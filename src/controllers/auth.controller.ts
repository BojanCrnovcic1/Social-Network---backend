import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";

import { LoginUserDto } from "src/dtos/user/login.user.dto";
import { RegisterUserDto } from "src/dtos/user/register.user.dto";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { UserService } from "src/services/user/user.service";


@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService) {}

    @Get('/user/profile')
    async getProfile(@Req() req: any): Promise<User | null> {
        return await req.user
    }

    @Get('/user/me')
    async getUserProfile(@Req() req: Request): Promise<User | undefined> {
        try {
            const user = await this.userService.getUserProfile(req);
            if (!user) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
              }
              return user;
        } catch (error) {
            throw error;
        }
    }

    @Post('/user/registar')
    async registrationUser(@Body() data: RegisterUserDto): Promise<User | ApiResponse> {
        return await this.userService.registerUser(data);
    }

    @Post('/user/login')
    async login(@Body() data: LoginUserDto, @Res() res: Response) {
        try {
            const user = await this.authService.login(data);
            if (!user) {
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
              }

            const token = user;
            res.send({token})
            return { message: 'Login successful' };

        } catch (err) {
            throw err;
        }

    }
}