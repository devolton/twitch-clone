import {Query, Resolver} from '@nestjs/graphql';
import {SubscriptionService} from './subscription.service';
import {Authorization} from "../../../shared/decorators/auth.decorator";
import {SubscriptionModel} from "./models/subscription.model";
import {Authorized} from "../../../shared/decorators/authorized.decorator";
import {User} from "../../../../prisma/generated";



@Resolver('Subscription')
export class SubscriptionResolver {
    constructor(private readonly subscriptionService: SubscriptionService) {
    }

    @Authorization()
    @Query(() => [SubscriptionModel], {name: 'findMySponsors'})
    async findMySponsors(@Authorized() user: User) {
        return this.subscriptionService.findMySponsors(user);
    }
}
