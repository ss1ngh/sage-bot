FROM node:22-alpine

WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl

COPY package*.json ./
COPY schema.prisma ./

RUN npm install

COPY . .

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db push"]
