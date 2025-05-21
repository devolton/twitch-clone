import {Query, Resolver, Mutation, Args} from '@nestjs/graphql';
import {FollowService} from './follow.service';
import {FollowModel} from "./models/follow.model";
import {Authorization} from "../../shared/decorators/auth.decorator";
import {Authorized} from "../../shared/decorators/authorized.decorator";
import {User} from "../../../prisma/generated";

@Resolver('Follow')
export class FollowResolver {
    constructor(private readonly followService: FollowService) {
    }

    @Authorization()
    @Query(() => [FollowModel], {name: 'findMyFollowers'})
    async findMyFollowers(@Authorized() user: User) {
        return this.followService.findMyFollows(user);
    }

    @Authorization()
    @Query(() => [FollowModel], {name: 'findMyFollowings'})
    async findMyFollowing(@Authorized() user: User) {
        return this.followService.findMyFollowings(user);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'followChannel'})
    async follow(@Authorized() user: User,
                 @Args('channelId') channelId: number) {
        return this.followService.follow(user, channelId);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'unfollowChannel'})
    async unfollow(@Authorized() user: User,
                   @Args('channelId') channelId: number) {
        return this.followService.unfollow(user, channelId);
    }
}
