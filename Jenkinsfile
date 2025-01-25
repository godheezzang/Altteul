pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "your-docker-image-name"
        DOCKER_TAG = "latest"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://gitlab.com/your-group/your-project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    sh "docker stop ${DOCKER_IMAGE} || true"
                    sh "docker rm ${DOCKER_IMAGE} || true"
                    sh "docker run -d --name ${DOCKER_IMAGE} -p 5000:5000 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
    }
}
