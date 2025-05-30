# billor-challenge

## Description

Project composed of two services (automation-service and gpt-service) orchestrated via Docker Compose.

## Project Structure

- **automation-service**: Node.js service that uses Puppeteer for web navigation automation.
- **gpt-service**: Node.js service exposing a `/summarize-loads` endpoint that summarizes load data using OpenAI GPT.

## How to run the project

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/billor-challenge.git
   cd billor-challenge
   ```
2. Create a `.env` file in each service directory with the required environment variables (see `.env.example` if available).
3. Start the services:
   ```sh
   docker-compose up --build
   ```
4. Access the automation service:
   ```
   http://localhost:3000
   ```
5. Access the GPT service:
   ```
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

---

# CI/CD and Infrastructure as Code

## CI/CD with GitHub Actions

1. Every push or pull request triggers automated tests and build.
2. The Docker image is published to Docker Hub.
3. Deployment is performed automatically to Kubernetes.

## Infrastructure with Terraform

To provision infrastructure on AWS using Terraform:

```bash
terraform init
terraform apply -auto-approve
```

---

## Additional Information

### Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Node.js (for local development)
- Access to OpenAI API (for GPT service)
- PostgreSQL (runs as a container)

### Healthcheck Endpoints

- Automation Service: `http://localhost:3001/metrics`
- GPT Service: `http://localhost:8000/summarize-loads`
- PostgreSQL: `localhost:5432` (default user/password: `postgres`)

### Useful Commands

- Stop all services:
  ```sh
  docker-compose down
  ```
- View logs:
  ```sh
  docker-compose logs -f
  ```
- Run tests (inside each service directory):
  ```sh
  npm test
  ```

### Docker Build Instructions

To build the Docker images for each service manually, use the following commands from the root of the project:

- Build the automation-service image:

  ```sh
  docker build -t automation-service ./automation-service
  ```

- Build the gpt-service image:
  ```sh
  docker build -t gpt-service ./gpt-service
  ```

You can also build all services at once using Docker Compose:

```sh
docker-compose build
```

If you want to force a rebuild (ignoring cache):

```sh
docker-compose build --no-cache
```

After building, start the services:

```sh
docker-compose up
```

To stop and remove all containers, networks, and volumes created by `up`:

```sh
docker-compose down -v
```

**Tip:**  
Always ensure your `.env` files are correctly configured before building and running the containers.

### Folder Structure

```
billor-challenge/
│
├── automation-service/
│   ├── src/
│   ├── Dockerfile
│   └── ...
├── gpt-service/
│   ├── src/
│   ├── Dockerfile
│   └── ...
├── database/
│   ├── schema.sql
│   └── queries.sql
├── terraform/
│   └── main.tf
├── k8s/
│   └── deployment.yaml
├── docker-compose.yml
└── README.md
```

---

## Contact

For questions or suggestions, open an issue or contact the repository maintainer.
