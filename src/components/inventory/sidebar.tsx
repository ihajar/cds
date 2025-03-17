"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";

import { AwaitedPageProps, SidebarProps } from "@/config/types";
import { cn, formatBodyType, formatColor, formatFuelType, formatOdometerUnit, formatTransmission } from "@/lib/utils";
import { SearchInput } from "../shared/search-input";
import { TaxonomyFilters } from "./taxonomy-filters";
import { routes } from "@/config/routes";
import { env } from "@/env";
import { RangeFilter } from "./range-filter";
import { Select } from "../shared/select";
import { BodyType, Color, CurrencyCode, FuelType, OdoUnit, Prisma, Transmission } from "@prisma/client";


export const Sidebar = ({ minMaxValues, searchParams }: SidebarProps) => {
    const router = useRouter();
    const [filterCount, setFilterCount] = useState(0);
    const { _min, _max } = minMaxValues;

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

    const clearFilters = () => {
        const url = new URL(routes.inventory, env.NEXT_PUBLIC_APP_URL);
        window.location.replace(url.toString());
        setFilterCount(0);
    };

    const handleChange = async(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setQueryStates({
            [name]: value || null,
        });

        if (name === "make") {
            setQueryStates({
                model: null,
                modelVariant: null,
            });
        }
        router.refresh();
    };

    return (
        <div className="p-4 w-full bg-white rounded-lg hidden lg:block">
            <div>
                <div className="text-lg font-semibold flex justify-between px-4">
                    <span>Filters</span>
                    <button
                        type="button"
                        onClick={clearFilters}
                        aria-disabled={!filterCount}
                        className={cn(
                            "text-sm text-slate-500 py-1",
                            !filterCount
                                ? "disabled opacity-50 pointer-events-none cursor-default"
                                : "hover:underline cursor-pointer text-primary"
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
            <div className="p-4 space-y-2">
                <TaxonomyFilters
                    searchParams={searchParams}
                    handleChange={handleChange}
                />
                <RangeFilter
                    label="Year"
                    minName="minYear"
                    maxName="maxYear"
                    defaultMin={_min.year || 1925}
                    defaultMax={_max.year || new Date().getFullYear()}
                    handleChange={handleChange}
                    searchParams={searchParams}
                />
                <RangeFilter
					label="Price"
					minName="minPrice"
					maxName="maxPrice"
					defaultMin={_min.price || 0}
					defaultMax={_max.price || 21474836}
					handleChange={handleChange}
					searchParams={searchParams}
					increment={1000000}
					thousandSeparator
					currency={{
						currencyCode: "USD",
					}}
				/>
                <RangeFilter
					label="Odometer Reading"
					minName="minReading"
					maxName="maxReading"
					defaultMin={_min.odoReading || 0}
					defaultMax={_max.odoReading || 1000000}
					handleChange={handleChange}
					searchParams={searchParams}
					increment={5000}
					thousandSeparator
				/>
                <Select
                    label="Currency"
                    name="currency"
                    value={queryStates.currency || ""}
                    onChange={handleChange}
                    options={Object.values(CurrencyCode).map((value) => ({
                        label: value,
                        value,
                    }))}
                />
                <Select
					label="Odometer Unit"
					name="odoUnit"
					value={queryStates.odoUnit || ""}
					onChange={handleChange}
					options={Object.values(OdoUnit).map((value) => ({
						label: formatOdometerUnit(value),
						value,
					}))}
				/>
                <Select
					label="Transmission"
					name="transmission"
					value={queryStates.transmission || ""}
					onChange={handleChange}
					options={Object.values(Transmission).map((value) => ({
						label: formatTransmission(value),
						value,
					}))}
				/>
                <Select
					label="Fuel Type"
					name="fuelType"
					value={queryStates.fuelType || ""}
					onChange={handleChange}
					options={Object.values(FuelType).map((value) => ({
						label: formatFuelType(value),
						value,
					}))}
				/>
                <Select
					label="Body Type"
					name="bodyType"
					value={queryStates.bodyType || ""}
					onChange={handleChange}
					options={Object.values(BodyType).map((value) => ({
						label: formatBodyType(value),
						value,
					}))}
				/>
                <Select
					label="Color"
					name="color"
					value={queryStates.color || ""}
					onChange={handleChange}
					options={Object.values(Color).map((value) => ({
						label: formatColor(value),
						value,
					}))}
				/>
                <Select
					label="Doors"
					name="doors"
					value={queryStates.doors || ""}
					onChange={handleChange}
					options={Array.from({ length: 6 }).map((_, i) => ({
						label: Number(i + 1).toString(),
						value: Number(i + 1).toString(),
					}))}
				/>
                <Select
					label="Seats"
					name="seats"
					value={queryStates.seats || ""}
					onChange={handleChange}
					options={Array.from({ length: 8 }).map((_, i) => ({
						label: Number(i + 1).toString(),
						value: Number(i + 1).toString(),
					}))}
				/>
            </div>
        </div>
    )
}