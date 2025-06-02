# client/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./  

RUN npm install

# Copy source code
COPY . .

# Expose port (Vite default)
EXPOSE 5173

# Development command with Vite
CMD ["npm", "run", "dev"]