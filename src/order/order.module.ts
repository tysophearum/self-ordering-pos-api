import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { Price } from 'src/price/schema/price.schema';
import { OrderGateway } from './order.gateway';
import { OrderLine, OrderLineSchema } from 'src/order-line/schema/order-line.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Order.name, schema: OrderSchema}]),
    MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}]),
    MongooseModule.forFeature([{name: Price.name, schema: ProductSchema}]),
    MongooseModule.forFeature([{name: OrderLine.name, schema: OrderLineSchema}]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderGateway],
  exports: [OrderService, OrderGateway]
})
export class OrderModule {}
