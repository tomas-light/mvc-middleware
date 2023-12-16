export interface Stage2MethodDecorator {
  <T extends object>(target: T, methodName: string, descriptor: PropertyDescriptor): void;
}
export interface Stage3MethodDecorator {
  <This, Args extends any[], Return>(
    method: (this: This, ...args: Args) => Return,
    methodContext: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
  ): (this: This, ...args: Args) => Return;
}

export function isStage2MethodParameters(args: unknown[]): args is Parameters<Stage2MethodDecorator> {
  return args.length === 3 && typeof args[0] === 'object' && typeof args[1] === 'string';
}

export function isStage3MethodParameters(args: unknown[]): args is Parameters<Stage3MethodDecorator> {
  return args.length === 2 && typeof args[0] === 'function' && typeof args[1] === 'object';
}
