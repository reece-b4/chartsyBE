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
        NEON_PROJECT_ID = credentials('NEON_PROJECT_ID')
        NEON_PARENT_BRANCH_ID = credentials('NEON_PARENT_BRANCH_ID')
        EPHEMERAL_BRANCH_NAME = 'not-set' // this is used to create ephemeral branch and delete the branch at the end of the pipeline
    // TODO: PUT THIS IN RELEVANT STAGE: and same for all env vars
    // not a credential, can be hardcoded
    // PGDATABASE = 'chartsydb'
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
                    // running as user node prevents installing packages globally as global installs dir belongs to root - setting to root for installation of jq
                    args '-u root -e NPM_CONFIG_CACHE=/home/node/.npm' // run as non-root
                }
            }
            steps {
                script {
                    env.EPHEMERAL_BRANCH_NAME="ci-${System.currentTimeMillis()}"
                }
                // exit on any error
                sh '''set -e
                # install neon CLI
                npm i neonctl@1.15.0
                apk add --no-cache jq

                # create neon branch
                # --compute: provision a compute endpoint for this branch immediately.#Without this, the branch would exist in storage but wouldn’t have a #running Postgres server to connect to
                # output CLI output as json instead of human readable text - for easier #parsing and then output to file (> neon_branch.json) from this we can #parse the new branch id, connection string, endpoint host/port.
                # TODO: use date command to get current time in seconds since epoch, or use #a library like moment.js
                npx neon branches create --project-id "$NEON_PROJECT_ID" --parent "$NEON_PARENT_BRANCH_ID" --name "$EPHEMERAL_BRANCH_NAME" --compute --output json > neon_branch.json --api-key "$NEON_API_KEY"

                # cat ./neon_branch.json

                # parse exported variables from neon_branch.json)
                # jq: command line parser for JSON -r raw output (do not wrap strings in quotes), retrieve the first endpoints host etc with fallbacks eg  "postgres"
            HOST=$(jq -r '.endpoints[0].host // empty' neon_branch.json)
           USER=$(jq -r '.roles[0].name // "neondb_owner"' neon_branch.json)
           DBNAME=$(jq -r '.databases[0].name // "postgres"' neon_branch.json)
            # export makes the variable available to child processes
                # use PGPASSWORD if set, otherwise use NEON_ROLE_PASSWORD
          #5432 is postgres default port
              # Build DATABASE_URL with/without password safely
    #   if [ -n "${PGPASSWORD:-${NEON_ROLE_PASSWORD:-}}" ]; then
    #     DATABASE_URL="postgres://${USER}:${PGPASSWORD:-$NEON_ROLE_PASSWORD}@${HOST}:5432/${DBNAME}"
    #   else
    #     DATABASE_URL="postgres://${USER}@${HOST}:5432/${DBNAME}"
    #   fi

# get connection string with password etc rather than manually getting each part
# TODO: remove unusued vars for database_URL, host etc
CONN_JSON="$(npx neon connection-string "$EPHEMERAL_BRANCH_NAME" \
  --project-id "$NEON_PROJECT_ID" \
  --output json \
  --api-key "$NEON_API_KEY")"

# With jq
# DATABASE_URL="$(echo "$CONN_JSON" | jq -r '.connection_string')"

# DATABASE_URL="$(node -e 'console.log(JSON.parse(process.argv[1]).connection_string)' "$CONN_JSON")"

       export DATABASE_URL

    #       npm run migrate
    #       npm run seed
         NODE_ENV=neon DATABASE_URL="$DATABASE_URL" npm test
                '''
            // other code
            }
        }
    }

    post {
            always {
        steps {
            sh '''
      set -e
    # TODO: deleting neon branch name using force not recommended - is there another way/just remove force flag
      if [ -n "$EPHEMERAL" ] && [ "$EPHEMERAL" != "not-set" ]; then
        npx neon branches delete --project-id "$NEON_PROJECT_ID" --name "$EPHEMERAL_BRANCH_NAME" --api-key "$NEON_API_KEY"
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
