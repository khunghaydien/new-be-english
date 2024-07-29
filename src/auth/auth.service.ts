import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './auth.dto';
import { LoginResponse, TokenResponse } from './auth.model';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt'
import { response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const user = await this.validateUser(loginDto);
        if (!user) {
            throw new BadRequestException({ invalidCredentials: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = await this.createToken(user);
        return {
            accessToken,
            refreshToken,
            user
        }
    }

    async register(registerDto: RegisterDto): Promise<User> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email }
        })

        if (existingUser) {
            throw new BadRequestException({ email: 'Email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10)
        const user = await this.prisma.user.create({
            data: {
                fullname: registerDto.fullname,
                password: hashedPassword,
                email: registerDto.email,
            }
        })
        await this.createToken(user);
        return user
    }

    private async validateUser(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        })
        if (user && (await bcrypt.compare(loginDto.password, user.password))) {
            return user;
        }
        return null;
    }

    async createToken({ id }: User): Promise<TokenResponse> {
        const payload = { id };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: '1day',
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            expiresIn: '7d',
        });

        response.cookie('access_token', accessToken, { httpOnly: true });
        response.cookie('refresh_token', refreshToken, { httpOnly: true });

        return {
            accessToken,
            refreshToken
        }
    }

    async logout() {
        response.clearCookie('access_token');
        response.clearCookie('refresh_token');
    }
}
