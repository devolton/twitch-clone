import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../core/prisma/prisma.service";

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {
    }

    async findAll() {
        return this.prisma.category.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                streams: {
                    include: {
                        user: true,
                        category: true
                    }
                }
            }
        });
    }

    async findRandomCategories() {
        const total: number = await this.prisma.category.count();
        let randomIndexes = new Set<number>();
        while (randomIndexes.size < 4) {
            const randomIndex = Math.floor(Math.random() * total);
            randomIndexes.add(randomIndex);
        }
        const categories = await this.prisma.category.findMany({
            include: {
                streams: {
                    include: {
                        user: true,
                        category: true
                    }
                }
            },
            take: total,
            skip: 0
        });

        return Array.from(randomIndexes).map(index => categories[index]);

    }

    async findBySlug(slug: string) {
        const category = await this.prisma.category.findUnique({
            where: {
                slug
            },
            include: {
                streams: {
                    include: {
                        user: true,
                        category: true
                    }
                }
            }
        });
        if (!category) {
            throw new NotFoundException('No such category');
        }
        return category;
    }
}
