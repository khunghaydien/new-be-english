import { ArrayMinSize, ArrayUnique, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSearchDto {
    @IsOptional()
    @IsString({ message: 'Relative id must be a string' })
    relativeId: string;

    @IsNotEmpty({ message: "Name is required." })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description: string;

    @IsOptional()
    @IsArray({ message: 'Types must be an array of strings.' })
    @ArrayMinSize(1, { message: 'At least one type must be provided.' })
    @ArrayUnique({ message: 'Type must be unique.' })
    type: string[];
}

export class FilterSearchDto {
    @IsOptional()
    @IsString({ message: 'Name must be string' })
    name?: string

    @IsOptional()
    @IsArray({ message: 'Type must be an array of strings.' })
    @ArrayMinSize(1, { message: 'At least one type must be provided.' })
    @ArrayUnique({ message: 'Type must be unique.' })
    type?: string[];
}
