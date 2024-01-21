import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAdditionalDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string
    
    @IsNotEmpty()
    readonly price: number

    @IsOptional()
    readonly image: any
}