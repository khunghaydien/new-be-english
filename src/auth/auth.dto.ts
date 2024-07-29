import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}