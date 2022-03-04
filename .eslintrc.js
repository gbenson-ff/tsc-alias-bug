module.exports = {
	extends: ['@gabegabegabe/eslint-config'],
	overrides: [
		{
			files: ['*.json'],
			extends: ['@gabegabegabe/eslint-config/json']
		},
		{
			files: ['*.js', '*.mjs', '*.ts'],
			extends: ['@gabegabegabe/eslint-config/javascript']
		},
		{
			files: ['*.ts'],
			extends: ['@gabegabegabe/eslint-config/typescript']
		},
		{
			files: ['*.test.ts'],
			extends: [
				'@gabegabegabe/eslint-config/jest',
				'@gabegabegabe/eslint-config/jest-typescript'
			]
		}
	]
};
