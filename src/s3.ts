import {S3, config} from 'aws-sdk'
import {AWSConfig, S3Base} from './types/aws.types'
import * as core from '@actions/core'

const s3 = new S3()

export const initAWS = (input: AWSConfig): void => {
  config.update({
    ...input
  })
}

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
