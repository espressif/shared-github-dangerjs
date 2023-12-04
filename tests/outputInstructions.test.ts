import { config as originalConfig } from '../src/configParameters';

declare global {
	var danger: any;
	var results: any;
	var markdown: any;
}

function expectBasicInstructions() {
	expect(markdown).toHaveBeenCalledWith(expect.stringContaining('we appreciate your contribution to this project!'));
	expect(markdown).toHaveBeenCalledWith(expect.stringContaining('This automated output is generated'));
	expect(markdown).toHaveBeenCalledWith(expect.stringContaining('DangerJS is triggered with each `push`'));
	expect(markdown).toHaveBeenCalledWith(expect.stringContaining('Please consider the following:'));
	expect(markdown).toHaveBeenCalledWith(expect.stringContaining('- Danger mainly focuses on the PR structure and formatting'));
	expect(markdown).toHaveBeenCalledWith(expect.stringContaining('not a substitute for human code reviews'));
	expect(markdown).toHaveBeenCalledWith(expect.stringContaining('retry these Danger checks'));
}

function expectContributionsGuideLink(include: boolean = true) {
	if (include) expect(markdown).toHaveBeenCalledWith(expect.stringContaining('Contributions Guide'));
	if (!include) expect(markdown).not.toHaveBeenCalledWith(expect.stringContaining('Contributions Guide'));
}

function expectResolveWarnings(include: boolean = true) {
	if (include) expect(markdown).toHaveBeenCalledWith(expect.stringContaining('Resolve all warnings (⚠️ )'));
	if (!include) expect(markdown).not.toHaveBeenCalledWith(expect.stringContaining('Resolve all warnings (⚠️ )'));
}
function expectResolveInfos(include: boolean = true) {
	if (include) expect(markdown).toHaveBeenCalledWith(expect.stringContaining('Addressing info messages (📖)'));
	if (!include) expect(markdown).not.toHaveBeenCalledWith(expect.stringContaining('Addressing info messages (📖)'));
}
function expectClaLink(include: boolean = true) {
	if (include) expect(markdown).toHaveBeenCalledWith(expect.stringContaining('read and signed'));
	if (!include) expect(markdown).not.toHaveBeenCalledWith(expect.stringContaining('read and signed'));
}
function expectGitlabMirror(include: boolean = true) {
	if (include) expect(markdown).toHaveBeenCalledWith(expect.stringContaining('This GitHub project is public mirror'));
	if (!include) expect(markdown).not.toHaveBeenCalledWith(expect.stringContaining('This GitHub project is public mirror'));
}

