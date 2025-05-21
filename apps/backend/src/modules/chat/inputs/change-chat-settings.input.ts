import {InputType, Field} from "@nestjs/graphql";
import {IsBoolean} from "class-validator";

@InputType()
export class ChangeChatSettingsInput {

    @IsBoolean()
    @Field(()=>Boolean)
    isChatEnabled: boolean;
    @IsBoolean()
    @Field(()=>Boolean,{nullable:true})
    isChatFollowersOnly?: boolean;
    @IsBoolean()
    @Field(()=>Boolean,{nullable:true})
    isChatPremiumFollowersOnly?: boolean;

}