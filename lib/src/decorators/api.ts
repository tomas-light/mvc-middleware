import { Constructor } from 'cheap-di';
import { concatTwoUrlParts } from '../utils/concatTwoUrlParts';
import {
  ApiMethodsContainer,
  apiMethodsSymbol,
  apiWasAdjustedSymbol,
  ConstructorMaybeWithApiMethods,
  ConstructorWithUrlPrefix,
} from './symbols';

interface Api {
  <T extends Constructor>(constructor: T): T;

  (urlPrefix: string): <T extends Constructor>(constructor: T) => T;
}

/**
 * Extends class to be able to use it as API controller.
 * Be aware, the first instantiating of the class is used by MvcMiddleware
 * to be able to execute method decorators and register them in application
 * routing system.
 * @example
 * ㅤ@api('/api/user')
 *   class UserController extends MvcController {
 * ㅤㅤ@get('my-method') // /api/user/my-method
 *     doSome() {
 *       // ...
 *     }
 *   }
 * */
export const api: Api = <T extends Constructor>(...args: any[]) => {
  if (typeof args[0] === 'function') {
    const [constructor] = args as [T];
    return apiDecorator('')(constructor);
  }

  const [urlPrefix] = args as [string];
  return apiDecorator(urlPrefix);
};

const apiDecorator = (urlPrefix: string) => {
  return <T extends Constructor>(constructor: T): T => {
    (constructor as unknown as ConstructorWithUrlPrefix)[apiWasAdjustedSymbol] =
      true;
    if (!urlPrefix) {
      return constructor;
    }

    const apiMethods = (
      constructor as unknown as ConstructorMaybeWithApiMethods
    )[apiMethodsSymbol];
    if (!apiMethods) {
      return constructor;
    }

    function addPrefixToEachMethod(
      map: Map<string, string>
    ): Map<string, string> {
      const newMap = new Map<string, string>();
      for (const [url, methodName] of map.entries()) {
        const urlWithPrefix = concatTwoUrlParts(urlPrefix, url);
        newMap.set(urlWithPrefix, methodName);
      }
      return newMap;
    }

    Object.entries(apiMethods).forEach(([httpMethod, map]) => {
      apiMethods[httpMethod as keyof ApiMethodsContainer] =
        addPrefixToEachMethod(map);
    });

    return constructor;
  };
};
