import * as ActionsCore from '@actions/core';
import * as FileSystem from 'fs';
import * as Path from 'path';

interface PackageJson {
  name: string;
  version: string;
  engines?: {
    node?: string;
    npm?: string;
  };
}

const nodeReleasesUrl = 'https://nodejs.org/dist/index.json';

interface NodeRelease {
  readonly version: string;
}

const isNodeRelease = (value: unknown): value is NodeRelease =>
  typeof value === 'object' &&
  value !== null &&
  'version' in value &&
  typeof (value as NodeRelease).version === 'string';

const fetchLatestNodeRelease = async () => {
  const { default: fetch } = await import('node-fetch');
  const response = await fetch(nodeReleasesUrl);
  const data = await response.json();

  if (Array.isArray(data) && isNodeRelease(data[0])) {
    return data[0];
  }

  return null;
};

const fetchLatestNodeVersion = async () => {
  const release = await fetchLatestNodeRelease();
  const version = release?.version;

  if (version) {
    return version.startsWith('v') ? version.slice(1) : version;
  }

  return null;
};

const updateNvmrc = (path: string, version: string) => FileSystem.writeFileSync(path, `v${version}\n`);

const updatePackageJson = (path: string, version: string) => {
  const packageJson: PackageJson = JSON.parse(FileSystem.readFileSync(path, 'utf-8'));

  if (packageJson.engines?.node === version) {
    return;
  }

  const nextPackageJson: PackageJson = {
    ...packageJson,
    engines: {
      ...packageJson.engines,
      node: version
    }
  };

  const nextContent = JSON.stringify(nextPackageJson, null, 2) + '\n';
  FileSystem.writeFileSync(path, nextContent);
};

const main = async (projectPath = '') => {
  try {
    const version = await fetchLatestNodeVersion();
    if (!version) {
      console.error('Error: Unknown latest Node.js version');
      return 1;
    }

    console.info(`Info: Trying to update Node.js versions to ${version}`);

    updateNvmrc(Path.resolve(projectPath, '.nvmrc'), version);
    updatePackageJson(Path.resolve(projectPath, 'package.json'), version);

    console.info('Info: Update successful');

    if (process.env.GITHUB_ACTIONS === 'true') {
      ActionsCore.setOutput('version', version);
    }

    return 0;
  } catch (error) {
    console.error('Error: Cannot update Node.js versions');
    console.error(error);

    return 1;
  }
};

main(process.argv[2]).then((code) => process.exit(code));
