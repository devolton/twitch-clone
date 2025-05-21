import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class ChangeEmailInput {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @Field(()=>String)
    email: string;
}