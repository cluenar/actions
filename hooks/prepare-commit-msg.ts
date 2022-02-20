import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { capitalize } from 'lodash';

// @ts-expect-error Could not find a declaration file for module '../commitlint.config'.
import commitLintConfig from '../commitlint.config';

const [, , scopes] = commitLintConfig.rules['scope-enum'] as [number, string, string[]];
const [, , types] = commitLintConfig.rules['type-enum'] as [number, string, string[]];

const isRebasing = () => {
  try {
    execSync('ls `git rev-parse --git-dir` | grep rebase');
    return true;
  } catch {
    return false;
  }
};

const getBranchName = () => execSync('git symbolic-ref --short HEAD').toString().trim();

const isValidType = (type: string) => types.includes(type);
const isValidScope = (scope: string) => scopes.includes(scope);

interface BranchNameParts {
  type: string;
  scope: string | null;
}

const parseBranchName = (name: string): BranchNameParts => {
  const [rawType, rawScope] = name.split('-');

  if (!rawType || !isValidType(rawType)) {
    throw new Error('Invalid commit type in branch name');
  }

  const type = rawType.toLowerCase();
  const scope = rawScope && isValidScope(rawScope) ? rawScope.toLowerCase() : null;

  return {
    type,
    scope
  };
};

const createPrefix = (type: string, scope?: string | null) => `${type}${scope ? `(${scope})` : ''}`;

const stringifyCommitMessage = ({ type, scope }: BranchNameParts, message: string) => {
  const [subject, ...comments] = message.split('\n#');

  let commitMessage = createPrefix(type, scope) + ': ';

  if (subject) {
    commitMessage += capitalize(subject);
  }

  if (comments.length > 0) {
    commitMessage += '\n\n#' + comments.join('\n#');
  }

  return commitMessage;
};

const main = ([commitMessagePath]: string[]) => {
  if (isRebasing()) {
    return 0;
  }

  try {
    if (!commitMessagePath) {
      throw new Error('Missing commit message path.');
    }

    const branchName = getBranchName();
    const { type, scope } = parseBranchName(branchName);
    const commitMessage = readFileSync(commitMessagePath).toString();

    if (!commitMessage.startsWith(createPrefix(type, scope))) {
      const nextCommitMessage = stringifyCommitMessage({ type, scope }, commitMessage);
      writeFileSync(commitMessagePath, nextCommitMessage);
    }
  } catch (error) {
    console.warn('Warning: Cannot create commit message prefix');

    if (error instanceof Error) {
      console.warn(error.message);
    }
  }

  return 0;
};

process.exit(main(process.argv.slice(2)));
