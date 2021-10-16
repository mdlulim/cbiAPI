
 microservicesArray = []

pipeline {
    agent any
    stages {
        stage('Docker Build Microservices') {
            parallel {
                stage('admin-service') {
                    steps {
                       script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           developmentTag = "${branchName}-${gitCommit}-${unixTime}"
                           developmentImage = "${dockerRepoHost}/${JOB_NAME}:${developmentTag}"
                       } 
                    }
                }
                stage('auth-service') {
                    echo 'testing'
                }
                stage('company-service') {
                    echo 'testing'                    
                }
                stage('content-service') {
                    echo 'testing'                    
                }
                stage('product-service') {
                    echo 'testing'                    
                }
                stage('transaction-service') {
                    echo 'testing'                    
                }
                stage('user-service') {
                    echo 'testing'                    
                }
            }
          
        }
    }
}