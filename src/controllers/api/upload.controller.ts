import { Body, Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageConfig } from "config/storage.config";
import multer from "multer";
import { extname } from "path";
import { AddPostDto } from "src/dtos/post/add.post.dto";
import { AddStoriesDto } from "src/dtos/stories/add.stories.dto";
import { RegisterUserDto } from "src/dtos/user/register.user.dto";
import { UpdateUserDto } from "src/dtos/user/update.user.dto";
import { PosT } from "src/entities/post.entity";
import { Stories } from "src/entities/stories.entity";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { PostService } from "src/services/post/post.service";
import { StoriesService } from "src/services/stories/stories.service";
import { UserService } from "src/services/user/user.service";

@Controller('api/upload/')
export class UploadController {
    constructor(
        private postService: PostService,
        private userService: UserService,
        private storiesService: StoriesService
    ) {}
    @Post('profileAddPhoto/:userId')
    @UseInterceptors(
        FileInterceptor('profileAddPhoto', {
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                  cb(null, StorageConfig.image.profile)
                },
                filename: function (req, file, cb) {
                  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                  cb(null, uniqueSuffix + '-'+ file.originalname)
                },
              }),
              fileFilter(req, file, cb) {
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                const ext = extname(file.originalname).toLowerCase();
                if (allowedExtensions.includes(ext)) {
                cb(null, true);
               } 
             }
        })
    )
    async profileRegisterPicture(@Body() userData: RegisterUserDto, @UploadedFile() file: Express.Multer.File): Promise<User | ApiResponse> {
        try {
            const imagePath = file.path;
            const newUserData: RegisterUserDto = {
               email: userData.email,
               password: userData.password,
               username: userData.username,
               bio: userData.bio,
               profilePicture: imagePath
            }

            const createProfilePhoto = await this.userService.registerUser(newUserData);
            return createProfilePhoto;
        } catch (error) {
            return new ApiResponse('error', -10001, 'Internal server error');
        }
    }

    @Post('profileEditPhoto/:userId')
    @UseInterceptors(
        FileInterceptor('profileEditPhoto', {
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                  cb(null, StorageConfig.image.profile)
                },
                filename: function (req, file, cb) {
                  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                  cb(null, uniqueSuffix + '-'+ file.originalname)
                },
              }),
              fileFilter(req, file, cb) {
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                const ext = extname(file.originalname).toLowerCase();
                if (allowedExtensions.includes(ext)) {
                cb(null, true);
               } 
             }
        })
    )
    async profileEditPicture(@Param('userId') userId: number, @Body() userData: UpdateUserDto, @UploadedFile() file: Express.Multer.File): Promise<User | ApiResponse> {
        try {
            const imagePath = file.path;
            const newUserData: UpdateUserDto = {
               email: userData.email,
               password: userData.password,
               username: userData.username,
               bio: userData.bio,
               profilePhoto: imagePath
            }

            const createProfilePhoto = await this.userService.updateUser(userId,newUserData);
            return createProfilePhoto;
        } catch (error) {
            return new ApiResponse('error', -10001, 'Internal server error');
        }
    }

    @Post('postPhoto/:userId')
    @UseInterceptors(
        FileInterceptor('postPhoto', {
                storage: multer.diskStorage({
                destination: function (req, file, cb) {
                  cb(null, StorageConfig.image.destination)
                },
                filename: function (req, file, cb) {
                  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                  cb(null, uniqueSuffix + '-'+ file.originalname)
                },
              }),
              fileFilter(req, file, cb) {
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                const ext = extname(file.originalname).toLowerCase();
                if (allowedExtensions.includes(ext)) {
                cb(null, true);
               } 
             }
        })
    )
    async createPostPhoto(@Param('userId') userId: number, @Body() postData: AddPostDto, @UploadedFile() file: Express.Multer.File): Promise<PosT | ApiResponse> {
        try {
            const imagePath = file.path;
            const newPostData: AddPostDto = {
                content: postData.content,
                photo: imagePath
            }
            const createPost = await this.postService.createPost(userId, newPostData);
            return createPost;
        } catch (error) {
         return new ApiResponse('error', -10001, 'Internal server error');
        }
    }

    @Post('story/:userId')
    @UseInterceptors(
        FileInterceptor('story', {
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                  cb(null, StorageConfig.image.stories)
                },
                filename: function (req, file, cb) {
                  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                  cb(null, uniqueSuffix + '-'+ file.originalname)
                },
              }),
              fileFilter(req, file, cb) {
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                const ext = extname(file.originalname).toLowerCase();
                if (allowedExtensions.includes(ext)) {
                cb(null, true);
               } 
             }
        })
    )
    async createStory(@Param('userId') userId: number, @UploadedFile() file: Express.Multer.File): Promise<Stories | ApiResponse> {
        try {
            const storyPath = file.path;

            const story = await this.storiesService.createStory(userId, storyPath);
            return story;
        } catch (error) {
            return new ApiResponse('error', -10001, 'Internal server error');
        }
    }

    @Delete('deleteStory/:id')
    async deleteStory(@Param('id') storiesId: number): Promise<Stories | ApiResponse> {
        return await this.storiesService.removeStory(storiesId);
    }
}