import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsString({ message: "Email must be string" })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be string" })
  @Length(8, 16, { message: "Password must be between 8 and 16 characters" })
  password: string;
}
export class SignUpDto extends SignInDto {
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name is string" })
  name: string;
}
