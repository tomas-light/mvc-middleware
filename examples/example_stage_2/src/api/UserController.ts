import { Request, Response } from 'express';
import { MvcController } from 'mvc-middleware';
import { api, GET, POST } from 'mvc-middleware/stage2';
import { Logger } from '../Logger';

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

  @GET
  health() {
    return this.noContent();
  }

  @GET // api/users
  async users() {
    return this.ok(UserController.users);
  }

  @POST // api/add-user
  async addUser(payload: { user: { name: string } }) {
    const { user } = payload;
    UserController.users.push(user.name);

    return this.ok('user is created');
  }

  @POST('add-user-new') // api/add-user-new
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
