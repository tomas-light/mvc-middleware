import { toKebabCase } from '../utils/toKebabCase';
import {
  ApiMethodsContainer,
  apiMethodsSymbol,
  ConstructorMaybeWithApiMethods,
  ConstructorWithApiMethods,
} from './symbols';

interface HttpMethodWithParameters {
  (urlPart: string): (
    prototype: { constructor: Function },
    methodName: string,
    propertyDescriptor: PropertyDescriptor
  ) => void;
}
interface HttpMethodStraight {
  (
    prototype: { constructor: Function },
    methodName: string,
    propertyDescriptor: PropertyDescriptor
  ): void;
}

interface HttpMethod extends HttpMethodWithParameters, HttpMethodStraight {}

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
    const [prototype, methodName, propertyDescriptor] =
      args as Parameters<HttpMethod>;
    return apiMethodsDecorator('delete')(
      prototype,
      methodName,
      propertyDescriptor
    ) as unknown as HttpMethodStraight;
  }
  const [urlPart] = args as [string];
  return apiMethodsDecorator('delete', urlPart) as HttpMethodStraight;
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
    const [prototype, methodName, propertyDescriptor] =
      args as Parameters<HttpMethod>;
    return apiMethodsDecorator('get')(
      prototype,
      methodName,
      propertyDescriptor
    ) as unknown as HttpMethodStraight;
  }
  const [urlPart] = args as [string];
  return apiMethodsDecorator('get', urlPart) as HttpMethodStraight;
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
    const [prototype, methodName, propertyDescriptor] =
      args as Parameters<HttpMethod>;
    return apiMethodsDecorator('patch')(
      prototype,
      methodName,
      propertyDescriptor
    ) as unknown as HttpMethodStraight;
  }
  const [urlPart] = args as [string];
  return apiMethodsDecorator('patch', urlPart) as HttpMethodStraight;
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
    const [prototype, methodName, propertyDescriptor] =
      args as Parameters<HttpMethod>;
    return apiMethodsDecorator('post')(
      prototype,
      methodName,
      propertyDescriptor
    ) as unknown as HttpMethodStraight;
  }
  const [urlPart] = args as [string];
  return apiMethodsDecorator('post', urlPart) as HttpMethodStraight;
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
    const [prototype, methodName, propertyDescriptor] =
      args as Parameters<HttpMethod>;
    return apiMethodsDecorator('put')(
      prototype,
      methodName,
      propertyDescriptor
    ) as unknown as HttpMethodStraight;
  }
  const [urlPart] = args;
  return apiMethodsDecorator('put', urlPart) as HttpMethodStraight;
};

function apiMethodsDecorator(
  apiMethod: keyof ApiMethodsContainer,
  urlPart?: string
) {
  return (...args: Parameters<HttpMethod>) => {
    const [prototype, methodName, propertyDescriptor] = args;

    const constructorWithApi = initializeApiSymbolInConstructor(
      prototype.constructor as ConstructorMaybeWithApiMethods
    );

    let url: string;
    if (urlPart) {
      url = urlPart;
    } else {
      url = toKebabCase(String(methodName));
    }

    // add route to the method name mapping
    constructorWithApi[apiMethodsSymbol][apiMethod].set(
      url,
      String(methodName)
    );
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
