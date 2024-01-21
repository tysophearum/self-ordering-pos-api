import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Order } from 'src/order/schema/order.schema';

@Schema({
  timestamps: false,
})
export class Payment {
  @Prop({ type: SchemaTypes.ObjectId, ref: Order.name })
  orderId: Types.ObjectId;

  @Prop()
  payment_intent_id: string;

  @Prop()
  payment_status: string;

  @Prop()
  reason: string
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
