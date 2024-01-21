import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAdditionalDto {
    @IsNotEmpty()
    @IsString()
    readonly _id: string;

    @IsString()
    @IsOptional()
    readonly name: string
    
    @IsOptional()
    readonly price: number

    @IsOptional()
    readonly image: any
}