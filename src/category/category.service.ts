import { HttpException, Injectable } from '@nestjs/common';
import { Category } from './schema/category.schema';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { Product } from 'src/product/schema/product.schema';

@Injectable()
export class CategoryService {
    constructor (
        @InjectModel(Category.name) private categoryModel, 
        @InjectModel(Product.name) private productModel, 
        private imageService: UploadFileService
    ) {}

    async createCategory(createCategoryDto: CreateCategoryDto, imageFile?:any) {
        try {
            const image = this.imageService.saveImage(imageFile, './asset/image/categories')
            return await this.categoryModel.create({
                name: createCategoryDto.name,
                description: createCategoryDto.description,
                image: image
            })
        } catch (error) {
            return {
                error: error.message
            }
        }
    }

    async findAll(sortField?: string, sortOrder?: string): Promise<Category[]> {
        return this.categoryModel.aggregate([
            {
              $sort: {
                [sortField]: sortOrder === 'asc' ? 1 : -1,
              },
            },
        ]).exec()
    }

    async deleteCategory(id: string): Promise<any> {
        try {
            const deleteCategory = await this.categoryModel.findById(id)
            await this.productModel.deleteMany({ categoryId: deleteCategory._id }).exec();
            this.imageService.deleteFile(deleteCategory.image)
            await deleteCategory.deleteOne()
            return {
                success: true,
                message: "Category was deleted"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    async updateCategory(categoryUpdate: UpdateCategoryDto, imageFile?:any): Promise<Category> {
        try {
            let category = await this.categoryModel.findById(categoryUpdate._id)
            if(categoryUpdate.name) {
                category.name = categoryUpdate.name
            }
            if(categoryUpdate.description) {
                category.description = categoryUpdate.description
            }
            if(imageFile) {
                this.imageService.deleteFile(category.image)
                category.image = this.imageService.saveImage(imageFile, './asset/image/categories')
            }
            return await category.save()
        } catch (error) {
            throw new HttpException(error, 400)
        }
    }

    async searchCategories(query: string, sortField?: string, sortOrder?: string): Promise<Category[]> {
        return this.categoryModel.aggregate([
            {
              $match: {
                $or: [
                  { name: { $regex: query } },
                  { description: { $regex: query } },
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

    async getAllCategoriesWithOrderLines(): Promise<Category[]> {
        const categoriesWithOrderLines = await this.categoryModel.aggregate([
          {
            $lookup: {
              from: 'orderlines', // The name of the OrderLine collection in your MongoDB
              localField: '_id', // The field from the Category model to match
              foreignField: 'categoryId', // The field from the OrderLine model to match
              as: 'orderLines', // The name of the new field that will contain the matched orderLines
            },
          },
        ]);

        categoriesWithOrderLines.forEach(category => {
            let orderAmount = 0
            category.orderLines.forEach(orderLine => {
                orderAmount = orderAmount + orderLine.quantity
            });
            category.orderAmount = orderAmount
        });
    
        return categoriesWithOrderLines;
    }
}
