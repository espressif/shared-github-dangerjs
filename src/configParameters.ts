/**
 * `defaults` object:
 * This object defines the default settings for various merge request checks.
 * Each section corresponds to a specific check and contains default values for its parameters.
 * If an environment variable for a parameter is not set, the system will use the default value from this object.
 */
const defaults = {
	numberOfCommits: { enabled: true, maxCommitsInfo: 2, maxCommitsWarning: 5 },
	prDescription: { enabled: true, minLength: 50, ignoredSections: 'related,release,breaking' },
	// commitsEmail: { enabled: true },
	commitMessages: {
		enabled: true,
		allowedTypes: 'change,ci,docs,feat,fix,refactor,remove,revert',
		minSummaryLength: 20,
		maxSummaryLength: 72,
		maxBodyLineLength: 100,
	},
	// mrSize: { enabled: true, maxChangedLines: 1000 },
	// jiraReferences: { enabled: true },
	// sourceBranchName: { enabled: true },
	// updatedChangelog: {
	// 	enabled: true,
	// 	filename: 'CHANGELOG.md',
	// 	triggers: 'change,feat,fix,remove,revert',
	// },
	// releaseNotesDescription: { enabled: false },
	// areaLabels: { enabled: false, color: '#d2ebfa' },
	// docsTranslation: { enabled: false },
};

/**
 * `config` object:
 * This object fetches the values of environment variables and uses them to configure the merge request checks.
 * If an environment variable is not set, the system will fall back to the default value from the `defaults` object.
 */
const config = {
	numberOfCommits: {
		enabled: getEnvBool(process.env.ENABLE_CHECK_PR_TOO_MANY_COMMITS) ?? defaults.numberOfCommits.enabled,
		maxCommitsInfo: Number(process.env.MAX_COMMITS) || defaults.numberOfCommits.maxCommitsInfo,
		maxCommitsWarning: Number(process.env.MAX_COMMITS_WARN) || defaults.numberOfCommits.maxCommitsWarning,
	},
	prDescription: {
		enabled: getEnvBool(process.env.ENABLE_CHECK_PR_DESCRIPTION) ?? defaults.prDescription.enabled,
		minLength: Number(process.env.MIN_PR_DESCRIPTION_LENGTH) || defaults.prDescription.minLength,
		ignoredSections: process.env.IGNORED_SECTIONS_DESCRIPTION || defaults.prDescription.ignoredSections,
	},
	// commitsEmail: {
	// 	enabled: getEnvBool(process.env.ENABLE_CHECK_MR_COMMITS_EMAIL) ?? defaults.commitsEmail.enabled,
	// },
	commitMessages: {
		enabled: getEnvBool(process.env.ENABLE_CHECK_PR_COMMIT_MESSAGES) ?? defaults.commitMessages.enabled,
		allowedTypes: process.env.COMMIT_MESSAGE_ALLOWED_TYPES || defaults.commitMessages.allowedTypes,
		minSummaryLength: Number(process.env.MIN_COMMIT_MESSAGE_SUMMARY) || defaults.commitMessages.minSummaryLength,
		maxSummaryLength: Number(process.env.MAX_COMMIT_MESSAGE_SUMMARY) || defaults.commitMessages.maxSummaryLength,
		maxBodyLineLength: Number(process.env.MAX_COMMIT_MESSAGE_BODY_LINE) || defaults.commitMessages.maxBodyLineLength,
	},
	// mrSize: {
	// 	enabled: getEnvBool(process.env.ENABLE_CHECK_MR_SIZE_LINES) ?? defaults.mrSize.enabled,
	// 	maxChangedLines: Number(process.env.MAX_MR_LINES) || defaults.mrSize.maxChangedLines,
	// },
	// jiraReferences: {
	// 	enabled: getEnvBool(process.env.ENABLE_CHECK_MR_JIRA_REFERENCES) ?? defaults.jiraReferences.enabled,
	// },
	// sourceBranchName: {
	// 	enabled: getEnvBool(process.env.ENABLE_CHECK_MR_SOURCE_BRANCH_NAME) ?? defaults.sourceBranchName.enabled,
	// },
	// updatedChangelog: {
	// 	enabled: getEnvBool(process.env.ENABLE_CHECK_UPDATED_CHANGELOG) ?? defaults.updatedChangelog.enabled,
	// 	filename: process.env.CHANGELOG_FILENAME || defaults.updatedChangelog.filename,
	// 	triggers: process.env.CHANGELOG_UPDATE_TRIGGERS || defaults.updatedChangelog.triggers,
	// },
	// releaseNotesDescription: {
	// 	enabled: getEnvBool(process.env.ENABLE_CHECK_RELEASE_NOTES_DESCRIPTION) ?? defaults.releaseNotesDescription.enabled,
	// },
	// areaLabels: {
	// 	enabled: getEnvBool(process.env.ENABLE_CHECK_AREA_LABELS) ?? defaults.areaLabels.enabled,
	// 	color: process.env.AREA_LABEL_COLOR || defaults.areaLabels.color,
	// },
	// docsTranslation: {
	// 	enabled: getEnvBool(process.env.ENABLE_CHECK_DOCS_TRANSLATION) ?? defaults.docsTranslation.enabled,
	// },
};

