
pipeline {
    agent any

    environment {
        IMAGE_TAG = "build-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Automated Test / Validation') {
            steps {
                bat 'docker compose config'
            }
        }

       
stage('Deploy to Render') {
    steps {
        withCredentials([
            string(
                credentialsId: 'render-frontend-deploy-hook',
                variable: 'RENDER_FRONTEND_HOOK'
            ),
            string(
                credentialsId: 'render-backend-deploy-hook',
                variable: 'RENDER_BACKEND_HOOK'
            )
        ]) {
            bat '''
                @echo off
                echo Triggering Render frontend deployment...
                curl --fail --silent --show-error "%RENDER_FRONTEND_HOOK%"
                if errorlevel 1 exit /b 1

                echo Triggering Render backend deployment...
                curl --fail --silent --show-error "%RENDER_BACKEND_HOOK%"
                if errorlevel 1 exit /b 1

                echo Render deployment requests submitted.
            '''
        }
    }
}


        stage('Tag Latest Images') {
            steps {
                bat 'docker tag anahpatnaik/musicsheets-backend:%IMAGE_TAG% anahpatnaik/musicsheets-backend:latest'
                bat 'docker tag anahpatnaik/musicsheets-frontend:%IMAGE_TAG% anahpatnaik/musicsheets-frontend:latest'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKERHUB_USERNAME',
                        passwordVariable: 'DOCKERHUB_PASSWORD'
                    )
                ]) {
                    bat 'powershell -NoProfile -NonInteractive -Command "$env:DOCKERHUB_PASSWORD | docker login -u $env:DOCKERHUB_USERNAME --password-stdin"'
                    bat 'docker push anahpatnaik/musicsheets-backend:%IMAGE_TAG%'
                    bat 'docker push anahpatnaik/musicsheets-frontend:%IMAGE_TAG%'
                    bat 'docker push anahpatnaik/musicsheets-backend:latest'
                    bat 'docker push anahpatnaik/musicsheets-frontend:latest'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                bat 'docker compose down'
                bat 'set "IMAGE_TAG=%IMAGE_TAG%" && docker compose pull'
                bat 'set "IMAGE_TAG=%IMAGE_TAG%" && docker compose up -d'
                bat 'docker compose ps'
            }
}
    }

    post {
        success {
            echo 'MusicSheets CI/CD pipeline completed successfully.'
        }
        failure {
            echo 'MusicSheets CI/CD pipeline failed.'
        }
        always {
            bat 'docker logout'
        }
    }
}
