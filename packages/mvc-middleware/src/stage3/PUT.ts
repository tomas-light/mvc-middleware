import { methodDecorator } from '../decorators/methodDecorator.js';
import type { Stage3Decorator } from './Stage3Decorator.js';

/** PUT http method. If it called without argument the method name will be cased to kebab and used as url part.
 * @example
 *   class UserController extends MvcController {
 * ㅤㅤ@PUT // some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@PUT('my-method') // my-method
 *     doSome() {
 *       // ...
 *     }
 *   }
 *
 * // or with api prefix
 *
 * ㅤ@api('/api/user')
 *   class UserController extends MvcController {
 * ㅤㅤ@PUT // /api/user/some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@PUT('my-method') // /api/user/my-method
 *     doSome() {
 *       // ...
 *     }
 * ㅤㅤ@PUT(' /another-method ') // /api/user/another-method
 *     doSome2() {
 *       // ...
 *     }
 *   }
 * */
export const PUT: Stage3Decorator = ((...args: unknown[]) => {
  return methodDecorator('put')(...args);
}) as Stage3Decorator;
