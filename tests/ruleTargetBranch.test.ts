declare global {
	var danger: any;
	var warn: any;
}

describe('TESTS: Target Branch Check', () => {
	let ruleTargetBranch: any;
	beforeEach(async () => {
		global.danger = {
			github: {
				pr: {
					base: {
						ref: '',
						repo: {
							owner: { login: 'ownerLogin' },
							name: 'repoName',
						},
					},
				},
			},
		};
		global.warn = jest.fn();
		jest.resetModules();
		jest.mock('@octokit/rest', () => ({
			Octokit: jest.fn().mockImplementation(() => ({
				repos: {
					get: jest.fn().mockResolvedValue({
						data: { default_branch: 'main' },
					}),
				},
			})),
		}));
		ruleTargetBranch = (await import('../src/ruleTargetBranch')).default; // Adjust the import path according to your project structure
	});

	it('EXPECT PASS: Target branch is the default branch', async () => {
		danger.github.pr.base.ref = 'main';
		await ruleTargetBranch();
		expect(warn).not.toHaveBeenCalled();
	});

	it('EXPECT FAIL: Target branch is not the default branch', async () => {
		danger.github.pr.base.ref = 'develop';
		await ruleTargetBranch();
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('The **target branch** for this Pull Request **must be the default branch** of the project'));
	});
});

export {};
