declare global {
	var danger: any;
	var warn: any;
}

describe('TESTS: Source branch name', () => {
	let ruleSourceBranchName: any;
	beforeEach(async () => {
		global.danger = {
			github: { pr: { head: { ref: '' } } },
		};
		global.warn = jest.fn();
		jest.resetModules();
		jest.mock('../src/configParameters', () => ({
			...jest.requireActual('../src/configParameters'),
			recordRuleExitStatus: jest.fn(),
		}));
		ruleSourceBranchName = (await import('../src/ruleSourceBranchName')).default;
	});

	it('EXPECT PASS: Source branch name contains no slashes', () => {
		danger.github.pr.head.ref = 'feature-fix_something';
		ruleSourceBranchName();
		expect(warn).not.toHaveBeenCalled();
	});

	it('EXPECT PASS: Source branch name is valid (one slash, no uppercase)', () => {
		danger.github.pr.head.ref = 'feature/fix_something';
		ruleSourceBranchName();
		expect(warn).not.toHaveBeenCalled();
	});

	it('EXPECT FAIL: Source branch name contains more than one slash', () => {
		danger.github.pr.head.ref = 'feature/some/nested/thing/fix';
		ruleSourceBranchName();
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('contains more than one slash'));
	});

	it('EXPECT FAIL: Source branch name contains uppercase letters', () => {
		danger.github.pr.head.ref = 'docs/add_CN_chapter_for_BLE_API';
		ruleSourceBranchName();
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('contains uppercase letters'));
	});

	it('EXPECT FAIL: Source branch name contains more than one slash and uppercase letters', () => {
		danger.github.pr.head.ref = 'Feature/New/Feature';
		ruleSourceBranchName();
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('contains more than one slash'));
	});
});
export {};
