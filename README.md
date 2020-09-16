# mvc-middleware
Mvc middleware for express like .Net Mvc

## How to use

```js
import express, { Router } from 'express';
import { MvcMiddleware } from 'mvc-middleware';

const app = express();
MvcMiddleware.connect(app, Router);

app.listen(3000, 'localhost');
```

By default, place for controllers is `my-project/controllers`. 
You can specify your controller location:

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

## Controller API
`ok` method of `MvcController` returns data with 200 status code. You can pass plain text or object that will be transformed to json.
