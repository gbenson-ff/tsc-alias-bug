module.exports = {
	collectCoverage: false,
	collectCoverageFrom: ['./src/**'],
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'index.ts'
	],
	coverageThreshold: {
		global: { lines: 90 }
	},
	moduleFileExtensions: [
		'js',
		'json',
		'ts'
	],
	moduleNameMapper: {
		'^~/(?<path>.*)': '<rootDir>/src/$1'
	},
	preset: 'ts-jest',
	roots: ['<rootDir>/src/'],
	setupFilesAfterEnv: ['<rootDir>/src/_test-setup.ts'],
	testEnvironment: 'jsdom'
};
