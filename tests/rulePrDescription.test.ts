import { config as originalConfig, recordRuleExitStatus } from '../src/configParameters';

declare global {
	var danger: any;
	var warn: any;
}

describe('TESTS: Pull Request sufficient Description', () => {
	let rulePrDescription: any;
	beforeEach(() => {
		global.danger = {
			github: {
				pr: {
					body: '',
				},
			},
		};
		global.warn = jest.fn();
		jest.resetModules();
		jest.mock('../src/configParameters', () => ({
			...jest.requireActual('../src/configParameters'),
			recordRuleExitStatus: jest.fn(),
		}));
	});

	describe('DEFAULT CONFIG: Required length 50, ignored sections: "Release notes", "Related", "Breaking change notes"', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
					prDescription: {
						minLength: 50,
						ignoredSections: 'related,release,breaking',
					},
				},
				recordRuleExitStatus,
			}));
			rulePrDescription = (await import('../src/rulePrDescription')).default;
		});

		it('EXPECT PASS: Description without headers (80 characters)', () => {
			danger.github.pr.body = `This is a long description that is certainly over the threshold of 50 characters`;
			rulePrDescription();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Description with header "# Description" on the beginning', () => {
			danger.github.pr.body = `# Description
			This is a long description that is certainly over the threshold of 50 characters`;
			rulePrDescription();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Description with section header "# Description" on the beginning and with ignored section "Related"', () => {
			danger.github.pr.body = `# Description
			This PR solves the problem of the BOT being an 'admin' in the newly created GitHub project.
			The 'admin' role is not actually required for 'espressif-bot', but is automatically created this way because the BOT token
			is the one used to create the GitHub project (bot becomes admin because bot created the project).
			As a last step of creating a new GitHub project, a method was added to downgrade the BOT role from 'Admin' to 'Write'.

			## Related
			- RDT-490
			- https://github.com/espressif/test-project-bot/pull/15`;
			rulePrDescription();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Description without section header on the beginning but with ignored section "Related"', () => {
			danger.github.pr.body = `This PR solves the problem of the BOT being an 'admin' in the newly created GitHub project.
			The 'admin' role is not actually required for 'espressif-bot', but is automatically created this way because the BOT token is the one used to create the GitHub project (bot becomes admin because bot created the project).
			As a last step of creating a new GitHub project, a method was added to downgrade the BOT role from 'Admin' to 'Write'.

			## Related
			- RDT-490
			- https://github.com/espressif/test-project-bot/pull/15`;
			rulePrDescription();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Starts with text, then multiple ignored sections ("Related", "Breaking changes)', () => {
			danger.github.pr.body = `This PR solves the problem of the BOT being an 'admin' in the newly created GitHub project. The 'admin' role is not actually required for 'espressif-bot', but is automatically created this way because the BOT token is the one used to create the GitHub project (bot becomes admin because bot created the project).
			As a last step of creating a new GitHub project, a method was added to downgrade the BOT role from 'Admin' to 'Write'.

			## Breaking changes
			- this is maybe a breaking change

			## Related
			- RDT-490
			- https://github.com/espressif/test-project-bot/pull/15`;
			rulePrDescription();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT FAIL: Description is null', () => {
			danger.github.pr.body = null;
			rulePrDescription();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('The Pull Request description is empty'));
		});

		it('EXPECT FAIL: Empty description, only newlines', () => {
			danger.github.pr.body = '\n\n\n\n\n\n\n\n';
			rulePrDescription();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('The Pull Request description is empty'));
		});

		it('EXPECT FAIL: Short description (9 characters)', () => {
			danger.github.pr.body = 'Fixed bug';
			rulePrDescription();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('The Pull Request description looks very brief'));
		});

		it('EXPECT FAIL: Short description (only ignored section "Related")', () => {
			danger.github.pr.body = `## Related
			- RDT-490
			- https://github.com/espressif/test-project-bot/pull/15`;
			rulePrDescription();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('The Pull Request description looks very brief'));
		});

		it('EXPECT FAIL: Short description (22 characters), ignored section "Related" and HTML comments', () => {
			danger.github.pr.body = `Fixed bug

			## Related  <!-- Optional -->
			- RDT-490
			- https://github.com/espressif/test-project-bot/pull/15`;
			rulePrDescription();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('The Pull Request description looks very brief'));
		});

		it('EXPECT FAIL: Only HTML comments and ignored sections (minimum ESP-IDF Gitlab MR template)', () => {
			danger.github.pr.body = `
			<!-- This Template states the absolute minimum for an PR. If you want to have a more elaborate template or know why we have this structure, please use the "Mixed Template" or consult the Wiki. -->
			<!-- Add the CI labels to trigger the appropriate tests (e.g. "unit_test_esp32") --><!-- Mandatory -->
			<!-- Make sure the commit message follows the Wiki about "Commit Messages" --><!-- Mandatory -->

			<!-- Add description of the change here --><!-- Mandatory -->

			## Related <!-- Optional -->
			<!-- Related Jira issues and Github issues or write "No related issues"-->

			## Release notes <!-- Mandatory -->
			<!-- Either state release notes or write "No release notes" -->

			<!-- ## Breaking change notes --><!-- Optional -->`;
			rulePrDescription();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('The Pull Request description looks very brief'));
		});

		it('EXPECT FAIL: Short PR Description with ignored sections and HTML comments', async () => {
			danger.github.pr.body = `
			## Description
			PR description

			## Related <!-- Optional -->
			<!-- Related Jira issues and Github issues or write "No related issues"-->
			- JIRA-123
			- Closes JIRA-888

			## Release notes <!-- Mandatory -->
			- This is PR description test text in section Release notes
			- [Area] This is PR description test text in section Release notes

			## Breaking change notes<!-- Optional -->
			- This is PR description test text in section Breaking change notes`;
			rulePrDescription();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('The Pull Request description looks very brief'));
		});
	});

	describe('CUSTOM CONFIG:  Required length 2000, ignored sections: "Release notes", "Related", "Breaking change notes"', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
					prDescription: {
						minLength: 2000,
						ignoredSections: 'related,release,breaking',
					},
				},
				recordRuleExitStatus,
			}));
			rulePrDescription = (await import('../src/rulePrDescription')).default;
		});

		it('EXPECT PASS: Description length is more than 2000 characters', async () => {
			danger.github.pr.body = 'A'.repeat(2100); // A string with 2100 'A' characters
			rulePrDescription();
			expect(global.warn).not.toHaveBeenCalled();
		});

		it('EXPECT FAIL: Description length is less than 2000 characters', async () => {
			danger.github.pr.body = 'This is a description that is certainly under the threshold of 2000 characters';
			rulePrDescription();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('The Pull Request description looks very brief'));
		});
	});

	describe('CUSTOM CONFIG: Required length 100, no ignored sections', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
					prDescription: {
						minLength: 100,
						ignoredSections: '',
					},
				},
				recordRuleExitStatus,
			}));
			rulePrDescription = (await import('../src/rulePrDescription')).default;
		});

		it('EXPECT PASS: Description with no ignored section, has 323 chars total', async () => {
			danger.github.pr.body = `
			## Description
			This is PR description test text in section description

			## Related <!-- Optional -->
			<!-- Related Jira issues and Github issues or write "No related issues"-->
			- JIRA-123
			- Closes JIRA-888

			## Release notes <!-- Mandatory -->
			- This is PR description test text in section Release notes
			- [Area] This is PR description test text in section Release notes

			## Breaking change notes<!-- Optional -->
			- This is PR description test text in section Breaking change notes
			`;
			rulePrDescription();
			expect(global.warn).not.toHaveBeenCalled();
		});

		it('EXPECT FAIL: Only HTML comments and kept sections headers (minimum ESP-IDF PR template)', async () => {
			danger.github.pr.body = `
			<!-- This Template states the absolute minimum for an PR.
			If you want to have a more elaborate template or know why we have this structure,
			please use the "Mixed Template" or consult the Wiki. -->
			<!-- Add the CI labels to trigger the appropriate tests (e.g. "unit_test_esp32") --><!-- Mandatory -->
			<!-- Make sure the commit message follows the Wiki about "Commit Messages" --><!-- Mandatory -->

			<!-- Add description of the change here --><!-- Mandatory -->

			## Related <!-- Optional -->
			<!-- Related Jira issues and Github issues or write "No related issues"-->

			## Release notes <!-- Mandatory -->
			<!-- Either state release notes or write "No release notes" -->

			<!-- ## Breaking change notes --><!-- Optional -->
			`;
			rulePrDescription();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('The Pull Request description looks very brief'));
		});
	});
	describe('CUSTOM CONFIG: Required length 400, ignored sections: "Release"', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
					prDescription: {
						minLength: 400,
						ignoredSections: 'release',
					},
				},
				recordRuleExitStatus,
			}));
			rulePrDescription = (await import('../src/rulePrDescription')).default;
		});

		it('EXPECT PASS: Description with ignoring "Related ..." section, has 430 chars after', async () => {
			danger.github.pr.body = `This is PR description test text
			## Description
			This is PR description test text in section description

			## Related <!-- Optional -->
			<!-- Related Jira issues and Github issues or write "No related issues"-->
			- JIRA-123
			- Closes JIRA-888

			## Release notes <!-- Mandatory -->
			- This is PR description test text in section Release notes
			- [Area] This is PR description test text in section Release notes

			## Testing
			<!-- Testing changes here-->
			- This is PR description test text in section Testing\ g

			## Breaking change notes<!-- Optional -->
			- This is PR description test text in section Breaking change notes

			## Other section
			- This is PR description test text in section Other section
			`;
			rulePrDescription();
			expect(global.warn).not.toHaveBeenCalled();
		});

		it('EXPECT FAIL: Description with ignoring "Related ..." section, has 346 chars after', async () => {
			danger.github.pr.body = `This is PR description test text
			## Description
			This is PR description test text in section description

			## Related <!-- Optional -->
			<!-- Related Jira issues and Github issues or write "No related issues"-->
			- JIRA-123
			- Closes JIRA-888

			## Release notes <!-- Mandatory -->
			- This is PR description test text in section Release notes
			- [Area] This is PR description test text in section Release notes

			## Testing
			<!-- Testing changes here-->
			- This is PR description test text in section Testing\ g

			## Breaking change notes<!-- Optional -->
			- This is PR description test text in section Breaking change notes
			`;
			rulePrDescription();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('The Pull Request description looks very brief'));
		});
	});
});
