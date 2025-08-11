

// other code:


    //    parse exported variables from neon_branch.json)
    // jq: command line parser for JSON -r raw output (do not wrap strings in quotes), retrieve the first endpoints host etc with fallbacks eg // "postgres"
    //       HOST=$(cat neon_branch.json jq -r '.endpoints[0].host')
    //     //   HOST=$(jq -r '.endpoints[0].host' neon_branch.json)
    //       USER=$(jq -r '.roles[0].name // "neondb_owner"' neon_branch.json)
    //       DBNAME=$(jq -r '.databases[0].name // "postgres"' neon_branch.json)
    //     //   export makes the variable available to child processes
    //     // use PGPASSWORD if set, otherwise use NEON_ROLE_PASSWORD
    //     // 5432 is postgres default port
    //       export DATABASE_URL="postgres://${USER}:${PGPASSWORD:-$NEON_ROLE_PASSWORD}@$HOST:5432/${DBNAME}"
    //
    //       echo "$BRANCH_NAME" > neon_branch_name.txt
    //
    // // is this needed again?
    //     //   npm ci
    //       npm run migrate
    //       npm run seed
    //       NODE_ENV=test DATABASE_URL="$DATABASE_URL" npm test
    // }
    // }
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
// }