import {type Transaction, TransactionStatus} from "../../../../../prisma/generated";
import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql'
import {UserModel} from "../../../auth/account/models/user.model";


registerEnumType(TransactionStatus, {
    name: 'TransactionStatus',
})

@ObjectType()
export class TransactionModel implements Transaction {
    @Field(() => Number)
    id: number;

    @Field(() => Number)
    amount: number;

    @Field(() => String)
    currency: string;

    @Field(() => String)
    stripeSubscriptionId: string;

    @Field(() => TransactionStatus)
    status: TransactionStatus;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => UserModel)
    user: UserModel;

    @Field(() => Number)
    userId: number;

}