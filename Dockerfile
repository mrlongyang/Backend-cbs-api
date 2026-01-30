# 1. Base image
FROM node:20-alpine

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package files first (for caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy all source code
COPY . .

# 6. Build TypeScript
RUN npm run build

# 7. Expose port (change if needed)
EXPOSE 5000

# 8. Start the app
CMD ["npm", "start"]
