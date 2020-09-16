import { IRouter } from "./IRouter";
import { RouteHandler } from "./RouteHandler";

export interface IApplication {
    use: (areaOrRouter: string | IRouter, router?: IRouter) => void;
    get: (route: string, middleware?: RouteHandler) => void;
    post: (route: string, middleware?: RouteHandler) => void;
    put: (route: string, middleware?: RouteHandler) => void;
    patch: (route: string, middleware?: RouteHandler) => void;
    delete: (route: string, middleware?: RouteHandler) => void;
}
