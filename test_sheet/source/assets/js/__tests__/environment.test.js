import { describe, expect, it } from 'vitest';

import { environment } from './../testFramework';

describe('Environment',() => {
  it('Should have attributes, characters, query response sub objects and all attributes from sheet in attributes subobject',()=>{
    console.warn('env.attr',environment);
    expect(environment).toMatchSnapshot();
  });
});