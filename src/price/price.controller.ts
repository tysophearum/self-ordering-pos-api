import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { PriceService } from './price.service';
import { CreatePriceDto } from './dto/createPrice.dto';
import { Price } from './schema/price.schema';
import { UpdatePriceDto } from './dto/updatePrice.dto';
import { Roles } from 'src/auth/middlewares/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('price')
export class PriceController {
    constructor (private priceService: PriceService) {}

    @Post('create')
    @Roles(Role.Admin)
    async createPrice(@Body() price: CreatePriceDto): Promise<Price> {
        
        const newPrice = await this.priceService.createPrice(price)

        // this.productGateway.handleNewPrice(newPrice)

        return newPrice
    }

    @Put('/')
    @Roles(Role.Admin)
    async updatePrice(@Body() price: UpdatePriceDto) {
        const updatedPrice = await this.priceService.updatePrice(price)

        // this.priceGateway.handleChangePrice()

        return updatedPrice
    }

    @Delete('/:id')
    @Roles(Role.Admin)
    async deletePrice(@Param() param: any) {
        const data = await this.priceService.deletePrice(param.id)
        // if (data.success) {
        //     this.productGateway.handleChangeProduct()
        // }
        return data
    }
}
