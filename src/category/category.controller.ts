import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { CategoryService } from './category.service';
import { Category } from './schema/category.schema';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CategoryGateway } from './category.gateway';
import { Roles } from 'src/auth/middlewares/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService, private categoryGateway: CategoryGateway) {}

    @Post('create')
    // @Roles(Role.Admin)
    @UseInterceptors(FileInterceptor('image'))
    async create(@UploadedFile() img: any ,@Body() category: CreateCategoryDto): Promise<Category> {
        const newCategory = await this.categoryService.createCategory(category, img)

        this.categoryGateway.handleNewCategory(newCategory)

        return newCategory
    }

    @Get('/all')
    async getAll(
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
      ): Promise<Category[]> {
        return await this.categoryService.findAll(sortField, sortOrder)
    }

    @Delete('/:id')
    @Roles(Role.Admin)
    async deleteCategory(@Param() param: any) {
        const data = await this.categoryService.deleteCategory(param.id)
        if (data.success) {
            this.categoryGateway.handleChangeCategory()
        }
        return data
    }

    @Put('/')
    @Roles(Role.Admin)
    @UseInterceptors(FileInterceptor('image'))
    async updateCategory(@UploadedFile() image: any, @Body() category: UpdateCategoryDto) {
        if(image) {
            const updatedCategory = await this.categoryService.updateCategory(category, image)
            this.categoryGateway.handleChangeCategory()
            return updatedCategory
        }
        else{
            const updatedCategory = await this.categoryService.updateCategory(category)
            this.categoryGateway.handleChangeCategory()
            return updatedCategory
        }
    }

    @Get('search/:query')
    searchCategories(
        @Param('query') query: string,
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
    ): Promise<Category[]> {
        return this.categoryService.searchCategories(query, sortField, sortOrder);
    }

    @Get('all/order-line')
    orderLine() {
        return this.categoryService.getAllCategoriesWithOrderLines()
    }
}
