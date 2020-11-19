import { MvcMiddleware } from './mvc-middleware';
import { IApplication } from './types/IApplication';
import { IRouter } from './types/IRouter';

class Tester {
  private readonly router: string[];
  appRoute: string[];
  mockApp: IApplication;

  constructor() {
    this.appRoute = [];
    this.router = [];
    this.mockApp = {
      use: (areaOrRouter: string | IRouter, _router?: IRouter) => {
        if (_router) {
          this.router.forEach(route => this.appRoute.push(`${areaOrRouter}${route}`));
        }
        else {
          this.router.forEach(route => this.appRoute.push(route));
        }
      },
      get: (route: string) => {
        this.appRoute.push(route);
      },
      post: (route: string) => {
        this.appRoute.push(route);
      },
      put: (route: string) => {
        this.appRoute.push(route);
      },
      patch: (route: string) => {
        this.appRoute.push(route);
      },
      delete: (route: string) => {
        this.appRoute.push(route);
      },
    };

    this.createMockRouter = this.createMockRouter.bind(this);
  }

  createMockRouter(): IRouter {
    return {
      get: (route: string) => {
        this.router.push(route);
      },
      post: (route: string) => {
        this.router.push(route);
      },
      put: (route: string) => {
        this.router.push(route);
      },
      patch: (route: string) => {
        this.router.push(route);
      },
      delete: (route: string) => {
        this.router.push(route);
      },
      stack: this.router,
    };
  };
}

test('root routing', () => {
  const mockController = {
    area: undefined,
    get: {
      '/': '',
      'index': '',
      'about': '',
      'home': '',
      'form': '',
      'test/:testId': '',
    },
  };

  const output = [
    '/',
    '/index',
    '/about',
    '/home',
    '/form',
    '/test/:testId',
  ];

  const tester = new Tester();
  const middleware = new MvcMiddleware(tester.mockApp, tester.createMockRouter);
  middleware.register(mockController);

  expect(tester.appRoute).toEqual(output);
});

test('root area routing', () => {
  const mockController = {
    area: '/test',
    get: {
      'list': '',
      'some/:userId': '',
    },
  };

  const output = [
    '/test/list',
    '/test/some/:userId',
  ];

  const tester = new Tester();
  const middleware = new MvcMiddleware(tester.mockApp, tester.createMockRouter);
  middleware.register(mockController);

  expect(tester.appRoute).toEqual(output);
});

test('root area routing (api + pages)', () => {
  const mockController = {
    area: '/users',
    get: {
      '/api/users/list': '',
      '/api/users/:userId': '',
      '/users': '',
      ':userId': '',
    },
  };

  const output = [
    '/api/users/list',
    '/api/users/:userId',
    '/users',
    '/users/:userId',
  ];

  const tester = new Tester();
  const middleware = new MvcMiddleware(tester.mockApp, tester.createMockRouter);
  middleware.register(mockController);

  expect(tester.appRoute).toEqual(output);
});

describe('action argument passing', () => {
  const tester = new Tester();
  const middleware = new MvcMiddleware(tester.mockApp, tester.createMockRouter);

  test('params', () => {
    class MockController {
      doSomething(id: string, name: string, test: any) {
        expect(id).toBe('aaa');
        expect(name).toBe('bbb');
        expect(test).toBe('ccc');
      }
    }

    middleware.createMiddleware(MockController, 'doSomething')(
      {
        params: {
          id: 'aaa',
          name: 'bbb',
          test: 'ccc',
        },
      } as any,
      {} as any,
      () => undefined
    );
  });

  test('query', () => {
    class MockController {
      doSomething(id: string, name: string, test: any) {
        expect(id).toBe('aaa');
        expect(name).toBe('bbb');
        expect(test).toBe('ccc');
      }
    }

    middleware.createMiddleware(MockController, 'doSomething')(
      {
        query: {
          id: 'aaa',
          name: 'bbb',
          test: 'ccc',
        },
      } as any,
      {} as any,
      () => undefined
    );
  });

  test('body', () => {
    class MockController {
      doSomething(body: { id: string, name: string, test: any }) {
        expect(body.id).toBe('aaa');
        expect(body.name).toBe('bbb');
        expect(body.test).toBe('ccc');
      }
    }

    middleware.createMiddleware(MockController, 'doSomething')(
      {
        body: {
          id: 'aaa',
          name: 'bbb',
          test: 'ccc',
        },
      } as any,
      {} as any,
      () => undefined
    );
  });

  test('all', () => {
    class MockController {
      doSomething(
        paramId: string, paramName: string, paramTest: any,
        queryId: string, queryName: string, queryTest: any,
        body: { id: string, name: string, test: any }
      ) {
        expect(paramId).toBe('p-aaa');
        expect(paramName).toBe('p-bbb');
        expect(paramTest).toBe('p-ccc');

        expect(queryId).toBe('q-aaa');
        expect(queryName).toBe('q-bbb');
        expect(queryTest).toBe('q-ccc');

        expect(body.id).toBe('aaa');
        expect(body.name).toBe('bbb');
        expect(body.test).toBe('ccc');
      }
    }

    middleware.createMiddleware(MockController, 'doSomething')(
      {
        params: {
          paramId: 'p-aaa',
          paramName: 'p-bbb',
          paramTest: 'p-ccc',
        },
        query: {
          queryId: 'q-aaa',
          queryName: 'q-bbb',
          queryTest: 'q-ccc',
        },
        body: {
          id: 'aaa',
          name: 'bbb',
          test: 'ccc',
        },
      } as any,
      {} as any,
      () => undefined
    );
  });
});
