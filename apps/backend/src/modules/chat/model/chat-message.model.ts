import {Field, ObjectType} from "@nestjs/graphql";
import {ChatMessage} from "../../../../prisma/generated";
import {StreamModel} from "../../stream/models/stream.model";
import {UserModel} from "../../auth/account/models/user.model";


@ObjectType()
export class ChatMessageModel implements ChatMessage {
    @Field(() => Number)
    id: number;

    @Field(() => Number)
    userId: number;

    @Field(() => UserModel)
    user: UserModel;


    @Field(() => String)
    text: string;

    @Field(() => Number)
    streamId: number;

    @Field(() => StreamModel)
    stream: StreamModel

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;



}