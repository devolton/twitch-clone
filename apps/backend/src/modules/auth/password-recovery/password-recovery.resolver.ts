import {Context, Mutation, Resolver, Args} from '@nestjs/graphql';
import {PasswordRecoveryService} from './password-recovery.service';
import {UserAgent} from "../../../shared/decorators/user-agent.decorator";
import {ResetPasswordInput} from "./inputs/reset-password.input";
import {NewPasswordInput} from "./inputs/new-password.input";


@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {
    constructor(private readonly passwordRecoveryService: PasswordRecoveryService) {
    }

    @Mutation(() => Boolean, {name: "resetPassword"})
    async resetPassword(@Context() {req},
                        @Args('data', {type: () => ResetPasswordInput}) input: ResetPasswordInput,
                        @UserAgent() userAgent: string) {
        return await this.passwordRecoveryService.resetPassword(req, input, userAgent);

    }

    @Mutation(() => Boolean, {name: "newPassword"})
    async newPassword(@Args('data', {type: () => NewPasswordInput}) input: NewPasswordInput) {
        return await this.passwordRecoveryService.newPassword(input);

    }


}
