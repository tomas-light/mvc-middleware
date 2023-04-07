import { ConstructorWithUrlPrefix, urlPrefixSymbol } from './symbols';

type Constructor = new (...args: any[]) => any;

interface Api {
  <T extends Constructor>(constructor: T, context: ClassDecoratorContext<T>): T;

  (urlPrefix: string): <T extends Constructor>(
    constructor: T,
    context: ClassDecoratorContext<T>
  ) => T;
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
export const api: Api = <T extends Constructor>(...args: any[]) => {
  if (args.length === 2) {
    const [constructor, context] = args as [T, ClassDecoratorContext<T>];
    return apiDecorator('')(constructor, context);
  }

  const [urlPrefix] = args as [string];
  return apiDecorator(urlPrefix);
};

const apiDecorator = (urlPrefix: string) => {
  return <T extends Constructor>(
    constructor: T,
    context: ClassDecoratorContext<T>
  ): T => {
    if (context.kind === 'class') {
      (constructor as ConstructorWithUrlPrefix)[urlPrefixSymbol] = urlPrefix;
    }

    return constructor;
  };
};
