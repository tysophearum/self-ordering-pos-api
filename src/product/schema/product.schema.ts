import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Category } from "src/category/schema/category.schema";

@Schema({
    timestamps: false
})
export class Product {
    @Prop({ type: SchemaTypes.ObjectId, ref: Category.name })
    categoryId: Types.ObjectId

    @Prop()
    name: string

    @Prop()
    price: number

    @Prop()
    image: string

    @Prop({ required: true, enum: ['true', 'false'] })
    show: string
}

export const ProductSchema = SchemaFactory.createForClass(Product)