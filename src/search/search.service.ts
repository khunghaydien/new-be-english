import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSearchDto, FilterSearchDto } from './search.dto';
import { Prisma, Search } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { isEmpty } from 'class-validator';

@Injectable()
export class SearchService {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    async createSearch({ name, relativeId, type, description }: CreateSearchDto) {
        const search = await this.prisma.search.create({
            data: {
                name,
                relativeId,
                type,
                description
            }
        })
        return search
    }

    async updateSearch({ relativeId, name, type }: CreateSearchDto): Promise<Search> {
        try {
            return this.prisma.search.update({
                where: { relativeId: relativeId },
                data: {
                    name,
                    type
                }
            })
        } catch (error) {
        }
    }

    async deleteSearch(relativeId: string): Promise<Search> {
        try {
            return this.prisma.search.delete({
                where: { relativeId }
            })
        }
        catch (error) { }
    }

    async getSearchs({ name, type }: FilterSearchDto, { page = 1, pageSize = 10 }: PaginationDto): Promise<Search[]> {
        const where: Prisma.SearchWhereInput = {}
        if (name) {
            where.name = { contains: name, mode: 'insensitive' };
        }
        if (type && !isEmpty(type)) {
            where.OR = [
                { type: { hasSome: type } },
                { type: { equals: [] } }
            ]
        }
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        return this.prisma.search.findMany({
            where,
            skip,
            take,
            orderBy: { name: 'asc' }
        })
    }
}
