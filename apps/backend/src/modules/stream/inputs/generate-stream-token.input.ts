import {InputType, Field} from "@nestjs/graphql";
import {IsNumber, IsNotEmpty} from "class-validator";

@InputType()
export class GenerateStreamTokenInput {
    @IsNumber()
    @IsNotEmpty()
    @Field(() => Number)
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    @Field(() => Number)
    channelId: number;
}