/**
 * `parametersForTable` array:
 * This array maps environment variables to their current values and default values.
 * It is used to display a table that shows which checks are active and their current configurations in CI job tracelog.
 */
const parametersForTable = [
	// { ciVar: 'ENABLE_CHECK_AREA_LABELS', value: config.areaLabels.enabled, defaultValue: defaults.areaLabels.enabled },
	// { ciVar: 'ENABLE_CHECK_DOCS_TRANSLATION', value: config.docsTranslation.enabled, defaultValue: defaults.docsTranslation.enabled },
	{ ciVar: 'ENABLE_CHECK_PR_COMMIT_MESSAGES', value: config.commitMessages.enabled, defaultValue: defaults.commitMessages.enabled },
	// { ciVar: 'ENABLE_CHECK_MR_COMMITS_EMAIL', value: config.commitsEmail.enabled, defaultValue: defaults.commitsEmail.enabled },
	{ ciVar: 'ENABLE_CHECK_PR_DESCRIPTION', value: config.prDescription.enabled, defaultValue: defaults.prDescription.enabled },
	// { ciVar: 'ENABLE_CHECK_MR_JIRA_REFERENCES', value: config.jiraReferences.enabled, defaultValue: defaults.jiraReferences.enabled },
	// { ciVar: 'ENABLE_CHECK_MR_SIZE_LINES', value: config.mrSize.enabled, defaultValue: defaults.mrSize.enabled },
	// { ciVar: 'ENABLE_CHECK_MR_SOURCE_BRANCH_NAME', value: config.sourceBranchName.enabled, defaultValue: defaults.sourceBranchName.enabled },
	{ ciVar: 'ENABLE_CHECK_PR_TOO_MANY_COMMITS', value: config.numberOfCommits.enabled, defaultValue: defaults.numberOfCommits.enabled },
	// { ciVar: 'ENABLE_CHECK_RELEASE_NOTES_DESCRIPTION', value: config.releaseNotesDescription.enabled, defaultValue: defaults.releaseNotesDescription.enabled },
	// { ciVar: 'ENABLE_CHECK_UPDATED_CHANGELOG', value: config.updatedChangelog.enabled, defaultValue: defaults.updatedChangelog.enabled },
	// { ciVar: 'AREA_LABEL_COLOR', value: config.areaLabels.color, defaultValue: defaults.areaLabels.color },
	// { ciVar: 'CHANGELOG_FILENAME', value: config.updatedChangelog.filename, defaultValue: defaults.updatedChangelog.filename },
	// { ciVar: 'CHANGELOG_UPDATE_TRIGGERS', value: config.updatedChangelog.triggers, defaultValue: defaults.updatedChangelog.triggers },
	{ ciVar: 'COMMIT_MESSAGE_ALLOWED_TYPES', value: config.commitMessages.allowedTypes, defaultValue: defaults.commitMessages.allowedTypes },
	{ ciVar: 'IGNORED_SECTIONS_DESCRIPTION', value: config.prDescription.ignoredSections, defaultValue: defaults.prDescription.ignoredSections },
	{ ciVar: 'MAX_COMMIT_MESSAGE_BODY_LINE', value: config.commitMessages.maxBodyLineLength, defaultValue: defaults.commitMessages.maxBodyLineLength },
	{ ciVar: 'MAX_COMMIT_MESSAGE_SUMMARY', value: config.commitMessages.maxSummaryLength, defaultValue: defaults.commitMessages.maxSummaryLength },
	{ ciVar: 'MAX_COMMITS', value: config.numberOfCommits.maxCommitsInfo, defaultValue: defaults.numberOfCommits.maxCommitsInfo },
	{ ciVar: 'MAX_COMMITS_WARN', value: config.numberOfCommits.maxCommitsWarning, defaultValue: defaults.numberOfCommits.maxCommitsWarning },
	// { ciVar: 'MAX_MR_LINES', value: config.mrSize.maxChangedLines, defaultValue: defaults.mrSize.maxChangedLines },
	{ ciVar: 'MIN_COMMIT_MESSAGE_SUMMARY', value: config.commitMessages.minSummaryLength, defaultValue: defaults.commitMessages.minSummaryLength },
	{ ciVar: 'MIN_PR_DESCRIPTION_LENGTH', value: config.prDescription.minLength, defaultValue: defaults.prDescription.minLength },
];

