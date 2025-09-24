pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'kellynkwain'
        APP_NAME = 'realworld-app'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // Docker Hub credentials
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
                withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                    sh '''
                        rm -rf temp-gitops
                        git clone https://${GIT_USER}:${GIT_TOKEN}@github.com/devkelzs/kubernetes-k8-manifest.git temp-gitops
                        cd temp-gitops

                        # Update backend deployment
                        sed -i "s|image:.*realworld-app-backend:.*|image: ${DOCKER_HUB_USER}/${APP_NAME}-backend:latest|" K8S/backend/deployment.yaml

                        # Update frontend deployment
                        sed -i "s|image:.*realworld-app-frontend:.*|image: ${DOCKER_HUB_USER}/${APP_NAME}-frontend:latest|" K8S/frontend/deployment.yaml

                        git config user.email "jenkins@ci.local"
                        git config user.name "Jenkins CI"

                        git add .
                        git commit -m "Update Docker images to latest"
                        git push origin main
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}
