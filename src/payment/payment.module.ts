import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/order/schema/order.schema';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { OrderService } from 'src/order/order.service';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { Price } from 'src/price/schema/price.schema';
import { OrderModule } from 'src/order/order.module';
import { OrderLine, OrderLineSchema } from 'src/order-line/schema/order-line.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Order.name, schema: OrderSchema}]),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]), 
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{name: Price.name, schema: ProductSchema}]),
    MongooseModule.forFeature([{name: OrderLine.name, schema: OrderLineSchema}]),
    OrderModule
  ],
  providers: [PaymentService, OrderService],
  controllers: [PaymentController],
  exports: [PaymentService]
})
export class PaymentModule {}
