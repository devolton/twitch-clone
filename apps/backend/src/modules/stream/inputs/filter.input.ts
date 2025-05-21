import {Field, InputType} from "@nestjs/graphql";
import {IsString, IsNumber, IsOptional} from "class-validator";


@InputType()
export class FilterInput {
    @IsNumber()
    @IsOptional()
    @Field(() => Number, {nullable: true})
    take?: number

    @IsNumber()
    @IsOptional()
    @Field(() => Number, {nullable: true})
    skip?: number;
    @IsString()
    @IsOptional()
    @Field(() => String, {nullable: true})
    searchTerm?: string;

}