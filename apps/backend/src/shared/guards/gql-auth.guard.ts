import {CanActivate,type ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {PrismaService} from "../../core/prisma/prisma.service";
import {Observable} from "rxjs";
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class GqlAuthGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {
    }

    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        if (typeof request.session.userId === "undefined") {
            throw new UnauthorizedException("User is not authorized");
        }
        const user = await this.prisma.user.findFirst({
            where: {
                id: request.session.userId,
            }
        });
        request.user=user;
        return true;
    }
}