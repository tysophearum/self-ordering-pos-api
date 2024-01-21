import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AdditionalProductService } from './additional-product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAdditionalDto } from './dto/createAdditinal.dto';
import { AdditionalProduct } from './schema/additional-product.schema';
import { UpdateAdditionalDto } from './dto/updateAdditional.dto';
import { Roles } from 'src/auth/middlewares/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('additional-product')
export class AdditionalProductController {
    constructor(private additionalService: AdditionalProductService) {}

    @Post('create')
    @Roles(Role.Admin)
    @UseInterceptors(FileInterceptor('image'))
    async create(@UploadedFile() img: any ,@Body() additional: CreateAdditionalDto): Promise<AdditionalProduct> {
        const newAdditional = await this.additionalService.createAdditional(additional, img)

        return newAdditional
    }

    @Get('/all')
    async getAll(
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
      ): Promise<AdditionalProduct[]> {
        return await this.additionalService.findAll(sortField, sortOrder)
    }

    @Delete('/:id')
    @Roles(Role.Admin)
    async deleteAdditional(@Param() param: any) {
        const data = await this.additionalService.deleteAdditional(param.id)
        return data
    }

    @Put('/')
    @Roles(Role.Admin)
    @UseInterceptors(FileInterceptor('image'))
    async updateAdditional(@UploadedFile() image: any, @Body() additional: UpdateAdditionalDto) {
        if(image) {
            const updatedAdditional = await this.additionalService.updateAdditional(additional, image)
            return updatedAdditional
        }
        else{
            const updatedAdditional = await this.additionalService.updateAdditional(additional)
            return updatedAdditional
        }
    }

    @Get('search/:query')
    searchAdditionals(
        @Param('query') query: string, 
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
    ): Promise<AdditionalProduct[]> {
        return this.additionalService.searchAdditionals(query, sortField, sortOrder);
    }
}
