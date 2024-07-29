import { EExercise } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateQuestionDto } from "./question.dto";

export class createExerciseDto {
    @IsNotEmpty({ message: "Name is required." })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsNotEmpty({ message: "Construction is required." })
    @IsString({ message: 'Construction must be a string' })
    construction: string;

    @IsNotEmpty({ message: "Type is required." })
    @IsString({ message: 'Level must be string' })
    type: EExercise

    @IsNotEmpty({ message: "Questions are required." })
    questions: CreateQuestionDto[];
}