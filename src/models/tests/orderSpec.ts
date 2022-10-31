import Client from '../../database';
import { Order, OrderStatus, OrderStore } from '../orders';
import { ProductStore } from '../product';
import { UserStore } from '../user';

const sutOrderStore = new OrderStore();
const productStore = new ProductStore();
const userStore = new UserStore();

describe('Product Store Tests', () => {
  it('Should user current orders', async () => {
    // Arrange
    const product1 = await productStore.create({
      name: 'product 1',
      price: '20.75'
    });

    const product2 = await productStore.create({
      name: 'product 2',
      price: '20.75'
    });

    const user = await userStore.create({
      firstname: 'user',
      lastname: 'test',
      email: 'user@email.com',
      password: 'pass'
    });

    const order = (
      await Client.execute<Order>(
        'INSERT INTO Orders (Quantity, UserId, Status) VALUES ($1,$2,$3) RETURNING *',
        [20, user.id, OrderStatus.Active]
      )
    ).rows[0];

    await Client.execute(
      'INSERT INTO OrderProducts (OrderId, ProductId) VALUES ($1,$2), ($1, $3)',
      [order.id, product1.id, product2.id]
    );

    // Act
    const result = await sutOrderStore.userOrders(user.id ?? 0, order.status);

    // Assert
    expect(result).toEqual([
      {
        id: order.id,
        userid: user.id ?? 0,
        quantity: order.quantity,
        status: order.status,
        productids: [product1.id ?? 0, product2.id ?? 0]
      }
    ]);
  });
});
