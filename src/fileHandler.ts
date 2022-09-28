import {S3} from 'aws-sdk'
import * as core from '@actions/core'
import {countReset} from 'console'
import {truncateSync} from 'fs'

export class FileS3 {
  private branches: string[]

  constructor(data: string[]) {
    this.branches = [...data]
  }
  addBranch(branchName: string): string[] {
    const allBranches = this.branches
    allBranches.push(branchName)
    return allBranches
  }
  hasBranch(branchName: string): boolean {
    if (this.branches.includes(branchName)) return true
    return false
  }
  getBranches(): string[] {
    return this.branches
  }
}
