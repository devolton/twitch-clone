import {Mutation, Query, Args, Resolver} from '@nestjs/graphql';
import {TransactionService} from './transaction.service';
import {TransactionModel} from "./models/transaction.model";
import {Authorization} from "../../../shared/decorators/auth.decorator";
import {Authorized} from "../../../shared/decorators/authorized.decorator";
import {User} from "../../../../prisma/generated";
import {MakePaymentModel} from "./models/make-payment.model";


@Resolver('Transaction')
export class TransactionResolver {
    constructor(private readonly transactionService: TransactionService) {
    }


    @Authorization()
    @Query(() => [TransactionModel], {name: 'findMyTransactions'})
    async findMyTransactions(@Authorized() user: User) {
        return this.transactionService.findMyTransactions(user);
    }


    @Authorization()
    @Mutation(() => MakePaymentModel, {name: 'makePayment'})
    async makePayment(@Authorized() user: User, @Args('planId',{type:()=>Number}) planId: number) {
        return this.transactionService.makePayment(user, planId);
    }


}
