import { IsEnum, IsOptional, IsString } from "class-validator";

enum SortOrder {
    ASC = 'asc',
    DESC = 'desc'
}

export class OrderByDto {
    @IsString()
    @IsOptional()
    field?: string;

    @IsOptional()
    @IsEnum(SortOrder)
    order?: SortOrder;
}