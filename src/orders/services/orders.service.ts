import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { OrderDto, OrderIdRequestParamsDto } from "../dtos/orders.dto";
import { CreateOrderCommand, CreateOrderStartCommand } from "../commands/impl/create-order.command";
import { UpdateOrderCommand } from "../commands/impl/update-order.command";
import { DeleteOrderCommand } from "../commands/impl/delete-order.command";
import { GetOrdersQuery } from "orders/queries/impl/get-orders.query";
import { FindOrderQuery } from "orders/queries/impl/find-order.query";
import { config } from "../../../config";

const stripe = require("stripe")(config.STRIPE_SECRET_KEY);

@Injectable()
export class OrdersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async createOrderStart(streamId: string, orderDto: OrderDto) {
    return await this.commandBus.execute(new CreateOrderStartCommand(streamId, orderDto));
  }

  async createOrder(streamId: string, orderDto: OrderDto) {
    return await this.commandBus.execute(new CreateOrderCommand(streamId, orderDto));
  }

  async updateOrder(streamId: string, orderDto: OrderDto) {
    return await this.commandBus.execute(new UpdateOrderCommand(streamId, orderDto));
  }

  async deleteOrder(streamId: string, orderIdDto: OrderIdRequestParamsDto) {
    return await this.commandBus.execute(new DeleteOrderCommand(streamId, orderIdDto));
  }

  async getOrders(getOrdersQuery: GetOrdersQuery) {
    var query = new GetOrdersQuery();
    Object.assign(query, getOrdersQuery);
    return await this.queryBus.execute(query);
  }

  async findOne(findOrderQuery: FindOrderQuery): Promise<OrderDto> {
    var query = new FindOrderQuery(findOrderQuery.id);
    return await this.queryBus.execute(query);
  }

  async getPaymentIntent(amount: string) {
    return await stripe.paymentIntents.create({
      amount: parseInt(amount),
      currency: 'usd'
    });
  }
}
