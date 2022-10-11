import * as core from '@actions/core';
const branchName = core.getInput('BRANCH_NAME');
const bucketName = core.getInput('BUCKET_NAME');
const serviceName = core.getInput('SERVICE_NAME');
const region = core.getInput('REGION');
const targetBranch = core.getInput('TARGET_Branch');
const deploy_environment = core.getInput('ENVIRONMENT_NAME');

export {
  branchName,
  bucketName,
  region,
  targetBranch,
  deploy_environment,
  serviceName,
};
