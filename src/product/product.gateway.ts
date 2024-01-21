import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ProductService } from './product.service';
import { Server } from 'http';

@WebSocketGateway()
export class ProductGateway {
  constructor (private readonly productService: ProductService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('newProduct')
  handleNewProduct(@MessageBody() product) {
    this.server.emit('newProduct', product)
  }

  @SubscribeMessage('changeProduct')
  async handleChangeProduct() {
    this.server.emit('changeProduct', await this.productService.showVisible())
  }
}
