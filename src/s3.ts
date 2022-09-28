import {S3, config, AWSError} from 'aws-sdk'
import {AWSConfig, S3Base, S3Object, BundleConfig} from './types/types'
import {fromNodeProviderChain} from '@aws-sdk/credential-providers'
import {readFileSync} from 'fs'
import * as core from '@actions/core'
import {eventType} from './main'
import {rejects} from 'assert'
const s3 = new S3({})

export const initAWS = (input: AWSConfig): void => {
  config.update({
    ...input
  })
}

export const getS3Object = async (
  {Bucket, Key}: S3Base,
  branchName: string
): Promise<S3.Body | undefined> => {
  return new Promise((res, rej) => {
    core.info(`getting data from ${Bucket} with path ${Key}`)
    s3.getObject(
      {
        Bucket,
        Key
      },
      async (err, data) => {
        if (err) {
          if (err.message !== 'The specified key does not exist.') {
            return rej(err)
          }
          return res(undefined)
        }
        let s3ObjectData: S3.Body | undefined = data.Body
        if (data?.Body) {
          core.info('Response is generated')
          s3ObjectData = data.Body

          return res(s3ObjectData)
        } else {
          core.info('nothing is present inside the S3 object')
          return res(s3ObjectData)
        }
      }
    )
  })
}

export async function createObject(params: S3Object): Promise<boolean> {
  return new Promise((res, rej) => {
    core.info('Pushing into the object/file')
    s3.putObject(params, (err: Error, data: S3.PutObjectOutput): void => {
      if (err) {
        core.info('error pushing into the object/file')
        return rej(false)
      }
      core.info('Successfully Pushed the data into the object')
      return res(true)
    })
  })
}
