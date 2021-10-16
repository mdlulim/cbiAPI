pipeline {
    agent any
    stages {
        stage('Docker Build Microservices') {
            steps {
                script {
                    microservicesArray = "ls -d */"
                    microservicesArray.split(' ')
                }
                sh "echo $microservices"
            }            
        }
    }
}