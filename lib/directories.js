/* eslint-disable no-underscore-dangle */
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const require = createRequire(import.meta.url);
