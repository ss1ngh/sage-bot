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
        // Try to get existing collection or create new one
        collection = await client.getOrCreateCollection({
            name: 'university_knowledge',
            metadata: { description: 'University knowledge base for chatbot' }
        });
        console.log('✅ ChromaDB collection initialized');
    } catch (error) {
        console.error('Error initializing ChromaDB collection:', error);
        throw error;
    }
}

/**
 * Add documents to ChromaDB
 * @param {string[]} chunks - Text chunks
 * @param {number[][]} embeddings - Embedding vectors
 * @param {object} metadata - Document metadata
 */
async function addDocuments(chunks, embeddings, metadata) {
    try {
        if (!collection) {
            await initializeCollection();
        }

        const ids = chunks.map((_, index) =>
            `${metadata.documentId}_chunk_${index}`
        );

        const metadatas = chunks.map((chunk, index) => ({
            documentId: metadata.documentId,
            documentTitle: metadata.title,
            documentType: metadata.type,
            chunkIndex: index,
            uploadedAt: new Date().toISOString()
        }));

        await collection.add({
            ids,
            embeddings,
            documents: chunks,
            metadatas
        });

        console.log(`✅ Added ${chunks.length} chunks to ChromaDB`);
    } catch (error) {
        console.error('Error adding documents to ChromaDB:', error);
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
    addDocuments,
    queryDocuments
};
