import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import * as bcrypt from 'bcrypt';

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    readonly _id: string;

    @IsString()
    @IsOptional()
    readonly username: string
    
    @IsString()
    @IsOptional()
    password: string

    @IsString()
    @IsOptional()
    readonly gender: string

    @IsString()
    @IsOptional()
    readonly role: string

    @IsOptional()
    readonly image: any

    @IsString()
    @IsOptional()
    readonly repeat_password: string

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