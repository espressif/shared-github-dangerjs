import { DangerResults } from 'danger';
import { config, displayAllOutputStatuses, logParamTable } from './configParameters';
import ruleCommitMessages from './ruleCommitMessages';
import ruleNumberOfCommits from './ruleNumberOfCommits';
import rulePrDescription from './rulePrDescription';

declare const results: DangerResults;
declare const message: (message: string, results?: DangerResults) => void;

async function runDangerRules(): Promise<void> {
	// Show Danger CI job parameters - visible only in CI job trace log
	logParamTable();

	// Run DangerJS checks if they are enabled by CI job parameters
	if (config.commitMessages.enabled) await ruleCommitMessages();
	if (config.numberOfCommits.enabled) ruleNumberOfCommits();
	if (config.prDescription.enabled) rulePrDescription();

	// Show DangerJS individual checks statuses - visible in CI job tracelog
	displayAllOutputStatuses();

	// Show success message if no issues are found
	const foundIssues: boolean = Boolean(results.fails.length + results.warnings.length + results.messages.length);
	if (!foundIssues) return message('🎉 Good Job! All checks are passing!');
}

runDangerRules();
