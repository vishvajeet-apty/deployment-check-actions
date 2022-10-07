import * as core from '@actions/core';
import { getS3Object, createObject } from './s3';
import { FrozenBranches } from './fileHandler';

import { branchName, bucketName, deploy_environment,serviceName  } from './config';


async function run(): Promise<void> {
  const s3FileKey = `${serviceName}/${deploy_environment}.json`;
  let frozenBranches;
  try {
    if(deploy_environment !== 'production') {
      process.exit(0);
    }
    const frozenBranchData = await getS3Object(bucketName, s3FileKey);
    if (!frozenBranchData) {
      frozenBranches = new FrozenBranches([branchName]);
    } else {
      frozenBranches = FrozenBranches.FromJsonString(
        frozenBranchData.toString()
      ).withBranch(branchName);
      core.info(JSON.stringify(frozenBranches.getBranches()));
    }

    await createObject(
      bucketName,
      `${serviceName}/${deploy_environment}.json`,
      frozenBranches.toJsonString()
    );
    core.info(JSON.stringify(frozenBranches.getBranches()));
  } catch (err) {
    core.setFailed(
      `Error while checking/updating frozen branch details to S3 - ${err}`
    );
  }
}

run();
