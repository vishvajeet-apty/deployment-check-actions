import * as core from '@actions/core'
const branchName = core.getInput('BRANCH_NAME')
const bucketName = core.getInput('BUCKET_NAME')
const region = core.getInput('REGION')
const configPath = core.getInput('CONFIG_PATH')
let targetBranch = core.getInput('TARGET_Branch')
const deploy_environment = core.getInput('ENVIRONMENT_NAME')

export default {
  branchName,
  bucketName,
  region,
  configPath,
  targetBranch,
  deploy_environment
}
