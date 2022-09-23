import {S3, config, AWSError} from 'aws-sdk'
import {AWSConfig, S3Base, S3Object, BundleConfig} from './types/types'
import {fromNodeProviderChain} from '@aws-sdk/credential-providers'
import {readFileSync} from 'fs'
import * as core from '@actions/core'

const s3 = new S3({})

export const initAWS = (input: AWSConfig): void => {
  config.update({
    ...input
  })
}

//create the file if it doesn't exist

export const getS3Object = async ({Bucket, Key}: S3Base): Promise<[]> => {
  return new Promise((res, rej) => {
    core.info(`getting data from ${Bucket} with path ${Key}`)
    s3.getObject({Bucket, Key}, (err, data) => {
      if (err) {
        return rej(err)
      } else return res(JSON.parse(data.toString()))
    })
  })
}

export const isFileExists = async (input: S3Base): Promise<boolean> => {
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
//   if (err) {
//       console.log("Error creating the folder: ", err);
//   } else {
//       console.log("Successfully created a folder on S3");

//   }
// });
try {
  const file_config: BundleConfig[] = JSON.parse(
    readFileSync('./src/production.json', {encoding: 'utf-8'})
  )
  core.info('file found')
} catch (err) {
  core.info('file not found')
}
