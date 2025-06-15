# Dockerfile for BagsBe API
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose app port
EXPOSE 8080

# Default command
CMD ["pnpm", "start"]
