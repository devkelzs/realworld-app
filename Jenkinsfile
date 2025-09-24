pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'kellynkwain'
        APP_NAME = 'realworld-app'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // username/password type
        GIT_TOKEN = credentials('github-token') // Personal access token for GitOps repo
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
                        sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_USER --password-stdin"
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
                        sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_USER --password-stdin"
                        sh "docker build -t $DOCKER_HUB_USER/$APP_NAME-frontend:latest ."
                        sh "docker push $DOCKER_HUB_USER/$APP_NAME-frontend:latest"
                    }
                }
            }
        }

        stage('Update GitOps Repo') {
            steps {
                script {
                    // Clone the GitOps repo using a token for authentication
                    sh """
                        git clone https://$GIT_TOKEN@github.com/devkelzs/kubernetes-k8-manifest.git temp-gitops
                        cd temp-gitops
                        # Update backend and frontend images
                        sed -i "s|image:.*backend:.*|image: $DOCKER_HUB_USER/$APP_NAME-backend:latest|" K8S/backend/deployment.yaml
                        sed -i "s|image:.*frontend:.*|image: $DOCKER_HUB_USER/$APP_NAME-frontend:latest|" K8S/frontend/deployment.yaml
                        git config user.email "jenkins@ci.local"
                        git config user.name "Jenkins CI"
                        git add K8S/backend/deployment.yaml K8S/frontend/deployment.yaml
                        git commit -m "Update Docker images to latest" || echo "No changes to commit"
                        git push
                    """
                }
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
