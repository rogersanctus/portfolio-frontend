pipeline {
  agent {
    label "${node_label}"
  }

  environment {
    NODE_ENV = "production"
  }

  stages {
    stage ('Load production env') {
      steps {
        sh '${HOME}/portfolio-frontend.env.sh > .env.production'
      }
    }
    stage ('Build the app') {
      steps {
        sh 'docker compose build landing-page-app'
        sh 'docker compose create landing-page-app'
      }
    }
    stage ('Stop previously running app') {
      steps {
        echo 'Stopping the app server...'
        script {
          try {
            sh 'docker compose stop landing-page-app'
          } catch (error) {
            echo "Caugh: ${error}"
          }
        }
      }
    }
    stage ('Run the app') {
      steps {
        sh 'docker compose start landing-page-app'
      }
    }
  }
}
