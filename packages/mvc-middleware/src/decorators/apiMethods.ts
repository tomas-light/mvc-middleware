import { ApiMethodsContainer, methodNamesTemporaryBox } from '../constants.js';
import { toKebabCase } from '../utils/toKebabCase.js';

interface HttpMethodWithParameters {
  (
    urlPart: string
  ): <This, Args extends any[], Return>(
    method: (this: This, ...args: Args) => Return,
    methodContext: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
  ) => (this: This, ...args: Args) => Return;
}

interface HttpMethodStraight {
  <This, Args extends any[], Return>(
    method: (this: This, ...args: Args) => Return,
    methodContext: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
  ): (this: This, ...args: Args) => Return;
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
export const delete_: HttpMethod = ((...args: any[]) => {
  if (args.length > 1) {
    const [method, context] = args as Parameters<HttpMethod>;
    return apiMethodsDecorator('delete')(method, context) as unknown as HttpMethodStraight;
  }

  const [urlPart] = args as [string];
  return apiMethodsDecorator('delete', urlPart) as HttpMethodStraight;
}) as HttpMethod;

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
export const get: HttpMethod = ((...args: any[]) => {
  if (args.length > 1) {
    const [method, context] = args as Parameters<HttpMethod>;
    return apiMethodsDecorator('get')(method, context) as unknown as HttpMethodStraight;
  }
  const [urlPart] = args as [string];
  return apiMethodsDecorator('get', urlPart) as HttpMethodStraight;
}) as HttpMethod;

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
export const patch: HttpMethod = ((...args: any[]) => {
  if (args.length > 1) {
    const [method, context] = args as Parameters<HttpMethod>;
    return apiMethodsDecorator('patch')(method, context) as unknown as HttpMethodStraight;
  }
  const [urlPart] = args as [string];
  return apiMethodsDecorator('patch', urlPart) as HttpMethodStraight;
}) as HttpMethod;

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
export const post: HttpMethod = ((...args: any[]) => {
  if (args.length > 1) {
    const [method, context] = args as Parameters<HttpMethod>;
    return apiMethodsDecorator('post')(method, context) as unknown as HttpMethodStraight;
  }
  const [urlPart] = args as [string];
  return apiMethodsDecorator('post', urlPart) as HttpMethodStraight;
}) as HttpMethod;

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
export const put: HttpMethod = ((...args: any[]) => {
  if (args.length > 1) {
    const [method, context] = args as Parameters<HttpMethod>;
    return apiMethodsDecorator('put')(method, context) as unknown as HttpMethodStraight;
  }
  const [urlPart] = args;
  return apiMethodsDecorator('put', urlPart) as HttpMethodStraight;
}) as HttpMethod;

function apiMethodsDecorator(apiMethod: keyof ApiMethodsContainer, urlPart?: string): HttpMethodStraight {
  return (method) => {
    let url: string;
    if (urlPart) {
      url = urlPart;
    } else {
      url = toKebabCase(method.name);
    }

    // add route to the method name mapping
    methodNamesTemporaryBox[apiMethod].set(url, method.name);

    return method;
  };
}
