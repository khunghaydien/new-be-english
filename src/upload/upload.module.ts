import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Specify the directory to store uploaded files
        filename: (req, file, cb) => {
          const ext = file.originalname.split('.').pop();
          cb(null, `${Date.now()}.${ext}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
      },
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController]
})
export class UploadModule { }
