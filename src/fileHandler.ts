import {truncateSync} from 'fs'

export class FileS3 {
  branchObject: {branches: string[]} = {
    branches: []
  }

  constructor(branch: string, environment: string) {
    this.branchObject.branches.push(branch)
  }
}
