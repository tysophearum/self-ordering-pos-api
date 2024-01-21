import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { OrderService } from './order.service';

@WebSocketGateway()
export class OrderGateway {
  constructor (private readonly orderServise: OrderService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('newOrder')
  async handleNewOrder() {
    const waitingOrders = await this.orderServise.findWaiting('_id', 'asc');
    this.server.emit('newOrder', waitingOrders)
  }


  @SubscribeMessage('inProgressOrder')
  async handleInProgressder() {
    const inProgressOrders = await this.orderServise.findInProgress('_id', 'asc');
    this.server.emit('inProgressOrder', inProgressOrders)
  }


  @SubscribeMessage('doneOrder')
  async handleDoneder() {
    const doneOrders = await this.orderServise.findDone('_id', 'asc', 15);
    this.server.emit('doneOrder', doneOrders)
  }
}
