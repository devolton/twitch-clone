import {Resolver, Args, Query, Mutation, Subscription} from '@nestjs/graphql';
import {ChatService} from './chat.service';
import {PubSub} from "graphql-subscriptions";
import {ChatMessageModel} from "./model/chat-message.model";
import {Authorization} from "../../shared/decorators/auth.decorator";
import {Authorized} from "../../shared/decorators/authorized.decorator";
import {User} from "../../../prisma/generated";
import {ChangeChatSettingsInput} from "./inputs/change-chat-settings.input";
import {SendMessageInput} from "./inputs/send-message.input";


@Resolver('Chat')
export class ChatResolver {
    private readonly pubSub: PubSub;

    constructor(private readonly chatService: ChatService) {
        this.pubSub = new PubSub();
    }

    @Query(() => [ChatMessageModel], {name: 'findChatMessagesByStream'})
    async findMessagesByStream(@Args('streamId') id: number) {
        return this.chatService.findMessagesByStream(id);
    }


    @Authorization()
    @Mutation(() => Boolean, {name: 'changeChatSettings'})
    async changeChatSettings(@Authorized() user: User,
                             @Args('data', {type: () => ChangeChatSettingsInput}) input: ChangeChatSettingsInput) {
        return this.chatService.changeSettings(user, input);
    }

    @Authorization()
    @Mutation(() => ChatMessageModel, {name: 'sendChatMessage'})
    async sendMessage(@Authorized('id') userId: number,
                      @Args('data',{type:()=>SendMessageInput}) input: SendMessageInput) {
        const message = await this.chatService.sendMessage(userId, input);
        this.pubSub.publish('CHAT_MESSAGE_ADDED', {chatMessageAdded: message});
        return message;
    }

    @Subscription(() => ChatMessageModel, {
        name: 'chatMessageAdded', filter: (payload, variables) =>
            payload.chatMessageAdded.streamId === variables.streamId

    })
    chatMessageAdded(@Args('streamId') streamId: number) {
        return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED');
    }
}
