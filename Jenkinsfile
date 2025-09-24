pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_HUB_USER = 'kellynkwain'
        APP_NAME = 'realworld-app'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/devkelzs/realworld-app.git'
            }
        }

        stage('Backend - Build & Test') {
            steps {
                sh 'mvn clean package -DskipTests'
                sh 'mvn test'
            }
        }

        stage('Frontend - Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build & Push - Backend') {
            steps {
                dir('backend') {
                    script {
                        sh "docker build -t $DOCKER_HUB_USER/$APP_NAME-backend:latest ."
                        withDockerRegistry([credentialsId: 'dockerhub-credentials', url: '']) {
                            sh "docker push $DOCKER_HUB_USER/$APP_NAME-backend:latest"
                        }
                    }
                }
            }
        }

        stage('Docker Build & Push - Frontend') {
            steps {
                dir('frontend') {
                    script {
                        sh "docker build -t $DOCKER_HUB_USER/$APP_NAME-frontend:latest ."
                        withDockerRegistry([credentialsId: 'dockerhub-credentials', url: '']) {
                            sh "docker push $DOCKER_HUB_USER/$APP_NAME-frontend:latest"
                        }
                    }
                }
            }
        }

        stage('Update GitOps Repo') {
            steps {
                echo "Here we would update Kubernetes manifests repo with new image tags"
                // Later: script to commit/push changes to kubernetes-k8-manifest repo
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
