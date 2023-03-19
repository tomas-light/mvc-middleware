import { concatTwoUrlParts } from '../utils/concatTwoUrlParts';
import { toKebabCase } from '../utils/toKebabCase';
import {
  ApiMethodsContainer,
  apiMethodsSymbol,
  ConstructorMaybeWithApiMethods,
  ConstructorWithApiMethods,
  ConstructorWithUrlPrefix,
  urlPrefixSymbol,
} from './symbols';

interface HttpMethod {
  (urlPart: string): <This, Method extends (this: This, ...args: any[]) => any>(
    method: Method,
    context: ClassMethodDecoratorContext<This, Method>
  ) => void;

  <This, Method extends (this: This, ...args: any[]) => any>(
    method: Method,
    context: ClassMethodDecoratorContext<This, Method>
  ): void;
}

/** DELETE http method. If it called without argument the method name will be cased to kebab and used as url part.
 * @example
 *   class UserController extends MvcController {
 * ㅤㅤ@delete_ // some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@delete_('my-method') // my-method
 *     doSome() {
 *       // ...
 *     }
 *   }
 *
 * // or with api prefix
 *
 * ㅤ@api('/api/user')
 *   class UserController extends MvcController {
 * ㅤㅤ@delete_ // /api/user/some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@delete_('my-method') // /api/user/my-method
 *     doSome() {
 *       // ...
 *     }
 * ㅤㅤ@delete_(' /another-method ') // /api/user/another-method
 *     doSome2() {
 *       // ...
 *     }
 *   }
 * */
export const delete_: HttpMethod = (...args: any[]) => {
  if (args.length > 1) {
    return apiMethodsDecorator('delete').apply(args[0], args[1]);
  }
  return apiMethodsDecorator('delete', args[0]);
};

/** GET http method. If it called without argument the method name will be cased to kebab and used as url part.
 * @example
 *   class UserController extends MvcController {
 * ㅤㅤ@get // some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@get('my-method') // my-method
 *     doSome() {
 *       // ...
 *     }
 *   }
 *
 * // or with api prefix
 *
 * ㅤ@api('/api/user')
 *   class UserController extends MvcController {
 * ㅤㅤ@get // /api/user/some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@get('my-method') // /api/user/my-method
 *     doSome() {
 *       // ...
 *     }
 * ㅤㅤ@get(' /another-method ') // /api/user/another-method
 *     doSome2() {
 *       // ...
 *     }
 *   }
 * */
export const get: HttpMethod = (...args: any[]) => {
  if (args.length > 1) {
    return apiMethodsDecorator('get').apply(args[0], args[1]);
  }
  return apiMethodsDecorator('get', args[0]);
};

/** PATCH http method. If it called without argument the method name will be cased to kebab and used as url part.
 * @example
 *   class UserController extends MvcController {
 * ㅤㅤ@patch // some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@patch('my-method') // my-method
 *     doSome() {
 *       // ...
 *     }
 *   }
 *
 * // or with api prefix
 *
 * ㅤ@api('/api/user')
 *   class UserController extends MvcController {
 * ㅤㅤ@patch // /api/user/some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@patch('my-method') // /api/user/my-method
 *     doSome() {
 *       // ...
 *     }
 * ㅤㅤ@patch(' /another-method ') // /api/user/another-method
 *     doSome2() {
 *       // ...
 *     }
 *   }
 * */
export const patch: HttpMethod = (...args: any[]) => {
  if (args.length > 1) {
    return apiMethodsDecorator('patch').apply(args[0], args[1]);
  }
  return apiMethodsDecorator('patch', args[0]);
};

/** POST http method. If it called without argument the method name will be cased to kebab and used as url part.
 * @example
 *   class UserController extends MvcController {
 * ㅤㅤ@post // some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@post('my-method') // my-method
 *     doSome() {
 *       // ...
 *     }
 *   }
 *
 * // or with api prefix
 *
 * ㅤ@api('/api/user')
 *   class UserController extends MvcController {
 * ㅤㅤ@post // /api/user/some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@post('my-method') // /api/user/my-method
 *     doSome() {
 *       // ...
 *     }
 * ㅤㅤ@post(' /another-method ') // /api/user/another-method
 *     doSome2() {
 *       // ...
 *     }
 *   }
 * */
export const post: HttpMethod = (...args: any[]) => {
  if (args.length > 1) {
    return apiMethodsDecorator('post').apply(args[0], args[1]);
  }
  return apiMethodsDecorator('post', args[0]);
};

/** PUT http method. If it called without argument the method name will be cased to kebab and used as url part.
 * @example
 *   class UserController extends MvcController {
 * ㅤㅤ@put // some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@put('my-method') // my-method
 *     doSome() {
 *       // ...
 *     }
 *   }
 *
 * // or with api prefix
 *
 * ㅤ@api('/api/user')
 *   class UserController extends MvcController {
 * ㅤㅤ@put // /api/user/some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@put('my-method') // /api/user/my-method
 *     doSome() {
 *       // ...
 *     }
 * ㅤㅤ@put(' /another-method ') // /api/user/another-method
 *     doSome2() {
 *       // ...
 *     }
 *   }
 * */
export const put: HttpMethod = (...args: any[]) => {
  if (args.length > 1) {
    return apiMethodsDecorator('put').apply(args[0], args[1]);
  }
  return apiMethodsDecorator('put', args[0]);
};

function apiMethodsDecorator(
  apiMethod: keyof ApiMethodsContainer,
  urlPart?: string
) {
  return <This, T extends (this: This, ...args: any) => any>(
    method: T,
    context: ClassMethodDecoratorContext<This, T>
  ) => {
    if (context.kind === 'method') {
      context.addInitializer(function (this: This) {
        const prototype = Object.getPrototypeOf(this) as {
          constructor?: ConstructorMaybeWithApiMethods;
        };
        if (!prototype || !prototype.constructor) {
          return;
        }

        const constructorWithApi = initializeApiSymbolInConstructor(
          prototype.constructor
        );

        const prefix = (constructorWithApi as ConstructorWithUrlPrefix)[
          urlPrefixSymbol
        ];

        let url: string;
        if (prefix && urlPart) {
          url = concatTwoUrlParts(prefix, urlPart);
        }
        else if (urlPart) {
          url = urlPart;
        }
        else if (prefix) {
          const kebabedMethodName = toKebabCase(String(context.name));
          url = concatTwoUrlParts(prefix, kebabedMethodName);
        }
        else {
          url = toKebabCase(String(context.name));
        }

        constructorWithApi[apiMethodsSymbol][apiMethod].set(
          url,
          String(context.name)
        );
      });
    }
    return method;
  };
}

function initializeApiSymbolInConstructor(
  constructorMaybeWithApi: ConstructorMaybeWithApiMethods
): ConstructorWithApiMethods {
  const constructorWithApi =
    constructorMaybeWithApi as ConstructorWithApiMethods;

  if (!constructorWithApi[apiMethodsSymbol]) {
    constructorWithApi[apiMethodsSymbol] = {
      delete: new Map(),
      get: new Map(),
      patch: new Map(),
      post: new Map(),
      put: new Map(),
    };
  }

  return constructorWithApi;
}
