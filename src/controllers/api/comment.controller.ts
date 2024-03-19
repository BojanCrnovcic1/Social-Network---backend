import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "src/auth/auth.service";
import { AddCommentDto } from "src/dtos/comment/add.comment.dto";
import { EditCommentDto } from "src/dtos/comment/edit.comment.dto";
import { Comment } from "src/entities/comment.entity";
import { Like } from "src/entities/like.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { CommentService } from "src/services/comment/comment.service";
import { LikeService } from "src/services/like/like.service";

@Controller('api/comment/')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly likeService: LikeService,
        private readonly authService: AuthService
    ) {}

    @Get()
    async getAllComment(): Promise<Comment[]> {
        return await this.commentService.getAllComment();
    }

    @Get(':postId')
    async getAllCommentForPost(@Param('postId') postId: number): Promise<Comment[]> {
        return await this.commentService.getAllCommentForPost(postId)
    }

    @Get(':id')
    async getCommentById(@Param('id') commentId: number): Promise<Comment | ApiResponse> {
        return await this.commentService.getCommentById(commentId);
    }

    @Post(':userId/createComment/:postId')
    async createComment(@Param('userId') userId: number, @Param('postId') postId: number, @Body() data: AddCommentDto): Promise<Comment | ApiResponse> {
        return await this.commentService.createComment(userId,postId,data);
    }

    @Patch(':userId/editComment/:commentId')
    async editComment(@Param('userId') userId: number, @Param('commentId') commentId: number, @Body() data: EditCommentDto): Promise<Comment | ApiResponse> {
        return await this.commentService.updateComment(userId,commentId,data);
    }

    @Delete(':id')
    async deleteComment(@Param('id') commentId: number): Promise<Comment | ApiResponse> {
        return this.commentService.deleteComment(commentId);
    }

    @Post('like/:commentId')
    async likeComment(@Req() req: Request, @Param('commentId') commentId: number): Promise<Like | ApiResponse> {
        const user = await this.authService.getCurrentUser(req);
        if (!user || !user.userId) {
            return new ApiResponse('error', -1009, 'User not authorized');
        }
        const userId = user.userId;

        return await this.likeService.likeComment(userId, commentId);
    }

    @Post('dislike/:commentId')
    async dislikeComment(@Req() req: Request, @Param('commentId') commentId: number): Promise<Like | ApiResponse> {
        const user = await this.authService.getCurrentUser(req);
        if (!user || !user.userId) {
            return new ApiResponse('error', -1009, 'User not authorized');
        }
        const userId = user.userId;

        return await this.likeService.dislikeComment(userId, commentId);
    }
}