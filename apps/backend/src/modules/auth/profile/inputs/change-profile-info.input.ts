import {InputType, Field} from "@nestjs/graphql";
import {IsString, IsEmail, IsNotEmpty, Matches, MaxLength, IsOptional} from 'class-validator'

@InputType()
export class ChangeProfileInfoInput {
    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
    username: string;

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    displayName: string;

    @IsString()
    @MaxLength(512)
    @IsOptional()
    @Field(() => String)
    bio?: string;

}