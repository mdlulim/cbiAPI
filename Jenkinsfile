
dockerRepoHost = 'registry.digitalocean.com/cbiglobal'
dockerRepoUser = 'jenkins-cbiglobal' // (Username must match the value in jenkinsDockerSecret)

// these refer to a Jenkins secret "id", which can be in Jenkins global scope:
jenkinsDockerSecret = '5a6e1c1d-377a-4c55-ae7b-9ec71f49c31d'

// blank values that are filled in by pipeline steps below:
gitCommit = ''
branchName = ''
unixTime = ''
developmentTag = ''
releaseTag = ''

// Microservices Docker Images 
adminImage = ''
authImage = ''
companyImage = ''
contentImage = ''
productImage = ''
transactionImage = ''
userImage = ''

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
                           developmentTag = "admin-service-${branchName}-${gitCommit}-${unixTime}"
                           adminImage = "${dockerRepoHost}/${JOB_NAME}:${developmentTag}"
                        } 
                        echo "${adminImage}"
                    }
                }
                stage('auth-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           developmentTag = "auth-service-${branchName}-${gitCommit}-${unixTime}"
                           authImage = "${dockerRepoHost}/${JOB_NAME}:${developmentTag}"
                        }
                        echo "${authImage}"
                    }                    
                }
                stage('company-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           developmentTag = "company-service-${branchName}-${gitCommit}-${unixTime}"
                           companyImage = "${dockerRepoHost}/${JOB_NAME}:${developmentTag}"
                        }
                        echo "${companyImage}"
                    }                      
                }
                stage('content-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           developmentTag = "content-service-${branchName}-${gitCommit}-${unixTime}"
                           contentImage = "${dockerRepoHost}/${JOB_NAME}:${developmentTag}"
                        }
                        echo "${contentImage}"
                    }                      
                }
                stage('product-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           developmentTag = "product-service-${branchName}-${gitCommit}-${unixTime}"
                           productImage = "${dockerRepoHost}/${JOB_NAME}:${developmentTag}"
                        }
                        echo "${productImage}"
                    }                      
                }
                stage('transaction-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           developmentTag = "transaction-service-${branchName}-${gitCommit}-${unixTime}"
                           transactionImage = "${dockerRepoHost}/${JOB_NAME}:${developmentTag}"
                        }
                        echo "${transactionImage}"
                    }                      
                }
                stage('user-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           developmentTag = "user-service-${branchName}-${gitCommit}-${unixTime}"
                           userImage = "${dockerRepoHost}/${JOB_NAME}:${developmentTag}"
                        }
                        echo "${userImage}"
                    }                    
                }
            }  
        }
    }
}