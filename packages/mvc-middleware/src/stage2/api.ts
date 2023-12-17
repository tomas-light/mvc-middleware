import { Constructor } from 'cheap-di';
import { classDecorator } from '../decorators/classDecorator.js';

interface Api {
  <T, TConstructor extends Constructor<T>>(constructor: TConstructor): TConstructor;
  (urlPrefix: string): <T, TConstructor extends Constructor<T>>(constructor: TConstructor) => TConstructor;
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
