import { describe,it,expect } from 'vitest';
import { k } from './testFramework';

describe('k.parseHTMLName',()=>{
  it('Should extract the full name from an html version of an attribute name',()=>{
    expect(k.parseHTMLName('attr_attribute')).toMatchInlineSnapshot('"attribute"');
  });
  it('Should extract the full name from an html version of a roll button name',()=>{
    expect(k.parseHTMLName('roll_roll')).toMatchInlineSnapshot('"roll"');
  });
  it('Should extract the full name from an html version of an action button name',()=>{
    expect(k.parseHTMLName('act_action')).toMatchInlineSnapshot('"action"');
  });
});