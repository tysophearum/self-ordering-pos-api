import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Req,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn.dto';
import { User } from 'src/user/schema/user.schema';
import { AuthGuard } from './guards/auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(ValidationPipe)
  async signIn(
    @Body() signInDto: SignInDto,
    @Req() req: Request,
    @Session() session: Record<string, any>,
  ): Promise<{ user: User }> {
    const result = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    session.jwtToken = result.access_token;

    return {
      ...result,
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async signOut(@Request() req) {
    return this.authService.signOut(req.session);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Request() req) {
    return req.user;
  }

}
