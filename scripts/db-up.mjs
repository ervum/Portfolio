import { Secrets } from '../packages/shared-configuration/dist/secrets.js';
import { DefaultSecrets } from '../packages/shared-configuration/dist/index.js';

import { execSync } from 'child_process';

import fs from 'fs';



const { User, Password, Name } = Secrets.Database;
const { User: DefaultUser, Password: DefaultPassword, Name: DefaultName } = DefaultSecrets.Database;

const UserName = User || DefaultUser;
const UserPassword = Password || DefaultPassword;
const DatabaseName = Name || DefaultName;

const EnvironmentContent = `
POSTGRES_USER=${UserName}
POSTGRES_PASSWORD=${UserPassword}
POSTGRES_DB=${DatabaseName}
`;



fs.writeFileSync('docker.env', EnvironmentContent);

console.log(`Starting database "${DatabaseName}" with username: "${UserName}"...`);

try {
  execSync('docker compose -f docker-compose.dev.yml up -d db', { stdio: 'inherit' });
} catch (Error) {
  console.error('Failed to start docker-compose:', Error.message);

  process.exit(1);
}
