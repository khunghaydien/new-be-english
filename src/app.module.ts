import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { LibraryModule } from './library/library.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards';
import { SearchModule } from './search/search.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UploadModule, AuthModule, LibraryModule, SearchModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    AppService],
})
export class AppModule { }
