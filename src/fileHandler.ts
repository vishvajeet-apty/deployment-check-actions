import {S3} from 'aws-sdk'
import {truncateSync} from 'fs'

export class FileS3 {
  private branches: string[]
  constructor(data: S3.Body) {
    this.branches = JSON.parse(data.toString())
  }
  addBranch(branchName: string): {allBranches: string[]} {
    this.branches.push(branchName)
    return {allBranches: this.branches}
  }
  hasBranch(branchName: string): boolean {
    if (this.branches.includes(branchName)) return true
    return false
  }
  getBranches(): string[] {
    return this.branches
  }
}
