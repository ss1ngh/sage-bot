const { GoogleGenerativeAI } = require('@google/generative-ai');
const { queryDocuments } = require('./vectorStore');
const { pipeline } = require('@xenova/transformers');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Singleton for the embedding pipeline
let embedder = null;

async function getEmbedder() {
    if (!embedder) {
        console.log("Loading local embedding model...");
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log("Local embedding model loaded.");
    }
    return embedder;
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Initial delay in ms
 */
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0 || !error.message.includes('429')) {
            throw error;
        }
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithBackoff(fn, retries - 1, delay * 2);
    }
}

/**
 * Generate embedding for query text
 * @param {string} query - Query text
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateQueryEmbedding(query) {
    const pipe = await getEmbedder();
    const output = await pipe(query, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

/**
 * Retrieve relevant context from vector database
 * @param {string} query - User query
 * @returns {Promise<{context: string, sources: object[]}>}
 */
async function retrieveContext(query) {
    try {
        // Generate query embedding
        const queryEmbedding = await generateQueryEmbedding(query);

        // Query ChromaDB for similar documents
        const results = await queryDocuments(queryEmbedding, 3);

        if (!results.documents || !results.documents[0] || results.documents[0].length === 0) {
            return {
                context: '',
                sources: [],
                hasContext: false
            };
        }

        // Combine retrieved chunks into context
        const context = results.documents[0].join('\n\n');
        const sources = results.metadatas[0] || [];

        return {
            context,
            sources,
            hasContext: true
        };
    } catch (error) {
        console.error('Error retrieving context:', error);
        return {
            context: '',
            sources: [],
            hasContext: false
        };
    }
}

/**
 * Generate response using Gemini with RAG context
 * @param {string} query - User query
 * @param {string} context - Retrieved context from vector database
 * @returns {Promise<string>} Generated response
 */
async function generateResponse(query, context) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

        const prompt = context
            ? `You are a helpful university chatbot assistant. Answer the student's question based on the following context from university documents. If the context doesn't contain relevant information to answer the specific question, please say "I don't have that information" and add the tag [ESCALATE] to your response.

Context:
${context}

Student's Question: ${query}

Please provide a clear, concise, and helpful answer:`
            : `You are a helpful university chatbot assistant. The student asked: "${query}"

If this is a general greeting (like "hi", "hello", "how are you") or a general conversational input, answer it politely and helpfully.
If the question requires specific university information that you don't have, please say "I don't have that information" and add the tag [ESCALATE] to your response.`;

        const result = await retryWithBackoff(async () => {
            return await model.generateContent(prompt);
        });
        const response = result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Error generating response:', error);
        return "I apologize, but I'm having trouble processing your question right now. Please try again or escalate this to an administrator.";
    }
}

/**
 * Complete RAG pipeline: retrieve context and generate response
 * @param {string} query - User query
 * @returns {Promise<{response: string, shouldEscalate: boolean, sources: object[]}>}
 */
async function processQuery(query) {
    try {
        // Retrieve relevant context
        const { context, sources, hasContext } = await retrieveContext(query);

        // Generate response
        const response = await generateResponse(query, context);

        // Determine if query should be escalated
        // Escalate if response indicates uncertainty via tag
        const shouldEscalate = response.includes("[ESCALATE]");

        // Remove the tag from the response shown to the user
        const finalResponse = response.replace("[ESCALATE]", "").trim();

        return {
            response: finalResponse,
            shouldEscalate,
            sources: hasContext ? sources : []
        };
    } catch (error) {
        console.error('RAG pipeline error:', error);
        return {
            response: "I apologize, but I encountered an error. Please escalate this query to an administrator.",
            shouldEscalate: true,
            sources: []
        };
    }
}

module.exports = {
    generateQueryEmbedding,
    retrieveContext,
    generateResponse,
    processQuery
};
