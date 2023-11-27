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

export { displayAllOutputStatuses, recordRuleExitStatus, outputStatuses };
