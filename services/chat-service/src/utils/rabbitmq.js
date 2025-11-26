const amqp = require('amqplib');

let connection = null;
let channel = null;

/**
 * Connect to RabbitMQ
 */
async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();

        await channel.assertQueue('ingestion.complete', { durable: true });
        await channel.assertQueue('query.escalated', { durable: true });

        console.log('✅ Connected to RabbitMQ (chat service)');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}

/**
 * Publish message to queue
 */
async function publishMessage(queue, message) {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }

        channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(message)),
            { persistent: true }
        );

        console.log(`📤 Published message to ${queue}`);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
}

module.exports = {
    connectRabbitMQ,
    publishMessage
};
