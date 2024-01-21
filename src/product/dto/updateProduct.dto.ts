import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    readonly _id: string

    @IsString()
    @IsOptional()
    readonly name: string
    
    @IsString()
    @IsOptional()
    readonly categoryId: string
    
    @IsOptional()
    readonly price: number
    
    @IsString()
    @IsOptional()
    readonly show: string

    @IsOptional()
    readonly image: any
}