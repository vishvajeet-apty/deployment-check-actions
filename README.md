<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Create a JavaScript Action using TypeScript

Use this repository to run as a job in manual deployment action in Apty services(assist,account,etc)

This repository is purely written as a standard typescript action.

If run successfully it will store the current deployed branch onto the S3 Bucket which can used by any other repository like its sibling repository(push-PR-blocker) under Apty.

## Use this action in an apty service.

> In the manual_deploy workflow create a job which uses aptyInc/deployment-check-actions@main and provide the inputs mentioned below.

## Code in Main

          BRANCH_NAME: "${{github.event.inputs.Branch}}"
          ENVIRONMENT_NAME: "${{github.event.inputs.Environment}}"
          BUCKET_NAME: "name-of-the-bucket"
          REGION: "us-east-1"
          CONFIG_PATH: "./"
          TARGET_BRANCH: "${{github.event.pull_request.base.ref}}"
        env:
          AWS_ACCESS_KEY_ID: ${{secrets.AWS_ACCESS_KEY_ID}}
          AWS_SECRET_ACCESS_KEY: ${{secrets.AWS_SECRET_ACCESS_KEY}}


## Change action.yml

The action.yml defines the inputs and output for your action.

 
        name: 'Deployment check action'
        description: 'Update the S3 bucket with the latest deployed branch'
        author: 'Vishvajeet Singh'
        inputs:
          BRANCH_NAME:
            required: true
            description: "the name of the current branch"
          ENVIRONMENT_NAME:
            required: true
            description: "the name of the environment variable"
          BUCKET_NAME:
            required: true
            description: 'AWS S3 bucket to push the data'
          REGION:
            required: true
            description: 'AWS S3 bucket region'
          CONFIG_PATH:
            required: true
    description: 'Path to config file used in action'
          TARGET_BRANCH:
            required: true
            description: 'Target branch of PR'
        runs:
          using: 'node16'
          main: 'dist/index.js'


