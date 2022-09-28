import * as core from '@actions/core'
import {context} from '@actions/github'
import {wait} from './wait'
import {AWSError, CostExplorer, S3} from 'aws-sdk'
import {getS3Object, createObject} from './s3'
import {S3Base, BundleConfig} from './types/types'
import {FileS3} from './fileHandler'

import {
  branchName,
  bucketName,
  deploy_environment,
  configPath,
  targetBranch
} from './config'
import {info} from 'console'

export let eventType = core.getInput('EVENT_TYPE')

async function run(): Promise<void> {
  try {
    const s3Params = {
      Bucket: bucketName,
      Key: `assist/${deploy_environment}.json`
    }

    // if (await isS3ObjectExists(S3Params, branchName)) {
    //   core.info('found the folder in the bucket')
    //   // update the folder
    //   const res = await getS3Object(S3Params, branchName)
    //   if (res) {
    //     await updateS3Object(res, S3Params, branchName)
    //   }
    //   else
    //   {
    //       core.setFailed()
    //   }
    // } else {
    //   core.info('folder not found in the bucket so creating a new folder')
    //   const fileObject = new FileS3(branchName, deploy_environment)

    //   var params = {
    //     Bucket: bucketName,
    //     Key: `assist/${deploy_environment}.json`,
    //     Body: JSON.stringify(fileObject.branchObject)
    //   }
    //   await createObject(params)
    // }
    const branchObject = {
      branches: [`${branchName}`]
    }
    let fileS3Data = await getS3Object(s3Params, branchName)
    if (fileS3Data) core.info(fileS3Data.toString())
    if (!fileS3Data) {
      //create object in S3

      // s3Params.Body = JSON.stringify(fileS3Data);
      const isObjectCreated = await createObject({
        Bucket: bucketName,
        Key: `assist/${deploy_environment}.json`,
        Body: JSON.stringify(branchObject)
      })
      core.info(isObjectCreated.toString())
    } else {
      //update the object and create the object back from the new body
      let fileS3Object = new FileS3(fileS3Data)
      core.info(fileS3Object.toString())
      // add the branch in the object
      await createObject({
        Bucket: bucketName,
        Key: `assist/${deploy_environment}.json`,
        Body: JSON.stringify(fileS3Object.addBranch(branchName))
      })
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
