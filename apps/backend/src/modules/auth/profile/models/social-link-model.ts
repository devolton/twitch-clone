import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class SocialLinkModel {
    @Field(() => String)
    title: string;

    @Field(() => String)
    url: string;

}