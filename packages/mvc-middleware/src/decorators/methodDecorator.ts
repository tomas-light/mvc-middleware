import { ApiMethodsContainer, methodNamesTemporaryBox } from '../constants.js';
import { toKebabCase } from '../utils/toKebabCase.js';
import { isStage2MethodParameters, isStage3MethodParameters } from './StageMethodDecorator';
import { isStage2PropertyParameters, isStage3PropertyParameters } from './StagePropertyDecorator';

export const methodDecorator = (apiMethod: keyof ApiMethodsContainer) => {
  const parameters = {
    url: undefined as string | undefined,
  };

  return (...args: unknown[]) => {
    if (typeof args[0] === 'string') {
      [parameters.url] = args;
      return decorator;
    }

    return decorator(...args);
  };

  function decorator(...args: unknown[]) {
    if (isStage3MethodParameters(args)) {
      const [method, methodContext] = args;

      const methodName = findMethodName(method, methodContext);
      const url = parameters.url ?? toKebabCase(methodName);
      addRouteToMethodNameMapping(apiMethod, url, methodName);

      return method;
    }

    if (isStage2MethodParameters(args)) {
      const [target, methodName] = args;

      const url = parameters.url ?? toKebabCase(methodName);
      addRouteToMethodNameMapping(apiMethod, url, methodName);

      return void 0;
    }

    if (isStage3PropertyParameters(args)) {
      const [target, fieldContext] = args;

      const methodName = fieldContext.name.toString();
      const url = parameters.url ?? toKebabCase(methodName);
      addRouteToMethodNameMapping(apiMethod, url, methodName);

      return void 0;
    }

    if (isStage2PropertyParameters(args)) {
      const [classPrototype, propertyName] = args;

      const url = parameters.url ?? toKebabCase(propertyName);
      addRouteToMethodNameMapping(apiMethod, url, propertyName);

      return void 0;
    }

    throw new TypeError('Passed arguments is not assignable to method or property decorator parameters');
  }
};

// const methodDecorator = (apiMethod: keyof ApiMethodsContainer, urlPart: string | undefined, ...args: unknown[]) => {
//   if (isStage3MethodParameters(args)) {
//     const [method, methodContext] = args;
//
//     const methodName = findMethodName(method, methodContext);
//     const url = urlPart ?? toKebabCase(methodName);
//     addRouteToMethodNameMapping(apiMethod, url, methodName);
//
//     return method;
//   }
//
//   if (isStage2MethodParameters(args)) {
//     const [target, methodName] = args;
//
//     const url = urlPart ?? toKebabCase(methodName);
//     addRouteToMethodNameMapping(apiMethod, url, methodName);
//
//     return void 0;
//   }
//
//   throw new TypeError('Passed arguments is not assignable to method decorator parameters');
// };
//
// const propertyDecorator = (apiMethod: keyof ApiMethodsContainer, urlPart: string | undefined, ...args: unknown[]) => {
//   if (isStage2PropertyParameters(args)) {
//     const [classPrototype, propertyName] = args;
//
//     const url = urlPart ?? toKebabCase(propertyName);
//     addRouteToMethodNameMapping(apiMethod, url, propertyName);
//
//     return void 0;
//   }
//
//   if (isStage3PropertyParameters(args)) {
//     const [target, fieldContext] = args;
//
//     const methodName = fieldContext.name.toString();
//     const url = urlPart ?? toKebabCase(methodName);
//     addRouteToMethodNameMapping(apiMethod, url, methodName);
//
//     return void 0;
//   }
//
//   throw new TypeError('Passed arguments is not assignable to property decorator parameters');
// };

function findMethodName(
  method: (this: unknown, ...args: unknown[]) => unknown,
  methodNameOrContext: string | ClassMethodDecoratorContext<any> | undefined
): string {
  if (typeof methodNameOrContext === 'string') {
    return methodNameOrContext;
  }

  if (typeof methodNameOrContext === 'object') {
    return methodNameOrContext.name.toString();
  }

  return method.name;
}

function addRouteToMethodNameMapping(apiMethod: keyof ApiMethodsContainer, rote: string, methodName: string) {
  methodNamesTemporaryBox[apiMethod].set(rote, methodName);
}
