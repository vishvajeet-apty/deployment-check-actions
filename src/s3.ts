import {S3, config, AWSError} from 'aws-sdk'
import {AWSConfig, S3Base, S3Object, BundleConfig} from './types/types'
import {fromNodeProviderChain} from '@aws-sdk/credential-providers'
import {readFileSync} from 'fs'
import * as core from '@actions/core'
import {eventType} from './main'
const s3 = new S3({})

export const initAWS = (input : AWSConfig) : void => {
    config.update({
        ...input
    })
}

const actual = ['values']
const toJSON = (input : any) : any => {
    try {
        return JSON.parse(input)
    } catch (e) {}
    return undefined
}
export const isDeployable = async (Body : S3.Body, {Bucket, Key} : S3Base, branchName : string) : Promise < void > => {
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
        } else { // it is a pull request
            core.info(Body.toString())

            const branchList = toJSON(Body.toString())
            core.info(`log: info: branchList: ${branchList} !`)
            if (branchList && branchList.branches.includes(branchName)) {
                core.setFailed('Cannot deploy the already deployed branches')
            }
            return
        }
    })
}
export const getS3Object = async ({Bucket, Key} : S3Base, branchName : string) : Promise < void > => {
    return new Promise((res, rej) => {
        core.info(`getting data from ${Bucket} with path ${Key}`)
        s3.getObject({
            Bucket,
            Key
        }, async (err, data) => {
            if (err) {
                return rej(err)
            }
            if (data ?. Body) {
                core.info('Response is generated')
                const res = data.Body
                await isDeployable(res, {
                    Bucket,
                    Key
                }, branchName)
                core.info(eventType)
            } else {
                core.info('nothing is present')
                return
            }
        })
    })
}

export const isFileExists = async (input : S3Base, branchName : string) : Promise < boolean > => {
    return new Promise(res => {
        getS3Object({
            ...input
        }, branchName).then(() => {
            return res(true)
        }).catch(() => {
            return res(false)
        })
    })
}
export async function pushAgain(params: S3Object): Promise<boolean> {
    return new Promise((res, rej) => {
        core.info('Pushing the array again...')
        s3.putObject(params, (err : Error, data : S3.PutObjectOutput) : void => {
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
        s3.putObject(params, (err : Error, data : S3.PutObjectOutput) : void => {
            if (err) {
                core.info('error creating the folder/object')
                return rej()
            }
            core.info('Successfully created the folder on the S3')
            return res()
        })
    })
}
