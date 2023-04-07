import { toKebabCase } from './toKebabCase';

describe('toKebabCase', () => {
  test('someLongMethodName should be changed to some-long-method-name', () => {
    expect(toKebabCase('someLongMethodName')).toBe('some-long-method-name');
  });
  test('SomeLongMethodName should be changed to some-long-method-name', () => {
    expect(toKebabCase('SomeLongMethodName')).toBe('some-long-method-name');
  });
  test('METHOD should be changed to m-e-t-h-o-d', () => {
    expect(toKebabCase('METHOD')).toBe('m-e-t-h-o-d');
  });
});
