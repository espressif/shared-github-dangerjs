import { DangerDSLType, DangerResults } from 'danger';
import { Octokit } from '@octokit/rest';
import { recordRuleExitStatus } from './configParameters';

declare const danger: DangerDSLType;
declare const warn: (message: string, results?: DangerResults) => void;

/**
 * Check if the target branch is project default branch.
 *
 * @dangerjs warn
 */
export default async function (): Promise<void> {
	const ruleName = 'Target branch is project default branch';
	const prTargetBranch: string = danger.github.pr.base.ref;
	const defaultBranch: string = await getDefaultBranch();

	if (prTargetBranch !== defaultBranch) {
		warn(`
        The **target branch** for this Pull Request **must be the default branch** of the project (\`${defaultBranch}\`).\n
        If you would like to add this feature to a different branch, please state this in the PR description and we will consider it.
        `);
		return recordRuleExitStatus(ruleName, 'Failed');
	}

	// At this point, the rule has passed
	return recordRuleExitStatus(ruleName, 'Passed');
}

/**
 * Fetches the default branch of the repository.
 */
async function getDefaultBranch(): Promise<string> {
	const repoOwner: string = danger.github.pr.base.repo.owner.login;
	const repoName: string = danger.github.pr.base.repo.name;
	const octokit = new Octokit();
	const { data: repo } = await octokit.repos.get({ owner: repoOwner, repo: repoName });
	return repo.default_branch;
}
