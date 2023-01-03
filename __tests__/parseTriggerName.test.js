import { describe,it,expect } from 'vitest';
import { k } from './testFramework';

describe('k.parseTriggerName',()=>{
  it('Should extract attribute/button name from a basic attribute name',()=>{
    expect(k.parseTriggerName('attribute')).toMatchInlineSnapshot(`
      [
        undefined,
        undefined,
        "attribute",
      ]
    `);
  });
  it('Should extract section, rowID, and attribute/button name from a full repeating name',()=>{
    expect(k.parseTriggerName('repeating_test_-234kjasdf0j_attribute')).toMatchInlineSnapshot(`
      [
        "repeating_test",
        "-234kjasdf0j",
        "attribute",
      ]
    `);
  });
})