import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { AdditionalProductRelationService } from './additional-product-relation.service';
import { CreateAdditionalRelationDto } from './dto/createAdditionalRelation.dto';
import { Roles } from 'src/auth/middlewares/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('additional-product-relation')
export class AdditionalProductRelationController {
    constructor(private relationService: AdditionalProductRelationService) {}

    @Post('create')
    @Roles(Role.Admin)
    async create(@Body() relationDto: CreateAdditionalRelationDto ) {
        const newRelation = this.relationService.createRelation(relationDto)
        return newRelation
    }

    @Delete('/:id')
    @Roles(Role.Admin)
    async deleteRelation(@Param() param: any) {
        const data = await this.relationService.deleteRelation(param.id)
        return data
    }
}
