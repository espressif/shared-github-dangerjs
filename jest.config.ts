import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\.ts?$': [
			'ts-jest',
			{
				tsconfig: '<rootDir>/tsconfig.json',
			},
		],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.tsx?$',
	reporters: ['default', ['jest-junit', { outputDirectory: '<rootDir>/reports', outputName: 'report.xml' }]],
	collectCoverage: true,
	coverageDirectory: '<rootDir>/reports',
	coverageReporters: ['json', 'lcov', 'text', 'clover'],
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/dangerfile.ts', // Exclude this file from coverage
		'!src/configParameters.ts', // Exclude this file from coverage
	],
};

export default config;
