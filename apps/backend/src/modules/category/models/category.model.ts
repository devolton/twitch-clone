import {Category} from "../../../../prisma/generated";
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class CategoryModel implements Category {
    @Field(() => Number)
    id: number;
    @Field(() => String)
    title: string;
    @Field(() => String)
    slug: string;
    @Field(() => String, {nullable: true})
    description: string;
    @Field(() => String)
    thumbnailUrl: string;
    @Field(() => Date)
    createdAt: Date;
    @Field(() => Date)
    updatedAt: Date;

}