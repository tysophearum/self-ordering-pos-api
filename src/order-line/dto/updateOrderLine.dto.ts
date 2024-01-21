import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateOrderLineDto {
    @IsString()
    @IsNotEmpty()
    readonly _id: string
    
    @IsString()
    @IsOptional()
    readonly note: string
}