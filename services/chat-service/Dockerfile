FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# Copy package files
COPY services/chat-service/package*.json ./services/chat-service/

# Copy shared files
COPY prisma/ ./prisma/
COPY shared/ ./shared/

# Set working directory to service
WORKDIR /app/services/chat-service

# Install dependencies (including devDependencies for prisma)
RUN npm install --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate --schema=../../prisma/schema.prisma

# Copy source code
COPY services/chat-service/ ./

# Prune dev dependencies
RUN npm prune --production --legacy-peer-deps

# Expose port
EXPOSE 3002

# Start service
CMD ["npm", "start"]
