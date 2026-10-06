pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Test / Validate') {
            steps {
                bat 'docker compose config'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker images'
            }
        }
    }

    post {
        success {
            echo 'MusicSheets CI pipeline completed successfully.'
        }

        failure {
            echo 'MusicSheets CI pipeline failed.'
        }
    }
}