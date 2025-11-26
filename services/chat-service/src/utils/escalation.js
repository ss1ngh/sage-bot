const { PrismaClient } = require('@prisma/client');
const { publishMessage } = require('./rabbitmq');

const prisma = new PrismaClient();

/**
 * Create escalation record for unresolved query
 * @param {string} userId - User ID
 * @param {string} query - User query
 */
async function escalateQuery(userId, query) {
    try {
        const escalation = await prisma.escalatedQuery.create({
            data: {
                userId,
                query,
                status: 'PENDING'
            }
        });

        // Publish escalation message to RabbitMQ for notification
        await publishMessage('query.escalated', {
            escalationId: escalation.id,
            userId,
            query,
            timestamp: new Date().toISOString()
        });

        console.log(`🚨 Query escalated: ${escalation.id}`);

        return escalation;
    } catch (error) {
        console.error('Error escalating query:', error);
        throw error;
    }
}

module.exports = {
    escalateQuery
};
