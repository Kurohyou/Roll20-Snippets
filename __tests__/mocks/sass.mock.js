import { vi } from 'vitest';
import sass from 'sass-embedded';

export const sassSpy = (css) => vi.spyOn(sass,'compileAsync').mockImplementation(()=> ({css}));