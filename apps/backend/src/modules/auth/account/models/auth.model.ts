import {Field, ObjectType} from "@nestjs/graphql";
import {UserModel} from "./user.model";
import {IsString} from "class-validator";

@ObjectType()
export class AuthModel {
    @Field(() => UserModel, {nullable: true})
    user?: UserModel;

    @Field(() => String, {nullable: true})
    @IsString()
    message?: string;
}