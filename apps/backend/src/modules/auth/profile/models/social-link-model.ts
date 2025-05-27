import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class SocialLinkModel {
    @Field(() => Number)
    id: number;
    @Field(() => Number)
    position: number;
    @Field(() => String)
    title: string;
    @Field(() => String)
    url: string;

}