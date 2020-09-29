import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { IApplication } from "./types/IApplication";
import { IDependencyResolver } from "./types/IDependencyResolver";
import { IRouter } from "./types/IRouter";

type RouteFactory = () => IRouter;
type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
const HTTP_METHODS: HttpMethod[] = [ 'get', 'post', 'put', 'patch', 'delete' ];

class MvcMiddleware {
    static connect(applicationInstance: IApplication, createRouter: RouteFactory, container?: IDependencyResolver) {
        // @ts-ignore
        const appDir = path.dirname(require.main.filename);
        const directoryPath = path.join(appDir, 'controllers');
        new MvcMiddleware(applicationInstance, createRouter, container)
            .registerControllers(directoryPath)
            .run();
    }

    private readonly applicationInstance: IApplication;
    private readonly createRouter: RouteFactory;
    private readonly container: IDependencyResolver;

    constructor(applicationInstance: IApplication, createRouter: RouteFactory, container?: IDependencyResolver) {
        this.applicationInstance = applicationInstance;
        this.createRouter = createRouter;
        this.container = container || {
            resolve: (controllerClass, ...args) => new controllerClass(...args),
        };
    }

    registerControllers(directoryPath: string) {
        const fileNames = fs.readdirSync(directoryPath);
        const sanitizedFileNames = fileNames.filter(name => name.endsWith('.js') || name.endsWith('.ts'));

        sanitizedFileNames.forEach(name => {
            const pathToController = path.join(directoryPath, name);
            if (fs.lstatSync(pathToController).isDirectory()) {
                this.registerControllers(pathToController);
                return;
            }

            const ControllerClass = require(pathToController).default;
            if (!ControllerClass) {
                console.log(`${name} has no default import to register it as controller`);
                return;
            }

            const properties = Object.keys(ControllerClass);
            const hasAnyHttpMethodProperty = properties.some(property => HTTP_METHODS.indexOf(property as any) >= 0);

            if (!hasAnyHttpMethodProperty) {
                console.log(`controller (${name}) does not meet the requirements for controllers`);
                return;
            }

            this.register(ControllerClass);
        });

        return this;
    }

    register(ControllerClass: InstanceType<any>) {
        const router = this.createRouter();

        HTTP_METHODS.forEach(httpMethod => {
            const routes = ControllerClass[httpMethod];
            if (!routes) {
                return;
            }

            Object.keys(routes).forEach(route => {
                /** @type {string} */
                const actionName = routes[route];
                const middleware = this.createMiddleware(ControllerClass, actionName);

                if (ControllerClass.area && route.startsWith('/')) {
                    this.applicationInstance[httpMethod](route, middleware);
                }
                else if (route.startsWith('/')) {
                    router[httpMethod](route, middleware);
                }
                else {
                    router[httpMethod](`/${route}`, middleware);
                }
            });
        });

        if (ControllerClass.area) {
            this.applicationInstance.use(ControllerClass.area, router);
        }
        else if (router.stack.length) {
            this.applicationInstance.use(router);
        }
    }

    createMiddleware(ControllerClass: InstanceType<any>, actionName: string) {
        const container = this.container;

        function middleware(request: Request, response: Response, next: Function) {
            const controller = container.resolve(ControllerClass, request, response);

            let args: any[] = [];
            if (request.params) {
                const paramNames = Object.keys(request.params);
                args = paramNames.map(name => request.params[name]);
            }
            if (request.query) {
                const queryNames = Object.keys(request.query);
                args = queryNames.map(name => request.query[name]);
            }
            if (request.body) {
                args.push(request.body);
            }

            controller[actionName].apply(controller, args);
        }

        return middleware;
    }

    run() {
        return function (request: Request, response: Response, next: Function) {
            next();
        };
    }
}

export { MvcMiddleware };
