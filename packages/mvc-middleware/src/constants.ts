const methods = {
  get: '',
  post: '',
  put: '',
  patch: '',
  delete: '',
};
export type HttpMethod = keyof typeof methods;
export const HTTP_METHODS = Array.from(Object.keys(methods)) as HttpMethod[];

type Route = string;
type MethodName = string;

export type ApiMethodsContainer = {
  [method in HttpMethod]: Map<Route, MethodName>;
};

// todo: use context.metadata for passing method names from method-decorator, when it will be ready
export const methodNamesTemporaryBox: ApiMethodsContainer = {
  delete: new Map(),
  get: new Map(),
  patch: new Map(),
  post: new Map(),
  put: new Map(),
};

export function copyTemporaryBox() {
  return {
    delete: new Map(methodNamesTemporaryBox.delete),
    get: new Map(methodNamesTemporaryBox.get),
    patch: new Map(methodNamesTemporaryBox.patch),
    post: new Map(methodNamesTemporaryBox.post),
    put: new Map(methodNamesTemporaryBox.put),
  };
}

export function clearTemporaryBox() {
  methodNamesTemporaryBox.delete.clear();
  methodNamesTemporaryBox.get.clear();
  methodNamesTemporaryBox.patch.clear();
  methodNamesTemporaryBox.post.clear();
  methodNamesTemporaryBox.put.clear();
}
