const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Dummy model to get client
        // There isn't a direct listModels on the client instance in the node SDK easily accessible in all versions, 
        // but let's try to just run a generation on gemini-1.5-flash to see if it works.

        console.log("Testing gemini-1.5-flash...");
        try {
            const result = await model.generateContent("Hello");
            console.log("gemini-1.5-flash works! Response:", result.response.text());
        } catch (e) {
            console.error("gemini-1.5-flash failed:", e.message);
        }

        console.log("Testing text-embedding-004...");
        try {
            const embedModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
            const result = await embedModel.embedContent("Hello");
            console.log("text-embedding-004 works! Vector length:", result.embedding.values.length);
        } catch (e) {
            console.error("text-embedding-004 failed:", e.message);
        }

        console.log("Testing embedding-001...");
        try {
            const embedModel = genAI.getGenerativeModel({ model: 'embedding-001' });
            const result = await embedModel.embedContent("Hello");
            console.log("embedding-001 works! Vector length:", result.embedding.values.length);
        } catch (e) {
            console.error("embedding-001 failed:", e.message);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
