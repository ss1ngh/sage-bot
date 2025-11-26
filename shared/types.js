/**
 * Shared types and constants used across all services
 */

// User roles
const USER_ROLES = {
    STUDENT: 'STUDENT',
    ADMIN: 'ADMIN'
};

// Escalation status
const ESCALATION_STATUS = {
    PENDING: 'PENDING',
    RESOLVED: 'RESOLVED',
    IN_PROGRESS: 'IN_PROGRESS'
};

// RabbitMQ queue names
const QUEUES = {
    INGESTION_COMPLETE: 'ingestion.complete',
    QUERY_ESCALATED: 'query.escalated'
};

// API response helpers
const createSuccessResponse = (data, message = 'Success') => ({
    success: true,
    message,
    data
});

const createErrorResponse = (message, error = null) => ({
    success: false,
    message,
    error: error?.message || error
});

module.exports = {
    USER_ROLES,
    ESCALATION_STATUS,
    QUEUES,
    createSuccessResponse,
    createErrorResponse
};
