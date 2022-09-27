import * as core from '@actions/core'
import {context} from '@actions/github'
import {wait} from './wait'
import {AWSError, S3} from 'aws-sdk'
import {getS3Object, createObject, isS3ObjectExists} from './s3'
import {S3Base, BundleConfig} from './types/types'
const deployed_branches = ['rc.18', 'rc.19', 'rc.20', 'rc.21', 'rc.22']

export let eventType = core.getInput('EVENT_TYPE')

async function run(): Promise<void> {
  try {
    const branchName = core.getInput('BRANCH_NAME')
    const bucketName = core.getInput('BUCKET_NAME')
    const region = core.getInput('REGION')
    const configPath = core.getInput('CONFIG_PATH')
    let targetBranch = core.getInput('TARGET_Branch')
    const deploy_environment = core.getInput('ENVIRONMENT_NAME')
    const access_key = process.env.AWS_ACCESS_KEY
    let targetBranchData: BundleConfig[] = []

    // const isFileExists = async (input: S3Base): Promise<boolean> => {
    // return new Promise(res => {
    //     getS3Object(
    //       {
    //         ...input
    //       },
    //       branchName
    //     )
    //       .then(() => {
    //         return res(true)
    //       })
    //       .catch(() => {
    //         return res(false)
    //       })
    // })
    // }
    const branchObject = {
      branches: [`${branchName}`]
    }

    // const isTargetFileExists = await isFileExists({
    // Bucket: bucketName,
    // Key: `assist/${deploy_environment}.json`
    // })
    // if (!isTargetFileExists) {
    // // now check the difference if any
    // core.info('target branch not found for comparison')
    // core.info('push the empty object to the bucket')
    // var params = {
    //     Bucket: bucketName,
    //     Key: `assist/${deploy_environment}.json`,
    //     Body: JSON.stringify(branchObject)
    // }
    // await createObject(params)
    // } else {
    // await getS3Object(
    //     {
    //       Bucket: bucketName,
    //       Key: `assist/${deploy_environment}.json`
    //     },
    //     branchName
    // )
    // core.info(JSON.parse(targetBranchData.toString()))
    // }

    if (
      await isS3ObjectExists(
        {
          Bucket: bucketName,
          Key: `assist/${deploy_environment}.json`
        },
        branchName
      )
    ) {
      core.info('found the folder in the bucket')
    } else {
      core.info('Creater the new folder and push the things into it..')
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
    if (error instanceof Error) {
      core.info('output the error!!')
      core.setFailed(error.message)
    }
  }
}
run()
