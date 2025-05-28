# billor-challenge

## Descrição
Projeto composto por dois serviços (automation-service e gpt-service) orquestrados via Docker Compose.

## Estrutura do Projeto
- **automation-service**: Serviço Node.js que utiliza Puppeteer para automação de navegação web.
- **gpt-service**: Serviço (detalhes a serem implementados).

## Como rodar o projeto

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/billor-challenge.git
   cd billor-challenge
   ```
2. Inicie os serviços:
   ```sh
   docker-compose up --build
   ```
3. Acesse o serviço de automação:
   ```sh
   http://localhost:3000
   ```
4. Acesse o serviço GPT:
   ```sh
   http://localhost:8000
   ```

## Como contribuir

1. Faça um fork deste repositório.
2. Crie uma nova branch para sua feature:
   ```sh
   git checkout -b minha-feature
   ```
3. Faça suas alterações e commit:
   ```sh
   git commit -m 'Adiciona nova feature'
   ```
4. Envie para o repositório remoto:
   ```sh
   git push origin minha-feature
   ```
5. Abra um Pull Request.

## Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

