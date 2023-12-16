import { Request, Response } from 'express';
import { MvcController } from 'mvc-middleware';
import { api, GET, POST } from 'mvc-middleware/stage3';

class Logger {
  log(message: string) {
    console.log(`[Log] ${message}`);
  }
}

@api('/api/my')
export default class UserController extends MvcController {
  static users = ['user-1', 'user-2', 'user-3'];

  constructor(
    private logger: Logger,
    request: Request,
    response: Response
  ) {
    super(request, response);

    const message = `${request.method.toUpperCase()}: ${request.url}`;
    this.logger.log(message);
  }

  @GET // api/my/health
  health() {
    return this.noContent();
  }

  @GET // api/my/users
  async users() {
    return this.ok(UserController.users);
  }

  @POST // api/my/add-user
  async addUser(payload: { user: { name: string } }) {
    const { user } = payload;
    UserController.users.push(user.name);

    return this.ok('user is created');
  }

  @POST('add-user-new') // api/my/add-user-new
  async addUserAnotherWay(payload: { user: { name: string } }) {
    const { user } = payload;
    UserController.users.push(user.name);

    return this.ok('user is created with another way');
  }
}
// fetch('/api/my/add-user-new', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({ user: { name: 'my-new-user' } }),
// });
