import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { OrderLineService } from './order-line.service';
import { CreateOrderLineDto } from './dto/createOrderLine.dto';
import { OrderLine } from './schema/order-line.schema';

@Controller('order-line')
export class OrderLineController {
    constructor (private orderLineService: OrderLineService) {}

    @Post('create')
    async create(@Body() orderLine: CreateOrderLineDto): Promise<OrderLine> {
        const newOrderLine = await this.orderLineService.createOrderLine(orderLine)
        return newOrderLine
    }

    @Delete('order/:orderId')
    async deleteByOrder(@Param() param: any) {
        return this.orderLineService.deleteOrderLinesByOrder(param.orderId)
    }

    @Delete('/:id')
    async deleteOrderLine(@Param() param: any) {
        return this.orderLineService.deleteOrderLine(param.id)
    }
}
