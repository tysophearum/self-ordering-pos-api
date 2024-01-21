import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdditionalProductRelation } from './schema/additional-product-relation.schema';
import { Product } from 'src/product/schema/product.schema';
import { AdditionalProduct } from 'src/additional-product/schema/additional-product.schema';
import { CreateAdditionalRelationDto } from './dto/createAdditionalRelation.dto';

@Injectable()
export class AdditionalProductRelationService {
    constructor (
        @InjectModel(AdditionalProductRelation.name) private additionalRelationModel,
        @InjectModel(Product.name) private productModel,
        @InjectModel(AdditionalProduct.name) private additionalModel,
    ) {}

    async createRelation (createRelationDto: CreateAdditionalRelationDto): Promise<AdditionalProductRelation> {
        let product = await this.productModel.findById(createRelationDto.productId)
        if(product == null){
            throw new HttpException({ success: false, message: "Input productId does not exist" }, HttpStatus.NOT_FOUND);
        }
        let additional = await this.additionalModel.findById(createRelationDto.additionalProductId)
        if(product == null){
            throw new HttpException({ success: false, message: "Input additionalId does not exist" }, HttpStatus.NOT_FOUND);
        }
        try {
            return await this.additionalRelationModel.create({
                productId: createRelationDto.productId,
                additionalProductId: createRelationDto.additionalProductId
            })
        } catch (error) {
            throw new HttpException(error, 400)
        }
    }

    async deleteRelation (id: string): Promise<any> {
        try {
            const deleteRelation = await this.additionalRelationModel.findById(id)
            await deleteRelation.deleteOne()
            return {
                success: true,
                message: "Additional product relation was deleted"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}
