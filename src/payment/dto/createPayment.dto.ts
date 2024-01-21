import { IsNotEmpty, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsString()
    @IsNotEmpty()
    readonly orderId: string
}