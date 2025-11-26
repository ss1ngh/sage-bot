require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

/**
 * Send email notification
 */
async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        });

        console.log(`📧 Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

/**
 * Handle ingestion complete notifications
 */
async function handleIngestionComplete(message) {
    try {
        console.log('📄 Ingestion complete:', message);

        const { title, type, chunkCount } = message;

        const emailHtml = `
      <h2>Document Ingestion Complete</h2>
      <p>A new document has been successfully processed and added to the knowledge base.</p>
      <ul>
        <li><strong>Title:</strong> ${title}</li>
        <li><strong>Type:</strong> ${type}</li>
        <li><strong>Chunks:</strong> ${chunkCount}</li>
      </ul>
      <p>The chatbot can now answer questions based on this document.</p>
    `;

        await sendEmail(
            process.env.ADMIN_EMAIL,
            `Document Ingestion Complete: ${title}`,
            emailHtml
        );
    } catch (error) {
        console.error('Error handling ingestion notification:', error);
    }
}

/**
 * Handle query escalation notifications
 */
async function handleQueryEscalated(message) {
    try {
        console.log('🚨 Query escalated:', message);

        const { escalationId, query, userId } = message;

        const emailHtml = `
      <h2>New Query Escalation</h2>
      <p>A student query has been escalated and requires administrator attention.</p>
      <ul>
        <li><strong>Escalation ID:</strong> ${escalationId}</li>
        <li><strong>User ID:</strong> ${userId}</li>
        <li><strong>Query:</strong> ${query}</li>
      </ul>
      <p>Please log in to the admin panel to review and resolve this escalation.</p>
    `;

        await sendEmail(
            process.env.ADMIN_EMAIL,
            'New Query Escalation Requires Attention',
            emailHtml
        );
    } catch (error) {
        console.error('Error handling escalation notification:', error);
    }
}

/**
 * Connect to RabbitMQ and start consuming messages
 */
async function startWorker() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        const channel = await connection.createChannel();

        // Declare queues
        await channel.assertQueue('ingestion.complete', { durable: true });
        await channel.assertQueue('query.escalated', { durable: true });

        console.log('✅ Notification worker connected to RabbitMQ');

        // Consume ingestion complete messages
        channel.consume('ingestion.complete', async (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());
                await handleIngestionComplete(content);
                channel.ack(msg);
            }
        });

        // Consume query escalated messages
        channel.consume('query.escalated', async (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());
                await handleQueryEscalated(content);
                channel.ack(msg);
            }
        });

        console.log('📥 Waiting for messages...');

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down notification worker...');
            channel.close();
            connection.close();
            process.exit(0);
        });
    } catch (error) {
        console.error('Error starting notification worker:', error);
        setTimeout(startWorker, 5000); // Retry after 5 seconds
    }
}

// Start the worker
startWorker();
