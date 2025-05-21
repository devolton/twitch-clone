import {Query, Resolver, Args} from "@nestjs/graphql";
import {CategoryService} from "./category.service";
import {CategoryModel} from "./models/category.model";

@Resolver('Category')
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) {
    }

    @Query(() => [CategoryModel], {name: 'findAllCategories'})
    async findAll() {
        return this.categoryService.findAll();
    }

    @Query(() => [CategoryModel], {name: 'findRandomCategories'})
    async findRandom() {
        return this.categoryService.findRandomCategories();
    }

    @Query(() => CategoryModel, {name: 'findBySlug'})
    async findBySlug(@Args('slug') slug: string) {
        return this.categoryService.findBySlug(slug);
    }

}
