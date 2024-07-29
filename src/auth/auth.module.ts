import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResponseUtil } from 'src/common/utils/response.util';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, ConfigService, ResponseUtil]
})
export class AuthModule { }
