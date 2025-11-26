const { ChromaClient } = require('chromadb');

const client = new ChromaClient({
    path: process.env.CHROMADB_URL || 'http://chromadb:8000'
});

let collection = null;

/**
 * Initialize ChromaDB collection
 */
async function initializeCollection() {
    try {
        collection = await client.getOrCreateCollection({
            name: 'university_knowledge',
            metadata: { description: 'University knowledge base for chatbot' }
        });
        console.log('✅ ChromaDB collection initialized in chat service');
    } catch (error) {
        console.error('Error initializing ChromaDB collection:', error);
        throw error;
    }
}

/**
 * Query ChromaDB for similar documents
 * @param {number[]} queryEmbedding - Query embedding vector
 * @param {number} nResults - Number of results to return
 * @returns {Promise<object>} Query results
 */
async function queryDocuments(queryEmbedding, nResults = 3) {
    try {
        if (!collection) {
            await initializeCollection();
        }

        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults
        });

        return results;
    } catch (error) {
        console.error('Error querying ChromaDB:', error);
        throw error;
    }
}

module.exports = {
    initializeCollection,
    queryDocuments
};
