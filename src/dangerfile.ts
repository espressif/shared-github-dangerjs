import { DangerResults } from 'danger';
import { config, displayAllOutputStatuses, logParamTable } from './configParameters';
import ruleCommitMessages from './ruleCommitMessages';
import rulePrSize from './rulePrSize';
import ruleNumberOfCommits from './ruleNumberOfCommits';
import rulePrDescription from './rulePrDescription';
import ruleSourceBranchName from './ruleSourceBranchName';
import ruleTargetBranch from './ruleTargetBranch';
import outputInstructions from './outputInstructions';

declare const results: DangerResults;
declare const message: (message: string, results?: DangerResults) => void;

async function runDangerRules(): Promise<void> {
	// Show Danger CI job parameters - visible only in CI job trace log
	logParamTable();

	// Run DangerJS checks if they are enabled by CI job parameters
	if (config.commitMessages.enabled) await ruleCommitMessages();
	if (config.numberOfCommits.enabled) ruleNumberOfCommits();
	if (config.prDescription.enabled) rulePrDescription();
	if (config.prSize.enabled) rulePrSize();
	if (config.sourceBranchName.enabled) ruleSourceBranchName();
	if (config.targetBranch.enabled) await ruleTargetBranch();

	// Show DangerJS individual checks statuses - visible in CI job tracelog
	displayAllOutputStatuses();

	// Show DangerJS dynamic output message and instructions - visible in feedback comment
	await outputInstructions();

	// Show success message if no issues are found
	const foundIssues: boolean = Boolean(results.fails.length + results.warnings.length + results.messages.length);
	if (!foundIssues) return message('🎉 Good Job! All checks are passing!');
}

runDangerRules();
