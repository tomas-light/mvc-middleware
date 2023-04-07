import type { DependencyResolver } from 'cheap-di';
import { Application, Request, Response } from 'express';
import { readdir } from 'fs/promises';
import path from 'path';
import {
  ApiMethodsContainer,
  apiMethodsSymbol,
  apiWasAdjustedSymbol,
  ConstructorMaybeController,
  ConstructorWithUrlPrefix,
} from './decorators/symbols';

type HttpMethod = keyof ApiMethodsContainer;
const HTTP_METHODS: HttpMethod[] = ['get', 'post', 'put', 'patch', 'delete'];

export class MvcMiddleware {
  constructor(
    private readonly application: Pick<
      Application,
      'get' | 'post' | 'put' | 'patch' | 'delete'
    >,
    private readonly container: {
      resolve: DependencyResolver['resolve'];
    }
  ) {}

  /** Registers all classes with default exports in specified directory
   * as API controllers recursively.
   * */
  async registerControllers(directoryPath: string) {
    const folderContent = await readdir(directoryPath, { withFileTypes: true });

    folderContent.forEach((dirent) => {
      const pathToController = path.join(directoryPath, dirent.name);

      if (dirent.isDirectory()) {
        this.registerControllers(pathToController);
        return;
      }

      if (!dirent.name.endsWith('.ts')) {
        return;
      }

      const controllerConstructor = require(pathToController)
        .default as ConstructorMaybeController;
      if (!controllerConstructor) {
        console.log(
          `${dirent.name} has no default import to register it as controller`
        );
        return;
      }

      if (typeof controllerConstructor !== 'function') {
        console.log(
          `${dirent.name} has default export for something, that can not be controller`
        );
      }

      if (
        !(controllerConstructor as unknown as ConstructorWithUrlPrefix)[
          apiWasAdjustedSymbol
        ]
      ) {
        console.log(`${dirent.name} has no API adjustments`);
        return;
      }

      this.register(controllerConstructor);
    });

    return this;
  }

  /** Registers one class as API controller */
  register(controllerConstructor: ConstructorMaybeController) {
    // todo: how can we do it in correct way?
    try {
      // to initialize controller at least once and execute its method decorators to register all methods
      this.container.resolve(controllerConstructor);
    } catch {}

    const apiMethods = controllerConstructor[apiMethodsSymbol];
    if (!apiMethods) {
      return;
    }

    HTTP_METHODS.forEach((httpMethod) => {
      const map = apiMethods[httpMethod];
      if (!map) {
        return;
      }

      map.forEach((methodName, url) => {
        const endpointHandler = this.createEndpointHandler(
          controllerConstructor,
          methodName
        );

        if (url.startsWith('/')) {
          this.application[httpMethod](url, endpointHandler);
        } else {
          // todo: check, may be it's redundant
          this.application[httpMethod](`/${url}`, endpointHandler);
        }
      });
    });
  }

  /** Returns express route handler for specified API controller method */
  createEndpointHandler(
    controllerConstructor: ConstructorMaybeController,
    methodName: string
  ) {
    return (request: Request, response: Response, next: Function) => {
      const controller = this.container.resolve(
        controllerConstructor,
        request,
        response
      );
      if (!controller) {
        next();
        return;
      }

      const args: any[] = [];
      if (request.params) {
        // const paramNames = Object.keys(request.params);
        // args = paramNames.map((name) => request.params[name]);
        const urlParams = Array.from(Object.values(request.params));
        args.push(...urlParams);
      }
      if (request.query) {
        // const queryNames = Object.keys(request.query);
        // const queryParams = queryNames.map((name) => request.query[name]);
        const queryParams = Array.from(Object.values(request.query));
        args.push(...queryParams);
      }
      if (request.body) {
        args.push(request.body);
      }

      controller[methodName].apply(controller, args);
    };
  }
}
