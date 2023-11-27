import { DangerResults } from 'danger';
import { displayAllOutputStatuses } from './configParameters';
import ruleNumberOfCommits from './ruleNumberOfCommits';

declare const results: DangerResults;
declare const message: (message: string, results?: DangerResults) => void;

function runDangerRules(): void {
	// Run DangerJS checks if they are enabled by CI job parameters
	if (process.env.MAX_COMMITS_ENABLED === 'true') ruleNumberOfCommits();

	// Show DangerJS individual checks statuses - visible in CI job tracelog
	displayAllOutputStatuses();

	// Show success message if no issues are found
	const foundIssues: boolean = Boolean(results.fails.length + results.warnings.length + results.messages.length);
	if (!foundIssues) return message('🎉 Good Job! All checks are passing!');
}

runDangerRules();
