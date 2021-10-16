pipeline {
    agent any
    stages {
        stage('Docker Build Microservices') {
            steps {
                script {
                    micro = "ls -d */"
                    micro.split(' ')
                    microservicesArray[] = micro.split(' ', -1)
                }
                sh "echo $microservicesArray"
            }            
        }
    }
}