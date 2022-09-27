import * as core from '@actions/core'
import {context} from '@actions/github'
import {wait} from './wait'
import {AWSError, S3} from 'aws-sdk'
import {getS3Object, updateS3Object, createObject, isS3ObjectExists} from './s3'
import {S3Base, BundleConfig} from './types/types'
import config from './config'

export let eventType = core.getInput('EVENT_TYPE')
const {branchName, bucketName, deploy_environment, configPath, targetBranch} =
  config
async function run(): Promise<void> {
  try {
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
      branches: [`${config.branchName}`]
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
        config.branchName
      )
    ) {
      core.info('found the folder in the bucket')
      // update the folder
      const res = await getS3Object(
        {
          Bucket: bucketName,
          Key: `assist/${deploy_environment}.json`
        },
        branchName
      )
      core.info(JSON.stringify(res))
      await updateS3Object(
        res,
        {
          Bucket: bucketName,
          Key: `assist/${deploy_environment}.json`
        },
        branchName
      )
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
