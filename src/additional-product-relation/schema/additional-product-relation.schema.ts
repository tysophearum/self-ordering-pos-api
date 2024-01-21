import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { AdditionalProduct } from "src/additional-product/schema/additional-product.schema";
import { Product } from "src/product/schema/product.schema";

@Schema({
    timestamps: false
})
export class AdditionalProductRelation {
    @Prop({type: SchemaTypes.ObjectId, ref: Product.name})
    productId: Types.ObjectId

    @Prop({type: SchemaTypes.ObjectId, ref: AdditionalProduct.name})
    additionalProductId: Types.ObjectId
}

export const AdditionalProductRelationSchema = SchemaFactory.createForClass(AdditionalProductRelation)