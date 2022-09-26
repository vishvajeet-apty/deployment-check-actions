import {S3, config, AWSError} from 'aws-sdk'
import {AWSConfig, S3Base, S3Object, BundleConfig} from './types/types'
import {fromNodeProviderChain} from '@aws-sdk/credential-providers'
import {readFileSync} from 'fs'
import * as core from '@actions/core'
import {eventType} from './main'
const s3 = new S3({})

export const initAWS = (input: AWSConfig): void => {
  config.update({
    ...input
  })
}

const actual = ['values']
export const isDeployable = async (
  Body: S3.Body,
  {Bucket, Key}: S3Base,
  branchName: string
): Promise<void> => {
  return new Promise(async (res, rej) => {
    core.info('It depends on the type of event')
    if (eventType === 'push') {
      const branchArray = JSON.parse(Body.toString())
      branchArray.branches.push(branchName)
      core.info(JSON.stringify(branchArray))
      let params = {
        Bucket,
        Key,
        Body: JSON.stringify(branchArray)
      }
      let result = await pushAgain(params)
      if (result) {
        core.info('succesfully pushed again')
        return
      }
    } else {
      // here the event type is pull_request
      // So check if the branch exists in the array and act
      const branchArray = JSON.parse(Body.toString())
      if (branchArray.includes(branchName)) {
        core.error('Cannot deploye the already branches')
      }
      return
    }
  })
}
export const getS3Object = async (
  {Bucket, Key}: S3Base,
  branchName: string
): Promise<void> => {
  return new Promise((res, rej) => {
    core.info(`getting data from ${Bucket} with path ${Key}`)
    s3.getObject(
      {
        Bucket,
        Key
      },
      async (err, data) => {
        if (err) {
          return rej(err)
        }
        if (data?.Body) {
          core.info('response is generated')
          const res = data.Body
          await isDeployable(res, {Bucket, Key}, branchName)
          core.info(eventType)
        } else {
          core.info('nothing is present')
          return
        }
      }
    )
  })
}

export const isFileExists = async (
  input: S3Base,
  branchName: string
): Promise<boolean> => {
  return new Promise(res => {
    getS3Object(
      {
        ...input
      },
      branchName
    )
      .then(() => {
        return res(true)
      })
      .catch(() => {
        return res(false)
      })
  })
}
export async function pushAgain(params: S3Object): Promise<boolean> {
  return new Promise((res, rej) => {
    core.info('Pushing the array again...')
    s3.putObject(params, (err: Error, data: S3.PutObjectOutput): void => {
      if (err) {
        core.info('Error pushing the file in the S3 object')
        return rej(false)
      }
      core.info('Successfully created the folder on the S3')
      return res(true)
    })
  })
}
export async function createObject(params: S3Object): Promise<void> {
  return new Promise((res, rej) => {
    core.info('creating the object in the file.')
    s3.putObject(params, (err: Error, data: S3.PutObjectOutput): void => {
      if (err) {
        core.info('error creating the folder/object')
        return rej()
      }
      core.info('Successfully created the folder on the S3')
      return res()
    })
  })
}

// s3.upload(params, function (err, data) {
// if (err) {
//       console.log("Error creating the folder: ", err);
// } else {
//       console.log("Successfully created a folder on S3");

// }
// });
// try {
// const file_config: BundleConfig[] = JSON.parse(
//     readFileSync('./src/production.json', {encoding: 'utf-8'})
// )
// core.info('file found')
// } catch (err) {
// core.info('file not found')
// }

// if (github.event === 'push') {

// push: merged

// read from S3

//     const deployedBranches = ['rc-4.18']

//     const currentBranch = 'rc-4.19';

//     const updatedBranches = [...deployedBranches, currentBranch];

//     upload to S3 -> updatedBranches

//     return;

// }

// if (github.event === 'pull_request') {

// pull: -> PR

// read from S3

//     const deployedBranches = ['rc-4.18', 'rc-4.19']

//     const currentBranch = 'rc-4.19';

//     if (deployedBranches.includes(currentBranch)) {

//       core.error('canno deploy already deployed branches')

//     }
