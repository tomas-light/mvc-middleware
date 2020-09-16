import { MvcMiddleware } from './mvc-middleware';
import { IApplication } from "./types/IApplication";
import { IRouter } from "./types/IRouter";

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
        }
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
