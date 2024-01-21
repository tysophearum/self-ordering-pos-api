import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private imageService: UploadFileService,
  ) {}
  
  async onApplicationBootstrap() {
    this.seedUser();
  }

  async createUser(
    createUserDto: CreateUserDto,
    imageFile?: any,
  ): Promise<any> {
    try {
      const image = this.imageService.saveImage(
        imageFile,
        './asset/image/users',
      );
      return await this.userModel.create({
        username: createUserDto.username,
        password: createUserDto.password,
        gender: createUserDto.gender,
        role: createUserDto.role,
        image: image,
      });
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async findAll(sortField?: string, sortOrder?: string): Promise<User[]> {
    return await this.userModel
      .aggregate([
        {
          $sort: {
            [sortField]: sortOrder === 'asc' ? 1 : -1,
          },
        },
      ])
      .exec();
  }

  async deleteUser(id: string): Promise<any> {
    try {
      const user = await this.userModel.findById(id);
      this.imageService.deleteFile(user.image);
      await user.deleteOne();
      return {
        success: true,
        message: 'User was deleted',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async updateUser(userUpdate: UpdateUserDto, imageFile?: any): Promise<any> {
    try {
      let user = await this.userModel.findById(userUpdate._id);
      if (userUpdate.username) {
        user.username = userUpdate.username;
      }
      if (userUpdate.password) {
        user.password = userUpdate.password;
      }
      if (userUpdate.gender) {
        user.gender = userUpdate.gender;
      }
      if (imageFile) {
        this.imageService.deleteFile(user.image);
        user.image = this.imageService.saveImage(
          imageFile,
          './asset/image/users',
        );
      }
      return await user.save();
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async searchUsers(
    query: string ="",
    sortField?: string,
    sortOrder?: string,
  ): Promise<User[]> {
    return this.userModel.aggregate([
      {
        $match: {
          $or: [
            { username: { $regex: query } },
            { gender: { $regex: query } },
            { role: { $regex: query } },
          ],
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === 'asc' ? 1 : -1,
        },
      },
    ]);
  }

  async findOne(username: string): Promise<User | null> {
    return await this.userModel
      .findOne({ username })
      .select('username password gender role image repeat_password')
      .exec();
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.userModel
      .findById(id)
      .select('username password gender role image repeat_password')
      .exec();
  }

  async seedUser() {
    try{
      const existingUser = await this.userModel.findOne({ username: 'admin' });

      if(!existingUser) {
        const createUserDto = new CreateUserDto();
        createUserDto.username = 'admin';
        createUserDto.gender = 'ប្រុុស'
        createUserDto.password = 'admin';
        createUserDto.repeat_password = 'admin';
        createUserDto.validatePassword();
        await createUserDto.hashPassword();
        const user = this.userModel.create({
          username: createUserDto.username,
          gender: createUserDto.gender,
          password: createUserDto.password,
          role: 'អ្នកគ្រប់គ្រងទិន្នន័យ',
        });

        await this.userModel.create(user);
        return { created: true, message: 'User seeded successfully' };
      } else {
        return { created: false, message: 'User with username "admin" already exists. Skipping seeding.' };
      }
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
}
