
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
fileImage = ''

// Microservices Docker Images
// blank values that are filled in by pipeline steps below: 
adminTag = ''
authTag = ''
companyTag = ''
contentTag = ''
productTag = ''
transactionTag = ''
userTag = ''
fileTag = ''

def COLOR_MAP = [
    'SUCCESS': 'good',
    'FAILURE': 'danger',
]

pipeline {
    environment {
        // test variable: 0=success, 1=fail; must be string
        doError = '0'
        BUILD_USER = ''
    }
    agent any
    stages {
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner';
                }
                withSonarQubeEnv(installationName: 'cbiglobal-sonarqube') {
                    echo '${scannerHome}'
                    sh '${scannerHome}/bin/sonar-scanner --version'
                }
            }
        }
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
                stage('file-storage-service') {
                    steps {
                        script {
                           gitCommit = env.GIT_COMMIT.substring(0,8)
                           unixTime = (new Date().time / 1000) as Integer
                           branchName = env.GIT_BRANCH.replace('/', '-').substring(7)
                           fileTag = "${branchName}-${gitCommit}-${unixTime}"
                           fileImage = "${dockerRepoHost}/file-storage-service:${fileTag}"
                        }
                        sh "docker build -t ${fileImage} ./file-storage-service"
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
                sh "docker push ${fileImage}"
            }
        }
        stage('Remove Local Docker Image') {
            steps {
                sh "docker rmi ${adminImage} ${authImage} ${companyImage} ${contentImage} ${productImage} ${transactionImage} ${userImage} ${fileImage}"
            }
        }
        stage('Update GitOps repo for ArgoCD') {
            steps {
                script {
                    git branch: 'develop', credentialsId: '38f1358e-7a55-488b-b1ee-40eb0cc6b3f4', url: 'https://github.com/cbiglobal/dev_ops.git'
                    script {
                        switch(JOB_NAME) {
                            case 'cbigold-api-develop':
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/admin-service:${adminTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/auth-service:${authTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/company-service:${companyTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/content-service:${contentTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/product-service:${productTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/transaction-service:${transactionTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/user-service:${userTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/file-storage-service:${fileTag}");
                                break;
                            case 'cbigold-api-production':
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/admin-service:${adminTag}");
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/auth-service:${authTag}");
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/company-service:${companyTag}");
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/content-service:${contentTag}");
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/product-service:${productTag}");
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/transaction-service:${transactionTag}");
                                sh("cd cbigold/overlays/production && kustomize edit set image registry.digitalocean.com/cbiglobal/user-service:${userTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/file-storage-service:${fileTag}");
                                break;
                            case 'cbigold-api-qa':
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/admin-service:${adminTag}");
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/auth-service:${authTag}");
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/company-service:${companyTag}");
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/content-service:${contentTag}");
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/product-service:${productTag}");
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/transaction-service:${transactionTag}");
                                sh("cd cbigold/overlays/qa && kustomize edit set image registry.digitalocean.com/cbiglobal/user-service:${userTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/file-storage-service:${fileTag}");
                                break;
                            case 'cbigold-api-staging':
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/admin-service:${adminTag}");
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/auth-service:${authTag}");
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/company-service:${companyTag}");
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/content-service:${contentTag}");
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/product-service:${productTag}");
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/transaction-service:${transactionTag}");
                                sh("cd cbigold/overlays/staging && kustomize edit set image registry.digitalocean.com/cbiglobal/user-service:${userTag}");
                                sh("cd cbigold/overlays/develop && kustomize edit set image registry.digitalocean.com/cbiglobal/file-storage-service:${fileTag}");
                                break;
                            default:
                                echo 'No Kustomize application found';
                                break;
                        }
                    }
                }
                sh('git add .')
                sh("git commit -m \"Update ${JOB_NAME} to v-${gitCommit}\"")
                withCredentials([usernamePassword(credentialsId: '38f1358e-7a55-488b-b1ee-40eb0cc6b3f4', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                    sh('git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/cbiglobal/dev_ops.git')
                }
            }
        }
        stage('Apply Sync with ArgoCD') {
            environment {
                ARGOCD_SERVER='argocd.cbiglobal.io'
                ARGOCD_AUTH_TOKEN = credentials('14eb5095-973d-43a0-8889-5ed02b31b432')
            }
            steps {
                script {
                    switch(JOB_NAME) {
                        case 'cbigold-api-develop':
                            application = "develop";
                            break;
                        case 'cbigold-api-production':
                            application = "production";
                            break;
                        case 'cbigold-api-qa':
                            application = "qa";
                            break;
                        case 'cbigold-api-staging':
                            application = "staging";
                            break;
                        default:
                            echo 'No ArgoCD application found';
                            break;
                    }
                }
                sh("argocd app sync cbigold-${application}");
                sh("argocd app wait cbigold-${application}");
            }
        }
        stage('Error') {
            // when doError is equal to 1, return an error
            when {
                expression { doError == '1' }
            }
            steps {
                echo "Failure :("
                error "Test failed on purpose, doError == str(1)"
            }
        }
        stage('Success') {
            // when doError is equal to 0, just print a simple message
            when {
                expression { doError == '0' }
            }
            steps {
                echo "Success :)"
            }
        }      
    }
    post {
        always {
            script {
                BUILD_TRIGGER_BY = "${currentBuild.getBuildCauses()[0].shortDescription}".substring(26)
            }
            echo 'I will always say hello in the console.'
            slackSend channel: '#proj-new-website',
                color: COLOR_MAP[currentBuild.currentResult],
                message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} by ${BUILD_TRIGGER_BY}\n More info at: ${env.BUILD_URL}"
            cleanWs()
        }
    }
}