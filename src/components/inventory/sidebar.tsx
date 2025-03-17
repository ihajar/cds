"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";

import { AwaitedPageProps } from "@/config/types";
import { cn } from "@/lib/utils";
import { SearchInput } from "../shared/search-input";



interface SidebarProps extends AwaitedPageProps {
    minMaxValues: any,
}

export const Sidebar = ({ minMaxValues, searchParams }: SidebarProps) => {
    const router = useRouter();
    const [filterCount, setFilterCount] = useState(0);

    const [queryStates, setQueryStates] = useQueryStates({
        make: parseAsString.withDefault(""),
        model: parseAsString.withDefault(""),
        modelVariant: parseAsString.withDefault(""),
        minYear: parseAsString.withDefault(""),
        maxYear: parseAsString.withDefault(""),
        minReading: parseAsString.withDefault(""),
        maxReading: parseAsString.withDefault(""),
        currency: parseAsString.withDefault(""),
        odoUnit: parseAsString.withDefault(""),
        transmission: parseAsString.withDefault(""),
        fuelType: parseAsString.withDefault(""),
        bodyType: parseAsString.withDefault(""),
        color: parseAsString.withDefault(""),
        doors: parseAsString.withDefault(""),
        seats: parseAsString.withDefault(""),
    }, {
        shallow: false,
    })

    useEffect(() => {
        const filterCount = Object.entries(
            searchParams as Record<string, string>,
        ).filter(([key, value]) => key !== "page" && value).length;

        setFilterCount(filterCount);
    }, [searchParams]);

    return (
        <div className="p-4 w-full bg-white rounded-lg hidden lg:block">
            <div>
                <div className="text-lg font-semibold flex justify-between px-4">
                    <span>Filters</span>
                    <button
                        type="button"
                        // onClick=""
                        aria-disabled={!filterCount}
                        className={cn(
                            "text-sm text-slate-500 py-1",
                            !filterCount
                                ? "disabled opacity-50 pointer-events-none cursor-default"
                                : "hover:underline cursor-pointer"
                        )}
                    >
                        Reset {filterCount ? `(${filterCount})`: null}
                    </button>
                </div>
                <div className="mt-2" />
            </div>
            <div className="p-4">
                <SearchInput
                    placeholder="Search cars..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
            </div>
        </div>
    )
}