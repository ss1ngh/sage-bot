require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('redis');
const { PrismaClient } = require('@prisma/client');
const { processQuery } = require('./utils/ragEngine');
const { escalateQuery } = require('./utils/escalation');
const { initializeCollection } = require('./utils/vectorStore');
const { connectRabbitMQ } = require('./utils/rabbitmq');

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Redis client setup
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Connected to Redis'));

// Initialize connections
(async () => {
    try {
        await redisClient.connect();
        await initializeCollection();
        await connectRabbitMQ();
        console.log('✅ Chat service initialized');
    } catch (error) {
        console.error('Initialization error:', error);
    }
})();

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'chat-service' });
});

// Process chat message
app.post('/api/chat/message', async (req, res) => {
    try {
        const { userId, message } = req.body;

        if (!userId || !message) {
            return res.status(400).json({
                success: false,
                message: 'userId and message are required'
            });
        }

        console.log(`💬 Processing message from user ${userId}: ${message}`);

        // Check Redis cache for similar queries
        const cacheKey = `query:${message.toLowerCase().trim()}`;
        const cachedResponse = await redisClient.get(cacheKey);

        if (cachedResponse) {
            console.log('✅ Cache hit');

            // Save to chat history
            await prisma.chatMessage.create({
                data: {
                    userId,
                    message,
                    response: cachedResponse,
                    isBot: false
                }
            });

            return res.json({
                success: true,
                data: {
                    response: cachedResponse,
                    fromCache: true,
                    shouldEscalate: false
                }
            });
        }

        // Process query with RAG pipeline
        const { response, shouldEscalate, sources } = await processQuery(message);

        // Cache the response (30 minutes TTL)
        await redisClient.setEx(cacheKey, 1800, response);

        // Save message to database
        await prisma.chatMessage.create({
            data: {
                userId,
                message,
                response,
                isBot: false
            }
        });

        // Save bot response
        await prisma.chatMessage.create({
            data: {
                userId,
                message: response,
                response: null,
                isBot: true
            }
        });

        // Handle escalation if needed
        let escalationId = null;
        if (shouldEscalate) {
            const escalation = await escalateQuery(userId, message);
            escalationId = escalation.id;
        }

        res.json({
            success: true,
            data: {
                response,
                shouldEscalate,
                escalationId,
                sources: sources.slice(0, 3) // Return top 3 sources
            }
        });
    } catch (error) {
        console.error('Chat message error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing chat message',
            error: error.message
        });
    }
});

// Get chat history for a user
app.get('/api/chat/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit) || 50;

        const messages = await prisma.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                message: true,
                response: true,
                isBot: true,
                createdAt: true
            }
        });

        res.json({
            success: true,
            data: messages.reverse() // Reverse to show oldest first
        });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching chat history',
            error: error.message
        });
    }
});

// Clear cache (admin utility)
app.post('/api/chat/cache/clear', async (req, res) => {
    try {
        await redisClient.flushAll();

        res.json({
            success: true,
            message: 'Cache cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing cache:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cache',
            error: error.message
        });
    }
});

const PORT = process.env.CHAT_SERVICE_PORT || 3002;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`💬 Chat Service running on port ${PORT}`);
});
