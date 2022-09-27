export default class Branch {
  branches: string[] = []

  constructor(branch: string, environment: string) {
    this.branches.push(branch)
  }

  checkEnvExists(env: string): boolean {
    return true
  }
}
