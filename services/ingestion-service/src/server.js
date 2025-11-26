require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { PrismaClient } = require('@prisma/client');
const { processText } = require('./utils/textProcessor');
const { initializeCollection, addDocuments } = require('./utils/vectorStore');
const { connectRabbitMQ, publishMessage } = require('./utils/rabbitmq');

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// Initialize connections
(async () => {
    try {
        await initializeCollection();
        await connectRabbitMQ();
        console.log('✅ Ingestion service initialized');
    } catch (error) {
        console.error('Initialization error:', error);
    }
})();

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'ingestion-service' });
});

// Upload and process PDF
app.post('/api/ingest/pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No PDF file uploaded'
            });
        }

        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Document title is required'
            });
        }

        console.log(`📄 Processing PDF: ${title}`);

        // Parse PDF
        const pdfData = await pdfParse(req.file.buffer);
        const content = pdfData.text;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'PDF content is empty or unreadable'
            });
        }

        // Process text: split into chunks and generate embeddings
        const { chunks, embeddings } = await processText(content);

        // Save document metadata to database
        const document = await prisma.document.create({
            data: {
                title,
                type: 'PDF',
                content,
                filename: req.file.originalname,
                chunkCount: chunks.length
            }
        });

        // Add to vector database
        await addDocuments(chunks, embeddings, {
            documentId: document.id,
            title: document.title,
            type: document.type
        });

        // Publish success message to RabbitMQ
        await publishMessage('ingestion.complete', {
            documentId: document.id,
            title: document.title,
            type: 'PDF',
            chunkCount: chunks.length,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'PDF processed successfully',
            data: {
                documentId: document.id,
                title: document.title,
                chunkCount: chunks.length
            }
        });
    } catch (error) {
        console.error('PDF ingestion error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing PDF',
            error: error.message
        });
    }
});

// Process text input
app.post('/api/ingest/text', async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        if (content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Content cannot be empty'
            });
        }

        console.log(`📝 Processing text: ${title}`);

        // Process text: split into chunks and generate embeddings
        const { chunks, embeddings } = await processText(content);

        // Save document metadata to database
        const document = await prisma.document.create({
            data: {
                title,
                type: 'TEXT',
                content,
                chunkCount: chunks.length
            }
        });

        // Add to vector database
        await addDocuments(chunks, embeddings, {
            documentId: document.id,
            title: document.title,
            type: document.type
        });

        // Publish success message to RabbitMQ
        await publishMessage('ingestion.complete', {
            documentId: document.id,
            title: document.title,
            type: 'TEXT',
            chunkCount: chunks.length,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Text processed successfully',
            data: {
                documentId: document.id,
                title: document.title,
                chunkCount: chunks.length
            }
        });
    } catch (error) {
        console.error('Text ingestion error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing text',
            error: error.message
        });
    }
});

// Get all documents
app.get('/api/ingest/documents', async (req, res) => {
    try {
        const documents = await prisma.document.findMany({
            orderBy: { uploadedAt: 'desc' },
            select: {
                id: true,
                title: true,
                type: true,
                filename: true,
                chunkCount: true,
                uploadedAt: true
            }
        });

        res.json({
            success: true,
            data: documents
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching documents',
            error: error.message
        });
    }
});

const PORT = process.env.INGESTION_SERVICE_PORT || 3004;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`📚 Ingestion Service running on port ${PORT}`);
});
