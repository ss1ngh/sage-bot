# Port Conflict Fix - ChromaDB Port 8000

## Problem
Port 8000 is already in use by another process or container.

## Quick Fix

### Option 1: Stop All Docker Containers (Recommended)
```bash
# Stop all running containers
docker stop $(docker ps -aq)

# Remove stopped containers
docker rm $(docker ps -aq)

# Then try again
docker-compose up
```

### Option 2: Find and Kill Process Using Port 8000
```bash
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Then try again
docker-compose up
```

### Option 3: Change ChromaDB Port
If you can't stop the other service, edit `docker-compose.yml`:

Change line for ChromaDB ports from:
```yaml
ports:
  - "8000:8000"
```

To:
```yaml
ports:
  - "8001:8000"
```

Then update `.env` file:
```env
CHROMADB_URL="http://chromadb:8000"  # Keep this as is (internal port)
```

And update service environment variables in docker-compose.yml to use `http://chromadb:8000` (they use internal Docker network, so no change needed).

## Recommended Solution
Try **Option 1** first - it's the cleanest approach.
