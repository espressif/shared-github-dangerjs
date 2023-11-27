import { DangerResults, DangerDSLType } from 'danger';
declare const results: DangerResults;
declare const danger: DangerDSLType;
declare const message: (message: string, results?: DangerResults) => void;
declare const markdown: (message: string, results?: DangerResults) => void;
declare const warn: (message: string, results?: DangerResults) => void;

function runDangerRules(): void {
	console.log('Running Danger Rules ...');

	message('Hello from Danger JS - message');
	markdown('Hello from Danger JS - markdown');
	warn('Hello from Danger JS - warn');

	const prCommits = danger.git.commits;
	console.log('PR Commits: ', prCommits);

	const customInput: number = Number(process.env.CUSTOM);
	console.log(`CUSTOM INPUT: ${customInput}`);

	console.log('Danger Rules results: ', results);
}

runDangerRules();
