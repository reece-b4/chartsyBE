pipeline {
    agent any

    // environment {
    // }

    stages {
        stage('echo') {
            steps {
                echo 'Hello World'
            }
        }
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
