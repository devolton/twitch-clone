import {Field, ID, ObjectType} from "@nestjs/graphql";
import {DeviceInfo, LocationInfo, SessionMetadata} from "../../../shared/types/session-metadata.types";


@ObjectType()
export class LocationModel implements LocationInfo {
    @Field(() => String)
    country: string;

    @Field(() => String)
    city: string;

    @Field(() => Number)
    latitude: number;

    @Field(() => Number)
    longitude: number;

}

@ObjectType()
export class DeviceModel implements DeviceInfo {
    @Field(() => String)
    browser: string;

    @Field(() => String)
    os: string;

    @Field(() => String)
    type: string;

}

@ObjectType()
export class SessionMetadataModel implements SessionMetadata {
    @Field(() => LocationModel)
    location: LocationModel;

    @Field(() => DeviceModel)
    device: DeviceModel;

    @Field(() => String)
    ip: string;

}

@ObjectType()
export class SessionModel {
    @Field(() => ID)
    id: string;

    @Field(() => Number)
    userId: number;

    @Field(() => String)
    createdAt: string;

    @Field(()=>SessionMetadataModel)
    metadata:SessionMetadataModel;
}