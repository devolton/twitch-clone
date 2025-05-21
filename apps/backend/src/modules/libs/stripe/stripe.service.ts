import {Inject, Injectable} from '@nestjs/common';
import {PrismaService} from "../../../core/prisma/prisma.service";
import Stripe from "stripe";
import {StripeOptionsSymbol, TypeStripeOptions} from "./types/stripe.types";

@Injectable()
export class StripeService extends Stripe {
    constructor(@Inject(StripeOptionsSymbol) private readonly options: TypeStripeOptions,
                private readonly prisma: PrismaService) {
        super(options.apiKey, options.config);
    }
}
