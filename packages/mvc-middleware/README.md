# mvc-middleware

Mvc middleware for express like .Net Mvc

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tomas-light/mvc-middleware/blob/HEAD/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/mvc-middleware/latest.svg)](https://img.shields.io/npm/v/mvc-middleware/latest.svg)
[![codecov](https://codecov.io/github/tomas-light/mvc-middleware/branch/main/graph/badge.svg?token=NuAoioGPVD)](https://codecov.io/github/tomas-light/mvc-middleware)

* [Installation](#installation)
* [How to use](#how-to-use)
  * [Dependency injection](#dependency-injection)
  * [Decorators](#decorators)
  * [MvcController methods](#methods)
  * [More examples](#more-examples)

## <a name="installation"></a> Installation

```shell
npm i mvc-middleware
```

## <a name="how-to-use"></a> How to use

```ts
// src/index.ts
import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { MvcMiddleware } from 'mvc-middleware';
import path from 'path';

// Path to folder where you have your controllers.
// Middleware will search controllers recursively.
// Each file with '.ts' extension and default export and 
//  typeof === 'function', decorated with '@api' will be
//  assumed as controller class.
const controllersPath = path.join(__dirname, 'api');

const expressApp = express();
expressApp.use(cors()).use(json());

const mvcMiddleware = new MvcMiddleware(expressApp);

(async () => {
  await mvcMiddleware.registerControllers(controllersPath);

  http
    .createServer(expressApp)
    .listen(80, 'localhost');
})();
```
```ts
// src/api/UsersApi.ts
import { MvcController } from 'mvc-middleware';

@api('/api')
export default class UsersApi extends MvcController {
  @GET // api/users
  users() {
    return this.ok(['user-1', 'user-2', 'user-3']);
  }
}
```
```ts
// src/api/ArticlesApi.ts
import { MvcController } from 'mvc-middleware';

@api('/api')
export default class ArticlesApi extends MvcController {
  @GET // articles
  async articles() {
    const articles = await Promise.resolve(['article-1', 'article-2']);
    return this.ok(articles);
  }
}
```

## <a name="dependency-injection"></a> Dependency injection

We recommend to use <a href="https://github.com/tomas-light/cheap-di/tree/master/packages/cheap-di">cheap-di</a> package to handle your dependency injection:

```ts
import { container } from 'cheap-di';
import express from 'express';

const expressApp = express();
const mvcMiddleware = new MvcMiddleware(expressApp, container);
// ...
```

You may pass any custom DI resolver that implements the following contract:
```ts
type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;
type Constructor<T = any> = new (...args: any[]) => T;

type Resolver = <TInstance>(type: Constructor<TInstance> | AbstractConstructor<TInstance>, ...args: any[]) => TInstance | undefined;

interface DependencyResolver {
  /** instantiate by class */
  resolve: Resolver;
}
```


## <a name="decorators"></a> Decorators

We have two sets of decorators: for stage 2 (legacy) and stage 3 proposals. You may choose one of them with imports:
```ts
import { api, GET, POST, PUT, PATCH, DELETE } from 'mvc-middleware/stage2';
import { api, GET, POST, PUT, PATCH, DELETE } from 'mvc-middleware/stage3';
```

| decorator | description                                                                | variants of using                                                             |
|-----------|----------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| api       | collect method names and types (get/post/...) and concat prefix to is urls | `@api`<br>`@api('api')`<br>`@api('/api/domain')`                              |
| GET       | marks method as handler for GET request, can change handled url            | `@GET`<br>`@GET('')`<br>`@GET('my-route')`<br>`@GET('/my-route')`             |
| POST      | marks method as handler for GET request, can change handled url            | `@POST`<br>`@POST('')`<br>`@POST('my-route')`<br>`@POST('/my-route')`         |
| PUT       | marks method as handler for PUT request, can change handled url            | `@PUT`<br>`@PUT('')`<br>`@PUT('my-route')`<br>`@PUT('/my-route')`             |
| PATCH     | marks method as handler for PATCH request, can change handled url          | `@PATCH`<br>`@PATCH('')`<br>`@PATCH('my-route')`<br>`@PATCH('/my-route')`     |
| DELETE    | marks method as handler for DELETE request, can change handled url         | `@DELETE`<br>`@DELETE('')`<br>`@DELETE('my-route')`<br>`@DELETE('/my-route')` |


## <a name="methods"></a> MvcController methods
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

## <a name="more-examples"></a> More examples

```ts
// src/api/UsersController.ts
import { Request, Response } from 'express';
import { api, GET, POST } from 'mvc-middleware/stage2';

@api('/api/users')
export default class UsersController extends MvcController {
  static users = [{
    id: 1,
    name: 'user 1',
  }]

  // GET: /api/users
  @GET('')
  list() {
    return this.ok(UsersController.users);
  }

  // GET: /api/users/:userId
  @GET(':userId')
  getById(stringId: string) {
    const userId = parseInt(stringId, 10);
    const user = UsersController.users.find(user => user.id === userId);
    return this.ok(user);
  }

  // POST: /api/users
  @POST('')
  add({ name }: { name: string }) {
    UsersController.users.push({
      id: UsersController.users.length + 1,
      name,
    });
    return this.ok('user is added');
  }
}
```

If you want to get query params and body content, you have to connect another middleware that will handle requests before MvcMiddleware like below.

```js
// src/index.ts
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import { MvcMiddleware } from 'mvc-middleware';

const expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded());

const mvcMiddleware = new MvcMiddleware(expressApp, container);
// ...
```