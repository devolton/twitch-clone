import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {SessionService} from './session.service';
import {GqlContext} from "../../shared/types/gql-context.types";
import {LoginInput} from "./inputs/login.input";
import {UserAgent} from "../../shared/decorators/user-agent.decorator";
import {Authorization} from "../../shared/decorators/auth.decorator";
import {SessionModel} from "./models/session.model";
import {AuthModel} from "../auth/account/models/auth.model";

@Resolver('Session')
export class SessionResolver {
    constructor(private readonly sessionService: SessionService) {
    }

    @Authorization()
    @Query(() => [SessionModel], {name: 'findSessionsByUser'})
    async findByUser(@Context() {req}: GqlContext) {
        return await this.sessionService.findByUser(req);
    }

    @Authorization()
    @Query(() => SessionModel, {name: "findCurrentSession"})
    async findCurrentSession(@Context() {req}: GqlContext) {
        return await this.sessionService.findCurrentSession(req);
    }

    @Mutation(() => AuthModel, {name: 'login'})
    async login(@Context() {req}: GqlContext,
                @Args('data', {type: () => LoginInput}) data: LoginInput,
                @UserAgent() userAgent: string) {
        return this.sessionService.login(req, data, userAgent);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'logout'})
    async logout(@Context() {req}: GqlContext) {
        return await this.sessionService.logout(req);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'clearSessionCookies'})
    async clearSession(@Context() {req}: GqlContext) {
        return await this.sessionService.clearSession(req);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'removeSession'})
    async remove(@Context() {req}: GqlContext, @Args('id', {type: () => String}) sessionId: string) {
        return await this.sessionService.removeSession(req, sessionId);
    }

}
