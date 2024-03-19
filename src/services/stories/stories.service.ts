import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Stories } from "src/entities/stories.entity";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class StoriesService {
    constructor(
        @InjectRepository(Stories) private readonly storiesRepository: Repository<Stories>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async createStory(userId: number, story: string): Promise<Stories | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found.')
        }

        const newStory = new Stories();
        newStory.user= new User()
        newStory.user.userId = user.userId;
        newStory.photoStories = story;

        const savedStories = await this.storiesRepository.save(newStory);
        if (!savedStories) {
            return new ApiResponse('error', -6001, 'Story not save.')
        }
        return savedStories;
    }

    async removeStory(id: number): Promise<Stories | ApiResponse> {
        const story = await this.storiesRepository.findOne({where: {storiesId: id}});
        if (!story) {
            return new ApiResponse('error', -6002, 'Story not found!')
        }
        return await this.storiesRepository.remove(story);
    }
}