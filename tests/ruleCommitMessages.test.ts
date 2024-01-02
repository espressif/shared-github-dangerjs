import { config as originalConfig, recordRuleExitStatus } from '../src/configParameters';

declare global {
	var danger: any;
	var warn: any;
}

describe('TESTS: Commit messages style', () => {
	let ruleCommitMessages: any;
	beforeEach(() => {
		global.danger = {
			git: {
				commits: [{ message: '' }],
			},
		};
		global.warn = jest.fn();
		jest.resetModules();
		jest.mock('../src/configParameters', () => ({
			...jest.requireActual('../src/configParameters'),
			recordRuleExitStatus: jest.fn(),
		}));
	});

	describe('Default config', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
				},
				recordRuleExitStatus,
			}));
			ruleCommitMessages = (await import('../src/ruleCommitMessages')).default;
		});

		it('EXPECT PASS: Message with "scope" and "body"', async () => {
			danger.git.commits = [{ message: 'feat(bootloader): This is commit message with scope and body\n\nThis is a text of body' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message with "scope" and "body", type "test"', async () => {
			danger.git.commits = [{ message: 'test(bootloader): This is commit message with scope and body\n\nThis is a text of body' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message with "scope", without "body"', async () => {
			danger.git.commits = [{ message: 'change(wifi): This is commit message with scope without body' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message with "scope" (with hyphen in "scope"), without "body"', async () => {
			danger.git.commits = [{ message: 'change(esp-rom): This is commit message with hyphen in scope' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message with "scope" (with asterisk in "scope"), without "body"', async () => {
			danger.git.commits = [{ message: 'change(examples*storage): This is commit message with asterisk in scope' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message with "scope" (with comma in "scope"), without "body"', async () => {
			danger.git.commits = [{ message: 'change(examples,storage): This is commit message with comma in scope' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message with "scope" (with slash in "scope"), without "body"', async () => {
			danger.git.commits = [{ message: 'change(examples/storage): This is commit message with slash in scope' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message without "scope", with "body"', async () => {
			danger.git.commits = [{ message: 'change: This is commit message without scope with body\n\nThis is a text of body' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message without "scope", without "body"', async () => {
			danger.git.commits = [{ message: 'ci: This is commit message without scope and body' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message "summary" starts with lowercase', async () => {
			danger.git.commits = [{ message: 'change(rom): this message summary starts with lowercase' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message "summary" contains text in brackets', async () => {
			danger.git.commits = [{ message: 'change: this message summary starts (as usually) with lowercase' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message with "scope", "summary" contains text in brackets', async () => {
			danger.git.commits = [{ message: 'change(rom): this message summary starts (as usually) with lowercase' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message "summary" ends with text in brackets', async () => {
			danger.git.commits = [{ message: 'change: this message summary starts with lowercase (just here)' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message with "scope", "summary" ends with text in brackets', async () => {
			danger.git.commits = [{ message: 'change(rom): this message summary starts with lowercase (just here)' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT FAIL: Missing colon between "type/(optional-scope)" and "summary"', async () => {
			danger.git.commits = [{ message: 'change this is commit message without body' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*summary* looks empty'));
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*type/action* looks empty'));
		});

		it('EXPECT FAIL: Message "summary" is too short (7 characters)', async () => {
			danger.git.commits = [{ message: 'fix: Fix bug' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*summary* looks too short'));
		});

		it('EXPECT FAIL: Message "summary" is too long (88 characters)', async () => {
			danger.git.commits = [{ message: 'change(rom): Refactor authentication flow for enhanced security measures and improved user experience' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*summary* appears to be too long'));
		});

		it('EXPECT FAIL: Message "summary" ends with period (full stop)', async () => {
			danger.git.commits = [{ message: 'change(rom): Fixed the another bug.' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*summary* should not end with a period'));
		});

		it('EXPECT FAIL: Message "scope" starts uppercase', async () => {
			danger.git.commits = [{ message: 'change(Bt): Added new feature with change\n\nThis feature adds functionality' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*scope/component* should be lowercase without whitespace'));
		});

		it('EXPECT FAIL: Message contains uppercase in "scope"', async () => {
			danger.git.commits = [{ message: 'fix(dangerGH): Update token permissions - allow Danger to add comments to PR' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*scope/component* should be lowercase without whitespace'));
		});

		it('EXPECT FAIL: Message contains space in "scope"', async () => {
			danger.git.commits = [{ message: 'fix(danger github): Update token permissions - allow Danger to add comments to PR' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*scope/component* should be lowercase without whitespace'));
		});

		it('EXPECT FAIL: Message with scope and body contains not allowed "type"', async () => {
			danger.git.commits = [{ message: 'delete(bt): Added new feature with change\n\nThis feature adds functionality' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*type/action* should be one of'));
		});

		it('EXPECT FAIL: Message without scope and without body contains not allowed "type"', async () => {
			danger.git.commits = [{ message: 'wip: Added new feature with change' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*type/action* should be one of'));
		});

		it('EXPECT FAIL: Message with scope and body contains not allowed "type" (uppercase)', async () => {
			danger.git.commits = [{ message: 'Fix(bt): Added new feature with change\n\nThis feature adds functionality' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*type/action* should be one of'));
		});

		it('EXPECT FAIL: Missing blank line between "summary" and "body"', async () => {
			danger.git.commits = [{ message: 'change: Added new feature with change\nThis is body without blank line' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('body must have leading blank line'));
		});

		it('EXPECT FAIL: Message "body" line is too long (110 characters)', async () => {
			danger.git.commits = [
				{
					message:
						'fix(bt): Update database schemas\n\nUpdating the database schema to include new fields and user profile preferences, cleaning up unnecessary calls',
				},
			];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining("body's lines must not be longer than"));
		});

		it('EXPECT FAIL: Jira ticket references in commit message', async () => {
			danger.git.commits = [{ message: 'fix(esp32): Fixed startup timeout issue (fixes JIRA-123)' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('JIRA-123'));
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('remove Jira tickets'));
		});
	});

	describe('Custom config', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
					commitMessages: {
						maxBodyLineLength: 150,
						maxSummaryLength: 100,
						minSummaryLength: 5,
						allowedTypes: 'fix,feat,change,style,perf',
					},
				},
				recordRuleExitStatus,
			}));
			ruleCommitMessages = (await import('../src/ruleCommitMessages')).default;
		});

		it('EXPECT PASS: Message "body" line is longer but within custom max length', async () => {
			danger.git.commits = [
				{
					message:
						'fix(bt): Update database schemas\n\nUpdating the database schema to include new fields and user profile preferences, cleaning up unnecessary calls and optimizing performance',
				},
			];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT PASS: Message with "style" type', async () => {
			danger.git.commits = [{ message: 'style(ui): Update button styles\n\nAdjusted padding and margins for better alignment.' }];
			await ruleCommitMessages();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT FAIL: Message "summary" is longer than custom max length', async () => {
			danger.git.commits = [
				{ message: 'change(rom): Refactor authentication flow for enhanced security measures and improved user experience with additional features' },
			];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*summary* appears to be too long'));
		});

		it('EXPECT FAIL: Message with "fox" type', async () => {
			danger.git.commits = [{ message: 'fox(ui): Fix button alignment\n\nAdjusted padding and margins for better alignment.' }];
			await ruleCommitMessages();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('*type/action* should be one of'));
		});
	});
});
