import Client from '../database';

export enum OrderStatus {
  Active = 'Active',
  Complete = 'Complete'
}

export type Order = {
  id?: number;
  userid: number;
  quantity: number;
  status: OrderStatus;
  productids: number[];
};

export class OrderStore {
  async userOrders(userId: number): Promise<Order[]> {
    const sql = `
      SELECT o.Id, o.UserId, o.Quantity, o.Status, op.ProductId 
      FROM Orders o
      INNER JOIN OrderProducts op ON (op.OrderId = o.Id)
      WHERE o.UserId = $1
      AND o.Status = $2`;

    const dbRows = await Client.execute(sql, [userId, OrderStatus.Active]);

    const orders: Order[] = [];

    dbRows.rows.forEach((item) => {
      let order = orders.find((o) => o.id == item.id);
      if (!order) {
        order = {
          id: item.id,
          userid: item.userid,
          quantity: item.quantity,
          status: item.status,
          productids: []
        };

        orders.push(order);
      }

      order.productids.push(item.productid);
    });

    return orders;
  }
}
