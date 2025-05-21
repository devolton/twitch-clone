import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {TotpService} from './totp.service';
import {User} from "../../../../../prisma/generated";
import {Authorized} from "../../../../shared/decorators/authorized.decorator";
import {TotpModel} from "./models/totp.model";
import {EnableTotpInput} from "./inputs/enable-totp.input";
import {Authorization} from "../../../../shared/decorators/auth.decorator";

@Resolver('Totp')
export class TotpResolver {
    constructor(private readonly totpService: TotpService) {
    }

    @Authorization()
    @Query(() => TotpModel, {name: 'generateTotpSecret'})
    async generate(@Authorized() user: User) {
        return await this.totpService.generate(user);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'enableTotp'})
    async enable(@Authorized() user: User,
                 @Args('data',{type:()=>EnableTotpInput}) input: EnableTotpInput) {
        return await this.totpService.enable(user, input);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'disableTotp'})
    async disable(@Authorized() user: User) {
        return await this.totpService.disable(user);
    }
}
