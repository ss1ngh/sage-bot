FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# Copy package files
COPY services/admin-service/package*.json ./services/admin-service/

# Copy shared files
COPY prisma/ ./prisma/
COPY shared/ ./shared/

# Set working directory to service
WORKDIR /app/services/admin-service

# Install dependencies (including devDependencies for prisma)
RUN npm install

# Generate Prisma client
RUN npx prisma generate --schema=../../prisma/schema.prisma

# Copy source code
COPY services/admin-service/ ./

# Prune dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 3003

# Start service
CMD ["npm", "start"]
