import * as core from '@actions/core'
import {context} from '@actions/github'
import {wait} from './wait'
import {AWSError, S3} from 'aws-sdk'
import {getS3Object, updateS3Object, createObject, isS3ObjectExists} from './s3'
import {S3Base, BundleConfig} from './types/types'
import {
  branchName,
  bucketName,
  deploy_environment,
  configPath,
  targetBranch
} from './config'

export let eventType = core.getInput('EVENT_TYPE')

async function run(): Promise<void> {
  try {
    const branchObject = {
      branches: [`${branchName}`]
    }
    const S3Params = {
      Bucket: bucketName,
      Key: `assist/${deploy_environment}.json`
    }

    if (await isS3ObjectExists(S3Params, branchName)) {
      core.info('found the folder in the bucket')
      // update the folder
      const res = await getS3Object(S3Params, branchName)
      if (res) {
        await updateS3Object(res, S3Params, branchName)
      }
    } else {
      var params = {
        Bucket: bucketName,
        Key: `assist/${deploy_environment}.json`,
        Body: JSON.stringify(branchObject)
      }
      await createObject(params)
    }

    core.info(
      JSON.stringify({
        branchName,
        bucketName,
        configPath,
        targetBranch,
        deploy_environment
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
