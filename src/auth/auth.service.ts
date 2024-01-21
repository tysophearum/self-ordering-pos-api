import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signIn(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne(username);

        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                const payload = { id: user._id.toString(), username: user.username, role: user.role };
                const access_token = await this.jwtService.signAsync(payload);
                
                return {
                    user: user,
                    access_token: access_token,
                };
            } else {
                throw new HttpException('password is incorrect!', HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new HttpException('Username or password is incorrect!', HttpStatus.BAD_REQUEST);
        }
    }

    async signOut(session: any): Promise<{ message: string} | { error: any }> {
        try{
            session.destroy();
            return {
                message: 'Logout successfully!',
            };
            
        } catch (error) {
            return {
                error: error,
            }
        }
    }

}
