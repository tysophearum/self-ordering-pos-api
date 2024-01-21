import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePriceDto {
    @IsString()
    @IsNotEmpty()
    readonly _id: string

    @IsString()
    @IsOptional()
    readonly name: string
    
    @IsString()
    @IsOptional()
    readonly productId: string
    
    @IsNumber()
    @IsOptional()
    readonly price: number
}