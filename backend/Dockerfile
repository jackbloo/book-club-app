# Use Node.js 18 on Bullseye
FROM node:18-bullseye
RUN apt-get update && apt-get install -y libssl1.1

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app (including prisma, src, tsconfig, etc.)
COPY . .

# Generate Prisma client (needs schema.prisma)
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Build TypeScript → JavaScript
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]
