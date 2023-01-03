import { describe,it,expect } from 'vitest';
import { k } from './testFramework';

const resetMock = () => {
  console.log.mockClear();
  console.table.mockClear();
};
k.sheetName = 'Test Sheet';
describe('k.log()',()=>{
  it('Should log the message with the sheet name tag prepended',()=>{
    resetMock();
    k.log('Test log');
    expect(console.log.calls[0]).toMatchInlineSnapshot(`
      [
        "%cTest Sheet log| Test log",
        "background-color:#159ccf",
      ]
    `);
  });
  it('Should expand objects to their key/value pairs',()=>{
    resetMock();
    k.log({nested:{attributes:['array','of','values']}});
    expect(console.log.calls).toMatchInlineSnapshot(`
      [
        [
          "%cTest Sheet log| object nested",
          "background-color:#159ccf",
        ],
      ]
    `);
    expect(console.table.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "attributes": [
              "array",
              "of",
              "values",
            ],
          },
        ],
      ]
    `);
  });
});
describe('k.debug()',()=>{
  describe('Sheet Version = 0',()=>{
    it('Should log the message with the sheet name tag prepended',()=>{
      k.version = 0;
      resetMock();
      k.debug('Test log');
      expect(console.log.calls).toMatchInlineSnapshot(`
        [
          [
            "%cTest Sheet DEBUG| Test log",
            "background-color:tan;color:red;",
          ],
        ]
      `);
    });
    it('Should expand objects to their key/value pairs',()=>{
      k.version = 0;
      resetMock();
      k.debug({nested:{attributes:['array','of','values']}});
      expect(console.log.calls).toMatchInlineSnapshot(`
        [
          [
            "%cTest Sheet DEBUG| object nested",
            "background-color:tan;color:red;font-weight:bold;",
          ],
        ]
      `);
      expect(console.table.calls).toMatchInlineSnapshot(`
        [
          [
            {
              "attributes": [
                "array",
                "of",
                "values",
              ],
            },
          ],
        ]
      `);
    });
  });
  describe('Sheet Version > 0, no debug mode',()=>{
    it('Should not log anything',()=>{
      k.version = 1;
      k.debugMode = false;
      resetMock();
      k.debug('Test log');
      expect(console.log.calls).toMatchInlineSnapshot('[]');
    });
    it('Should not log objects either',()=>{
      k.version = 1;
      k.debugMode = false;
      resetMock();
      k.debug({nested:{attributes:['array','of','values']}});
      expect(console.log.calls).toMatchInlineSnapshot('[]');
      expect(console.table.calls).toMatchInlineSnapshot('[]');
    });
    describe('forced',()=>{
      it('Should log the message with the sheet name tag prepended',()=>{
        k.version = 1;
        k.debugMode = false;
        resetMock();
        k.debug('Test log',true);
        expect(console.log.calls).toMatchInlineSnapshot(`
          [
            [
              "%cTest Sheet DEBUG| Test log",
              "background-color:tan;color:red;",
            ],
          ]
        `);
      });
      it('Should expand objects to their key/value pairs',()=>{
        k.version = 1;
        k.debugMode = false;
        resetMock();
        k.debug({nested:{attributes:['array','of','values']}},true);
        expect(console.log.calls).toMatchInlineSnapshot(`
          [
            [
              "%cTest Sheet DEBUG| object nested",
              "background-color:tan;color:red;font-weight:bold;",
            ],
          ]
        `);
        expect(console.table.calls).toMatchInlineSnapshot(`
          [
            [
              {
                "attributes": [
                  "array",
                  "of",
                  "values",
                ],
              },
            ],
          ]
        `);
      });
    })
  });
  describe('Sheet Version > 0, debug mode',()=>{
    k.version = 1;
    it('Should log the message with the sheet name tag prepended',()=>{
      k.debugMode = true;
      resetMock();
      k.debug('Test log');
      expect(console.log.calls).toMatchInlineSnapshot(`
        [
          [
            "%cTest Sheet DEBUG| Test log",
            "background-color:tan;color:red;",
          ],
        ]
      `);
    });
    it('Should expand objects to their key/value pairs',()=>{
      k.debugMode = true;
      resetMock();
      k.debug({nested:{attributes:['array','of','values']}});
      expect(console.log.calls).toMatchInlineSnapshot(`
        [
          [
            "%cTest Sheet DEBUG| object nested",
            "background-color:tan;color:red;font-weight:bold;",
          ],
        ]
      `);
      expect(console.table.calls).toMatchInlineSnapshot(`
        [
          [
            {
              "attributes": [
                "array",
                "of",
                "values",
              ],
            },
          ],
        ]
      `);
    });
  });
});