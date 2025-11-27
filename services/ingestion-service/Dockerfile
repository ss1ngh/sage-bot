FROM node:22-slim

WORKDIR /app

# Install OpenSSL and build tools (for sharp/onnxruntime)
RUN apt-get update -y && apt-get install -y openssl python3 make g++

# Copy package files
COPY services/ingestion-service/package*.json ./services/ingestion-service/

# Copy shared files
COPY prisma/ ./prisma/
COPY shared/ ./shared/

# Set working directory to service
WORKDIR /app/services/ingestion-service

# Install dependencies (including devDependencies for prisma)
RUN npm install --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate --schema=../../prisma/schema.prisma

# Copy source code
COPY services/ingestion-service/ ./

# Prune dev dependencies
RUN npm prune --production --legacy-peer-deps

# Expose port
EXPOSE 3004

# Start service
CMD ["npm", "start"]
