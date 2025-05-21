import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../../core/prisma/prisma.service";
import {User} from "../../../../prisma/generated";

@Injectable()
export class SubscriptionService {
    constructor(private readonly prisma:PrismaService) {
    }

    async findMySponsors(user:User){
        return this. prisma.sponsorshipSubscription.findMany({
            where: {
                channelId:user.id,
            },
            orderBy:{
                createdAt:'desc'
            },
            include:{
                plan:true,
                user:true
            }
        })
    }
}
