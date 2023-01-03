import { describe,it,expect } from 'vitest';
import { k } from './testFramework';

describe('k.pseudoQuery',()=>{
  it('Should return undefined if no value passed',async ()=>{
    const retVal = await k.pseudoQuery();

    expect(retVal).toMatchInlineSnapshot('"undefined"');
  });
  it('Should return the value if a value is passed',async ()=>{
    const retVal = await k.pseudoQuery(2);

    expect(retVal).toMatchInlineSnapshot('"2"');
  });
});