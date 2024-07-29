import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from 'src/common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';
import { SignInDto, SignUpDto } from './dto';
import { User } from '@prisma/client';
import { response, Response } from 'express';
import { ResponseUtil } from 'src/common/utils/response.util';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    async signIn(
        @Body() signInDto: SignInDto,
        @Res() res: Response
    ) {
        const tokens = await this.authService.signIn(signInDto);
        ResponseUtil.success(res, 'Login successed', tokens, HttpStatus.OK);
    }

    @Public()
    @Post('sign-up')
    @HttpCode(HttpStatus.CREATED)
    async signUp(
        @Body() signUpDto: SignUpDto,
        @Res() res: Response
    ) {
        const user = await this.authService.signUp(signUpDto);
        ResponseUtil.success(res, 'Sign up successed', user, HttpStatus.CREATED);
    }

    @Post('sign-out')
    @HttpCode(HttpStatus.OK)
    async signOut(
        @GetCurrentUserId() userId: string,
        @Res() res: Response
    ) {
        const isSignOut = await this.authService.signOut(userId);
        ResponseUtil.success(res, 'Sign out successed', isSignOut, HttpStatus.OK);

    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') refreshToken: string,
        @Res() res: Response
    ) {
        const tokens = await this.authService.refreshTokens(userId, refreshToken);
        ResponseUtil.success(res, 'Refresh successed', tokens, HttpStatus.OK);
    }
}
