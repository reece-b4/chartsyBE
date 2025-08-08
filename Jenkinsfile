// TODO: pass in node version from nvm to docker and all processes here to ensure consistency
// TODO: dockerfile is not used in this pipeline? confirm and delete if not needed - same with FE
// TODO: refactor to global agent? comment the args for agent and remove if not needed as they were possibly connected to dockerfile methodology - same for FE

pipeline {
    agent any

    environment {
        DATABASE_URL = credentials('DATABASE_URL')
        // how does this replace normal indication of production build?
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        GITHUB_PAT = credentials('github-pat')
        STAGE      = 'production'
    }

// install dependencies
// build the project
// run tests
// build serverless
// deploy to AWS
// anything else?

    stages {
        stage('install dependencies and build') {
            agent {
                docker {
                    image 'node:20.19.4-alpine'
                    args '-u node -e NPM_CONFIG_CACHE=/home/node/.npm' // run as non-root
                }
            }
            steps {
                sh 'rm -rf node_modules'
                sh 'npm ci --omit=optional'
                sh 'npm ci --include=dev'
                sh 'npm run build'
            }
        }
        stage('create ephemeral prod DB copy to test') {
            agent {
                docker {
                    image 'node:20.19.4-alpine'
                    args '-u node -e NPM_CONFIG_CACHE=/home/node/.npm' // run as non-root
                }
            }
            steps {
                sh 'npm i -g neonctl'
            }
        }
        // stage('run tests') {
        //     agent {
        //         docker {
        //             image 'node:20.19.4-alpine'
        //             args '-u node -e NPM_CONFIG_CACHE=/home/node/.npm' // run as non-root
        //         }
        //     }
        //     // global environment variables above are not available here in docker environment/agent so we declare them in this stage specifically
        //         environment {
        //             NODE_ENV = 'test'
        //             PGDATABASE='chartsydb'
        //         }
        //     steps {
        //         sh 'printenv'
        //         sh 'npm run test'
        //     }
        // }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
//
// pipeline {
//   agent none
//
//   environment {
//     AWS_REGION = 'eu-west-2'
//     STAGE      = 'production'
//   }
//
//   stages {
//     stage('Checkout') {
//       agent any
//       steps {
//         checkout scm
//       }
//     }
//
//     stage('Build and Deploy') {
//       agent {
//         docker {
//           image 'node:20.19.4-alpine'
//           args '-u node' // run as non-root
//         }
//       }
//       environment {
//         HOME = '/home/node'
//       }
//       steps {
//         withCredentials([
//           string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
//           string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY'),
//           string(credentialsId: 'DOTENV_PROD', variable: 'DOTENV_CONTENT')
//         ]) {
//           sh '''
//             echo "$DOTENV_CONTENT" > .env.production
//             npm ci
//             npm run build
//             npm run build:serverlessDist
//             npx dotenv -e .env.production serverless deploy --stage $STAGE
//             rm .env.production
//           '''
//         }
//       }
//     }
//   }
//
//   post {
//     success {
//       echo '✅ Deploy successful!'
//     }
//     failure {
//       echo '❌ Deploy failed!'
//     }
//   }
// }
