export const urlPrefixSymbol = Symbol('mvc-middleware url prefix symbol');
export const apiWasAdjustedSymbol = Symbol('mvc-middleware api symbol');

export const apiMethodsSymbol = Symbol('mvc-middleware API methods symbol');

export type ConstructorWithUrlPrefix = (abstract new (
  ...args: any[]
) => any) & {
  [urlPrefixSymbol]?: string;
  [apiWasAdjustedSymbol]?: true;
};

export type ApiMethodsContainer = {
  delete: Map<string, string>;
  get: Map<string, string>;
  patch: Map<string, string>;
  post: Map<string, string>;
  put: Map<string, string>;
};

export type ConstructorMaybeWithApiMethods = (abstract new (
  ...args: any[]
) => any) & {
  [apiMethodsSymbol]?: ApiMethodsContainer;
};

export type ConstructorMaybeController = (abstract new (
  ...args: any[]
) => any) & {
  [apiMethodsSymbol]?: ApiMethodsContainer;
  [urlPrefixSymbol]?: string;
};

export type ConstructorWithApiMethods = ConstructorMaybeWithApiMethods & {
  [apiMethodsSymbol]: ApiMethodsContainer;
};
