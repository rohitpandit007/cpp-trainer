FROM node:20-bookworm-slim

# Install g++ compiler and build tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends g++ make && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy application files
COPY package*.json ./
COPY . .

# Default environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server/server.js"]
