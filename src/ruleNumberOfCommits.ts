import { DangerDSLType, DangerResults } from 'danger';
import { config, recordRuleExitStatus } from './configParameters';

declare const danger: DangerDSLType;
declare const message: (message: string, results?: DangerResults) => void;
declare const warn: (message: string, results?: DangerResults) => void;

/**
 * Throw a Danger MESSAGE if the pull request has an excessive number of commits (if it needs to be squashed).
 * Throw a Danger WARN if number of commits hits warn defined value.
 */
export default function (): void {
	const ruleName = 'Number of commits in Pull Request';
	const prCommits: number = danger.github.commits.length;

	if (prCommits > config.numberOfCommits.maxCommitsWarning) {
		warn(`Please consider squashing your ${prCommits} commits (simplifying branch history).`);
		return recordRuleExitStatus(ruleName, 'Failed');
	}

	if (prCommits > config.numberOfCommits.maxCommitsInfo) {
		message(`You might consider squashing your ${prCommits} commits (simplifying branch history).`);
		return recordRuleExitStatus(ruleName, 'Passed (with suggestion)');
	}

	// At this point, the rule has passed
	return recordRuleExitStatus(ruleName, 'Passed');
}
