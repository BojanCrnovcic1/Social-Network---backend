import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthService } from "src/auth/auth.service";
import { Roles } from "src/auth/roles.decorator";
import { AddPostDto } from "src/dtos/post/add.post.dto";
import { EditPostDto } from "src/dtos/post/edit.post.dto";
import { Like } from "src/entities/like.entity";
import { PosT } from "src/entities/post.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { LikeService } from "src/services/like/like.service";
import { PostService } from "src/services/post/post.service";

@Controller('api/post/')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly likeService: LikeService,
        private readonly authService: AuthService,
    ) {}

    @Get()
    async allPost(): Promise<PosT[]> {
        return await this.postService.getAllPosts();
    }

    @Get(':userId')
    async allPostByUser(@Param('userId') userId: number): Promise<PosT[]> {
        return await this.postService.getAllPostsByUser(userId);
    }

    @Get(':id') 
    async getPostById(@Param('id') postId: number): Promise<PosT | ApiResponse> {
        return await this.postService.getPostById(postId);
    }

    @Post('createPost/:id')
    async createPost(@Param('id') userId: number, @Body() data: AddPostDto): Promise<PosT | ApiResponse> {
        return await this.postService.createPost(userId, data);
    }

    @Patch(':userId/edit/:postId')
    async editPost(@Param('userId') userId: number, @Param('postId') postId: number, @Body() data: EditPostDto): Promise<PosT | ApiResponse>  {
        return await this.postService.updatePost(userId, postId, data);
    }

    @Delete(':id')
    async deletePost(@Param('id') postId: number): Promise<PosT | ApiResponse> {
        return await this.postService.deletePost(postId);
    }

    @Post('like/:postId')
    @UseGuards(AuthGuard)
    async likePost(@Req() req: Request, @Param('postId') postId: number): Promise<Like | ApiResponse> {
        const user = await this.authService.getCurrentUser(req);
        
        if (!user || !user.userId) {
            return new ApiResponse('error', -1009, 'User not authorized');
        }
        const userId = user.userId;

        return await this.likeService.likePost(userId, postId);
    }

    @Post('dislike/:postId')
    @UseGuards(AuthGuard)
    @Roles('user')
    async dislikePost(@Req() req: Request, @Param('postId') postId: number): Promise<Like | ApiResponse> {
        const user = await this.authService.getCurrentUser(req);
        
        if (!user || !user.userId) {
            return new ApiResponse('error', -1009, 'User not authorized');
        }
        const userId = user.userId;

        return await this.likeService.dislikePost(userId,postId);
    }
}