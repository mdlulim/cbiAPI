pipeline {
    agent any
    stages {
        stage('Docker Build Microservices') {
            steps {
                script {
                    microservices = "ls -d */ | cut -f1 -d'/'"
                }
                sh "echo $microservices"
            }            
        }
    }
}