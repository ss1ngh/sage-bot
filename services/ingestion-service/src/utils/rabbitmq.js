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

        // Declare queues
        await channel.assertQueue('ingestion.complete', { durable: true });
        await channel.assertQueue('query.escalated', { durable: true });

        console.log('✅ Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}

/**
 * Publish message to queue
 * @param {string} queue - Queue name
 * @param {object} message - Message to publish
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

/**
 * Consume messages from queue
 * @param {string} queue - Queue name
 * @param {function} callback - Callback function to handle messages
 */
async function consumeMessages(queue, callback) {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }

        await channel.consume(queue, async (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());
                await callback(content);
                channel.ack(msg);
            }
        });

        console.log(`📥 Consuming messages from ${queue}`);
    } catch (error) {
        console.error('Error consuming messages:', error);
    }
}

module.exports = {
    connectRabbitMQ,
    publishMessage,
    consumeMessages
};
