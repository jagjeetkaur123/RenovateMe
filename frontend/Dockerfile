FROM node:20-alpine

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=1536"

COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
