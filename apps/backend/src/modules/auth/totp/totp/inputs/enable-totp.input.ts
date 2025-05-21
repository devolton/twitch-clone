import {InputType, Field} from "@nestjs/graphql";
import {IsString, IsNotEmpty, Length} from "class-validator";


@InputType()
export class EnableTotpInput {
    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    secret: string;


    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    pin: string;
}