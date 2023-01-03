import { describe,it,expect } from 'vitest';
import { k } from './testFramework';

describe('value()',()=>{
  describe('No default specified',()=>{
    it('Should return the number if passed a number',()=>{
      expect(k.value(2)).toBe(2);
      expect(k.value(0)).toBe(0);
    });
    it('Should return the number version of a numerical string',()=>{
      expect(k.value('2')).toBe(2);
      expect(k.value(' 2 ')).toBe(2);
    });
    it('Should return 0 if passed a non numerical string',()=>{
      expect(k.value('ABCD')).toBe(0);
      expect(k.value('2d12')).toBe(0);
    });
  });
  describe('Default Specified',()=>{
    it('Should return the number if passed a number',()=>{
      expect(k.value(2,10)).toBe(2);
      expect(k.value(0,10)).toBe(0);
    });
    it('Should return the number version of a numerical string',()=>{
      expect(k.value('2',10)).toBe(2);
      expect(k.value(' 2 ',10)).toBe(2);
    });
    it('Should return the custom default if passed a non numerical string',()=>{
      expect(k.value('ABCD',10)).toBe(10);
      expect(k.value('2d12',10)).toBe(10);
    });
    it('Should throw an error if passed a non numeric default',()=>{
      expect(()=>k.value(2,'should error')).toThrowError(/invalid default for value\(\)/);
    })
  })
});