import { Chapter } from "@prisma/client";
import { PaginationResponse } from "src/common/model";

export class ChaptersResponse {
    chapters: Chapter[]
    pagination: PaginationResponse
}