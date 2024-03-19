import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterUserDto } from "src/dtos/user/register.user.dto";
import { UpdateUserDto } from "src/dtos/user/update.user.dto";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";
import * as crypto from "crypto";
import { Request } from "express";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    )  {}

    async getUserProfile(req: Request): Promise<User | undefined> {
        if (!req.user) {
            return undefined
        }
        const userId = req.user.userId

        return await this.userRepository.findOne({where: {userId: userId}});
    }

    async getAllUser(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getById(userId: number): Promise<User | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found!');
        }
        return user;
    }

    async getUserEmail(email: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({where: {email: email}});
        if (user) {
            return user;
        }
        return undefined;
    }

    async getByUsername(username: string): Promise<User | undefined> {
        const userName = await this.userRepository.findOne({where: {username: username}})

        if (userName) {
            return userName;
        }
        return undefined;
    }

    async findUserForUsername(username: string): Promise<User[]> {
        return this.userRepository.find({where: {username: username + '%'}})
    }

    async registerUser(dataUser: RegisterUserDto): Promise<User | ApiResponse> {
        const user = await this.getUserEmail(dataUser.email);
        if (user) {
            return new ApiResponse('error', -1003, 'User alredy exist.');
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(dataUser.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        const newUser = new User()
        newUser.email = dataUser.email;
        newUser.passwordHash = passwordHashString;
        newUser.username = dataUser.username;
        newUser.bio = dataUser.bio;
        newUser.profilePhoto = dataUser.profilePicture;

        const savedUser = await this.userRepository.save(newUser);

        if (!savedUser) {
            return new ApiResponse('error', -1004, 'This user account cannot be created.')
        }

        return savedUser;
    }

    async updateUser(userId: number, userData: UpdateUserDto): Promise<User | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found!');
        }

        user.passwordHash = userData.password;
        user.username = userData.username;
        user.bio = userData.bio;
        user.profilePhoto = userData.profilePhoto;

        const savedUser = await this.userRepository.save(user);
        if (!savedUser) {
            return new ApiResponse('error', -1002, 'No user data has been changed.')
        }
        return savedUser;
    }

    async deleteUser(userId: number): Promise<User | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found!');
        }
        return await this.userRepository.remove(user);
    }

}