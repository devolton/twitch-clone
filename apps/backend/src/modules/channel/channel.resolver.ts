import {Query, Resolver, Args} from '@nestjs/graphql';
import {ChannelService} from './channel.service';
import {UserModel} from "../auth/account/models/user.model";
import {Authorization} from "../../shared/decorators/auth.decorator";
import {SubscriptionModel} from "../sponsorship/subscription/models/subscription.model";
import {Authorized} from "../../shared/decorators/authorized.decorator";
import {User} from "../../../prisma/generated";

@Resolver('Channel')
export class ChannelResolver {
    constructor(private readonly channelService: ChannelService) {
    }

    @Query(() => [UserModel], {name: 'findRecommendedChannels'})
    async findRecommendedChannels() {
        return this.channelService.findRecommendedChannels();
    }


    @Query(() => UserModel, {name: 'findChannelByUsername'})
    async findByUsername(@Args('username') username: string) {
        return this.channelService.findByUsername(username);
    }

    @Query(() => Number, {name: 'findFollowersCountByChannel'})
    async findFollowersCountByChannel(@Args('channelId') channelId: number) {
        return this.channelService.findFollowersCountByChannel(channelId);
    }

    @Query(() => [SubscriptionModel], {name: 'findSponsorsByChannel'})
    async findSponsorsByChannel(@Args('channelId') channelId: number) {
        return this.channelService.findSponsorsByChannel(channelId);
    }
}
