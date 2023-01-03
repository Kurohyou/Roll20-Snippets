import { describe,it,expect } from 'vitest';
import { k } from './testFramework';

describe('k.capitalize',()=>{
  it('Should capitalize every word in a string',()=>{
    expect(k.capitalize('the big green house')).toMatchInlineSnapshot('"The Big Green House"');
  });
});