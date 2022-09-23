import * as core from '@actions/core'
import {context} from '@actions/github'
import {wait} from './wait'
import {AWSError, S3} from 'aws-sdk'
import {getS3Object, createObject} from './s3'
import {S3Base, BundleConfig} from './types/types'
const deployed_branches = ['rc.18', 'rc.19', 'rc.20', 'rc.21', 'rc.22']

async function run(): Promise<void> {
  try {
    const branchName = core.getInput('BRANCH_NAME')
    const bucketName = core.getInput('BUCKET_NAME')
    const region = core.getInput('REGION')
    const configPath = core.getInput('CONFIG_PATH')
    const eventName = context.eventName
    let targetBranch = 'development'
    const deploy_environment = core.getInput('ENVIRONMENT_NAME')
    const access_key = process.env.AWS_ACCESS_KEY
    let targetBranchData: BundleConfig[] = []

    const isFileExists = async (input: S3Base): Promise<boolean> => {
      return new Promise(res => {
        getS3Object({
          ...input
        })
          .then(() => {
            return res(true)
          })
          .catch(() => {
            return res(false)
          })
      })
    }
    const obj1 = {
      name: 'vishvajeet singh',
      what: 'okkkaaaa'
    }

    // if the event is push then get the object if it exists append it to the object file and push it to bucket back
    // if there is no object in the first place then create the object and ...
    const isTargetFileExists = await isFileExists({
      Bucket: bucketName,
      // Key: `assist/${branchName}.json`
      Key: 'assist/nicer.json'
    })
    if (!isTargetFileExists) {
      // now check the difference if any
      core.info('target branch not found for comparison')
      // now I can create the object/file in the bucket with empty data and then push the array in the form of json to the object
      core.info('push the empty object to the bucket')
      var params = {
        Bucket: bucketName,
        // Key: `assist/${branchName}.json`,
        Key: 'assist/nicerr.json',
        Body: JSON.stringify(obj1)
      }

      await createObject(params)
    } else {
      await getS3Object({
        Bucket: bucketName,
        // Key: `assist/${branchName}.json`
        Key: 'assist/nicerr.json'
      })
      core.info(JSON.parse(targetBranchData.toString()))
    }

    core.info(
      JSON.stringify({
        branchName,
        region,
        configPath,
        targetBranch,
        deploy_environment,
        eventName,
        targetBranchData
      })
    )
    // if(eventName==='push')
    // {
    //   if(targetBranchData.length>0)
    //   {
    //       core.info(`${targetBranchData}`);
    //   }
    //   else{
    //     // I will create the array and then push to the
    //     const array = [branchName];
    //     //push into the S3 here
    //   }
    // }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
run()
