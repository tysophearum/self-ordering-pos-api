import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DateTime } from 'luxon';

@Schema({
    timestamps: false
})
export class Order {
    @Prop()
    totalPrice: number

    @Prop()
    orderNumber: number

    @Prop({ required: true, enum: ['ញាំក្នុងហាង', 'ខ្ចប់'] })
    type: string

    @Prop({ required: true, enum: ['waiting', 'in progress', 'done'] })
    status: string

    @Prop()
    paymentStatus: string

    @Prop({
        default: () => DateTime.now().setZone('Asia/Phnom_Penh').toFormat('dd-MM-yy HH:mm:ss'),
    })
    createdAt: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order)