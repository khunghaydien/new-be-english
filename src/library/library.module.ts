import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { PrismaService } from 'src/prisma.service';
import { ResponseUtil } from 'src/common/utils/response.util';
import { SearchService } from 'src/search/search.service';

@Module({
  controllers: [LibraryController],
  providers: [LibraryService, PrismaService, ResponseUtil, SearchService]
})
export class LibraryModule { }
