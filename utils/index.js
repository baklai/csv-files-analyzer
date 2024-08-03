import fs from 'fs';
import path from 'path';

export const findCSVFiles = directory => {
  return fs.readdirSync(directory).filter(file => path.extname(file) === '.csv');
};
