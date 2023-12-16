import { Constructor } from 'cheap-di';
import { classDecorator } from '../decorators/classDecorator.js';

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
export const api: Api = ((...args: unknown[]) => {
  return classDecorator(...args);
}) as Api;
