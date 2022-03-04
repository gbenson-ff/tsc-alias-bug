import browserslist from 'browserslist';
import esbuild from 'esbuild';
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist';
import fs from 'fs/promises';
import path from 'path';

// An array containing the entry points for the library.  Add your entry points
// here.
const ENTRY_POINTS = [
	'src/index.ts',
	'src/models/index.ts'
];

// The directory where the compiled code should be placed
const OUT_DIR = 'dist';

// A function that copies this project's package.json into the output folder so
// that it may then be published to a package repository
const writePackageJson = async () => {
	// Load the package.json file
	const pkgString = await fs.readFile('./package.json', 'utf-8');

	// Conver it to JSON
	const pkg = JSON.parse(pkgString);

	// Construct the new package.json as an object
	const newPkg = {
		author: pkg.author,
		bugs: { ...pkg.bugs },
		description: pkg.description,
		homepage: pkg.homepage,
		license: pkg.license,
		main: pkg.main.replace(`${OUT_DIR}/`, ''),
		name: pkg.name,
		repository: { ...pkg.repository },
		types: pkg.types.replace(`${OUT_DIR}/`, ''),
		version: pkg.version
	};

	// Copy dependencies and peerDependencies if they exist
	const depString = 'dependencies';
	const peerDepString = 'peerDependencies';

	if (depString in pkg) newPkg[depString] = pkg[depString];
	if (peerDepString in pkg) newPkg[depString] = pkg[depString];

	// Create the JSON string, indenting by the specified amount
	const spacesToIndent = 2;
	const newPkgString = JSON.stringify(newPkg, null, spacesToIndent);

	// Write the package.json copy to disk
	await fs.writeFile(path.resolve(`./${OUT_DIR}/package.json`), newPkgString);
};

// The main build function
const build = async () => {
	try {
		// Wait for esbuild to complete
		await esbuild
			.build({
				bundle: true,
				entryPoints: ENTRY_POINTS,
				format: 'cjs',
				minify: true,
				outdir: 'dist',
				plugins: [
					esbuildPluginBrowserslist(browserslist(), {
						printUnknownTargets: false
					})
				],
				sourcemap: true
			});

		// Then copy package.json
		await writePackageJson();
	} catch (err) {
		// Log any errors
		// eslint-disable-next-line no-console
		console.error(err);

		// And exit with an error status
		process.exit(1);
	}
};

// Run build
build();
