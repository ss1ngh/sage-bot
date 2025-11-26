require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Admin authentication middleware
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'admin-service' });
});

// Get all escalated queries
app.get('/api/admin/escalations', verifyAdmin, async (req, res) => {
    try {
        const { status } = req.query;

        const whereClause = status ? { status } : {};

        const escalations = await prisma.escalatedQuery.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: escalations
        });
    } catch (error) {
        console.error('Error fetching escalations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching escalations',
            error: error.message
        });
    }
});

// Get single escalation details
app.get('/api/admin/escalations/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const escalation = await prisma.escalatedQuery.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });

        if (!escalation) {
            return res.status(404).json({
                success: false,
                message: 'Escalation not found'
            });
        }

        res.json({
            success: true,
            data: escalation
        });
    } catch (error) {
        console.error('Error fetching escalation:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching escalation',
            error: error.message
        });
    }
});

// Mark escalation as in progress
app.post('/api/admin/escalations/:id/in-progress', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const escalation = await prisma.escalatedQuery.update({
            where: { id },
            data: {
                status: 'IN_PROGRESS'
            }
        });

        res.json({
            success: true,
            message: 'Escalation marked as in progress',
            data: escalation
        });
    } catch (error) {
        console.error('Error updating escalation:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating escalation',
            error: error.message
        });
    }
});

// Resolve escalation
app.post('/api/admin/escalations/:id/resolve', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { resolution } = req.body;

        if (!resolution) {
            return res.status(400).json({
                success: false,
                message: 'Resolution message is required'
            });
        }

        const escalation = await prisma.escalatedQuery.update({
            where: { id },
            data: {
                status: 'RESOLVED',
                resolution,
                resolvedAt: new Date()
            }
        });

        res.json({
            success: true,
            message: 'Escalation resolved successfully',
            data: escalation
        });
    } catch (error) {
        console.error('Error resolving escalation:', error);
        res.status(500).json({
            success: false,
            message: 'Error resolving escalation',
            error: error.message
        });
    }
});

// Get all documents
app.get('/api/admin/documents', verifyAdmin, async (req, res) => {
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

// Delete document
app.delete('/api/admin/documents/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.document.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting document',
            error: error.message
        });
    }
});

// Get statistics
app.get('/api/admin/stats', verifyAdmin, async (req, res) => {
    try {
        const [
            totalUsers,
            totalDocuments,
            totalEscalations,
            pendingEscalations,
            totalMessages
        ] = await Promise.all([
            prisma.user.count(),
            prisma.document.count(),
            prisma.escalatedQuery.count(),
            prisma.escalatedQuery.count({ where: { status: 'PENDING' } }),
            prisma.chatMessage.count()
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalDocuments,
                totalEscalations,
                pendingEscalations,
                totalMessages
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

const PORT = process.env.ADMIN_SERVICE_PORT || 3003;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`👨‍💼 Admin Service running on port ${PORT}`);
});
