import {IsNotEmpty, IsString, MinLength} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class ChangePasswordInput {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Field(() => String)
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Field(() => String)
    newPassword: string;
}