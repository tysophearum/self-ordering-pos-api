import { Module } from '@nestjs/common';
import { AdditionalProductRelationController } from './additional-product-relation.controller';
import { AdditionalProductRelationService } from './additional-product-relation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdditionalProductRelation, AdditionalProductRelationSchema } from './schema/additional-product-relation.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { AdditionalProduct, AdditionalProductSchema } from 'src/additional-product/schema/additional-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AdditionalProductRelation.name, schema: AdditionalProductRelationSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: AdditionalProduct.name, schema: AdditionalProductSchema }]),
  ],
  controllers: [AdditionalProductRelationController],
  providers: [AdditionalProductRelationService]
})
export class AdditionalProductRelationModule {}
