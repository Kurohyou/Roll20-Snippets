import { describe, it, expect, vi } from 'vitest';
import kErrorHead from './../../render/errorHead';
import './mocks';

describe('kErrorhead',()=>{
  it('Should log the provided error',()=>{
    kErrorHead('test');
    expect(console.log.calls).toMatchInlineSnapshot(`
      [
        [
          "[41m==============
      ==== test ====
      ==============[49m",
        ],
      ]
    `);
  })
})