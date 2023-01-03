import { describe,it,expect } from 'vitest';
import { k,environment } from './testFramework';

describe('k.extractQueryResult',()=>{
  it('Should return the user answer to the prompt',async ()=>{
    environment.queryResponses['Query Prompt'] = 'Test Response';
    const retVal = await k.extractQueryResult('Query Prompt');

    expect(retVal).toMatchInlineSnapshot('"Test Response"');
  });
});