describe('TESTS COMPONENT: outputInstructions for GitHub PRs', () => {
	let outputInstructions: any;
	beforeEach(async () => {
		global.danger = {
			github: {
				pr: {
					user: { login: 'JaneDoe' }, // author of Pull Request
					base: {
						repo: {
							owner: { login: 'espressif' },
							name: 'example-repo',
							default_branch: 'main',
						},
					},
				},
			},
		};
		global.results = {
			fails: [],
			warnings: [],
			messages: [],
		};
		global.markdown = jest.fn();
		jest.resetModules();
		jest.mock('@octokit/rest', () => {
			return {
				Octokit: jest.fn().mockImplementation(() => ({
					// Mock the default branch fetch
					repos: { get: jest.fn().mockResolvedValue({ data: { default_branch: 'main' } }) },
				})),
			};
		});
	});

	describe('DEFAULT: GitHub project, no CLA, no Contributions Guide', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
				},
			}));
			outputInstructions = (await import('../src/outputInstructions')).default;
		});

		it('EXPECT PASS: No issues, only basic instructions (always there)', async () => {
			await outputInstructions();
			expectBasicInstructions();
			expectGitlabMirror(false);
			expectClaLink(false);
			expectContributionsGuideLink(false);
			expectResolveWarnings(false);
			expectResolveInfos(false);
		});

		it('EXPECT FAIL: WARN issues in PR', async () => {
			global.results.warnings = [{ message: 'Sample warning' }];
			await outputInstructions();
			expectBasicInstructions();
			expectGitlabMirror(false);
			expectClaLink(false);
			expectContributionsGuideLink(false);
			expectResolveWarnings();
			expectResolveInfos(false);
		});

		it('EXPECT FAIL: ERROR issues in PR', async () => {
			global.results.fails = [{ message: 'Sample error' }];
			await outputInstructions();
			expectBasicInstructions();
			expectGitlabMirror(false);
			expectClaLink(false);
			expectContributionsGuideLink(false);
			expectResolveWarnings();
			expectResolveInfos(false);
		});

		it('EXPECT FAIL: MESSAGE (info) issues in PR', async () => {
			global.results.messages = [{ message: 'Sample info message' }];
			await outputInstructions();
			expectBasicInstructions();
			expectGitlabMirror(false);
			expectClaLink(false);
			expectContributionsGuideLink(false);
			expectResolveInfos();
			expectResolveWarnings(false);
		});

		it('EXPECT FAIL: WARN and MESSAGE (info) issues in PR', async () => {
			global.results.warnings = [{ message: 'Sample warning' }];
			global.results.messages = [{ message: 'Sample info message' }];
			await outputInstructions();
			expectBasicInstructions();
			expectGitlabMirror(false);
			expectClaLink(false);
			expectContributionsGuideLink(false);
			expectResolveInfos();
			expectResolveWarnings();
		});
	});
	describe('CUSTOM: CLA link defined', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
					instructions: {
						claLink: 'https://cla-assistant.io/espressif/esp-idf',
					},
				},
			}));
			outputInstructions = (await import('../src/outputInstructions')).default;
		});

		it('EXPECT PASS: No issues, only basic instructions (always there)', async () => {
			await outputInstructions();
			expectBasicInstructions();
			expectClaLink();
			expectGitlabMirror(false);
			expectContributionsGuideLink(false);
			expectResolveWarnings(false);
			expectResolveInfos(false);
		});

		it('EXPECT FAIL: WARN and MESSAGE (info) issues in PR', async () => {
			global.results.warnings = [{ message: 'Sample warning' }];
			global.results.messages = [{ message: 'Sample info message' }];
			await outputInstructions();
			expectBasicInstructions();
			expectClaLink();
			expectGitlabMirror(false);
			expectContributionsGuideLink(false);
			expectResolveInfos();
			expectResolveWarnings();
		});
	});
	describe('CUSTOM: Contributions Guide defined', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
					instructions: {
						contributingGuideFile: 'CONTRIBUTING.rst',
					},
				},
			}));
			outputInstructions = (await import('../src/outputInstructions')).default;
		});

		it('EXPECT PASS: No issues, only basic instructions (always there)', async () => {
			await outputInstructions();
			expectBasicInstructions();
			expectContributionsGuideLink();
			expect(markdown).toHaveBeenCalledWith(expect.stringContaining('main/CONTRIBUTING.rst'));
			expectClaLink(false);
			expectGitlabMirror(false);
			expectResolveWarnings(false);
			expectResolveInfos(false);
		});

		it('EXPECT FAIL: WARN and MESSAGE (info) issues in PR', async () => {
			global.results.warnings = [{ message: 'Sample warning' }];
			global.results.messages = [{ message: 'Sample info message' }];
			await outputInstructions();
			expectBasicInstructions();
			expectContributionsGuideLink();
			expect(markdown).toHaveBeenCalledWith(expect.stringContaining('main/CONTRIBUTING.rst'));
			expectClaLink(false);
			expectGitlabMirror(false);
			expectResolveInfos();
			expectResolveWarnings();
		});
	});
	describe('CUSTOM: GitHub project is Gitlab mirror', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
					instructions: {
						isGitlabMirror: true,
					},
				},
			}));
			outputInstructions = (await import('../src/outputInstructions')).default;
		});

		it('EXPECT PASS: No issues, only basic instructions (always there)', async () => {
			await outputInstructions();
			expectBasicInstructions();
			expectGitlabMirror();
			expectClaLink(false);
			expectContributionsGuideLink(false);
			expectResolveWarnings(false);
			expectResolveInfos(false);
		});

		it('EXPECT FAIL: WARN and MESSAGE (info) issues in PR', async () => {
			global.results.warnings = [{ message: 'Sample warning' }];
			global.results.messages = [{ message: 'Sample info message' }];
			await outputInstructions();
			expectBasicInstructions();
			expectGitlabMirror();
			expectClaLink(false);
			expectContributionsGuideLink(false);
			expectResolveInfos();
			expectResolveWarnings();
		});
	});
});

export {};
