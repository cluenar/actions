/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */

const { writeFileSync } = require('fs');
const { relative } = require('path');

const tsconfigPath = '.lint-staged-temp-tsconfig.json';

const toRelative = (filename) => relative('.', filename);
const mapToRelative = (filenames) => filenames.map(toRelative);

module.exports = {
  '**': (filenames) => {
    const relativeFilenames = mapToRelative(filenames).join(' ');

    return [`eslint ${relativeFilenames}`, `prettier --check ${relativeFilenames}`];
  },
  '**/*.ts?(x)': (filenames) => {
    // The lint-staged command runs this function multiple times to prepare
    // console messages. We want to save the temporary tsconfig.json file only
    // when this function is run with filenames (that start with a slash)
    if (filenames.length > 0 && filenames[0].startsWith('/')) {
      const relativeFilenames = mapToRelative(filenames);
      const tsconfig = {
        extends: './tsconfig.json',
        files: relativeFilenames
      };

      writeFileSync(tsconfigPath, JSON.stringify(tsconfig));
    }

    return `tsc -p ${tsconfigPath}`;
  }
};
