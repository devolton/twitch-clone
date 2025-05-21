import {Query, Resolver, Args, Mutation} from '@nestjs/graphql';
import {PlanService} from './plan.service';
import {Authorized} from "../../../shared/decorators/authorized.decorator";
import type {User} from "../../../../prisma/generated";
import {PlanModel} from "./models/plan.model";
import {Authorization} from "../../../shared/decorators/auth.decorator";
import {CreatePlanInput} from "./inputs/create-plan.input";

@Resolver('Plan')
export class PlanResolver {
    constructor(private readonly planService: PlanService) {
    }


    @Authorization()
    @Query(() => [PlanModel], {name: "findMyPlans"})
    async findMyPlans(@Authorized() user: User) {
        return this.planService.findMyPlan(user);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'createPlan'})
    async createPlan(@Authorized() user: User,
                     @Args('data', {type: () => CreatePlanInput}) input: CreatePlanInput) {
        return this.planService.createPlan(user, input);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'removePlan'})
    async removePlan(@Args('planId', {type: () => Number}) planId: number) {
        return this.planService.removePlan(planId);
    }

}
