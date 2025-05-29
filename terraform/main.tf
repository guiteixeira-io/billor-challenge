# Configura o provedor AWS e a região onde os recursos serão criados
provider "aws" {
  region = "us-east-1" # Região AWS (Norte da Virgínia)
}

# Cria um cluster ECS para orquestração dos containers
resource "aws_ecs_cluster" "my_cluster" {
  name = "billor-cluster" # Nome do cluster ECS
}

# Define a task definition do ECS para o serviço de automação
resource "aws_ecs_task_definition" "automation_task" {
  family = "automation-service" # Nome da família da task
  container_definitions = <<DEFINITION
  [
    {
      "name": "automation-service", # Nome do container
      "image": "myrepo/automation-service:latest", # Imagem Docker a ser usada
      "memory": 512, # Memória alocada (MB)
      "cpu": 256    # CPU alocada (unidades)
    }
  ]
  DEFINITION
}