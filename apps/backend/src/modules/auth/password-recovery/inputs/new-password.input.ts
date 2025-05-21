import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty, IsString, IsUUID, MinLength, Validate} from "class-validator";
import {IsPasswordMatchingConstraint} from "../../../../shared/decorators/is-password-matching-constraint.decorator";

@InputType()
export class NewPasswordInput {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Field(()=>String)
    password:string;


    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Field(()=>String)
    @Validate(IsPasswordMatchingConstraint)
    passwordRepeat:string;

    @Field(()=>String)
    @IsNotEmpty()
    @IsUUID("4")
    token:string;


}