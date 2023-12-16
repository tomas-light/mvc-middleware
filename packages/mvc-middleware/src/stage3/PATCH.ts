import { methodDecorator } from '../decorators/methodDecorator.js';
import type { Stage3Decorator } from './Stage3Decorator.js';

/** PATCH http method. If it called without argument the method name will be cased to kebab and used as url part.
 * @example
 *   class UserController extends MvcController {
 * ㅤㅤ@PATCH // some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@PATCH('my-method') // my-method
 *     doSome() {
 *       // ...
 *     }
 *   }
 *
 * // or with api prefix
 *
 * ㅤ@api('/api/user')
 *   class UserController extends MvcController {
 * ㅤㅤ@PATCH // /api/user/some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@PATCH('my-method') // /api/user/my-method
 *     doSome() {
 *       // ...
 *     }
 * ㅤㅤ@PATCH(' /another-method ') // /api/user/another-method
 *     doSome2() {
 *       // ...
 *     }
 *   }
 * */
export const PATCH: Stage3Decorator = ((...args: unknown[]) => {
  return methodDecorator('patch')(...args);
}) as Stage3Decorator;
