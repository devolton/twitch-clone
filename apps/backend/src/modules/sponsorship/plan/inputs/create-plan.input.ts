import {InputType, Field} from "@nestjs/graphql";
import {IsString, IsNotEmpty, IsNumber, IsOptional} from "class-validator";

@InputType()
export class CreatePlanInput {
    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    title: string;

    @IsString()
    @IsOptional()
    @Field(() => String, {nullable: true})
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    @Field(() => Number)
    price: number;
}