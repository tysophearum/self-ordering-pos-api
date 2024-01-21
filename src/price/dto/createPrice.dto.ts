import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePriceDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string
    
    @IsString()
    @IsNotEmpty()
    readonly productId: string
    
    @IsNumber()
    @IsNotEmpty()
    readonly price: number
}