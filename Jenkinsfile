pipeline {
    // Windows agent with Node.js and Microsoft Edge installed.
    // Replace the label with the one used by your Jenkins agents.
    agent { label 'windows' }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timestamps()
    }

    triggers {
        // Run on every push (requires GitHub webhook -> <jenkins>/github-webhook/)
        githubPush()
        // Plus a nightly run, Monday to Friday
        cron('H 2 * * 1-5')
    }

    environment {
        CI              = 'true'
        // Jenkins credentials (create these IDs under Manage Jenkins > Credentials):
        //   allianz-client-pfx       -> "Secret file"  (the exported .pfx)
        //   allianz-cert-passphrase  -> "Secret text"  (the PFX passphrase)
        CERT_PFX_PATH   = credentials('allianz-client-pfx')
        CERT_PASSPHRASE = credentials('allianz-cert-passphrase')
    }

    stages {
        stage('Install') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Test') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                allowMissing: true,
                alwaysLinkToLastBuild: true
            ])
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}
