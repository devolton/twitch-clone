import {InputType, Field} from "@nestjs/graphql";
import {IsNumber, IsNotEmpty} from "class-validator";

@InputType()
export class SocialLinkOrderInput {
    @IsNumber()
    @IsNotEmpty()
    @Field(() => Number)
    id: number;

    @IsNumber()
    @IsNotEmpty()
    @Field(() => Number)
    position: number;

}