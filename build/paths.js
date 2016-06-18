var path = require('path');
var fs = require('fs');

var appRoot = 'src/';
var tsGlob = '**/*.ts';

var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

module.exports = {
  root: appRoot,
  reports: 'reports/',
  source: [appRoot + tsGlob],
  tests: ['tests/' + tsGlob],
  esmOutput: 'esm/',
  packageName: pkg.name,
  dtsSrc: ['typings/index.d.ts']
};
