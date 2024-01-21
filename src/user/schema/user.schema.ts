import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Role } from "src/auth/enums/role.enum";

@Schema({
    timestamps: false
})
export class User extends Document {
    @Prop({
        unique: [true, "This username is already taken"]
    })
    username: string

    @Prop()
    password: string

    @Prop()
    gender: string

    @Prop({ required: true, enum: Object.values(Role) })
    role: string

    @Prop()
    image: string

    @Prop()
    repeat_password: string

    _id: string;

}

export const UserSchema = SchemaFactory.createForClass(User)