import { container } from 'cheap-di';
import { Application, Request, Response } from 'express';
import { MvcController, MvcMiddleware } from 'mvc-middleware';
import { api, GET, POST, PUT, PATCH, DELETE } from 'mvc-middleware/stage2';

describe('[class] MvcMiddleware', () => {
  class ExpressMock {
    appRoute: string[] = [];
    application: Pick<Application, 'get' | 'post' | 'put' | 'patch' | 'delete'> = {
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

  test('if there is no thrown error during controller registration', () => {
    class Logger {
      log(message: string) {
        console.log('[my] custom message');
      }
    }
    @api
    class MyController extends MvcController {
      constructor(logger: Logger, request: Request, response: Response) {
        super(request, response);

        // here will be thrown error in controller registration time,
        // because of request and response are not passed -> undefined
        // but this error should be covered by MvcMiddleware
        const message = `${request.method.toUpperCase()}: ${request.url}`;
        logger.log(message);
      }
      @GET
      index() {
        return this.noContent();
      }
    }

    const expressMock = new ExpressMock();
    const middleware = new MvcMiddleware(expressMock.application, container);
    middleware.register(MyController);

    expect(() => middleware.register(MyController)).not.toThrow();
  });

  test('if routes without api prefix are registered correctly', () => {
    @api
    class MyController extends MvcController {
      @GET
      @GET('about')
      @POST('home')
      @PUT('form')
      index() {
        return this.noContent();
      }

      @PATCH('test/:testId')
      test() {
        return this.noContent();
      }

      @DELETE(':userId')
      delete() {
        return this.noContent();
      }
    }

    const output = ['/form', '/home', '/about', '/index', '/test/:testId', '/:userId'].sort();

    const expressMock = new ExpressMock();
    const middleware = new MvcMiddleware(expressMock.application, container);
    middleware.register(MyController);

    expect(expressMock.appRoute.sort()).toEqual(output);
  });

  test('if routes with api prefix are registered correctly', () => {
    @api('/api/test')
    class TestController extends MvcController {
      @GET // /api/test/list
      @GET('form') // /api/test/form
      list() {
        return this.noContent();
      }

      @GET('some/:userId') // /api/test/some/:userId
      user() {
        return this.noContent();
      }
    }

    const output = ['/api/test/form', '/api/test/list', '/api/test/some/:userId'].sort();

    const expressMock = new ExpressMock();
    const middleware = new MvcMiddleware(expressMock.application, container);
    middleware.register(TestController);

    expect(expressMock.appRoute.sort()).toEqual(output);
  });

  describe('action argument passing', () => {
    const expressMock = new ExpressMock();
    const middleware = new MvcMiddleware(expressMock.application, container);

    test('if url params are passed to controller method', () => {
      class MockController extends MvcController {
        doSomething(id: string, name: string, test: any) {
          expect(id).toBe('aaa');
          expect(name).toBe('bbb');
          expect(test).toBe('ccc');
        }
      }

      const endpointHandler = middleware.createEndpointHandler(MockController, 'doSomething');
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

      const endpointHandler = middleware.createEndpointHandler(MockController, 'doSomething');
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

      const endpointHandler = middleware.createEndpointHandler(MockController, 'doSomething');
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

      const endpointHandler = middleware.createEndpointHandler(MockController, 'doSomething');
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
});
