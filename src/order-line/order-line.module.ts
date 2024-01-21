import { Module } from '@nestjs/common';
import { OrderLineController } from './order-line.controller';
import { OrderLineService } from './order-line.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderLine, OrderLineSchema } from './schema/order-line.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { Order, OrderSchema } from 'src/order/schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OrderLine.name, schema: OrderLineSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrderLineController],
  providers: [OrderLineService],
  exports: [OrderLineService]
})
export class OrderLineModule {}
