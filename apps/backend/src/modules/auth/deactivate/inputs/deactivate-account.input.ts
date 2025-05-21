import {IsEmail, IsNotEmpty, IsString, Length, MinLength} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class DeactivateAccountInput {
    @IsEmail()
    @IsNotEmpty()
    @Field(() => String)
    email: string;


    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Field(() => String)
    password: string;

    @Field(() => String, {nullable: true})
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    pin?: string;
}