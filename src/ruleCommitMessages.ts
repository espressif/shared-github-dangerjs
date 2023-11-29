import { DangerDSLType } from 'danger';
import lint from '@commitlint/lint';
import { QualifiedRules } from '@commitlint/types';
import { LintRuleOutcome } from '@commitlint/types';
import { config, recordRuleExitStatus } from './configParameters';

declare const danger: DangerDSLType;
declare const warn: (message: string) => void;

const lintingRules: QualifiedRules = {
	// rule definition: [(0-1 = off/on), (always/never = must be/mustn't be), (value)]
	'body-max-line-length': [1, 'always', config.commitMessages.maxBodyLineLength], // Max length of the body line
	'footer-leading-blank': [1, 'always'], // Always have a blank line before the footer section
	'footer-max-line-length': [1, 'always', config.commitMessages.maxBodyLineLength], // Max length of the footer line
	'subject-max-length': [1, 'always', config.commitMessages.maxSummaryLength], // Max length of the "Summary"
	'subject-min-length': [1, 'always', config.commitMessages.minSummaryLength], // Min length of the "Summary"
	'scope-case': [1, 'always', 'lower-case'], // "scope/component" must be lowercase
	'subject-full-stop': [1, 'never', '.'], // "Summary" must not end with a full stop (period)
	'subject-empty': [1, 'never'], // "Summary" is mandatory
	'type-case': [1, 'always', 'lower-case'], // "type/action" must start with lower-case
	'type-empty': [1, 'never'], // "type/action" is mandatory
	'type-enum': [1, 'always', config.commitMessages.allowedTypes.split(',')], // "type/action" must be one of the allowed types
	'body-leading-blank': [1, 'always'], // Always have a blank line before the body section
};

interface Commit {
	message: string;
}

/**
 * Throw Danger WARN if commit messages are not valid based on Espressif rules for git commit messages
 */
export default async function (): Promise<void> {
	const ruleName = 'Commit messages style';
	const prCommits: Commit[] = danger.git.commits;

	const issuesAllCommitMessages: string[] = [];

	for (const commit of prCommits) {
		const commitMessage: string = commit.message;
		const commitMessageTitle: string = commit.message.split('\n')[0];

		const issuesSingleCommitMessage: string[] = [];
		let reportSingleCommitMessage = '';

		// Check if the commit message contains any Jira ticket references
		const jiraTicketRegex = /[A-Z0-9]+-[0-9]+/g;
		const jiraTicketMatches = commitMessage.match(jiraTicketRegex);
		if (jiraTicketMatches) {
			const jiraTicketNames = jiraTicketMatches.join(', ');
			issuesSingleCommitMessage.push(
				`- probably contains Jira ticket reference (\`${jiraTicketNames}\`). Please remove Jira tickets from commit messages.`,
			);
		}

		// Add check for spaces in scope
		const scopeRegex = /(?<=\().+?(?=\):)/; // This regex captures the scope after the type and before the summary, including spaces
		const matchResults = commitMessageTitle.match(scopeRegex);
		if (matchResults !== null) {
			const scope = matchResults[0];
			if (scope && scope.trim().includes(' ')) {
				issuesSingleCommitMessage.push(
					'- *scope/component* should be lowercase without whitespace, allowed special characters are `_` `/` `.` `,` `*` `-` `.`',
				);
			}
		}

		// Lint commit messages with @commitlint (Conventional Commits style)
		const result = await lint(commit.message, lintingRules);

		for (const warning of result.warnings as LintRuleOutcome[]) {
			// Custom messages for each rule with terminology used by Espressif conventional commits guide
			switch (warning.name) {
				case 'subject-max-length':
					issuesSingleCommitMessage.push(`- *summary* appears to be too long`);
					break;
				case 'type-empty':
					issuesSingleCommitMessage.push(`- *type/action* looks empty`);
					break;
				case 'type-case':
					issuesSingleCommitMessage.push(`- *type/action* should start with a lowercase letter`);
					break;
				case 'scope-case':
					issuesSingleCommitMessage.push(
						`- *scope/component* should be lowercase without whitespace, allowed special characters are \`_\` \`/\` \`.\` \`,\` \`*\` \`-\` \`.\``,
					);
					break;
				case 'subject-empty':
					issuesSingleCommitMessage.push(`- *summary* looks empty`);
					break;
				case 'subject-min-length':
					issuesSingleCommitMessage.push(`- *summary* looks too short`);
					break;
				case 'subject-full-stop':
					issuesSingleCommitMessage.push(`- *summary* should not end with a period (full stop)`);
					break;
				case 'type-enum':
					issuesSingleCommitMessage.push(
						`- *type/action* should be one of [${config.commitMessages.allowedTypes
							.split(',')
							.map((type) => `\`${type}\``)
							.join(', ')}]`,
					);
					break;

				default:
					issuesSingleCommitMessage.push(`- ${warning.message}`);
			}
		}

		if (issuesSingleCommitMessage.length) {
			reportSingleCommitMessage = `- the commit message \`"${commitMessageTitle}"\`:\n${issuesSingleCommitMessage
				.map((message) => `  ${message}`) // Indent each issue by 2 spaces
				.join('\n')}`;
			issuesAllCommitMessages.push(reportSingleCommitMessage);
		}
	}

	// Create report
	if (issuesAllCommitMessages.length) {
		issuesAllCommitMessages.sort();
		const basicTips = [
			`- follow [Conventional Commits style](https://www.conventionalcommits.org/en/v1.0.0/)`,
			`- correct format of commit message should be: \`<type/action>(<scope/component>): <summary>\`, for example \`fix(esp32): Fixed startup timeout issue\``,
			`- allowed types are: \`${config.commitMessages.allowedTypes}\``,
			`- sufficiently descriptive message summary should be between ${config.commitMessages.minSummaryLength} to ${config.commitMessages.maxSummaryLength} characters and start with upper case letter`,
			`- avoid Jira references in commit messages (unavailable/irrelevant for our customers)`,
		];
		const dangerMessage = `\n**Some issues found for the commit messages in this PR:**\n${issuesAllCommitMessages.join('\n')}
			\n***
			\n**Please fix these commit messages** - here are some basic tips:\n${basicTips.join('\n')}
            \n \`TIP:\` Install pre-commit hooks and run this check when committing (uses the [Conventional Precommit Linter](https://github.com/espressif/conventional-precommit-linter)).
            `;
		warn(dangerMessage);
		return recordRuleExitStatus(ruleName, 'Failed');
	}

	// At this point, the rule has passed
	return recordRuleExitStatus(ruleName, 'Passed');
}
