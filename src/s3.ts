import {S3, config} from 'aws-sdk'
import {AWSConfig, S3Base} from './types/aws.types'
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";

import * as core from '@actions/core'

const s3 = new S3({})

export const initAWS = (input: AWSConfig): void => {
  config.update({
    ...input
  })
}

//create the file if it doesn't exist


export const getS3Object = async <T = []>({
  Bucket,
  Key
}: S3Base): Promise<T | []> => {
  return new Promise((res, rej) => {
    core.info(`getting data from ${Bucket} with path ${Key}`)
    s3.getObject({Bucket, Key}, (err, data) => {
      if (err) {
        return rej(err)
      }
      if (data?.Body) {
        return res(JSON.parse(data.Body?.toString()))
      } else {
        return res([])
      }
    })
  })
}

export const isFileExists = async (
  input: S3Base
): Promise<boolean> => {
  return new Promise(res => {
    getS3Object({ ...input })
      .then(() => {
        return res(true)
      })
      .catch(() => {
        return res(false)
      })
  })
}
