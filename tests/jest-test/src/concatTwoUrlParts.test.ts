import { concatTwoUrlParts } from 'mvc-middleware';

describe('concatTwoUrlParts', () => {
  test('if both parts are empty it should return empty string', () => {
    expect(concatTwoUrlParts('', '')).toBe('');
  });
  test('if prefix is empty it should return only second part', () => {
    expect(concatTwoUrlParts(' ', ' second-part ')).toBe('second-part');
  });
  test('if second part is empty it should return only prefix part', () => {
    expect(concatTwoUrlParts(' api/', ' ')).toBe('api/');
  });
  test('if both pars are presented it should return its concatenation', () => {
    expect(concatTwoUrlParts(' /api', 'my-method ')).toBe('/api/my-method');
  });
  test('if double slashes will be omitted to single', () => {
    expect(concatTwoUrlParts(' /api/', '/my-method/////to-do ')).toBe('/api/my-method/to-do');
  });
});
