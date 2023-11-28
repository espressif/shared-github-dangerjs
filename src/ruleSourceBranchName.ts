import { DangerDSLType, DangerResults } from 'danger';
import { recordRuleExitStatus } from './configParameters';

declare const danger: DangerDSLType;
declare const warn: (message: string, results?: DangerResults) => void;

/**
 * Throw Danger WARN if branch name contains more than one slash or uppercase letters
 */
export default function (): void {
	const ruleName = 'Source branch name';

	const sourceBranch = danger.github.pr.head.ref;
	const issuesBranchName: string[] = [];

	// Check if the source branch name contains more than one slash
	const slashCount = (sourceBranch.match(/\//g) || []).length;

	if (slashCount > 1) {
		issuesBranchName.push(`- contains more than one slash (\`/\`). This can cause troubles with git sync.`);
	}

	// Check if the source branch name contains any uppercase letters
	if (sourceBranch !== sourceBranch.toLowerCase()) {
		issuesBranchName.push(`- contains uppercase letters. This can cause troubles on case-insensitive file systems (macOS).`);
	}

	// Create report
	if (issuesBranchName.length) {
		const warnOutput = `The source branch \`"${sourceBranch}"\` incorrect format:\n${issuesBranchName
			.map((message) => `  ${message}`) // Indent each issue by 2 spaces
			.join('\n')}\nPlease rename your branch.`;
		warn(warnOutput);
		return recordRuleExitStatus(ruleName, 'Failed');
	}

	// At this point, the rule has passed
	return recordRuleExitStatus(ruleName, 'Passed');
}
