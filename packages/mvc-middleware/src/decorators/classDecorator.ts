import { Constructor } from 'cheap-di';
import { ApiMethodsContainer, clearTemporaryBox, copyTemporaryBox } from '../constants.js';
import { apiSymbol, type PatchedConstructor } from '../symbols.js';
import { concatTwoUrlParts } from '../utils/concatTwoUrlParts.js';

export function classDecorator(...args: unknown[]) {
  const parameters = {
    urlPrefix: undefined as string | undefined,
  };

  if (isStringParameters(args)) {
    [parameters.urlPrefix] = args;
    return decorator;
  }

  const [patchedConstructor] = args as [PatchedConstructor];
  return decorator(patchedConstructor);

  function decorator(constructor: PatchedConstructor) {
    const apiMethods = copyTemporaryBox();
    clearTemporaryBox();

    function addPrefixToEachMethod(map: Map<string, string>): Map<string, string> {
      const newMap = new Map<string, string>();
      for (const [url, methodName] of map.entries()) {
        const urlWithPrefix = concatTwoUrlParts(parameters.urlPrefix, url);
        newMap.set(urlWithPrefix, methodName);
      }
      return newMap;
    }

    Object.entries(apiMethods).forEach(([httpMethod, map]) => {
      apiMethods[httpMethod as keyof ApiMethodsContainer] = addPrefixToEachMethod(map);
    });

    constructor[apiSymbol] = apiMethods;

    return constructor;
  }
}

function isStringParameters(args: unknown[]): args is [string] {
  return args.length === 1 && typeof args[0] === 'string';
}
