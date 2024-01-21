import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: false
})
export class AdditionalProduct {
    @Prop()
    name: string

    @Prop()
    price: number

    @Prop()
    image: string
}

export const AdditionalProductSchema = SchemaFactory.createForClass(AdditionalProduct)