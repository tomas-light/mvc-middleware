import { container } from 'cheap-di';
import { Application, Request, Response } from 'express';
import { api } from './decorators/api';
import { delete_, get, patch, post, put } from './decorators/apiMethods';
import { MvcController } from './MvcController';
import { MvcMiddleware } from './MvcMiddleware';

class Logger {
  log(message: string) {
    console.log(`[Log] ${message}`);
  }
}

@api('/api/my')
class MyController extends MvcController {
  static users = ['user-1', 'user-2', 'user-3'];

  constructor(private logger: Logger, request: Request, response: Response) {
    super(request, response);

    const message = `${request.method.toUpperCase()}: ${request.url}`;
    this.logger.log(message);
  }

  @get
  health() {
    return this.noContent();
  }

  @get // api/users
  async users() {
    return this.ok(MyController.users);
  }

  @post // api/add-user
  async addUser(payload: { user: { name: string } }) {
    const {user} = payload;
    MyController.users.push(user.name);

    return this.ok('user is created');
  }

  @post('add-user-new') // api/add-user-new
  async addUserAnotherWay(payload: { user: { name: string } }) {
    const {user} = payload;
    MyController.users.push(user.name);

    return this.ok('user is created with another way');
  }

  @get
  m1() {
  }

  @get('get-m12')
  m12() {
  }

  @post
  m2() {
  }

  @post('post-m22')
  m22() {
  }

  @patch
  m3() {
  }

  @patch('patch-m32')
  m32() {
  }

  @put
  m4() {
  }

  @put('put-42')
  m42() {
  }

  @delete_
  m5() {
  }

  @delete_('delete-m52')
  m52() {
  }
}

class ExpressMock {
  appRoute: string[] = [];
  application: Pick<Application, 'get' | 'post' | 'put' | 'patch' | 'delete'> =
    {
      get: ((route: string) => {
        this.appRoute.push(route);
        return this.application as Application;
      }) as any,
      post: ((route: string) => {
        this.appRoute.push(route);
        return this.application as Application;
      }) as any,
      put: ((route: string) => {
        this.appRoute.push(route);
        return this.application as Application;
      }) as any,
      patch: ((route: string) => {
        this.appRoute.push(route);
        return this.application as Application;
      }) as any,
      delete: ((route: string) => {
        this.appRoute.push(route);
        return this.application as Application;
      }) as any,
    };
}

beforeEach(() => {
  container.clear();
});

test('if routes with api prefix are registered correctly', () => {
  @api
  class MyController extends MvcController {
    @get
    @get('about')
    @get('home')
    @get('form')
    index() {
      return this.noContent();
    }

    @get('test/:testId')
    test() {
      return this.noContent();
    }
  }

  const output = ['/index', '/about', '/home', '/form', '/test/:testId'];

  const expressMock = new ExpressMock();
  const middleware = new MvcMiddleware(expressMock.application, container);
  middleware.register(MyController);

  expect(expressMock.appRoute).toEqual(output);
});

test('if routes with api prefix are registered correctly', () => {
  @api('/test')
  class TestController extends MvcController {
    @get
    @get('form')
    list() {
      return this.noContent();
    }

    @get('some/:userId')
    test() {
      return this.noContent();
    }
  }

  const output = ['/test/list', '/test/form', '/test/some/:userId'];

  const expressMock = new ExpressMock();
  const middleware = new MvcMiddleware(expressMock.application, container);
  middleware.register(TestController);

  expect(expressMock.appRoute).toEqual(output);
});

describe('action argument passing', () => {
  const expressMock = new ExpressMock();
  const middleware = new MvcMiddleware(expressMock.application, container);

  test('if url params are passed to controlelr method', () => {
    class MockController extends MvcController {
      doSomething(id: string, name: string, test: any) {
        expect(id).toBe('aaa');
        expect(name).toBe('bbb');
        expect(test).toBe('ccc');
      }
    }

    const endpointHandler = middleware.createEndpointHandler(
      MockController,
      'doSomething'
    );
    endpointHandler(
      {
        params: {
          id: 'aaa',
          name: 'bbb',
          test: 'ccc',
        },
      } as unknown as Request,
      {} as Response,
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

    const endpointHandler = middleware.createEndpointHandler(
      MockController,
      'doSomething'
    );
    endpointHandler(
      {
        query: {
          id: 'aaa',
          name: 'bbb',
          test: 'ccc',
        },
      } as unknown as Request,
      {} as Response,
      () => undefined
    );
  });

  test('body', () => {
    class MockController {
      doSomething(body: { id: string; name: string; test: any }) {
        expect(body.id).toBe('aaa');
        expect(body.name).toBe('bbb');
        expect(body.test).toBe('ccc');
      }
    }

    const endpointHandler = middleware.createEndpointHandler(
      MockController,
      'doSomething'
    );
    endpointHandler(
      {
        body: {
          id: 'aaa',
          name: 'bbb',
          test: 'ccc',
        },
      } as unknown as Request,
      {} as Response,
      () => undefined
    );
  });

  test('all', () => {
    class MockController {
      doSomething(
        paramId: string,
        paramName: string,
        paramTest: any,
        queryId: string,
        queryName: string,
        queryTest: any,
        body: { id: string; name: string; test: any }
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

    const endpointHandler = middleware.createEndpointHandler(
      MockController,
      'doSomething'
    );
    endpointHandler(
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
      } as unknown as Request,
      {} as Response,
      () => undefined
    );
  });
});
