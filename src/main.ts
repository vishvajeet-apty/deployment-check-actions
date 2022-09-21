import * as core from '@actions/core'
import {wait} from './wait'
import {S3} from 'aws-sdk'
import {getS3Object} from './s3'
import {S3Base, BundleConfig} from './types/aws.types'
const deployed_branches = ['rc.18', 'rc.19', 'rc.20', 'rc.21', 'rc.22']

async function run(): Promise<void> {
  try {
    const branchName = core.getInput('BRANCH_NAME')
    const bucketName = core.getInput('BUCKET_NAME')
    const region = core.getInput('REGION')
    const configPath = core.getInput('CONFIG_PATH')
    let targetBranch = 'development'
    const deploy_environment = core.getInput('ENVIRONMENT_NAME')
    const access_key = process.env.AWS_ACCESS_KEY
    let targetBranchData: BundleConfig[] = []

    const isFileExists = async (input: S3Base): Promise<boolean> => {
      return new Promise(res => {
        getS3Object({...input})
          .then(() => {
            return res(true)
          })
          .catch(() => {
            return res(false)
          })
      })
    }

    const isTargetFileExists = await isFileExists({
      Bucket: bucketName,
      Key: `${branchName}.json`
    })
    if (!isTargetFileExists) {
      // now check the difference if any
      core.info('target branch not found for comparison')
    } else {
      targetBranchData = await getS3Object({
        Bucket: bucketName,
        Key: `${branchName}.json`
      })
    }

    core.info(
      JSON.stringify({
        branchName,
        region,
        configPath,
        targetBranch,
        deploy_environment,
        targetBranchData
      })
    )
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
