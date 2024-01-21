import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { Category, CategorySchema } from 'src/category/schema/category.schema';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { ProductGateway } from './product.gateway';
import { AdditionalProductRelation, AdditionalProductRelationSchema } from 'src/additional-product-relation/schema/additional-product-relation.schema';
import { Price, PriceSchema } from 'src/price/schema/price.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: Price.name, schema: PriceSchema }]),
    MongooseModule.forFeature([{ name: AdditionalProductRelation.name, schema: AdditionalProductRelationSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService, UploadFileService, ProductGateway]
})
export class ProductModule {}
