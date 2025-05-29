# Usa uma imagem base leve do Node.js (Alpine Linux)
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências para o container
COPY package.json package-lock.json ./

# Instala apenas as dependências do projeto
RUN npm install

# Copia todo o restante do código-fonte para o container
COPY . .

# Comando para iniciar a aplicação
CMD ["node", "src/server.js"]