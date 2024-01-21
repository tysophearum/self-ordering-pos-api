import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string
    
    @IsString()
    @IsNotEmpty()
    readonly categoryId: string
    
    @IsNotEmpty()
    readonly price: number

    @IsOptional()
    readonly image: any
}