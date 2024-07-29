import { IsNotEmpty, IsString } from "class-validator";
import { CreateAnswerDto } from "./answer.dto";

export class CreateQuestionDto {
    @IsNotEmpty({ message: "Question is required." })
    @IsString({ message: 'Question must be string' })
    question: string;

    @IsNotEmpty({ message: "Answers are required." })
    answers: CreateAnswerDto[];
}