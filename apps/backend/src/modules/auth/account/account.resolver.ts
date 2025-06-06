import {Query, Resolver, Mutation, Args} from '@nestjs/graphql';
import {AccountService} from './account.service';
import {UserModel} from "./models/user.model";
import {CreateUserInput} from "./inputs/create-user-input";
import {Authorized} from "../../../shared/decorators/authorized.decorator";
import {Authorization} from "../../../shared/decorators/auth.decorator";
import {ChangeEmailInput} from "./inputs/change-email.input";
import {User} from "../../../../prisma/generated";
import {ChangePasswordInput} from "./inputs/change-password.input";


@Resolver('Account')
export class AccountResolver {
    public constructor(private readonly accountService: AccountService) {
    }

    @Authorization()
    @Query(() => UserModel, {name: 'findProfile'})
    public async me(@Authorized() id: number) {
        return await this.accountService.me(id);
    }

    @Mutation(() => Boolean, {name: 'createUser'})
    public async create(@Args('data') input: CreateUserInput) {
        return await this.accountService.create(input);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'changeEmail'})
    public async changeEmail(
        @Authorized() user: User,
        @Args('data') input: ChangeEmailInput) {
        return await this.accountService.changeEmail(user, input);
    }

    @Mutation(() => Boolean, {name: 'changePassword'})
    public async changePassword(
        @Authorized() user: User,
        @Args('data') input: ChangePasswordInput) {
        return await this.accountService.changePassword(user, input);
    }


}
