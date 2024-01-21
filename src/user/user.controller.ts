import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './schema/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/auth/middlewares/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  @Post('create')
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('image'))
  async createUser(
    @UploadedFile() img: any,
    @Body() user: CreateUserDto,
  ): Promise<User> {
    user.validatePassword();
    await user.hashPassword();

    return await this.userService.createUser(user, img);
  }

  @Get('all')
  async getAll(
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
  ): Promise<User[]> {
    return await this.userService.findAll(sortField, sortOrder);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async deleteUser(@Param() param: any) {
    return await this.userService.deleteUser(param.id);
  }

  @Put('/')
  @UseInterceptors(FileInterceptor('image'))
  async updateUser(@UploadedFile() image: any, @Body() user: UpdateUserDto) {
    if(user.password){
      user.validatePassword();
      await user.hashPassword();
    }
    if (image) {
      return await this.userService.updateUser(user, image);
    } else {
      return await this.userService.updateUser(user);
    }
  }

  @Get('search/:query?')
  searchUsers(
    @Param('query') query: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
  ): Promise<User[]> {

    return this.userService.searchUsers(query, sortField, sortOrder);
  }


}
