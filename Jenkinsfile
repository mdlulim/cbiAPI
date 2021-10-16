
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
// blank values that are filled in by pipeline steps below:
adminImage = ''
authImage = ''
companyImage = ''
contentImage = ''
productImage = ''
transactionImage = ''
userImage = ''

// Microservices Docker Images
// blank values that are filled in by pipeline steps below: 
adminTag = ''
authTag = ''
companyTag = ''
contentTag = ''
productTag = ''
transactionTag = ''
userTag = ''

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
                           adminTag = "${branchName}-${gitCommit}-${unixTime}"
                           adminImage = "${dockerRepoHost}/admin-service:${adminTag}"
                        }
                        sh "docker build -t ${adminImage} ./admin-service"
                    }
                }
                stage('auth-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           authTag = "${branchName}-${gitCommit}-${unixTime}"
                           authImage = "${dockerRepoHost}/auth-service:${authTag}"
                        }
                        sh "docker build -t ${authImage} ./auth-service"
                    }                    
                }
                stage('company-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           companyTag = "${branchName}-${gitCommit}-${unixTime}"
                           companyImage = "${dockerRepoHost}/company-service:${companyTag}"
                        }
                        sh "docker build -t ${companyImage} ./company-service"
                    }                      
                }
                stage('content-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           contentTag = "${branchName}-${gitCommit}-${unixTime}"
                           contentImage = "${dockerRepoHost}/content-service:${contentTag}"
                        }
                        sh "docker build -t ${contentImage} ./content-service"
                    }                      
                }
                stage('product-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           productTag = "${branchName}-${gitCommit}-${unixTime}"
                           productImage = "${dockerRepoHost}/product-service:${productTag}"
                        }
                        sh "docker build -t ${productImage} ./product-service"
                    }                      
                }
                stage('transaction-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           transactionTag = "${branchName}-${gitCommit}-${unixTime}"
                           transactionImage = "${dockerRepoHost}/transaction-service:${transactionTag}"
                        }
                        sh "docker build -t ${transactionImage} ./transaction-service"
                    }                      
                }
                stage('user-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           userTag = "${branchName}-${gitCommit}-${unixTime}"
                           userImage = "${dockerRepoHost}/user-service:${userTag}"
                        }
                        sh "docker build -t ${userImage} ./user-service"
                    }                    
                }
            }  
        }
        stage('Publish Release Tag All Microservices') {
            steps {
                sh "docker push ${adminImage}"
                sh "docker push ${authImage}"
                sh "docker push ${companyImage}"
                sh "docker push ${contentImage}"
                sh "docker push ${productImage}"
                sh "docker push ${transactionImage}"
                sh "docker push ${userImage}"
            }
        }
        stage('Remove Local Docker Image') {
            steps {
                sh "docker rmi ${adminImage} ${authImage} ${companyImage} ${contentImage} ${productImage} ${transactionImage} ${userImage}"
            }
        }
        stage('Update GitOps repo for ArgoCD') {
            steps {
                script {
                    git branch: 'feature/1884-cbigold-react', credentialsId: '38f1358e-7a55-488b-b1ee-40eb0cc6b3f4', url: 'https://github.com/cbiglobal/dev_ops.git'
                    script {
                        switch(JOB_NAME) {
                            case 'cbigold-api-develop':
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/admin-service:${adminTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/auth-service:${authTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/company-service:${companyTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/content:${contentTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/product-service:${productTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/transaction-service:${transactionTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/user-service:${userTag}");
                                break;
                            case 'cbigold-api-production':
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/admin-service:${adminTag}");
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/auth-service:${authTag}");
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/company-service:${companyTag}");
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/content:${contentTag}");
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/product-service:${productTag}");
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/transaction-service:${transactionTag}");
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/user-service:${userTag}");
                                break;
                            case 'cbigold-api-qa':
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/admin-service:${adminTag}");
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/auth-service:${authTag}");
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/company-service:${companyTag}");
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/content:${contentTag}");
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/product-service:${productTag}");
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/transaction-service:${transactionTag}");
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/user-service:${userTag}");
                                break;
                            case 'cbigold-api-staging':
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/admin-service:${adminTag}");
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/auth-service:${authTag}");
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/company-service:${companyTag}");
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/content:${contentTag}");
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/product-service:${productTag}");
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/transaction-service:${transactionTag}");
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/user-service:${userTag}");
                                break;
                            default:
                                echo 'No Kustomize application found';
                                break;
                        }
                    }
                }
                sh('git add .')
                sh("git commit -m \"Update ${JOB_NAME} to v-${developmentTag}\"")
                withCredentials([usernamePassword(credentialsId: '38f1358e-7a55-488b-b1ee-40eb0cc6b3f4', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                    sh('git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/cbiglobal/dev_ops.git')
                }
            }
        }
    }
}