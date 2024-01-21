import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
    @IsNumber()
    @IsNotEmpty()
    readonly totlaPrice: number
    
    @IsString()
    @IsNotEmpty()
    readonly type: string
}