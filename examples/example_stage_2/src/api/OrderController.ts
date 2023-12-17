import { MvcController } from 'mvc-middleware';
import { api, GET, POST } from 'mvc-middleware/stage2';

@api('/api/orders')
export default class OrderController extends MvcController {
  static orders = ['order-1', 'order-2'];

  @GET('') // /api/orders
  async list() {
    return this.ok(OrderController.orders);
  }

  @POST('') // /api/orders
  async addOrder(payload: { orderName: string }) {
    const { orderName } = payload;
    OrderController.orders.push(orderName);

    return this.ok('order is created');
  }
}
// fetch('/api/orders', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({ orderName: 'new-order' }),
// });
