import * as core from '@actions/core';
import { getS3Object, createObject } from './s3';
import { FrozenBranches } from './fileHandler';

import { branchName, bucketName, deploy_environment } from './config';


async function run(): Promise<void> {
  const s3FileKey = `assist/${deploy_environment}.json`;
  let frozenBranches;
  try {
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
      `assist/${deploy_environment}.json`,
      frozenBranches.toJsonString()
    );
  } catch (err) {
    core.setFailed(
      `Error while checking/updating frozen branch details to S3 - ${err}`
    );
  }
}

run();
