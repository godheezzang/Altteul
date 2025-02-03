pipeline {
    agent any

    environment {
        PROJECT_NAME = "altteul"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        ENV_FILE_CONTENTS = credentials('ENV_FILE_CONTENTS')
    }

    stages {

        // stage('Cleanup Git Repository') {
        //     steps {
        //         script {
        //             sh """
        //             git remote prune origin || true
        //             """
        //         }
        //     }
        // }

        stage('Cleanup Workspace') {
            steps {
                script {
                    // 기존 작업공간 삭제 (오류 방지)
                    sh "rm -rf /var/lib/jenkins/workspace/Altteul/* || true"
                }
            }
        }

        stage('Checkout SCM') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Create .env File') {
            steps {
                script {
                    writeFile file: './altteul-be/.env', text: "${ENV_FILE_CONTENTS}"
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
            script {
                // 실패 시 컨테이너 로그 확인
                sh "docker compose logs"
            }
        }
    }
}