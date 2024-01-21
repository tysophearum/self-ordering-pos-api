import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Price } from './schema/price.schema';
import { CreatePriceDto } from './dto/createPrice.dto';
import { Product } from 'src/product/schema/product.schema';
import { UpdatePriceDto } from './dto/updatePrice.dto';

@Injectable()
export class PriceService {
    constructor (@InjectModel(Price.name) private priceModel, @InjectModel(Product.name) private productModel) {}

    async createPrice (createPriceDto: CreatePriceDto): Promise<Price> {
        let product = await this.productModel.findById(createPriceDto.productId)
        
        if(product == null){
            throw new HttpException({ success: false, message: "Input productId does not exist" }, HttpStatus.NOT_FOUND);
        }
        try {
            return await this.priceModel.create({
                name: createPriceDto.name,
                productId: createPriceDto.productId,
                price: createPriceDto.price
            })
        } catch (error) {
            throw new HttpException(error, 400)
        }
    }

    async deletePrice(id: string): Promise<any> {
        try {
            const deletePrice = await this.priceModel.findById(id)
            await deletePrice.deleteOne()
            return {
                success: true,
                message: "Price was deleted"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    async updatePrice(priceUpdate: UpdatePriceDto): Promise<Price> {
        try {
            let price = await this.priceModel.findById(priceUpdate._id)
            if(priceUpdate.name) {
                price.name = priceUpdate.name
            }
            if(priceUpdate.productId) {
                let product = await this.productModel.findById(priceUpdate.productId)
                if(product == null){
                    throw new HttpException({ success: false, message: "Input productId does not exist" }, HttpStatus.NOT_FOUND);
                }
                price.categoryId = priceUpdate.productId
            }
            if(priceUpdate.price) {
                price.price = priceUpdate.price
            }
            return await price.save()
        } catch (error) {
            throw new HttpException(error, 400)
        }
    }
}
