import {InputType, Field} from "@nestjs/graphql";
import {IsNotEmpty, IsEmail, IsString} from "class-validator";

@InputType()
export class ResetPasswordInput {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Field(()=>String)
    email:string;


}