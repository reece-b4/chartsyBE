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
        STAGE      = 'dev'
        // TODO: if creating full dev/QA/prod pipeline then create env var dynamically similarly to below
        // STAGE = "${BRANCH_NAME == 'main' ? 'production' : 'dev'}"
        NEON_API_KEY = credentials('NEON_API_KEY')
        NEON_PROJECT_ID = credentials('NEON_PROJECT_ID')
        NEON_PARENT_BRANCH_ID = credentials('NEON_PARENT_BRANCH_ID')
        EPHEMERAL_BRANCH_NAME = "ci-${System.currentTimeMillis()}" // this is used to create ephemeral branch and delete the branch at the end of the pipeline
    // TODO: PUT THIS IN RELEVANT STAGE: and same for all env vars
    // not a credential, can be hardcoded
    // PGDATABASE = 'chartsydb'
    }

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
                    // running as user node prevents installing packages globally as global installs dir belongs to root - setting to root for installation of jq
                    args '-u root -e NPM_CONFIG_CACHE=/home/node/.npm' // running as root here for global install of jq
                }
            }
            steps {
                // exit on any error
                sh '''set -e
                npm ci
                '''
                sh '''
  ./node_modules/.bin/jest --showConfig | grep -E "rootDir|preset" -A2 -B2 || true
'''
sh'''
                # install neon CLI
                # is this needed as npx can install ad-hoc? better to have it installed manually as we can specify?
                npm i neonctl@2.15.0
                apk add --no-cache jq

                # create neon branch
                # --compute: provision a compute endpoint for this branch immediately.#Without this, the branch would exist in storage but wouldn’t have a #running Postgres server to connect to
                # output CLI output as json instead of human readable text - for easier #parsing and then output to file (> neon_branch.json) from this we can #parse the new branch id, connection string, endpoint host/port.
                # TODO: use date command to get current time in seconds since epoch, or use #a library like moment.js
                npx neon branches create --project-id "$NEON_PROJECT_ID" --parent "$NEON_PARENT_BRANCH_ID" --name "$EPHEMERAL_BRANCH_NAME" --compute --output json > neon_branch.json --api-key "$NEON_API_KEY"

                #./node_modules/.bin/jest --showConfig | grep -E "rootDir|preset" -A2 -B2
                ./node_modules/.bin/jest --showConfig | grep -E "rootDir|preset" -A2 -B2

                # cat ./neon_branch.json

                # parse exported variables from neon_branch.json)
                # jq: command line parser for JSON -r raw output (do not wrap strings in quotes), retrieve the first endpoints host etc with fallbacks eg  "postgres"

# get connection string with password etc rather than manually getting each part

# get connection string from neon branch
# pipe into jq to get the parsed connection string
# exporting here overrides the global DATABASE_URL env var for this shell step onl

       export DATABASE_URL="$(
  npx neon connection-string "$EPHEMERAL_BRANCH_NAME" \
    --project-id "$NEON_PROJECT_ID" \
    --pooler \
    --output json \
    --api-key "$NEON_API_KEY" \
)"

    #       npm run migrate
    #       npm run seed
         NODE_ENV=neon:ephemeral DATABASE_URL="$DATABASE_URL" npm test
                '''
            }
        }
stage('deploy to AWS lambda') {
            // This stage only runs if previous stages succeeded.
            agent {
                docker {
                    image 'node:20.19.4-alpine'
                    args '-u node -e NPM_CONFIG_CACHE=/home/node/.npm' // run as non-root (node user)
                }
            }
            environment {
                AWS_REGION = 'eu-west-2' // adjust if needed
            }
            steps {
                sh '''
                  set -e

                  # Install deps needed by serverless plugins (if any) and the CLI itself
                  #npm ci --omit=optional

                  # Install Serverless CLI locally (v3 pinned for reproducibility)
                  npm i -D serverless@3
                  npx serverless --version

                  # Optional: show info before deploy (useful on first run). prints true if fails
                   npx serverless info --stage "$STAGE" --region "$AWS_REGION" || true

                  # Package (helps surface build errors before deploy)
                  npx serverless package --stage "$STAGE" --region "$AWS_REGION"

                  # Full deploy (CloudFormation + Lambda code)
                  # If you want "code-only" updates later: use
                  npx serverless deploy function --function api --stage "$STAGE" --region "$AWS_REGION"

                # Uncomment the next line to deploy the entire service or adapt to take in argument
                  #npx serverless deploy --stage "$STAGE" --region "$AWS_REGION" --conceal

                  echo "---- Deployed service info ----"
                  npx serverless info --stage "$STAGE" --region "$AWS_REGION"
                '''
            }
        }
    }

    post {
            always {
            sh '''
      set -e
      if [ -n "$EPHEMERAL_BRANCH_NAME" ]; then
        npx neon branches delete "$EPHEMERAL_BRANCH_NAME" --project-id "$NEON_PROJECT_ID" --api-key "$NEON_API_KEY"
      fi
    '''
            }
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
