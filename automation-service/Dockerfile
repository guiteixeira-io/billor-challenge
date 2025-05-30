FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY src/ /app/src/  # <- Garante que a pasta src seja copiada
CMD ["npx", "ts-node", "/app/src/automation.ts"]