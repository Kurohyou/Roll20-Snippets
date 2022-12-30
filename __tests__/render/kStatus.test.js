import { describe, it, expect, vi } from 'vitest';
import kStatus from './../../render/kStatus';
import resolvePaths from './../../render/kStatus';
import './mocks';

describe('kStatus()',()=>{
  it('Should log the message',()=>{
    kStatus('test message');
    expect(console.log.calls).toMatchInlineSnapshot(`
      [
        [
          "[44mtest message[49m",
        ],
      ]
    `);
  })
})