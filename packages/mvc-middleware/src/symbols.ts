import { ApiMethodsContainer } from './constants.js';

export const urlPrefixSymbol = Symbol('mvc-middleware url prefix symbol');
export const apiSymbol = Symbol('mvc-middleware api symbol');

export type ConstructorWithUrlPrefix = (abstract new (...args: any[]) => any) & {
  [urlPrefixSymbol]?: string;
  [apiSymbol]?: ApiMethodsContainer;
};

export type ConstructorMaybeController = (abstract new (...args: any[]) => any) & {
  [urlPrefixSymbol]?: string;
  [apiSymbol]?: ApiMethodsContainer;
};
