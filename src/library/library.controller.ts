import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Res } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateChapterDto, FilterChapterDto, UpdateChapterDto } from './dto/chapter.dto';
import { ResponseUtil } from 'src/common/utils/response.util';
import { Response } from 'express';
import { OrderByDto, PaginationDto } from 'src/common/dto';
import { Public } from 'src/common/decorators';

@Controller('library')
export class LibraryController {
    constructor(
        private libraryService: LibraryService,
        private res: ResponseUtil
    ) { }

    @Post('chapter')
    @HttpCode(HttpStatus.CREATED)
    async createChapter(
        @Body() createChapterDto: CreateChapterDto
    ) {
        const chapter = await this.libraryService.createChapter(createChapterDto);
        return this.res.success('Create chapter successed', chapter, HttpStatus.CREATED);
    }

    @Delete('chapter')
    @HttpCode(HttpStatus.OK)
    async deleteChapter(
        @Query() id: string
    ) {
        const chapter = await this.libraryService.deleteChapter(id);
        return this.res.success('Delete chapter successed', chapter, HttpStatus.OK);
    }

    @Put('chapter')
    @HttpCode(HttpStatus.OK)
    async updateChapter(
        @Body() updateChapterDto: UpdateChapterDto
    ) {
        const chapter = await this.libraryService.updateChapter(updateChapterDto);
        return this.res.success('Update chapter successed', chapter, HttpStatus.OK);
    }

    @Public()
    @Get('chapters')
    @HttpCode(HttpStatus.OK)
    async getChapters(
        @Query() filterChapterDto: FilterChapterDto,
        @Query() paginationDto: PaginationDto,
        @Query() orderByDto: OrderByDto
    ) {
        const chapter = await this.libraryService.getChapters(filterChapterDto, paginationDto, orderByDto);
        return this.res.success('Update chapter successed', chapter, HttpStatus.OK);
    }
}
