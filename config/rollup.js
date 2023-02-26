/*
 * @Date: 2020-04-09 11:06:01
 * @LastEditors: JOU(wx: huzhen555)
 * @LastEditTime: 2022-11-30 21:15:34
 */
var typescript = require('rollup-plugin-typescript2');
var { readFileSync } = require('fs');

const getCompiler = (
	opt = {
		// objectHashIgnoreUnknownHack: true,
		// clean: true,
		tsconfigOverride: {
			compilerOptions: {
				module: 'ES2015'
			}
		}
	}
) => typescript(opt);
exports.getCompiler = getCompiler;

const pkg = JSON.parse(readFileSync('package.json').toString() || '{}');
const version = pkg.version;
const author = pkg.author;
const homepage = pkg.homepage;
exports.banner = `/**
  * ${pkg.name} ${version} (${homepage})
  * Copyright ${new Date().getFullYear()} ${author}. All Rights Reserved
  * Licensed under MIT (${homepage}/blob/master/LICENSE)
  */
`;

const compilePath = exports.compilePath = {
	external: ['alova'],
	packageName: 'AlovaMock',
	input: 'src/index.ts',
	output: suffix => `dist/alova-mock.${suffix}.js`
};
exports.external = compilePath.external;
