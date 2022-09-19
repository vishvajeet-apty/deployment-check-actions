import * as core from '@actions/core'
import {wait} from './wait'

const deployed_branches = ["rc.18","rc.19","rc.20","rc.21","rc.22"];

async function run(): Promise<void> {
  try {
    let branchName: string = ''
    let shouldDeploy = false
    let ProdDeploy = false
    let NonProdDeploy = false
    const eventName = process.env.GITHUB_EVENT_NAME
  
    
    // Fetch Branch Name
    if (eventName === 'pull_request') {
      branchName = process.env.GITHUB_HEAD_REF!
    } else if (eventName === 'push' || eventName === 'workflow_run') {
      branchName = process.env.GITHUB_REF?.replace('refs/heads/', '')!
    }
    const bucketName = core.getInput('BUCKET_NAME')
    const region = core.getInput('REGION')
    const configPath = core.getInput('CONFIG_PATH')
    let targetBranch = core.getInput('TARGET_BRANCH')

    // Validate and set branch Name
    const validBranchRegex =
      /(^(revert)-[0-9]{1,5}-(feature|bugfix|hotfix|onprem|test)\/(LSP|CB|AQRE|LP|ASE|CED|SAP|FR)-[0-9]{1,5}\/[0-9a-zA-Z_-]+$)|(^(feature|bugfix|hotfix|onprem|test)\/(LSP|CB|AQRE|LP|ASE|CED|SAP|FR)-[0-9]{1,5}\/[0-9a-zA-Z_-]+$)|(^(main|development|staging|production|qa|qa1|hotfix|labs|onprem|nightly)$)|((rc)-\d*.\d*.\d*)/
    if (!validBranchRegex.test(branchName)) {
      core.setFailed(
        `Branch Name should be in the regex format ${validBranchRegex}`
      )
    } else {
      core.setOutput('branch_name', branchName)
    }

    // Calculate should_deploy and set as output
    const deployableBranches = [
      'development',
      'qa',
      'staging',
      'production',
      'labs',
      'qa1',
      'hotfix'
    ]
    if (deployableBranches.includes(branchName)) {
      shouldDeploy = true
    }
    core.setOutput('should_deploy', shouldDeploy)

    // Check if it's Staging or Productions or labs
    const ProdBranches = ['staging', 'production', 'labs']
    if (ProdBranches.includes(branchName)) {
      ProdDeploy = true
    }
    core.setOutput('prod_deploy', ProdDeploy)
    // Check if it's Dev or QA
    const NonProdBranches = ['development', 'qa', 'qa1', 'hotfix']
    if (NonProdBranches.includes(branchName)) {
      NonProdDeploy = true
    }
    core.setOutput('non_prod_deploy', NonProdDeploy)

    core.info(
      JSON.stringify({
        shouldDeploy: shouldDeploy,
        branchName,
        ProdDeploy: ProdDeploy,
        region,
        configPath,
      })
    )
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
