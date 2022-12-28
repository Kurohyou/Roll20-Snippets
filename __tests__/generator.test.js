import * as fs from 'fs/promises';
import * as path from 'path';

import { describe, it, expect } from 'vitest';

const cssURL = new URL('./../test_sheet/build/K-scaffold_Tester.css',import.meta.url);
const htmlURL = new URL('./../test_sheet/build/K-scaffold_Tester.html',import.meta.url);
const jsURL = new URL('./../test_sheet/source/assets/js/testFramework.js',import.meta.url);
console.log('cssURL',cssURL);
describe('k.build',()=>{
  it('Should generate the css file from scss', async ()=>{
    const css = await fs.readFile(cssURL,'utf8');
    expect(css).toMatchSnapshot();
  });
  it('Should generate the html file from the pug and js', async ()=>{
    const html = await fs.readFile(htmlURL,'utf8');
    expect(html).toMatchSnapshot();
  });
  it('Should generate the index.js for tests', async ()=>{
    const js = await fs.readFile(jsURL,'utf8');
    expect(js).toMatchSnapshot()
  });
});