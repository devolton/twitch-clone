import {IsEmail, IsNotEmpty, IsString, Length, Matches, MinLength} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class LoginInput{
    @IsString()
    @IsNotEmpty()
    @Field(()=>String)
    login: string;


    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Field(()=>String)
    password: string;

    @Field(()=> String,{nullable:true})
    @IsString()
    @Length(6,6)
    pin?: string;
}