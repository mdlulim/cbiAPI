pipeline {
    agent any
    stages {
        stage('Docker Build Microservices') {
            steps {
                script {
                    microservicesArray = "ls -d */".split(' ')
                    
                }
                sh "echo $microservices"
            }            
        }
    }
}