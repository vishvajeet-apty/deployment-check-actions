export class FrozenBranches {
  private branches: string[]

  constructor(branches: string[]) {
    this.branches = branches;
  }

  static FromJsonString(data: string) {
    return new FrozenBranches(JSON.parse(data).branches);
  }

  toJsonString(): string {
    return JSON.stringify({ branches: this.branches });
  }

  withBranch(branchName: string): FrozenBranches {
    this.branches.push(branchName);
    return this;
  }

  hasBranch(branchName: string): boolean {
    if (this.branches.includes(branchName)) return true;
    return false;
  }
  getBranches(): string[] {
    return this.branches;
  }
}
