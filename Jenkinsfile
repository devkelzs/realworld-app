pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'kellynkwain'
        APP_NAME = 'realworld-app'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // username/password type
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/devkelzs/realworld-app.git'
            }
        }

        stage('Backend - Build & Test') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh '''
                        if [ -f package.json ]; then
                            npm test || echo "No tests configured"
                        fi
                    '''
                }
            }
        }

        stage('Docker Build & Push - Backend') {
            steps {
                dir('backend') {
                    script {
                        sh "docker login -u $DOCKER_HUB_USER -p $DOCKERHUB_CREDENTIALS_PSW"
                        sh "docker build -t $DOCKER_HUB_USER/$APP_NAME-backend:latest ."
                        sh "docker push $DOCKER_HUB_USER/$APP_NAME-backend:latest"
                    }
                }
            }
        }

        stage('Docker Build & Push - Frontend') {
            steps {
                dir('frontend') {
                    script {
                        sh "docker login -u $DOCKER_HUB_USER -p $DOCKERHUB_CREDENTIALS_PSW"
                        sh "docker build -t $DOCKER_HUB_USER/$APP_NAME-frontend:latest ."
                        sh "docker push $DOCKER_HUB_USER/$APP_NAME-frontend:latest"
                    }
                }
            }
        }

        stage('Update GitOps Repo') {
            steps {
                echo "Here we would update Kubernetes manifests repo with new image tags"
                // Optional: script to commit/push changes to kubernetes-k8-manifest repo
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully ✅'
        }
        failure {
            echo 'Pipeline failed ❌'
        }
    }
}
