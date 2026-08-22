const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

const uri = process.env.DATABASE_URI;
if (!uri) {
  console.error('DATABASE_URI is not defined in .env file!');
  process.exit(1);
}

const backupDir = path.join(__dirname, 'backup', 'NewRND');
console.log(`Seeding database from: ${backupDir}`);

try {
  const cmd = `mongorestore --uri="${uri}" --dir="${backupDir}" --drop`;
  console.log('Executing mongorestore...');
  execSync(cmd, { stdio: 'inherit' });
  console.log('Successfully seeded database!');
} catch (error) {
  console.error('Error seeding database:', error.message);
  process.exit(1);
}
