# mvc-middleware

Mvc middleware for express like .Net Mvc

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tomas-light/mapper-js/blob/HEAD/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@tomas-light/mapper-js/latest.svg)](https://img.shields.io/npm/v/@tomas-light/mapper-js/latest.svg)
[![codecov](https://codecov.io/github/tomas-light/mapper-js/branch/main/graph/badge.svg?token=NuAoioGPVD)](https://codecov.io/github/tomas-light/mapper-js)

## How to use

`index.js`
```js
import express, { Router } from 'express';
import { MvcMiddleware } from 'mvc-middleware';

const app = express();
MvcMiddleware.connect(app, Router);

app.listen(3000, 'localhost');
```

By default, place for controllers is `my-project/controllers`. 
You can specify your controller location:

`index.js`
```js
import express, { Router } from 'express';
import { MvcMiddleware } from 'mvc-middleware';

const app = express();

const directoryPath = path.join(__dirname, 'src', 'some-folder', 'controllers');
new MvcMiddleware(app, Router)
    .registerControllers(directoryPath)
    .run();

app.listen(3000, 'localhost');
```

Controller sample:

`my-project/controllers/users-controller.js`
```js
import { UserService } from '../domain/users';
import { ControllerBase } from './base/controller-base';

export class UsersController extends MvcController {
    static area = '/users';
    static get = {
        '/api/users/list': 'list',
        '/api/users/:userId': 'getById',

        '/users': 'userListPage',
        ':userId': 'userPage',
    }
    static post = {
        '/api/users/add': 'add',
    }

    constructor(request, response) {
        super(request, response);

        this.users = [{
            id: 1,
            name: 'user 1',        
        }];
    }

    // GET: /users
    userListPage() {
        return this.view('list');
    }

    // GET: /users/:userId
    userPage(userId) {
        return this.view('user');
    }

    // GET: /api/users/list
    list() {
        return this.ok(this.users);
    }

    // GET: /api/users/:userId
    getById(userId) {
        const user = this.users.find(user => user.id === userId);
        return this.ok(user);
    }

    // POST: /api/users/add
    add({ name }) {
        this.users.push({
            id: this.users.length + 1,
            name,
        });
        return this.ok('user is added');
    }
}

export default UsersController;
```

Default paths for views is `my-project/public/views/*.html` and `my-project/public/views/<controller area>/*.html`. 
You change it by overriding `getViewPath(viewName, area)` method of `MvcController`.


If you want to get query params and body content you should use connect another middleware, that will handle requests before MvcMiddleware like bellow.

`index.js`
```js
import path from 'path';
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import { MvcMiddleware } from 'mvc-middleware';

const app = express();

const rootPath = path.join(__dirname, 'public');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));

MvcMiddleware.connect(app, Router, container);

app.listen(3000, 'localhost');
```

## Dependency injection
You can connect any container to resolve your dependencies, that provide follow contract:
```ts
export interface IDependencyResolver {
    resolve: (type: InstanceType<any>, ...args: any[]) => InstanceType<any>;
}
```

for example how it looks with `cheap-di`

`index.js`
```js
import path from 'path';
import express, { Router } from 'express';
import { MvcMiddleware } from 'mvc-middleware';
import { container } from 'cheap-di';

import { Logger } from './logger';
import { ConsoleLogger } from './console-logger';

container.registerType(ConsoleLogger).as(Logger);

const app = express();

//other middlewares
// ...

MvcMiddleware.connect(app, Router, container);

app.listen(3000, 'localhost');
```

`users-controller.js`
```js
import { UserService } from '../domain/users';
import { ControllerBase } from './base/controller-base';

export class UsersController extends MvcController {
    static get = {
        '/users': 'userListPage',
    }

    static __constructorParams = [ Logger ];

    constructor(logger, request, response) {
        super(request, response);
        this.logger = logger;
    }

    userListPage() {
        this.logger.log('request to user list');
        return this.view('list');
    }
}

export default UsersController;
```

`logger.js`
```js
class Logger {
    constructor() {
        if (new.target === Logger) {
            throw new TypeError('Cannot construct Logger instances directly');
        }
    }

    log(message) {
        throw new Error("Not implemented");
    }
}

export { Logger };
```

`console-logger.js`
```js
import { Logger } from './logger';

class ConsoleLogger extends Logger {
    log(message) {
        console.log(message);
    }
}

export { ConsoleLogger };

```

## Controller API
| Method name         | Response status code | Response type | Arguments                         | Description                                                |
|:-------------------:|:--------------------:|:-------------:|:---------------------------------:|------------------------------------------------------------|
| `view`              | 200                  | html          | `viewName:  string`               | returns html view by name (using of  `getViewPath` method) |
| `ok`                | 200                  | text or json  | `model?:  any`                    | returns 200 status code with data                          |
| `created`           | 201                  | text or json  | `model?:  any`                    | returns 201 status code with data                          |
| `accepted`          | 202                  | text or json  | `model?:  any`                    | returns 202 status code with data                          |
| `noContent`         | 204                  | -             | -                                 | returns 204 status code                                    |
|                     |                      |               |                                   |                                                            |
| `found`             | 302                  | text          | `url: string`                     | returns 302 status code                                    |
| `permanentRedirect` | 308                  | text          | `url: string`                     | returns 308 status code                                    |
| `redirect`          | 300 - 308            | text          | `statusCode: number, url: string` | returns redirection status code                            |
|                     |                      |               |                                   |                                                            |
| `badRequest`        | 400                  | text or json  | `model?:  any`                    | returns 400 status code with data                          |
| `unauthorized`      | 401                  | text or json  | `model?:  any`                    | returns 401 status code with data                          |
| `forbid`            | 403                  | -             | `model?:  any`                    | returns 403 status code                                    |
| `notFound`          | 404                  | text or json  | `model?:  any`                    | returns 404 status code with data                          |
| `conflict`          | 409                  | text or json  | `model?:  any`                    | returns 409 status code with data                          |
|                     |                      |               |                                   |                                                            |
| `serverError`       | 500                  | text          | `message?:  any`                  | returns 500 status code with error message                 |
| `sendResponse`      | any http status code | text          | `model: any, statusCode?: number` | returns status code with data. Default status code is 200  |
