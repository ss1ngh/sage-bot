# Dependency Fix Applied

## Problem
The Docker build failed due to a version conflict between:
- `@google/generative-ai` v0.2.1 
- `chromadb` v1.7.3

ChromaDB requires `@google/generative-ai` v0.1.x but we had v0.2.x installed.

## Solution Applied
Updated the following files to use compatible versions:

**chat-service/package.json**
- `@google/generative-ai`: 0.2.1 → 0.1.3  ✓
- `chromadb`: 1.7.3 → 1.8.1  ✓

**ingestion-service/package.json**
- `@google/generative-ai`: 0.2.1 → 0.1.3  ✓
- `chromadb`: 1.7.3 → 1.8.1  ✓

## Next Steps

Run the Docker build again:

```bash
docker-compose build
```

Then start the services:

```bash
docker-compose up
```

The build should now complete successfully!
