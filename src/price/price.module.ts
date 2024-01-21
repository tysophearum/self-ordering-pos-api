import { Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Price, PriceSchema } from './schema/price.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Price.name, schema: PriceSchema }]),
  ],
  controllers: [PriceController],
  providers: [PriceService]
})
export class PriceModule {}
