pipeline {
    agent any

    environment {
        PROJECT_NAME = "altteul"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        BE_ENV_FILE_CONTENTS = credentials('BE_ENV_FILE_CONTENTS')
    }

    stages {

        stage('Create .env File') {
            steps {
                script {
                    writeFile file: './altteul-be/.env', text: BE_ENV_FILE_CONTENTS.trim()
                }
            }
        }

        stage('Build Images') {
            steps {
                script {
                    // frontend, backend 이미지 빌드
                    sh "docker compose build"
                }
            }
        }


        stage('Stop Previous Containers') {
            steps {
                script {
                    // 기존 실행 중인 컨테이너들 정리
                    sh "docker compose down || true"
                }
            }
        }

        stage('Start Containers') {
            steps {
                script {
                    // 데이터베이스 볼륨 유지하면서 컨테이너 시작
                    sh "docker compose up -d"
                }
            }
        }
    }

    post {
        failure {
            node('built-in') {  // 내장 노드 사용
                script {
                    sh "docker compose logs"  // 실패 시 도커 로그 확인
                }
            }
        }
    }
}