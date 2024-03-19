import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Follower } from "src/entities/follower.entity";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class FollowerService {
    constructor(
        @InjectRepository(Follower) private readonly followerRepository: Repository<Follower>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    async followUser(userId: number, followerUserId: number): Promise<Follower | ApiResponse> {
        try {
            if (userId === followerUserId) {
                return new ApiResponse('error', -4003, 'User cannot follow themselves.');
            }
            
            // Provera da li već postoji followerUserId za trenutnog korisnika
            const existingFollower = await this.followerRepository.findOne({
                where: { userId: userId, followerUserId: followerUserId }
            });
            if (existingFollower) {
                return new ApiResponse('error', -4004, 'User is already being followed.');
            } 
    
            // Provera da li već postoji userId za followerUserId
            const existingFollowerUser = await this.followerRepository.findOne({
                where: { userId: followerUserId, followerUserId: userId }
            });
            if (existingFollowerUser) {
                return new ApiResponse('error', -4005, 'User is already being followed by another user.');
            } 
    
            const follower = new Follower();
            follower.userId = userId;
            follower.followerUserId = followerUserId;
    
            const savedFollower = await this.followerRepository.save(follower);
            return savedFollower;
        } catch (error) {
            console.error('Error saving follower: ', error);
            return new ApiResponse('error', -4001, 'Failed to follow user.');
        }
    }
    
    
    async unfollowUser(userId: number, followerUserId: number): Promise<ApiResponse> {
        try {
            await this.followerRepository.delete({ userId, followerUserId });
            return new ApiResponse('success', 0, 'User unfollowed successfully.');
          } catch (error) {
            return new ApiResponse('error', -4002, 'Failed to unfollow user.');
          }
    };

    async getUserFollowers(userId: number): Promise<User[]> {
        const followers: Follower[] = await this.followerRepository.find({where: {userId}, relations:['user']})
        return followers.map((follower => follower.user))
    };

    async getUserFollowing(userId: number): Promise<Follower[]> {
        return await this.followerRepository.find({where: {followerUserId: userId}})
    }
}