/**
 * Throw Danger MESSAGE if the pull request is too large (more than 1000 lines of changes)
 * Throw Danger WARN if it is not possible to calculate PR size (empty PR)
 */

import { DangerDSLType, DangerResults } from 'danger';
import { config, recordRuleExitStatus } from './configParameters';
declare const danger: DangerDSLType;
declare const message: (message: string, results?: DangerResults) => void;

export default function (): void {
	const ruleName = 'Pull Request size (number of changed lines)';
	const totalLines: number | null = danger.github.pr.additions + danger.github.pr.deletions;

	if (totalLines > config.prSize.maxChangedLines) {
		message(`This PR seems to be quite large (total lines of code: ${totalLines}), you might consider splitting it into smaller PRs`);
		return recordRuleExitStatus(ruleName, 'Passed (with suggestions)');
	}

	// At this point, the rule has passed
	recordRuleExitStatus(ruleName, 'Passed');
}
