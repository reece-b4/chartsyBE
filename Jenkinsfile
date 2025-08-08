// TODO: pass in node version from nvm to docker and all processes here to ensure consistency
// TODO: dockerfile is not used in this pipeline? confirm and delete if not needed - same with FE
// TODO: refactor to global agent? comment the args for agent and remove if not needed as they were possibly connected to dockerfile methodology - same for FE
// i think best way to do it would be use dockerfile and use that globally here - check if this is faster/ less secure etc?

pipeline {
    agent any

    environment {
        DATABASE_URL = credentials('DATABASE_URL')
        // how does this replace normal indication of production build?
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        GITHUB_PAT = credentials('github-pat')
        STAGE      = 'production'
        NEON_API_KEY = credentials('NEON_API_KEY')
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
        stage('create ephemeral prod DB copy and test') {
            agent {
                docker {
                    image 'node:20.19.4-alpine'
                    // running as user node prevents installing packages globally as global installs dir belongs to root
                    args '-u node -e NPM_CONFIG_CACHE=/home/node/.npm' // run as non-root
                }
            }
            steps {
                // exit on any error
                set -e
                // install neon CLI
                sh 'npm i neonctl'
                neon auth login --api-key "$NEON_API_KEY"
                // create neon branch
                // --compute: provision a compute endpoint for this branch immediately.Without this, the branch would exist in storage but wouldn’t have a running Postgres server to connect to
                // output CLI output as json instead of human readable text - for easier parsing and then output to file (> neon_branch.json) from this we can parse the new branch id, connection string, endpoint host/port.
                // TODO: use date command to get current time in seconds since epoch, or use a library like moment.js
                BRANCH_NAME="ci-${new Date().time / 1000}"
                neon branches create --project-id "$NEON_PROJECT_ID" --parent "$NEON_PARENT_BRANCH_ID" --name "$BRANCH_NAME" --compute --output json > neon_branch.json

                sh 'cat ./neon_branch.json'

    //    parse exported variables from neon_branch.json)
    // jq: command line parser for JSON -r raw output (do not wrap strings in quotes), retrieve the first endpoints host etc with fallbacks eg // "postgres"
      HOST=$(cat neon_branch.json jq -r '.endpoints[0].host')
    //   HOST=$(jq -r '.endpoints[0].host' neon_branch.json)
      USER=$(jq -r '.roles[0].name // "neondb_owner"' neon_branch.json)
      DBNAME=$(jq -r '.databases[0].name // "postgres"' neon_branch.json)
    //   export makes the variable available to child processes
    // use PGPASSWORD if set, otherwise use NEON_ROLE_PASSWORD
    // 5432 is postgres default port
      export DATABASE_URL="postgres://${USER}:${PGPASSWORD:-$NEON_ROLE_PASSWORD}@$HOST:5432/${DBNAME}"

      echo "$BRANCH_NAME" > neon_branch_name.txt

// is this needed again?
    //   npm ci
      npm run migrate
      npm run seed
      NODE_ENV=test DATABASE_URL="$DATABASE_URL" npm test
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


// stage('Cleanup (CLI)') {
//   when { always() }
//   environment {
//     NEON_API_KEY = credentials('NEON_API_KEY')
//     NEON_PROJECT_ID = credentials('NEON_PROJECT_ID')
//   }
//   steps {
//     sh '''
//       set -e
//       neon auth login --api-key "$NEON_API_KEY"
//       if [ -f neon_branch_name.txt ]; then
//         BRANCH_NAME=$(cat neon_branch_name.txt)
//         neon branches delete --project-id "$NEON_PROJECT_ID" --name "$BRANCH_NAME" --force
//       fi
//     '''
//   }
//     }

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
