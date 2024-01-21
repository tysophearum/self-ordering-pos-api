import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderLine } from './schema/order-line.schema';
import { CreateOrderLineDto } from './dto/createOrderLine.dto';
import { Product } from 'src/product/schema/product.schema';
import { Order } from 'src/order/schema/order.schema';

@Injectable()
export class OrderLineService {
    constructor(
      @InjectModel(OrderLine.name) private orderLineModel,
      @InjectModel(Product.name) private productModel,
      @InjectModel(Order.name) private orderModel,
    ) { }

    async createOrderLine(orderDto: CreateOrderLineDto): Promise<OrderLine>{
        try {
            let product = await this.productModel.findById(orderDto.productId);
            
            return this.orderLineModel.create({
                productId: orderDto.productId,
                priceId: orderDto.priceId,
                orderId: orderDto.orderId,
                categoryId: product.categoryId.toString(),
                additionals: orderDto.additionals,
                note: orderDto.note,
                quantity: orderDto.quantity,
                totalPrice: orderDto.totalPrice
            })
        } catch (error) {
            throw new HttpException(error, 400) 
        }
    }

    async deleteOrderLinesByOrder(orderId: string): Promise<any>{
        try {
            await this.orderLineModel.deleteMany({orderId: orderId})
            return {
                success: true,
                message: "Order lines was deleted"
            }
        } catch (error) {
            throw new HttpException(error, 400) 
        }
    }

    async deleteOrderLine(id: string): Promise<any>{
        try {
            let orderLine = await this.orderLineModel.findById(id)
            let order = await this.orderModel.findById(orderLine.orderId)
            order.totalPrice = order.totalPrice - orderLine.totalPrice
            await order.save()
            await orderLine.deleteOne()
            return {
                success: true,
                message: "Order lines was deleted"
            }
        } catch (error) {
            throw new HttpException(error, 400) 
        }
    }
}
