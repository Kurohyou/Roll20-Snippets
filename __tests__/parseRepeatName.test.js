import { describe,it,expect } from 'vitest';
import { k } from './testFramework';

describe('k.parseRepeatName',()=>{
  it('Should extract section, rowID, and attribute/button name from a full repeating name',()=>{
    expect(k.parseRepeatName('repeating_test_-234kjasdf0j_attribute')).toMatchInlineSnapshot(`
      [
        "repeating_test",
        "-234kjasdf0j",
        "attribute",
      ]
    `);
  });
  it('Should extract section and rowID if just passed the row info',()=>{
    expect(k.parseRepeatName('repeating_test_-234kjasdf0j')).toMatchInlineSnapshot(`
      [
        "repeating_test",
        "-234kjasdf0j",
        undefined,
      ]
    `);
  })
})