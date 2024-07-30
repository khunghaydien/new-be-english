import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateChapterDto, FilterChapterDto, UpdateChapterDto } from './dto/chapter.dto';
import { Chapter, Prisma } from '@prisma/client';
import { OrderByDto, PaginationDto } from 'src/common/dto';
import { isEmpty } from 'class-validator';
import { ChaptersResponse } from './model';
import { PaginationResponse } from 'src/common/model';
import { SearchService } from 'src/search/search.service';

@Injectable()
export class LibraryService {
    constructor(
        private prisma: PrismaService,
        private searchService: SearchService
    ) { }

    async createChapter({ name, type, description, difficulty }: CreateChapterDto): Promise<Chapter> {
        try {
            const chapter = await this.prisma.chapter.create({
                data: {
                    name,
                    type,
                    description,
                    difficulty
                }
            })
            this.searchService.createSearch({
                description: '',
                relativeId: chapter.id,
                name: chapter.name,
                type: [...type, difficulty]
            });
            return chapter
        } catch { }
    }

    async updateChapter({ name, type, description, difficulty }: UpdateChapterDto): Promise<Chapter> {
        try {
            const chapter = await this.prisma.chapter.create({
                data: {
                    name,
                    description,
                    type,
                    difficulty
                },
            });
            this.searchService.updateSearch({
                description: '',
                relativeId: chapter.id,
                name: chapter.name,
                type: [...type, difficulty]
            });
            return chapter
        } catch { }
    }

    async deleteChapter(id: string): Promise<Chapter> {
        try {
            const chapter = await this.prisma.chapter.delete({
                where: { id }
            })
            this.searchService.deleteSearch(id);
            return chapter
        } catch { }
    }

    async getChapters(
        { name, type, difficulty }: FilterChapterDto,
        { page = 1, pageSize = 10 }: PaginationDto,
        { field, order }: OrderByDto
    ): Promise<ChaptersResponse> {
        try {
            const where: Prisma.ChapterWhereInput = {}
            if (name) {
                where.name = { contains: name, mode: 'insensitive' }
            }
            if (type && !isEmpty(type)) {
                where.type = { hasSome: type }
            }
            if (difficulty) {
                where.difficulty = difficulty
            }
            const orderBy: Prisma.ChapterOrderByWithRelationInput = {
                [field]: order
            }
            const skip = (page - 1) * pageSize
            const take = pageSize
            const [totalElement, chapters] = await Promise.all([
                this.prisma.chapter.count({ where }),
                this.prisma.chapter.findMany({
                    where,
                    skip,
                    take,
                    orderBy
                })
            ])
            const pagination: PaginationResponse = {
                currentPage: page,
                pageSize,
                totalElement,
                totalPages: Math.ceil(totalElement / pageSize)
            }
            return {
                chapters,
                pagination
            }
        } catch { }
    }
}
