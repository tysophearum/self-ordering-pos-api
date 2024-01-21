import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { PriceModule } from './price/price.module';
import { AdditionalProductModule } from './additional-product/additional-product.module';
import { AdditionalProductRelationModule } from './additional-product-relation/additional-product-relation.module';
import { OrderModule } from './order/order.module';
import { OrderLineModule } from './order-line/order-line.module';
import { UploadFileModule } from './upload-file/upload-file.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards';
import { PaymentModule } from './payment/payment.module'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule,
    CategoryModule,
    ProductModule,
    PriceModule,
    AdditionalProductModule,
    AdditionalProductRelationModule,
    OrderModule,
    OrderLineModule,
    UploadFileModule,
    AuthModule,
    PaymentModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', './paymentSuccess.html'), // Change 'public' to your directory name.
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
})

export class AppModule {}
