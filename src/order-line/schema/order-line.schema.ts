import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Category } from "src/category/schema/category.schema";
import { Order } from "src/order/schema/order.schema";
import { Price } from "src/price/schema/price.schema";
import { Product } from "src/product/schema/product.schema";

@Schema({
    timestamps: false
})
export class OrderLine {
    @Prop({type: SchemaTypes.ObjectId, ref: Product.name})
    productId: Types.ObjectId

    @Prop({type: SchemaTypes.ObjectId, ref: Category.name})
    categoryId: Types.ObjectId

    @Prop({type: SchemaTypes.ObjectId, ref: Order.name})
    orderId: Types.ObjectId

    @Prop({type: SchemaTypes.ObjectId, ref: Price.name})
    priceId: Types.ObjectId

    @Prop()
    additionals: string

    @Prop()
    note: string

    @Prop()
    quantity: number

    @Prop()
    totalPrice: number
}

export const OrderLineSchema = SchemaFactory.createForClass(OrderLine)