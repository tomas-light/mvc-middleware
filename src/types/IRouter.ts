import { RouteHandler } from './RouteHandler';

export interface IRouter {
  get: (route: string, middleware?: RouteHandler) => void;
  post: (route: string, middleware?: RouteHandler) => void;
  put: (route: string, middleware?: RouteHandler) => void;
  patch: (route: string, middleware?: RouteHandler) => void;
  delete: (route: string, middleware?: RouteHandler) => void;

  stack: string[];
}
