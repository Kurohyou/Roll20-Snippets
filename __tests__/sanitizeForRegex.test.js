import { describe,it,expect } from 'vitest';
import { k } from './testFramework';

const sanitize = k.sanitizeForRegex;

describe('sanitizeForRegex',()=>{
  it('Should do nothing to strings without problem characters',()=>{
    const sanText = sanitize('no problems');
    
    expect(sanText).toMatchInlineSnapshot('"no problems"');
  });
  it('Should replace regex syntax characters with escaped versions',()=>{
    const sanText = sanitize('has |,+,-,*,?,[,],(,),{,} in it');
    expect(sanText).toMatchInlineSnapshot('"has \\\\|,\\\\+,\\\\-,\\\\*,\\\\?,\\\\[,\\\\],\\\\(,\\\\),\\\\{,\\\\} in it"');
  });
});