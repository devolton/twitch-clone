import {Mutation, Resolver, Args} from '@nestjs/graphql';
import {IngressService} from './ingress.service';
import {Authorization} from "../../../shared/decorators/auth.decorator";
import {Authorized} from "../../../shared/decorators/authorized.decorator";
import {User} from "../../../../prisma/generated";
import type {IngressInput} from "livekit-server-sdk";

@Resolver('Ingress')
export class IngressResolver {
    constructor(private readonly ingressService: IngressService) {
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'createIngress'})
    async createIngress(
        @Authorized() user: User,
        @Args('ingressType') ingressType: IngressInput
    ) {
        return await this.ingressService.create(user, ingressType)
    }


}
