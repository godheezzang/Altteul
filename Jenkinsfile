pipeline {
    agent any

    environment {
        PROJECT_NAME = "altteul"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        ENV_FILE_CONTENTS = credentials('ENV_FILE_CONTENTS')
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                script {
                    // Git 충돌 방지: 기존 Git 저장소를 완전히 삭제
                    sh "rm -rf /var/lib/jenkins/workspace/Altteul/.git || true"
                }
            }
        }

        stage('Checkout SCM') {
            steps {
                script {
                    // 깨끗한 상태에서 다시 Clone
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/master']],  // 사용할 브랜치 지정
                        userRemoteConfigs: [[
                            credentialsId: 'C203',  // Jenkins GitLab 인증 정보
                            url: 'https://lab.ssafy.com/s12-webmobile1-sub1/S12P11C203.git'
                        ]],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [[$class: 'WipeWorkspace']]  // 기존 파일 삭제 후 새로 체크아웃
                    ])
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
                    sh "docker compose build"
                }
            }
        }

        stage('Stop Previous Containers') {
            steps {
                script {
                    sh "docker compose down || true"
                }
            }
        }

        stage('Start Containers') {
            steps {
                script {
                    sh "docker compose up -d"
                }
            }
        }
    }

    post {
        failure {
            script {
                sh "docker compose logs"
            }
        }
    }
}
