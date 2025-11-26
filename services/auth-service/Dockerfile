FROM node:22-alpine

WORKDIR /app

# Install build dependencies for native modules and openssl
RUN apk add --no-cache python3 make g++ openssl

# Copy package files
COPY services/auth-service/package*.json ./services/auth-service/

# Copy shared files
COPY prisma/ ./prisma/
COPY shared/ ./shared/

# Set working directory to service
WORKDIR /app/services/auth-service

# Install dependencies (including devDependencies for prisma)
RUN npm install

# Generate Prisma client
RUN npx prisma generate --schema=../../prisma/schema.prisma

# Copy source code
COPY services/auth-service/ ./

# Prune dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 3001

# Start service
CMD ["npm", "start"]
