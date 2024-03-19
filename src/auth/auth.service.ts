import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { UserService } from "src/services/user/user.service";
import * as bcrypt from "bcrypt";
import { LoginUserDto } from "src/dtos/user/login.user.dto";
import { User } from "src/entities/user.entity";
import { Request } from "express";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.getUserEmail(email);

        if(user && bcrypt.compare(password, user.passwordHash)) {
            return user;
        }
        return null;
    }

    async login(loginUserDto: LoginUserDto): Promise<string> {
        const user = await this.validateUser(
          loginUserDto.email,
          loginUserDto.password
        );
    
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }

        const userFarToken = {
            userId: user.userId,
            email: user.email,
        }
    
        return this.jwtService.sign(userFarToken);
      }

      async getCurrentUser(req: Request) {
        return req['user'];
      }
}