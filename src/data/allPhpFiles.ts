import { FileItem } from '../types';
import { corePhpFiles } from './phpCore';
import { userPhpFiles } from './phpUser';
import { adminPhpFiles } from './phpAdmin';

export const allPhpFiles: FileItem[] = [
  ...corePhpFiles,
  ...userPhpFiles,
  ...adminPhpFiles
];
