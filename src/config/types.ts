import type { ChangeEvent } from "react";
import { Prisma } from "@prisma/client";



type Params = {
    [x: string]: string | string[];
}

export type PageProps = {
    params?: Promise<Params>;
    searchParams?: Promise<{ [x: string]: string | string[] | undefined }>;
}

export type AwaitedPageProps = {
    params?: Awaited<PageProps["params"]>;
    searchParams?: Awaited<PageProps["searchParams"]>;
}

export interface SidebarProps extends AwaitedPageProps {
    minMaxValues: Prisma.GetClassifiedAggregateType<{
        _min: {
            year: true;
            price: true;
            odoReading: true;
        };
        _max: {
            year: true;
            odoReading: true;
            price: true;
        };
    }>;
}

export type ClassifiedWithImages = Prisma.ClassifiedGetPayload<{
    include: {
        images: true;
    };
}>;

export enum MultiStepFormEnum {
    WELCOME = 1,
    SELECT_DATE = 2,
    SUBMIT_DETAILS = 3,
}

export interface Favourites {
    ids: number[];
}

export type FilterOptions<LType, VType> = Array<{
    label: LType;
    value: VType;
}>

export interface TaxonomyFiltersProps extends AwaitedPageProps {
    handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}