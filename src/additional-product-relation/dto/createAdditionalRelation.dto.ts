import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAdditionalRelationDto {
    @IsNotEmpty()
    @IsString()
    readonly productId: string
    
    @IsNotEmpty()
    @IsString()
    readonly additionalProductId: string
}