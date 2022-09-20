import * as core from '@actions/core'
import {wait} from './wait'
import {S3} from 'aws-sdk'
import {getS3Object} from './s3'

const deployed_branches = ['rc.18', 'rc.19', 'rc.20', 'rc.21', 'rc.22']

async function run(): Promise<void> {
  try {
    const branchName = core.getInput('BRANCH_NAME')
    const bucketName = core.getInput('BUCKET_NAME')
    const region = core.getInput('REGION')
    const configPath = core.getInput('CONFIG_PATH')
    let targetBranch = core.getInput('TARGET_BRANCH')
    const deploy_environment = core.getInput('ENVIRONMENT_NAME')
    const access_key = process.env.AWS_ACCESS_KEY

    const data_form_S3 = getS3Object({
      Bucket: bucketName,
      Key: 'development.json'
    })

    core.info(
      JSON.stringify({
        branchName,
        region,
        configPath,
        targetBranch,
        deploy_environment,
        data_form_S3
      })
    )
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
