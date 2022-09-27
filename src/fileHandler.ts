import {truncateSync} from 'fs'

export class FileS3 {
  private branchObject: {branches: string[]} = {
    branches: []
  }

  constructor(branch: string, environment: string) {
    this.branchObject.branches.push(branch)
  }

  getBranchObject(): {branches: string[]} {
    return this.branchObject
  }
}
