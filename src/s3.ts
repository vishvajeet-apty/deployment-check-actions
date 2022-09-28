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

const toJSON = (input: any): any => {
  try {
    return JSON.parse(input)
  } catch (e) {}
  return undefined
}
// export const updateS3Object = async (
//   Body: S3.Body,
//   {Bucket, Key}: S3Base,
//   branchName: string
// ): Promise<void> => {
//   return new Promise(async (res, rej) => {
//     core.info('It depends on the type of event')
//     if (eventType === 'push') {
//       const branchArray = JSON.parse(Body.toString())
//       branchArray.branches.push(branchName)
//       core.info(JSON.stringify(branchArray))
//       let params = {
//         Bucket,
//         Key,
//         Body: JSON.stringify(branchArray)
//       }
//       let result = await createObject(params)
//       if (result) {
//         core.info('succesfully pushed again')
//         return
//       }
//     } else {
//       // it is a pull request
//       core.info(Body.toString())

//       const branchList = toJSON(Body.toString())
//       core.info(`log: info: branchList: ${branchList} !`)
//       if (branchList && branchList.branches.includes(branchName)) {
//         core.setFailed('Cannot deploy the already deployed branches')
//       }
//       return
//     }
//   })
// }
// export const isS3ObjectExists = async (
//   {Bucket, Key}: S3Base,
//   branchName: string
// ): Promise<boolean> => {
//   return new Promise(res => {
//     core.info(`Checking if this ${Bucket} with this path ${Key} exists or not`)
//     s3.getObject(
//       {
//         Bucket,
//         Key
//       },
//       async (err, data) => {
//         if (err) {
//           return res(false)
//         } else {
//           return res(true)
//         }
//       }
//     )
//   })
// }

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
