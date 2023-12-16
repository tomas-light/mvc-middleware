import { methodDecorator } from '../decorators/methodDecorator.js';
import type { Stage2Decorator } from './Stage2Decorator.js';

/** GET http method. If it called without argument the method name will be cased to kebab and used as url part.
 * @example
 *   class UserController extends MvcController {
 * ㅤㅤ@GET // some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@GET('my-method') // my-method
 *     doSome() {
 *       // ...
 *     }
 *   }
 *
 * // or with api prefix
 *
 * ㅤ@api('/api/user')
 *   class UserController extends MvcController {
 * ㅤㅤ@GET // /api/user/some-long-name-of-method
 *     someLongNameOfMethod() {
 *       // ...
 *     }
 * ㅤㅤ@GET('my-method') // /api/user/my-method
 *     doSome() {
 *       // ...
 *     }
 * ㅤㅤ@GET(' /another-method ') // /api/user/another-method
 *     doSome2() {
 *       // ...
 *     }
 *   }
 * */
export const GET: Stage2Decorator = ((...args: unknown[]) => {
  return methodDecorator('get')(...args);
}) as Stage2Decorator;
