FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and server package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY prisma ./prisma

# Install dependencies and build
RUN npm install
RUN cd server && npm install
RUN npx prisma generate --schema=./prisma/schema.prisma
COPY server ./server
RUN cd server && npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
COPY server/package*.json ./server/
COPY prisma ./prisma

RUN npm install --omit=dev
RUN cd server && npm install --omit=dev
RUN npx prisma generate --schema=./prisma/schema.prisma

COPY --from=builder /app/server/dist ./server/dist

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push --schema=./prisma/schema.prisma && node server/dist/server.js"]
