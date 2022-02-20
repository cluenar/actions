import { readFileSync, writeFileSync } from 'fs';
import { capitalize } from 'lodash';

const parseCommitMessage = (message: string) => {
  const firstColonPosition = message.search(':');

  const prefix = message.slice(0, firstColonPosition).trim();
  const content = message.slice(firstColonPosition + 1).trim();

  return { prefix, content };
};

const formatCommitMessage = (message: string) => {
  const { prefix, content } = parseCommitMessage(message);

  if (!prefix || !content) {
    return message;
  }

  return `${prefix.trim()}: ${capitalize(content.trim())}`;
};

const main = ([commitMessagePath]: string[]) => {
  try {
    if (!commitMessagePath) {
      throw new Error('Missing commit message path.');
    }

    const commitMessage = readFileSync(commitMessagePath).toString();
    const formattedCommitMessage = formatCommitMessage(commitMessage);

    if (formattedCommitMessage !== commitMessage) {
      writeFileSync(commitMessagePath, formattedCommitMessage);
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
