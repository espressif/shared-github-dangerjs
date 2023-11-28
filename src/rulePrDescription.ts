/**
 * Throw Danger WARN if the pull request description is not sufficiently descriptive
 */

import { DangerDSLType, DangerResults } from 'danger';
import { config, recordRuleExitStatus } from './configParameters';
declare const danger: DangerDSLType;
declare const warn: (message: string, results?: DangerResults) => void;

export default function (): void {
	const ruleName = 'Pull Request sufficient Description';

	// Check if the MR description is missing
	if (!prDescriptionExists()) {
		warn('The Pull Request description is empty. Please provide a detailed description.');
		return recordRuleExitStatus(ruleName, 'Failed');
	}

	let prDescription: string = danger.github.pr.body;

	// Do not count HTML comments as part of MR description length
	prDescription = removeHtmlComments(prDescription);

	// Do not count specified sections as part of MR description length
	const ignoredSections = config.prDescription.ignoredSections.split(',');
	prDescription = removeSections(prDescription, ignoredSections);

	// Count the length of the MR description without the ignored sections and HTML comments
	if (prDescription.length < config.prDescription.minLength) {
		warn('The Pull Request description looks very brief, please check if more details can be added.');
		return recordRuleExitStatus(ruleName, 'Failed');
	}

	// At this point, the rule has passed
	return recordRuleExitStatus(ruleName, 'Passed');
}

function prDescriptionExists(): boolean {
	return Boolean(danger.github.pr.body?.trim());
}

function removeHtmlComments(description: string): string {
	return description.replace(/<!--[\s\S]*?-->/g, '');
}

function removeSections(description: string, sectionNames: string[]): string {
	for (const sectionName of sectionNames) {
		const regexPattern = new RegExp(`## ${sectionName}.*?(\\r\\n|\\n|\\r)([\\s\\S]*?)(?=## |$)`, 'i');
		description = description.replace(regexPattern, '');
	}
	return description;
}
