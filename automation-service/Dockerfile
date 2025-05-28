# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia os arquivos do projeto para o contêiner
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Define o comando para iniciar o serviço
CMD ["node", "src/index.js"]