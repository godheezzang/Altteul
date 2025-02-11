pipeline {
    agent any

    environment {
        PROJECT_NAME = "altteul"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Build Images') {
            when {
                branch 'master'
            }
            steps {
                script {
                    // frontend, backend 이미지 빌드
                    sh "docker compose --env-file ./altteul-be/.env build"
                }
            }
        }

        stage('Stop Previous Containers') {
            when {
                branch 'master'
            }
            steps {
                script {
                    // 기존 실행 중인 컨테이너들 정리
                    sh "docker compose down || true"
                }
            }
        }

        stage('Start Containers') {
            when {
                branch 'master'
            }
            steps {
                script {
                    sh '''
                    docker compose --env-file ${WORKSPACE}/altteul-be/.env up -d
                    '''
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
