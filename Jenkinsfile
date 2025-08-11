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
                sh '''set -e
                # install neon CLI
                npm i neonctl
                npx neon auth --api-key $NEON_API_KEY
                # create neon branch
                # --compute: provision a compute endpoint for this branch immediately.#Without this, the branch would exist in storage but wouldn’t have a #running Postgres server to connect to
                # output CLI output as json instead of human readable text - for easier #parsing and then output to file (> neon_branch.json) from this we can #parse the new branch id, connection string, endpoint host/port.
                # TODO: use date command to get current time in seconds since epoch, or use #a library like moment.js
                BRANCH_NAME="ci-$(date +%s)"
                # neon branches create --project-id "$NEON_PROJECT_ID" --parent "$NEON_PARENT_BRANCH_ID" --name "$BRANCH_NAME" --compute --output json > neon_branch.json

                # cat ./neon_branch.json
                '''
            // other code
            }
        }
    }
// stage('Cleanup (CLI)')

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
