import { MvcController } from 'mvc-middleware';
import { api, GET, POST } from 'mvc-middleware/stage2';

@api('/api/my')
export default class UserController extends MvcController {
  static users = ['user-1', 'user-2', 'user-3'];

  @GET
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
