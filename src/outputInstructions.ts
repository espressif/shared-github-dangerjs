import { DangerDSLType, DangerResults } from 'danger';
import { Octokit } from '@octokit/rest';
import { config } from './configParameters';

declare const danger: DangerDSLType;
declare const results: DangerResults;
declare const markdown: (message: string, results?: DangerResults) => void;

/**
 * Generates a greeting message and a set of instructions for the author of a Pull Request (PR).
 *
 * This function creates a custom message for the MR author, providing guidance on how to handle
 * the automated feedback from DangerJS.
 * It includes a set of recommended actions for resolving warnings and information messages, when issues are found,
 * and instructions on how to retry DangerJS checks if necessary.
 * Message is dynamically generated based on the type of Danger issues found in the MR.
 */
const prAuthorUsername = danger.github.pr.user.login;
const repositoryOwner = danger.github.pr.base.repo.owner.login;
const repositoryName = danger.github.pr.base.repo.name;
const dangerProjectUrl: string = 'https://github.com/espressif/shared-github-dangerjs';

export default async function (): Promise<void> {
	// Basic instructions (ALWAYS SHOWN)
	let instructions: string = '';
	instructions += `👋 <strong>Hello ${prAuthorUsername}</strong>, we appreciate your contribution to this project!<br>`;

	// Contributors guide link, if exists in the repository
	if (config.instructions.contributingGuideFile) {
		const contributionsGuideLink = `https://github.com/${repositoryOwner}/${repositoryName}/blob/${await getDefaultBranch()}/${
			config.instructions.contributingGuideFile
		}`;
		instructions += `<hr>`;
		instructions += `📘 Please review the project's <a href="${contributionsGuideLink}}">Contributions Guide</a> for key guidelines on code, documentation, testing, and more.<br>`;
	}

	// Contributor License Agreement, if provided link to it
	if (config.instructions.claLink) {
		instructions += `<hr>`;
		instructions += `🖊️ Please also make sure you have <strong>read and signed</strong> the <a href="${config.instructions.claLink}}">Contributor License Agreement</a> for this project.<br>`;
	}

	// Basic instructions (ALWAYS SHOWN)
	instructions += `<hr>`;
	instructions += `<details><summary>Click to see more instructions ...</summary><p>`; // START collapsible section INSTRUCTIONS
	instructions += `<br>This automated output is generated by the <a href="${dangerProjectUrl}">PR linter DangerJS</a>, which checks if your Pull Request meets the project's requirements and helps you fix potential issues.<br><br>`;
	instructions += `DangerJS is triggered with each \`push\` event to a Pull Request and modify the contents of this comment.<br><br>`;
	instructions += `<strong>Please consider the following:</strong><br>`;
	instructions += `- Danger mainly focuses on the PR structure and formatting and can't understand the meaning behind your code or changes.<br>`;
	instructions += `- Danger is <strong>not a substitute for human code reviews</strong>; it's still important to request a code review from your colleagues.<br>`;

	// If 'warning' or 'error' issues exist, add this to Instructions DangerJS
	if (results.fails.length + results.warnings.length) {
		instructions += '- <strong>Resolve all warnings (⚠️ )</strong> before requesting a review from human reviewers - they will appreciate it.<br>';
	}

	// If info issues exist, add this to Instructions DangerJS
	if (results.messages.length) {
		instructions += `- Addressing info messages (📖) is strongly recommended; they're less critical but valuable.<br>`;
	}

	// Add (always) retry link as last line of Instructions DangerJS
	const retryLinkUrl: string = `https://github.com/${repositoryOwner}/${repositoryName}/actions`;
	instructions += `- To manually <a href="${retryLinkUrl}">retry these Danger checks</a>, please navigate to the <kbd>Actions</kbd> tab and re-run last Danger workflow.<br>`;
	instructions += `</p></details>`; // END collapsible section INSTRUCTIONS

	// Instructions about pull request Review and Merge process
	instructions += `<details><summary>Review and merge process you can expect ...</summary><p>`; // START collapsible section REVIEW PROCESS
	instructions += `<br>`;
	if (config.instructions.isGitlabMirror) {
		instructions += `<strong>We do welcome contributions in the form of bug reports, feature requests and pull requests via this public GitHub repository.</strong><br><br>`;
		instructions += `<strong>This GitHub project is public mirror of our internal git repository</strong><br><br>`;
		instructions += `<strong>1.</strong> An internal issue has been created for the PR, we assign it to the relevant engineer.<br>`;
		instructions += `<strong>2.</strong> They review the PR and either approve it or ask you for changes or clarifications.<br>`;
		instructions += `<strong>3.</strong> Once the GitHub PR is approved, we synchronize it into our internal git repository.<br>`;
		instructions += `<strong>4.</strong> In the internal git repository we do the final review, collect approvals from core owners and make sure all the automated tests are passing.<br>`;
		instructions += `    - At this point we may do some adjustments to the proposed change, or extend it by adding tests or documentation.<br>`;
		instructions += `<strong>5.</strong> If the change is approved and passes the tests it is merged into the default branch.<br>`;
		instructions += `<strong>5.</strong> On next sync from the internal git repository merged change will appear in this public GitHub repository.<br>`;
	} else {
		instructions += `<strong>We do welcome contributions in the form of bug reports, feature requests and pull requests.</strong><br><br>`;
		instructions += `<strong>1.</strong> An internal issue has been created for the PR, we assign it to the relevant engineer.<br>`;
		instructions += `<strong>2.</strong> They review the PR and either approve it or ask you for changes or clarifications.<br>`;
		instructions += `<strong>3.</strong> Once the GitHub PR is approved we do the final review, collect approvals from core owners and make sure all the automated tests are passing.<br>`;
		instructions += `    - At this point we may do some adjustments to the proposed change, or extend it by adding tests or documentation.<br>`;
		instructions += `<strong>4.</strong> If the change is approved and passes the tests it is merged into the default branch.<br>`;
	}
	instructions += `</p></details>`; // END collapsible section REVIEW PROCESS
	instructions += `\n`;

	// Create output message
	return markdown(instructions);
}

/**
 * Fetches the default branch of the repository.
 */
async function getDefaultBranch(): Promise<string> {
	const repositoryOwner: string = danger.github.pr.base.repo.owner.login;
	const repositoryName: string = danger.github.pr.base.repo.name;
	const octokit = new Octokit();
	const { data: repo } = await octokit.repos.get({ owner: repositoryOwner, repo: repositoryName });
	return repo.default_branch;
}
