import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from 'src/common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';
import { SignInDto, SignUpDto } from './dto';
import { ResponseUtil } from 'src/common/utils/response.util';
import { AccessTokenStrategy } from './strategies/access-token';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly res: ResponseUtil
    ) { }

    @Public()
    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    async signIn(
        @Body() signInDto: SignInDto
    ) {
        const tokens = await this.authService.signIn(signInDto);
        return this.res.success('Login successed', tokens, HttpStatus.OK);
    }

    @Public()
    @Post('sign-up')
    @HttpCode(HttpStatus.CREATED)
    async signUp(
        @Body() signUpDto: SignUpDto
    ) {
        const user = await this.authService.signUp(signUpDto);
        return this.res.success('Sign up successed', user, HttpStatus.CREATED);
    }

    @Post('sign-out')
    @UseGuards(AccessTokenStrategy)
    @HttpCode(HttpStatus.OK)
    async signOut(
        @GetCurrentUserId() userId: string
    ) {
        const isSignOut = await this.authService.signOut(userId);
        return this.res.success('Sign out successed', isSignOut, HttpStatus.OK);
    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') refreshToken: string
    ) {
        const tokens = await this.authService.refreshTokens(userId, refreshToken);
        return this.res.success('Refresh successed', tokens, HttpStatus.OK);
    }
}
