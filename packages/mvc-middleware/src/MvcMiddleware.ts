import type { DependencyResolver } from 'cheap-di';
import { Application, Request, Response } from 'express';
import { readdir } from 'fs/promises';
import path from 'path';
import { HTTP_METHODS } from './constants.js';
import { apiSymbol, PatchedConstructor } from './symbols.js';

export class MvcMiddleware {
  constructor(
    private readonly application: Pick<Application, 'get' | 'post' | 'put' | 'patch' | 'delete'>,
    private readonly container: {
      resolve: DependencyResolver['resolve'];
    }
  ) {}

  /** Registers all classes with default exports in specified directory
   * as API controllers recursively.
   * */
  async registerControllers(directoryPath: string) {
    const folderContent = await readdir(directoryPath, { withFileTypes: true });

    for await (const dirent of folderContent) {
      const pathToController = path.join(directoryPath, dirent.name);

      if (dirent.isDirectory()) {
        await this.registerControllers(pathToController);
        return;
      }

      if (!dirent.name.endsWith('.ts')) {
        return;
      }

      const controllerConstructor = (await import(pathToController)).default as PatchedConstructor;
      if (!controllerConstructor) {
        console.log(`${dirent.name} has no default import to register it as controller`);
        return;
      }

      if (typeof controllerConstructor !== 'function') {
        console.log(`${dirent.name} has default export for something, that can not be controller`);
      }

      if (!(controllerConstructor as unknown as PatchedConstructor)[apiSymbol]) {
        console.log(`${dirent.name} has no API adjustments`);
        return;
      }

      this.register(controllerConstructor);
    }

    return this;
  }

  /** Registers one class as API controller */
  register(controllerConstructor: PatchedConstructor) {
    const apiMethods = controllerConstructor[apiSymbol];
    if (!apiMethods) {
      return;
    }

    HTTP_METHODS.forEach((httpMethod) => {
      const map = apiMethods[httpMethod];
      if (!map) {
        return;
      }

      map.forEach((methodName, url) => {
        const endpointHandler = this.createEndpointHandler(controllerConstructor, methodName);

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
  createEndpointHandler(controllerConstructor: PatchedConstructor, methodName: string) {
    return (request: Request, response: Response, next: (...args: any[]) => void) => {
      const controller = this.container.resolve(controllerConstructor, request, response);
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

      // eslint-disable-next-line prefer-spread
      controller[methodName].apply(controller, args);
    };
  }
}
