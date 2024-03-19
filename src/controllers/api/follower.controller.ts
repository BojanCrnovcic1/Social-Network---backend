import { Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthService } from "src/auth/auth.service";
import { Follower } from "src/entities/follower.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { FollowerService } from "src/services/follower/follower.service";

@Controller('api/follower')
export class FollowerController {
    constructor(
        private readonly followerService: FollowerService,
        private readonly authService: AuthService,
    ) {}

    @Get(':id')
    async getAllUserFollowers(@Param('id') userId: number) {
        return await this.followerService.getUserFollowers(userId);
    };

    @Get(':id')
    async getAllUserFollowing(@Param('id') userId: number) {
        return await this.followerService.getUserFollowing(userId);
    }

    @Post('follow/:followerUserId')
    @UseGuards(AuthGuard)
    async followUser(@Req() req: Request, @Param('followerUserId') followerUserId: number): Promise<Follower | ApiResponse> {
        const user = await this.authService.getCurrentUser(req);
        if (!user || !user.userId) {
            return new ApiResponse('error', -1009, 'User not authorized');
        }
        const userId = user.userId;
        return await this.followerService.followUser(userId, followerUserId);
    };

    @Delete('unfollow/:followerUserId')
    async unfollowUser(@Req() req: Request, @Param('followerUserId') followerUserId: number): Promise<ApiResponse> {
        const user = await this.authService.getCurrentUser(req);
        if (!user || !user.userId) {
            return new ApiResponse('error', -1009, 'User not authorized');
        }
        const userId = user.userId;
        return await this.followerService.unfollowUser(userId, followerUserId);
    };
}