import {Args, Context, Mutation, Resolver} from '@nestjs/graphql';
import {VerificationService} from './verification.service';
import type {GqlContext} from "../../../shared/types/gql-context.types";
import {VerificationInput} from "./inputs/verification.input";
import {UserAgent} from "../../../shared/decorators/user-agent.decorator";
import {AuthModel} from "../account/models/auth.model";

@Resolver('Verification')
export class VerificationResolver {
    constructor(private readonly verificationService: VerificationService) {
    }

    @Mutation(() => AuthModel, {name: 'verifyAccount'})
    async verify(
        @Context() {req}: GqlContext,
        @Args('data',{ type: () => VerificationInput }) input: VerificationInput,
        @UserAgent() userAgent: string
    ) {
        return await this.verificationService.verify(req, input, userAgent);
    }
}
