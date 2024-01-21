import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { CategoryService } from './category.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class CategoryGateway {
  constructor (private readonly categoryService: CategoryService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('newCategory')
  handleNewCategory(@MessageBody() category) {
    this.server.emit('newCategory', category)
  }

  @SubscribeMessage('changeCategory')
  handleChangeCategory() {
    this.server.emit('changeCategory', this.categoryService.findAll())
  }
}
