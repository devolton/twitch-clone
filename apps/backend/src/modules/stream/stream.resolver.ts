import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {StreamService} from './stream.service';
import {StreamModel} from "./models/stream.model";
import {FilterInput} from "./inputs/filter.input";
import {Authorized} from "../../shared/decorators/authorized.decorator";
import type {User} from "../../../prisma/generated";
import Upload from "graphql-upload/Upload.mjs";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import {ChangeInfoStreamInput} from "./inputs/change-info-stream.input";
import {Authorization} from "../../shared/decorators/auth.decorator";
import {GenerateTokenModel} from "./models/generate-token.model";
import {GenerateStreamTokenInput} from "./inputs/generate-stream-token.input";

@Resolver('Stream')
export class StreamResolver {
    constructor(private readonly streamService: StreamService) {
    }

    @Query(() => [StreamModel], {name: 'findAllStreams'})
    async findAll(@Args('filter', {type: () => FilterInput}) input: FilterInput) {
        return await this.streamService.findAll(input);
    }

    @Query(() => [StreamModel], {name: 'findRandomStreams'})
    async findRandomStreams() {
        return await this.streamService.findRandomStreams();
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'changeStreamInfo'})
    async changeInfo(@Authorized() user: User, @Args('data') input: ChangeInfoStreamInput) {
        return await this.streamService.changeInfo(user, input);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'changeStreamThumbnail'})
    async changeThumbnail(@Authorized() user: User, @Args('thumbnail', {type: () => GraphQLUpload}) thumbnail: Upload) {
        return await this.streamService.changeThumbnail(user, thumbnail);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'removeStreamThumbnail'})
    async removeStreamThumbnail(@Authorized() user: User) {
        return await this.streamService.removeThumbnail(user);
    }

    @Mutation(() => GenerateTokenModel, {name: 'generateStreamToken'})
    async generateToken(@Args('data', {type: () => GenerateStreamTokenInput}) input: GenerateStreamTokenInput) {
        return this.streamService.generateToken(input);
    }

}
