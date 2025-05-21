import {InputType, Field} from "@nestjs/graphql";
import {IsString, IsNotEmpty} from 'class-validator'

@InputType()
export class SocialLinkInput {
    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    title: string;

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    url: string;

}