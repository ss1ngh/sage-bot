FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# Copy package files
COPY services/notification-service/package*.json ./services/notification-service/

# Copy shared files
COPY shared/ ./shared/

# Set working directory to service
WORKDIR /app/services/notification-service

# Install dependencies
RUN npm install --production

# Copy source code
COPY services/notification-service/ ./

# Start service
CMD ["npm", "start"]
