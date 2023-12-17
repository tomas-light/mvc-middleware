import { ApiMethodsContainer } from './constants.js';

export const apiSymbol = Symbol('mvc-middleware api symbol');

export type PatchedConstructor = (new (...args: any[]) => any) & {
  [apiSymbol]?: ApiMethodsContainer;
};
