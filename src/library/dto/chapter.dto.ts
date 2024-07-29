import { EChapter, EDifficulty } from "@prisma/client";
import { ArrayMinSize, ArrayNotEmpty, ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateChapterDto {
    @IsNotEmpty({ message: "Name is required." })
    @IsString({ message: 'Name must be string' })
    name: string

    @IsNotEmpty({ message: "Description is required." })
    @IsString({ message: 'Description must be string' })
    description: string

    @ArrayNotEmpty({ message: 'Chapter types are required.' })
    @IsArray({ message: 'Chapter types must be an array of strings.' })
    @ArrayMinSize(1, { message: 'At least one chapter type must be provided.' })
    @ArrayUnique({ message: 'Chapter types must be unique.' })
    @IsEnum(EChapter, { each: true, message: 'Each Chapter type must be a valid EChapter enum value.' })
    type: EChapter[];

    @IsNotEmpty({ message: "Level is required." })
    @IsString({ message: 'Level must be string' })
    difficulty: EDifficulty
}

export class UpdateChapterDto {
    @IsOptional()
    @IsString({ message: 'Name must be string' })
    name?: string

    @IsOptional()
    @IsString({ message: 'Description must be string' })
    description?: string

    @IsOptional()
    @IsArray({ message: 'Chapter types must be an array of strings.' })
    @ArrayMinSize(1, { message: 'At least one chapter type must be provided.' })
    @ArrayUnique({ message: 'Chapter types must be unique.' })
    @IsEnum(EChapter, { each: true, message: 'Each Chapter type must be a valid EChapter enum value.' })
    type?: EChapter[];

    @IsOptional()
    @IsString({ message: 'Level must be string' })
    difficulty?: EDifficulty
}

export class FilterChapterDto {
    @IsOptional()
    @IsString({ message: 'Name must be string' })
    name?: string

    @IsOptional()
    @IsArray({ message: 'Chapter types must be an array of strings.' })
    @ArrayMinSize(1, { message: 'At least one chapter type must be provided.' })
    @ArrayUnique({ message: 'Chapter types must be unique.' })
    type?: EChapter[];

    @IsOptional()
    @IsString({ message: 'difficulty must be string' })
    difficulty?: EDifficulty
}