interface RuleExitStatus {
	message: string;
	status: string;
}
const outputStatuses: RuleExitStatus[] = [];

/**
 * Logs the status of a rule with padded formatting and stores it in the `outputStatuses` array.
 * If the rule already exists in the array, its status is updated.
 */
function recordRuleExitStatus(message: string, status: string) {
	// Check if the rule already exists in the array
	const existingRecord = outputStatuses.find((rule) => rule.message === message);

	// Update or create the status of the existing rule in array
	if (existingRecord) existingRecord.status = status;
	else outputStatuses.push({ message, status });
}

/**
 * Displays all the rule output statuses stored in the `outputStatuses` array.
 * Filters out any empty lines, sorts them alphabetically, and prints the statuses
 * with a header and separator.
 * These statuses are later displayed in CI job tracelog.
 */
function displayAllOutputStatuses() {
	const lineLength = 100;
	const sortedStatuses = outputStatuses.sort((a, b) => a.message.localeCompare(b.message));

	const formattedLines: string[] = sortedStatuses.map((statusObj) => {
		const paddingLength = lineLength - statusObj.message.length - statusObj.status.length;
		const paddedMessage = statusObj.message.padEnd(statusObj.message.length + paddingLength, '.');
		return `${paddedMessage} ${colorize(statusObj.status)}`;
	});

	console.log('DangerJS checks (rules) output states:\n' + '='.repeat(lineLength + 2));
	console.log(formattedLines.join('\n'));
	console.log('='.repeat(lineLength + 2));
}

/**
 * This function logs a table to the console, displaying the current configuration of merge request Danger checks.
 * The table shows the environment variable associated with each check, its current value, and whether it's using
 * the default setting or a custom one.
 */
function logParamTable() {
	interface JobParameter {
		CiVariable: string;
		Value: number | string | boolean;
		CustomSettings: string;
	}

	const jobParametersTable: JobParameter[] = parametersForTable.map((param) => ({
		CiVariable: param.ciVar,
		Value: param.value,
		CustomSettings: param.value == param.defaultValue ? 'default' : `custom (default is: ${param.defaultValue})`,
	}));

	console.table(jobParametersTable);
}

/**
 * This function converts environment variable values to a boolean representation.
 * The function checks if the provided value matches any of the common representations of "true"
 * such as 'true', 'on', 'yes', '1', and 'enabled'. The check is case-insensitive.
 * If the value matches any of these representations, the function returns boolean `true`; otherwise, it returns boolean `false`.
 * If the value is undefined, the function returns undefined; that results to using default value in config object
 */
function getEnvBool(value: string | undefined): boolean | undefined {
	if (!value) return undefined; // Checks for both undefined and empty string
	return ['true', 'on', 'yes', '1', 'enabled'].includes(value.toLowerCase());
}

/**
 * This function applies specific ANSI color codes to a status message string based on its content,
 * enhancing the readability of console/CI job tracelog outputs. It checks the content of the message and colors it
 * accordingly: 'passed' messages are green, 'failed' messages are red, and all other cases are yellow.
 */
function colorize(message: string): string {
	enum AnsiColors {
		RED = '\u001b[31m',
		GREEN = '\u001b[32m',
		YELLOW = '\u001b[33m',
		RESET = '\u001b[0m',
	}
	if (message.toLowerCase().startsWith('skipped')) return message;
	if (message.toLowerCase() === 'passed') return AnsiColors.GREEN + message + AnsiColors.RESET;
	if (message.toLowerCase() === 'failed') return AnsiColors.RED + message + AnsiColors.RESET;
	return AnsiColors.YELLOW + message + AnsiColors.RESET;
}

export { displayAllOutputStatuses, recordRuleExitStatus, outputStatuses, logParamTable, config };
