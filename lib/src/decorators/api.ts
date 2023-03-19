import { ConstructorWithUrlPrefix, urlPrefixSymbol } from './symbols';

interface Api {
  <T extends abstract new (...args: any) => any>(
    constructor: T,
    context: ClassDecoratorContext<T>
  ): T;

  (urlPrefix: string): <T extends abstract new (...args: any) => any>(
    constructor: T,
    context: ClassDecoratorContext<T>
  ) => T;
}

export const api: Api = (...args: any[]) => {
  if (args.length === 2) {
    return apiDecorator('')(args[0], args[1]);
  }

  return apiDecorator(args[0]);
};

const apiDecorator = (urlPrefix: string) => {
  return <T extends abstract new (...args: any) => any>(
    constructor: T,
    context: ClassDecoratorContext<T>
  ) => {
    if (context.kind === 'class') {
      (constructor as ConstructorWithUrlPrefix)[urlPrefixSymbol] = urlPrefix;
    }
    return constructor;
  };
};
