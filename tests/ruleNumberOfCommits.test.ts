import { config as originalConfig, recordRuleExitStatus } from '../src/configParameters';

declare global {
	var danger: any;
	var message: any;
	var warn: any;
}

describe('TESTS: Number of commits in Pull Request', () => {
	let ruleNumberOfCommits: any;
	beforeEach(() => {
		global.danger = {
			github: {
				commits: [],
			},
		};
		global.message = jest.fn();
		global.warn = jest.fn();
		jest.resetModules();
		jest.mock('../src/configParameters', () => ({
			...jest.requireActual('../src/configParameters'),
			recordRuleExitStatus: jest.fn(),
		}));
	});

	describe('Default config (maxCommitsInfo: 2, maxCommitsWarning: 5)', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
				},
				recordRuleExitStatus,
			}));
			ruleNumberOfCommits = (await import('../src/ruleNumberOfCommits')).default;
		});
		it('EXPECT PASS: Not too many (2) commits', () => {
			global.danger.github.commits.length = 2;
			ruleNumberOfCommits();
			expect(message).not.toHaveBeenCalled();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT FAIL with MESSAGE: Too many (3) commits (exceeded soft limit)', () => {
			global.danger.github.commits.length = 3;
			ruleNumberOfCommits();
			expect(message).toHaveBeenCalledWith(expect.stringContaining('You might consider squashing'));
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT FAIL with WARN: Too many (6) commits (exceeded hard limit)', () => {
			global.danger.github.commits.length = 6;
			ruleNumberOfCommits();
			expect(message).not.toHaveBeenCalled();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('Please consider squashing'));
		});
	});

	describe('Custom config (maxCommitsInfo: 5, maxCommitsWarning: 7)', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
					numberOfCommits: {
						maxCommitsInfo: 5,
						maxCommitsWarning: 7,
					},
				},
				recordRuleExitStatus,
			}));
			ruleNumberOfCommits = (await import('../src/ruleNumberOfCommits')).default;
		});

		it('EXPECT PASS: Not too many (4) commits', () => {
			global.danger.github.commits.length = 4;
			ruleNumberOfCommits();
			expect(message).not.toHaveBeenCalled();
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT FAIL with MESSAGE: Too many (6) commits (exceeded custom soft limit)', () => {
			global.danger.github.commits.length = 6;
			ruleNumberOfCommits();
			expect(message).toHaveBeenCalledWith(expect.stringContaining('You might consider squashing'));
			expect(warn).not.toHaveBeenCalled();
		});

		it('EXPECT FAIL with WARN: Too many (8) commits (exceeded custom hard limit)', () => {
			global.danger.github.commits.length = 8;
			ruleNumberOfCommits();
			expect(message).not.toHaveBeenCalled();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('Please consider squashing'));
		});
	});
});
