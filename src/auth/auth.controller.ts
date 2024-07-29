import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { LoginResponse } from './auth.model';
import { ResponseUtil } from 'src/common/response.util';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res() res: Response,
    ) {
        try {
            const user = await this.authService.login(loginDto);
            ResponseUtil.success(res, 'Login successed', user, HttpStatus.CREATED);
        } catch (error) {
            ResponseUtil.error(res, 'Login failed', error);
        }
    }

    @Post('register')
    async register(
        @Body() registerDto: RegisterDto,
        @Res() res: Response,
    ) {
        try {
            const user = await this.authService.register(registerDto);
            ResponseUtil.success(res, 'User registered successfully', user, HttpStatus.CREATED);
        } catch (error) {
            ResponseUtil.error(res, 'User registration failed', error);
        }
    }
}
