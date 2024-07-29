import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { JwtPayload, Tokens } from './type';
import { SignInDto, SignUpDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }

    async signUp({ email, password, name }: SignUpDto): Promise<User> {
        const existedUser = await this.prisma.user.findUnique({
            where: { email }
        })
        if (existedUser) {
            throw new BadRequestException({ email: 'Email is already in use' });
        }
        const hashedPassword = await argon.hash(password);
        const user = await this.prisma.user.create({
            data: {
                name,
                password: hashedPassword,
                email
            }
        })
        return user
    }

    async validateUser({ email, password }: SignInDto) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        })
        if (user && (await argon.verify(user.password, password))) {
            return user;
        }
        return null;
    }

    async signIn({ email, password }: SignInDto): Promise<Tokens> {
        const user = await this.validateUser({ email, password });
        if (!user) {
            throw new BadRequestException({ invalidCredentials: 'Invalid credentials' });
        }
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async signOut(userId: string): Promise<boolean> {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRefreshToken: {
                    not: null,
                },
            },
            data: {
                hashedRefreshToken: null,
            },
        });
        return true;
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user || !user.hashedRefreshToken) throw new ForbiddenException('User invalid');

        const RefreshTokenMatches = await argon.verify(user.hashedRefreshToken, refreshToken);
        if (!RefreshTokenMatches) throw new ForbiddenException('Refresh token invalid');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async updateRefreshTokenHash(userId: string, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await argon.hash(refreshToken);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRefreshToken
            },
        });
    }

    async getTokens(userId: string, email: string): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
            id: userId,
            email: email,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
                expiresIn: '7d',
            }),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
}
