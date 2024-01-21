import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { Category, CategorySchema } from './schema/category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryGateway } from './category.gateway';
import { Product, ProductSchema } from 'src/product/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Category.name, schema: CategorySchema}]),
    MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}])
  ],
  controllers: [CategoryController],
  providers: [CategoryService, UploadFileService, CategoryGateway]
})
export class CategoryModule {}
