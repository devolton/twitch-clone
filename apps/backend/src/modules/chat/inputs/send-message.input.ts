import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

@InputType()
export class SendMessageInput {

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    text: string;

    @IsNumber()
    @IsNotEmpty()
    @Field(() => Number)
    streamId: number
}