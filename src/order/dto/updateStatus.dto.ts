import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateOrderStatusDto {
    @IsString()
    @IsNotEmpty()
    readonly _id: string
    
    @IsString()
    @IsOptional()
    readonly status: string
}