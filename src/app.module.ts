import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { LibraryModule } from './library/library.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UploadModule, AuthModule, LibraryModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    AppService],
})
export class AppModule { }
