import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty, IsUUID} from "class-validator";

@InputType()
export class VerificationInput {
    @Field(()=>String)
    @IsNotEmpty()
    @IsUUID("4")
    token:string;

}