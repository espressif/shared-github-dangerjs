import { config as originalConfig, recordRuleExitStatus } from '../src/configParameters';

declare global {
	var danger: any;
	var message: any;
}

describe('TESTS: Merge request size (number of changed lines)', () => {
	let rulePrSize: any;
	beforeEach(() => {
		global.danger = {
			github: {
				pr: {
					additions: 0,
					deletions: 0,
				},
			},
		};
		global.message = jest.fn();
		jest.resetModules();
		jest.mock('../src/configParameters', () => ({
			...jest.requireActual('../src/configParameters'),
			recordRuleExitStatus: jest.fn(),
		}));
	});

	describe('Default config (maxChangedLines: 1000)', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
					prSize: {
						maxChangedLines: 1000,
					},
				},
				recordRuleExitStatus,
			}));
			rulePrSize = (await import('../src/rulePrSize')).default;
		});

		it('EXPECT PASS: MR has not too many (800) lines of code', async () => {
			danger.github.pr.additions = 800;
			danger.github.pr.deletions = 0;
			await rulePrSize();
			expect(message).not.toHaveBeenCalled();
		});

		it('EXPECT FAIL: MR has too many (1200) lines of code', async () => {
			danger.github.pr.additions = 1200;
			danger.github.pr.deletions = 0;
			await rulePrSize();
			expect(message).toHaveBeenCalledWith(expect.stringContaining('This PR seems to be quite large'));
		});
	});

	describe('Custom config (maxChangedLines: 2000)', () => {
		beforeEach(async () => {
			jest.doMock('../src/configParameters', () => ({
				config: {
					...originalConfig,
					prSize: {
						maxChangedLines: 2000,
					},
				},
				recordRuleExitStatus,
			}));
			rulePrSize = (await import('../src/rulePrSize')).default;
		});

		it('EXPECT PASS: MR has not too many (1500) lines of code', async () => {
			danger.github.pr.additions = 1500;
			danger.github.pr.deletions = 0;
			await rulePrSize();
			expect(message).not.toHaveBeenCalled();
		});

		it('EXPECT FAIL: MR has too many (2500) lines of code', async () => {
			danger.github.pr.additions = 1500;
			danger.github.pr.deletions = 1000;
			await rulePrSize();
			expect(message).toHaveBeenCalledWith(expect.stringContaining('This PR seems to be quite large'));
		});
	});
});
