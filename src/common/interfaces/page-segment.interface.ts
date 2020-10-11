import { ProductTag } from "../enums/enums";

export interface PageSegmentInterface {
    id?: number;
    name?: string;
    value?: string;
    navigate?: string;
    selectedTag?: ProductTag;
}