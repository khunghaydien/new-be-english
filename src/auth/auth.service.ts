import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma.service';
import { JwtPayload, Tokens } from './type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }

    async signupLocal({ email, password }: AuthDto): Promise<Tokens> {
        const hashedPassword = await argon.hash(password);
        const user = await this.prisma.user
            .create({
                data: {
                    email,
                    password: hashedPassword,
                },
            })
            .catch((error) => {
                if (error instanceof PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        throw new ForbiddenException('Credentials incorrect');
                    }
                }
                throw error;
            });

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async signinLocal({ email, password }: AuthDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) throw new ForbiddenException('Access Denied');

        const passwordMatches = await argon.verify(user.password, password);
        if (!passwordMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async logout(userId: string): Promise<boolean> {
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
        if (!user || !user.hashedRefreshToken) throw new ForbiddenException('Access Denied');

        const rtMatches = await argon.verify(user.hashedRefreshToken, refreshToken);
        if (!rtMatches) throw new ForbiddenException('Access Denied');

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
