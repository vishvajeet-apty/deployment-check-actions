export interface AWSConfig {
  region: string
}

export interface S3Base {
  Bucket: string
  Key: string
}

export type BundleConfig = {
  name: string
  path: string
  size: string
  change?: string
  sizeNumber?: number
  targetBranchName?: string
}

export interface S3Object {
  Bucket: string
  Key: string
  Body: string
}
