
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
                    steps {
                        echo 'testing'
                    }                    
                }
                stage('company-service') {
                    steps {
                        echo 'testing'
                    }                      
                }
                stage('content-service') {
                    steps {
                        echo 'testing'
                    }                      
                }
                stage('product-service') {
                    steps {
                        echo 'testing'
                    }                      
                }
                stage('transaction-service') {
                    steps {
                        echo 'testing'
                    }                      
                }
                stage('user-service') {
                    steps {
                        echo 'testing'
                    }                    
                }
            }
          
        }
    }
}