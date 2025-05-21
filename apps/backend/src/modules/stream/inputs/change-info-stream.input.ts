import {InputType, Field} from "@nestjs/graphql";
import {IsString, IsNotEmpty, IsNumber} from 'class-validator'


@InputType()
export class ChangeInfoStreamInput {
    @IsString()
    @IsNotEmpty()
    @Field(()=>String)
    title: string;

    @IsNumber()
    @IsNotEmpty()
    @Field(()=>Number)
    categoryId: number;
}