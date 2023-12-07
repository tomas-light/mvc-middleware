import { Request, Response } from 'express';
import { api, get, MvcController, post } from 'mvc-middleware';

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

  @get
  health() {
    return this.noContent();
  }

  @get // api/users
  async users() {
    return this.ok(UserController.users);
  }

  @post // api/add-user
  async addUser(payload: { user: { name: string } }) {
    const { user } = payload;
    UserController.users.push(user.name);

    return this.ok('user is created');
  }

  @post('add-user-new') // api/add-user-new
  async addUserAnotherWay(payload: { user: { name: string } }) {
    const { user } = payload;
    UserController.users.push(user.name);

    return this.ok('user is created with another way');
  }
}
