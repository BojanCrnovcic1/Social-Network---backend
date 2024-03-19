import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UpdateUserDto } from "src/dtos/user/update.user.dto";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { UserService } from "src/services/user/user.service";

@Controller('api/user/')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    getAllUser(): Promise<User[]> {
        return this.userService.getAllUser();
    }

    @Get(':id')
    getUserById(@Param('id') userId: number): Promise<User | ApiResponse> {
        return this.userService.getById(userId);
    }

    @Get(':username')
    findUsername(@Param('username') username: string): Promise<User[]> {
        return this.userService.findUserForUsername(username);
    }

    @Patch(':id')
    updateUserProfile(@Param('id') userId: number, @Body() data: UpdateUserDto): Promise<User | ApiResponse> {
        return this.userService.updateUser(userId,data);
    }

    @Delete(':id')
    deleteAcc(@Param('id') userId: number): Promise<User | ApiResponse> {
        return this.userService.deleteUser(userId);
    }
}