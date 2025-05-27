import {Query, Resolver} from '@nestjs/graphql';
import {ProfileService} from './profile.service';
import {Authorized} from "../../../shared/decorators/authorized.decorator";
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
import type {User} from "../../../../prisma/generated";
import Upload from "graphql-upload/Upload.mjs";
import {Mutation, Args} from "@nestjs/graphql";
import {Authorization} from "../../../shared/decorators/auth.decorator";
import {FileValidationPipe} from "../../../shared/pipes/file-validation.pipe";
import {ChangeProfileInfoInput} from "./inputs/change-profile-info.input";
import {SocialLinkInput} from "./inputs/social-link.input";
import {SocialLinkOrderInput} from "./inputs/social-link-order.input";
import {SocialLinkModel} from "./models/social-link-model";


@Resolver('Profile')
export class ProfileResolver {
    constructor(private readonly profileService: ProfileService) {
    }

    @Authorization()
    @Query(() => [SocialLinkModel],{name: 'findSocialLinks'})
    async findSocialLinks(@Authorized() user: User) {
        return await this.profileService.findSocialLinks(user);
    }


    @Authorization()
    @Mutation(() => Boolean, {name: 'changeProfileAvatar'})
    async changeAvatar(@Authorized() user: User, @Args('avatar', {type: () => GraphQLUpload}, FileValidationPipe) avatar: Upload) {
        return await this.profileService.changeAvatar(user, avatar);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'removeProfileAvatar'})
    async removeAvatar(@Authorized() user: User) {
        return await this.profileService.removeAvatar(user);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'changeProfileInfo'})
    async changeProfileInfo(
        @Authorized() user: User,
        @Args('data') input: ChangeProfileInfoInput) {
        return await this.profileService.changeInfo(user, input);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'createSocialLink'})
    async createSocialLink(
        @Authorized() user: User,
        @Args('data') input: SocialLinkInput) {
        return await this.profileService.createSocialLink(user, input);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'reorderSocialLinks'})
    async reorderSocialLinks(
        @Args('list', {type: () => [SocialLinkOrderInput]}) inputs: SocialLinkOrderInput[]) {
        return await this.profileService.reorderSocialLink(inputs);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'updateSocialLink'})
    async updateSocialLink(
        @Args('id', {type: () => Number}) id: number,
        @Args('data') input: SocialLinkInput) {
        return await this.profileService.updateSocialLink(id, input);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'removeSocialLink'})
    async removeSocialLink(
        @Args('id', {type: () => Number}) id: number) {
        return await this.profileService.removeSocialLink(id);
    }

}
