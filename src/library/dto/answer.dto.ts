import { IsNotEmpty, IsString } from "class-validator";

export class CreateAnswerDto {
  @IsString({ message: 'Label must be string' })
  label?: string;

  @IsNotEmpty({ message: "Value is required." })
  @IsString({ message: 'Value must be string' })
  value: string;

  isCorrect?: boolean;
}