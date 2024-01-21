import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import * as bcrypt from 'bcrypt';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string
    
    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    gender: string

    @IsString()
    @IsNotEmpty()
    readonly role: string

    @IsOptional()
    readonly image: any

    @IsString()
    @IsNotEmpty()
    repeat_password: string

    validatePassword() {
        if(this.password !== this.repeat_password) {
            throw new Error('Password not match');
        }
    }

    async hashPassword() {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
}