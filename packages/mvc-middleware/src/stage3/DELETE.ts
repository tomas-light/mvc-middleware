import { methodDecorator } from '../decorators/methodDecorator.js';
import type { Stage3Decorator } from './Stage3Decorator.js';

/** DELETE http method. If it called without argument the method name will be cased to kebab and used as url part.
 * @example
 *   class UserController extends MvcController {
 * ㅤㅤ@DELETE // some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@DELETE('my-method') // my-method
 *     doSome() {
 *       // ...
 *     }
 *   }
 *
 * // or with api prefix
 *
 * ㅤ@api('/api/user')
 *   class UserController extends MvcController {
 * ㅤㅤ@DELETE // /api/user/some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@DELETE('my-method') // /api/user/my-method
 *     doSome() {
 *       // ...
 *     }
 * ㅤㅤ@DELETE(' /another-method ') // /api/user/another-method
 *     doSome2() {
 *       // ...
 *     }
 *   }
 * */
export const DELETE: Stage3Decorator = ((...args: unknown[]) => {
  return methodDecorator('delete')(...args);
}) as Stage3Decorator;
