pipeline {
    agent any

    environment {
        // DOCKER_REGISTRY = "your-registry"
        PROJECT_NAME = "altteul"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'master', url: 'https://lab.ssafy.com/s12-webmobile1-sub1/S12P11C203.git'
            }
        }

        stage('Build Images') {
            steps {
                script {
                    // frontend, backend 이미지 빌드
                    sh "docker-compose build"
                }
            }
        }

        stage('Stop Previous Containers') {
            steps {
                script {
                    // 기존 실행 중인 컨테이너들 정리
                    sh "docker-compose down || true"
                }
            }
        }

        stage('Start Containers') {
            steps {
                script {
                    // 데이터베이스 볼륨 유지하면서 컨테이너 시작
                    sh "docker-compose up -d"
                }
            }
        }

        // stage('Health Check') {
        //     steps {
        //         script {
        //             // 서비스들이 정상적으로 시작됐는지 확인
        //             sh '''
        //                 # Frontend health check
        //                 curl -f http://localhost:3000/health || exit 1
                        
        //                 # Backend health check
        //                 curl -f http://localhost:8080/actuator/health || exit 1
                        
        //                 # Database connection check
        //                 docker-compose exec -T backend ./gradlew checkDbConnection || exit 1
        //             '''
        //         }
        //     }
        // }
    }

    post {
        failure {
            script {
                // 실패 시 컨테이너 로그 확인
                sh "docker-compose logs"
            }
        }
    }
}