export interface Stage2PropertyDecorator {
  (classPrototype: unknown, propertyName: string): void;
}

export interface Stage3PropertyDecorator {
  <This, Args extends unknown[], Return>(
    target: undefined, // is it always undefined for field decorators
    fieldContext: ClassFieldDecoratorContext<This, (this: This, ...args: Args) => Return>
  ): void;
}

export function isStage2PropertyParameters(args: unknown[]): args is Parameters<Stage2PropertyDecorator> {
  return args.length === 2 && typeof args[0] === 'object' && typeof args[1] === 'string';
}

export function isStage3PropertyParameters(args: unknown[]): args is Parameters<Stage3PropertyDecorator> {
  return args.length === 2 && typeof args[0] === 'undefined' && typeof args[1] === 'function';
}
