import {Field, InputType} from "@nestjs/graphql";
import {IsEmail, IsNotEmpty, IsString, Matches, MinLength} from "class-validator";

@InputType()
export class CreateUserInput {
    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
    username: string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @Field(() => String)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Field(() => String)
    password: string;
}