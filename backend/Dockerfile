# Backend Dockerfile
FROM oven/bun:1

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy Prisma schema first
COPY prisma ./prisma/

# Generate Prisma client
RUN bunx prisma generate

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Expose port
EXPOSE 4000

# Start the application
CMD ["bun", "run", "start"]
