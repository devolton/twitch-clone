import {Args, Context, Mutation, Resolver} from '@nestjs/graphql';
import {DeactivateService} from './deactivate.service';
import type {GqlContext} from "../../../shared/types/gql-context.types";
import {UserAgent} from "../../../shared/decorators/user-agent.decorator";
import {Authorized} from "../../../shared/decorators/authorized.decorator";
import {User} from "../../../../prisma/generated";
import {DeactivateAccountInput} from "./inputs/deactivate-account.input";
import {AuthModel} from "../account/models/auth.model";
import {Authorization} from "../../../shared/decorators/auth.decorator";

@Resolver('Deactivate')
export class DeactivateResolver {
    constructor(private readonly deactivateService: DeactivateService) {
    }

    @Authorization()
    @Mutation(() => AuthModel, {name: 'deactivateAccount'})
    async deactivate(
        @Context() {req}: GqlContext,
        @Authorized() user: User,
        @Args('data', {type: () => DeactivateAccountInput}) input: DeactivateAccountInput,
        @UserAgent() userAgent: string
    ) {
        return await this.deactivateService.deactivate(req, input, user, userAgent);
    }
}
