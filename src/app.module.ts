import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { LibraryModule } from './library/library.module';

@Module({
  imports: [UploadModule, AuthModule, LibraryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
