import { S3, config } from 'aws-sdk';
import * as core from '@actions/core'
import { countReset } from 'console';
import { AWSConfig } from './types/types';
const s3 = new S3({});

export const initAWS = (input: AWSConfig): void => {
  config.update({
    ...input
  });
};

export const getS3Object = async (
  bucketName: string,
  key: string
): Promise<S3.Body | undefined> => {
  return new Promise((res, rej) => {
    s3.getObject(
      {
        Bucket: bucketName,
        Key: key
      },
      async (err, data) => {
        if (err) {
          if (err.code !== 'NoSuchKey') {
              core.info(err.code);
            return rej(
              new Error(
                `Requested file with key: ${key}, Bucket: ${bucketName} not available - ${err}`
              )
            );
          }
          return res(undefined);
        }
        if (data?.Body) {
          return res(data.Body);
        } else {
          return res(undefined);
        }
      }
    );
  });
};

export async function createObject(
  bucketName: string,
  key: string,
  body: string
): Promise<void> {
  return new Promise((res, rej) => {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: body
    };

    s3.putObject(params, (err: Error): void => {
      if (err) {
        return rej(
          `Error while uploading frozen branch details ${body} to s3 bucket ${bucketName} & key ${key} - ${err}`
        );
      }
      return res();
    });
  });
}
