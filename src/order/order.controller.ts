import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderStatusDto } from './dto/updateStatus.dto';
import { Roles } from 'src/auth/middlewares/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { OrderGateway } from './order.gateway';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService, private orderGateway: OrderGateway) {}

    @Post('create')
    async create(@Body() order: CreateOrderDto): Promise<Order> {
        const newOrder = await this.orderService.createOrder(order)

        // this.orderGateway.handleNewOrder()

        return newOrder
    }

    @Get('emit')
    async emitNewOrder(): Promise<String> {
      
      this.orderGateway.handleNewOrder()

      return "New order emitted";
    }

    @Get('id/:id')
    async getOrderById(@Param('id') id: string): Promise<Order> {
      const order = await this.orderService.findById(id);

      if (!order) {
        throw new NotFoundException(`Order not found for id: ${id}`);
      }

      return order;
    }

    @Get('all')
    async findAll(
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
      ): Promise<Order[]> {
        return this.orderService.findAll(sortField, sortOrder)
    }

    @Get('dine-in')
    async findDineIn(
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
      ): Promise<Order[]> {
        return this.orderService.findDineIn(sortField, sortOrder)
    }

    @Get('take-out')
    async findTakeOut(
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
      ): Promise<Order[]> {
        return this.orderService.findTakeOut(sortField, sortOrder)
    }

    @Put('status')
    @Roles(Role.User)
    async updateStatus(@Body() updatedStatus: UpdateOrderStatusDto): Promise<Order> {
      const updatedOrder = this.orderService.updateStatus(updatedStatus)
      if ((await updatedOrder).status == 'done') {
        this.orderGateway.handleInProgressder()
        this.orderGateway.handleDoneder()
      }
      return updatedOrder
    }

    @Get('status/waiting')
    async findWaiting(
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
        @Query('amount') amount: number,
      ): Promise<Order[]> {
        return this.orderService.findWaiting(sortField, sortOrder, amount)
    }

    @Get('status/in-progress')
    async findInProgress(
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
        @Query('amount') amount: number,
      ): Promise<Order[]> {
        return this.orderService.findInProgress(sortField, sortOrder, amount)
    }

    @Get('status/done')
    async findDone(
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
        @Query('amount') amount: number,
      ): Promise<Order[]> {
        return this.orderService.findDone(sortField, sortOrder, amount)
    }

    @Get('number')
    async findOrderNumber(
        @Query('orderId') orderId: string,
      ): Promise<Order[]> {
        let order = await this.orderService.findOrder(orderId)
        return order.orderNumber
    }
    
    @Delete('/:id')
    @Roles(Role.User)
    async deleteOrder(@Param() param: any) {
        const data = await this.orderService.deleteOrder(param.id)
        return data
    }
}
