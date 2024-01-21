import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from './schema/product.schema';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductGateway } from './product.gateway';
import { Roles } from 'src/auth/middlewares/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('product')
export class ProductController {
    constructor (private productService: ProductService, private productGateway: ProductGateway) {}

    @Post('create')
    @Roles(Role.Admin)
    @UseInterceptors(FileInterceptor('image'))
    async create(@UploadedFile() img: any ,@Body() product: CreateProductDto): Promise<Product> {
        const newProduct = await this.productService.createProduct(product, img)

        this.productGateway.handleNewProduct(newProduct)

        return newProduct
    }

    @Delete('/:id')
    @Roles(Role.Admin)
    async deleteUser(@Param() param: any) {
        const data = await this.productService.deleteProduct(param.id)
        if (data.success) {
            await this.productGateway.handleChangeProduct()
        }
        return data
    }

    @Put('/')
    @Roles(Role.Admin)
    @UseInterceptors(FileInterceptor('image'))
    async updateUser(@UploadedFile() image: any, @Body() product: UpdateProductDto) {
        if(image) {
            const updatedProduct = await this.productService.updateProduct(product, image)
            this.productGateway.handleChangeProduct()
            return updatedProduct
        }
        else{
            const updatedProduct = await this.productService.updateProduct(product)
            this.productGateway.handleChangeProduct()
            return updatedProduct
        }
    }

    @Get('/all')
    async getAll(
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
      ): Promise<Product[]> {
        return await this.productService.findAll(sortField, sortOrder)
    }

    @Get('/all/order-line')
    async getAllWithOrderLine(): Promise<Product[]> {
        return await this.productService.getAllProductsWithOrderLines()
    }

    @Get('/visible')
    async getVisible(
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
      ): Promise<Product[]> {
        return await this.productService.showVisible(sortField, sortOrder)
    }

    @Get('/invisible')
    @Roles(Role.Admin)
    async getInvisible(
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
      ): Promise<Product[]> {
        return await this.productService.showInvisible(sortField, sortOrder)
    }

    @Get('/category/:categoryId')
    async getCategory(
        @Param() param: any,
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
    ): Promise<Product[]> {
        return await this.productService.getCategory(param.categoryId,sortField, sortOrder)
    }

    @Get('search/:query')
    searchProducts(@Param('query') query: string, 
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
    ): Promise<Product[]> {
        return this.productService.searchProducts(query, sortField, sortOrder);
    }

    @Get('/category/order-line/:categoryId')
    async getCategoryWithOrderLine(
        @Param() param: any,
    ): Promise<Product[]> {
        return await this.productService.getCategoryProductsWithOrderLines(param.categoryId)
    }

    @Get('/:id')
    async getOne(@Param('id') param: any, ) {
        return await this.productService.findOne(param)
    }
}
