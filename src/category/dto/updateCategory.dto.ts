import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
    @IsNotEmpty()
    @IsString()
    readonly _id: string;

    @IsString()
    @IsOptional()
    readonly name: string
    
    @IsString()
    @IsOptional()
    readonly description: string

    @IsOptional()
    readonly image: any
}