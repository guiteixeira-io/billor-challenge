# billor-challenge

## Description

Project composed of two services (automation-service and gpt-service) orchestrated via Docker Compose.

## Project Structure

- **automation-service**: Node.js service that uses Puppeteer for web navigation automation.
- **gpt-service**: Service (details to be implemented).

## How to run the project

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/billor-challenge.git
   cd billor-challenge
   ```
2. Start the services:
   ```sh
   docker-compose up --build
   ```
3. Access the automation service:
   ```sh
   http://localhost:3000
   ```
4. Access the GPT service:
   ```sh
   http://localhost:8000
   ```

## How to contribute

1. Fork this repository.
2. Create a new branch for your feature:
   ```sh
   git checkout -b my-feature
   ```
3. Make your changes and commit:
   ```sh
   git commit -m 'Add new feature'
   ```
4. Push to the remote repository:
   ```sh
   git push origin my-feature
   ```
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
