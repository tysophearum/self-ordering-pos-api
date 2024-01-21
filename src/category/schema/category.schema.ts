import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: false
})
export class Category {
    @Prop()
    name: string

    @Prop()
    description: string

    @Prop()
    image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category)