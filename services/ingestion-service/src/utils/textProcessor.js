const { GoogleGenerativeAI } = require('@google/generative-ai');
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
 * Split text into chunks with overlap
 * @param {string} text - Text to split
 * @param {number} chunkSize - Size of each chunk
 * @param {number} overlap - Overlap between chunks
 * @returns {string[]} Array of text chunks
 */
function splitTextIntoChunks(text, chunkSize = 500, overlap = 50) {
    const chunks = [];
    let startIndex = 0;

    while (startIndex < text.length) {
        const endIndex = Math.min(startIndex + chunkSize, text.length);
        const chunk = text.slice(startIndex, endIndex);
        chunks.push(chunk.trim());

        startIndex += chunkSize - overlap;
    }

    return chunks.filter(chunk => chunk.length > 0);
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
 * Generate embeddings for text chunks using local transformer
 * @param {string[]} chunks - Text chunks to embed
 * @returns {Promise<number[][]>} Array of embedding vectors
 */
async function generateEmbeddings(chunks) {
    const pipe = await getEmbedder();
    const embeddings = [];

    for (const chunk of chunks) {
        try {
            const output = await pipe(chunk, { pooling: 'mean', normalize: true });
            embeddings.push(Array.from(output.data));
        } catch (error) {
            console.error('Error generating embedding:', error);
            // Push zero vector as fallback (384 dimensions for all-MiniLM-L6-v2)
            embeddings.push(new Array(384).fill(0));
        }
    }

    return embeddings;
}

/**
 * Process text: split into chunks and generate embeddings
 * @param {string} text - Text to process
 * @returns {Promise<{chunks: string[], embeddings: number[][]}>}
 */
async function processText(text) {
    const chunks = splitTextIntoChunks(text);
    const embeddings = await generateEmbeddings(chunks);

    return {
        chunks,
        embeddings
    };
}

module.exports = {
    splitTextIntoChunks,
    generateEmbeddings,
    processText
};
