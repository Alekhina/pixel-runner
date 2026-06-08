import { Area } from "./types";

function areasIntersect(area_1: Area, area_2: Area): boolean {
    return (
        (((area_1.x + area_1.w) < (area_2.x + area_2.w) && (area_1.x + area_1.w) > area_2.x) || (area_1.x < (area_2.x + area_2.w) && area_1.x > area_2.x)) && (((area_1.y + area_1.h) < (area_2.y + area_2.h) && (area_1.y + area_1.h) > area_2.y) || (area_1.y < (area_2.y + area_2.h) && area_1.y > area_2.y))
    )
}