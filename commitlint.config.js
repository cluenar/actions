/* eslint-disable import/no-commonjs */

module.exports = {
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    'body-full-stop': [2, 'always', '.'],
    'body-leading-blank': [2, 'always'],
    'body-case': [2, 'always', 'sentence-case'],

    'footer-leading-blank': [2, 'always'],

    'header-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],

    'scope-case': [2, 'always', 'lower-case'],
    'scope-enum': [2, 'always', ['actions', 'dev', 'lock', 'prod', 'security']],

    'subject-case': [2, 'always', 'sentence-case'],
    'subject-empty': [2, 'never'],

    'type-case': [2, 'always', 'lower-case'],
    'type-enum': [
      2,
      'always',
      ['chore', 'deps', 'docs', 'feat', 'fix', 'perf', 'refactor', 'release', 'revert', 'style', 'test']
    ],
    'type-empty': [2, 'never']
  }
};
