import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderLineDto {
    @IsString()
    @IsNotEmpty()
    readonly productId: string

    categoryId: string
    
    @IsString()
    @IsNotEmpty()
    readonly orderId: string
    
    @IsString()
    @IsNotEmpty()
    readonly priceId: string
    
    @IsOptional()
    @IsString()
    readonly additionals: string
    
    @IsOptional()
    @IsString()
    readonly note: string
    
    @IsNotEmpty()
    @IsNumber()
    readonly quantity: number
    
    @IsNotEmpty()
    @IsNumber()
    readonly totalPrice: number
}