import {ObjectType} from "@nestjs/graphql";
import {Field} from "@nestjs/graphql";

@ObjectType()
export class GenerateTokenModel {
    @Field(() => String)
    token: string;
}