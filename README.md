# mvc-middleware

Mvc middleware for express like .Net Mvc

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tomas-light/mvc-middleware/blob/HEAD/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/mvc-middleware/latest.svg)](https://img.shields.io/npm/v/mvc-middleware/latest.svg)
[![codecov](https://codecov.io/github/tomas-light/mvc-middleware/branch/main/graph/badge.svg?token=NuAoioGPVD)](https://codecov.io/github/tomas-light/mvc-middleware)

## How to use

```ts
// src/index.ts
import { container } from "cheap-di";
import express, { Router } from 'express';
import { MvcMiddleware } from 'mvc-middleware';

const app = express();

// Path to folder where you have you controllers.
// Middleware will search controlelrs recursively.
// Each file with '.ts' extension and default export and 
//  typeof === 'function', decorated with '@api' will be
//  assumed as controller class.
const controllersPath = path.join(__dirname, "api");

new MvcMiddleware(app, container /* dependency injection */)
  .registerControllers(controllersPath);

// ... run your server ...
```

You may pass any custom DI resolver that implements following contract:
```ts
type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;
type Constructor<T = any> = new (...args: any[]) => T;

type Resolver = <TInstance>(type: Constructor<TInstance> | AbstractConstructor<TInstance>, ...args: any[]) => TInstance | undefined;

interface DependencyResolver {
  /** instantiate by class */
  resolve: Resolver;
}
```

```ts
// src/api/UsersController.ts
import { Request, Response } from 'express';
import { api, get, post } from 'mvc-middleware';

@api('/api/user')
export class UsersController extends MvcController {
  static users: Array<{ id: number, name: string }> = [{
    id: 1,
    name: 'user 1',
  }]

  constructor(request: Request, response: Response) {
    super(request, response);
  }

  // GET: /api/users/list
  @get
  list() {
    return this.ok(UsersController.users);
  }

  // GET: /api/users/:userId
  @get(':userId')
  getById(userIdStr: string) {
    const userId = parseInt(userIdStr, 10);
    const user = UsersController.users.find(user => user.id === userId);
    return this.ok(user);
  }

  // POST: /api/users/add
  @post
  add({ name }: { name: string }) {
    UsersController.users.push({
      id: UsersController.users.length + 1,
      name,
    });
    return this.ok('user is added');
  }
}

export default UsersController;
```

If you want to get query params and body content you have to connect another middlewares, that will handle requests before MvcMiddleware like bellow.

```js
// src/index.ts
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import { MvcMiddleware } from 'mvc-middleware';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// ...
```

### MvcController methods
| Method name         | Response status code | Response type | Arguments                         | Description                                                |
|:-------------------:|:--------------------:|:-------------:|:---------------------------------:|------------------------------------------------------------|
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
