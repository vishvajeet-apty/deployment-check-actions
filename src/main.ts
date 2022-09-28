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

    const branchObject = {
      branches: [`${branchName}`]
    }
    let fileS3Data = await getS3Object(s3Params, branchName)
    if (fileS3Data)
      core.info(`fileS3DataAfterFetching : ${fileS3Data.toString()}`)

    if (!fileS3Data) {
      const isObjectCreated = await createObject({
        Bucket: bucketName,
        Key: `assist/${deploy_environment}.json`,
        Body: JSON.stringify(branchObject)
      })
      core.info(isObjectCreated.toString())
    } else {
      // update the object and create the object back from the new body
      let s3Object = JSON.parse(fileS3Data.toString())
      core.info(`s3Object : ${JSON.stringify(s3Object)}`)
      let fileS3Object = new FileS3(s3Object.branches)

      // add the branch in the object
      const branchData = fileS3Object.addBranch(branchName)
      const branchDataObject = {
        branches: branchData
      }
      core.info(JSON.stringify(branchData))
      core.info('before this branch data is printed')
      await createObject({
        Bucket: bucketName,
        Key: `assist/${deploy_environment}.json`,
        Body: JSON.stringify(branchDataObject)
      })
      const currentObject = {branches: fileS3Object.getBranches()}
      core.info(JSON.stringify(currentObject))
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
