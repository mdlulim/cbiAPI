
 microservicesArray = []

pipeline {
    agent any
    stages {
        stage('Docker Build Microservices') {
            steps {
                script {
                    sh "micro = $(ls -d */)"
                    microservicesArray = micro.split(' ', -1)
                }
                sh "echo $microservicesArray"
            }            
        }
    }
}