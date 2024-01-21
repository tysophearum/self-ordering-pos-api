import { Module } from '@nestjs/common';
import { AdditionalProductService } from './additional-product.service';
import { AdditionalProductController } from './additional-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdditionalProduct, AdditionalProductSchema } from './schema/additional-product.schema';
import { UploadFileService } from 'src/upload-file/upload-file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AdditionalProduct.name, schema: AdditionalProductSchema }]),
  ],
  controllers: [AdditionalProductController],
  providers: [AdditionalProductService, UploadFileService],
})
export class AdditionalProductModule {}
