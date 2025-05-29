provider "aws" {
  region = "us-east-1"
}

resource "aws_ecs_cluster" "my_cluster" {
  name = "billor-cluster"
}

resource "aws_ecs_task_definition" "automation_task" {
  family = "automation-service"
  container_definitions = <<DEFINITION
  [
    {
      "name": "automation-service",
      "image": "myrepo/automation-service:latest",
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
}