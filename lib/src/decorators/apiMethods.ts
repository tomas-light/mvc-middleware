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
export const delete_: HttpMethod = <
  This,
  Method extends (this: This, ...args: any[]) => any
>(
  ...args: any[]
) => {
  if (args.length > 1) {
    const [method, context] = args as [
      Method,
      ClassMethodDecoratorContext<This, Method>
    ];
    return apiMethodsDecorator('delete')(method, context);
  }
  const [urlPart] = args as [string];
  return apiMethodsDecorator('delete', urlPart);
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
export const get: HttpMethod = <
  This,
  Method extends (this: This, ...args: any[]) => any
>(
  ...args: any[]
) => {
  if (args.length > 1) {
    const [method, context] = args as [
      Method,
      ClassMethodDecoratorContext<This, Method>
    ];
    return apiMethodsDecorator('get')(method, context);
  }
  const [urlPart] = args as [string];
  return apiMethodsDecorator('get', urlPart);
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
export const patch: HttpMethod = <
  This,
  Method extends (this: This, ...args: any[]) => any
>(
  ...args: any[]
) => {
  if (args.length > 1) {
    const [method, context] = args as [
      Method,
      ClassMethodDecoratorContext<This, Method>
    ];
    return apiMethodsDecorator('patch')(method, context);
  }
  const [urlPart] = args as [string];
  return apiMethodsDecorator('patch', urlPart);
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
export const post: HttpMethod = <
  This,
  Method extends (this: This, ...args: any[]) => any
>(
  ...args: any[]
) => {
  if (args.length > 1) {
    const [method, context] = args as [
      Method,
      ClassMethodDecoratorContext<This, Method>
    ];
    return apiMethodsDecorator('post')(method, context);
  }
  const [urlPart] = args as [string];
  return apiMethodsDecorator('post', urlPart);
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
    const [method, context] = args;
    return apiMethodsDecorator('put')(method, context);
  }
  const [urlPart] = args;
  return apiMethodsDecorator('put', urlPart);
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
      if (context.static) {
        throw new Error(
          'Static methods are not supported for decorating of API'
        );
      }
      if (context.private) {
        throw new Error(
          'Private methods are not supported for decorating of API'
        );
      }

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
        } else if (urlPart) {
          url = urlPart;
        } else if (prefix) {
          const kebabedMethodName = toKebabCase(String(context.name));
          url = concatTwoUrlParts(prefix, kebabedMethodName);
        } else {
          url = toKebabCase(String(context.name));
        }

        // add route to the method name mapping
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
