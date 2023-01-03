import fs from 'fs/promises';
import { vi } from 'vitest';

export const fsSpy = {
  readFile: (text) => vi.spyOn(fs,'readFile').mockImplementation(() => new Promise(res => res(text))),
  writeFile: vi.spyOn(fs,'writeFile').mockImplementation(() => null)
};