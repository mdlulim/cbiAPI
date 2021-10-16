pipeline {
    agent any
    stages {
        stage('Docker Build Microservices') {
            steps {
                script {
                    microservices = "ls -d */"
                }
                sh "echo $microservices"
            }            
        }
    }
}