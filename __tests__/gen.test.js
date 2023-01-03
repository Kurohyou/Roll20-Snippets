import { describe, expect, it } from 'vitest';

import { environment } from '../test_sheet/source/assets/js/testFramework';

describe('Environment',() => {
  it(
    'Should have attributes, characters, query response sub objects and all attributes from sheet in attributes subobject',
    ()=>{
      expect(environment).toMatchSnapshot();
    }
  );
});