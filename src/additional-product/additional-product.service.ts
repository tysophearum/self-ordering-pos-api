import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdditionalProduct } from './schema/additional-product.schema';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { CreateAdditionalDto } from './dto/createAdditinal.dto';
import { UpdateAdditionalDto } from './dto/updateAdditional.dto';

@Injectable()
export class AdditionalProductService {
    constructor (@InjectModel(AdditionalProduct.name) private additionalModel,  private imageService: UploadFileService) {}

    async createAdditional(createAdditionalDto: CreateAdditionalDto, imageFile?:AdditionalProduct) {
        try {
            const image = this.imageService.saveImage(imageFile, './asset/image/additionals')
            return await this.additionalModel.create({
                name: createAdditionalDto.name,
                price: createAdditionalDto.price,
                image: image
            })
        } catch (error) {
            throw new HttpException(error, 400)
        }
    }

    async findAll(sortField?: string, sortOrder?: string): Promise<AdditionalProduct[]> {
        return this.additionalModel.aggregate([
            {
              $sort: {
                [sortField]: sortOrder === 'asc' ? 1 : -1,
              },
            },
        ]).exec()
    }

    async deleteAdditional(id: string): Promise<any> {
        try {
            const deleteAdditional = await this.additionalModel.findById(id)
            this.imageService.deleteFile(deleteAdditional.image)
            await deleteAdditional.deleteOne()
            return {
                success: true,
                message: "Additional was deleted"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    async updateAdditional(additionalUpdate: UpdateAdditionalDto, imageFile?:any): Promise<AdditionalProduct> {
        try {
            let additional = await this.additionalModel.findById(additionalUpdate._id)
            if(additionalUpdate.name) {
                additional.name = additionalUpdate.name
            }
            if(additionalUpdate.price) {
                additional.price = additionalUpdate.price
            }
            if(imageFile) {
                this.imageService.deleteFile(additional.image)
                additional.image = this.imageService.saveImage(imageFile, './asset/image/additionals')
            }
            return await additional.save()
        } catch (error) {
            throw new HttpException(error, 400)
        }
    }

    async searchAdditionals(query: string, sortField?: string, sortOrder?: string): Promise<AdditionalProduct[]> {
        return this.additionalModel.aggregate([
            {
              $match: {
                $or: [
                  { name: { $regex: query } },
                  { price: { $regex: query } },
                ],
              },
            },
            {
                $sort: {
                  [sortField]: sortOrder === 'asc' ? 1 : -1,
                },
              },
          ]);
    }
}
