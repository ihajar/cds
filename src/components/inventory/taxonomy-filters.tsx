"use client";

import { useEffect, useState } from "react";

import { endpoints } from "@/config/endpoints";
import { FilterOptions, TaxonomyFiltersProps } from "@/config/types";

import { api } from "@/lib/api-client";
import { Select } from "../shared/select";



export const TaxonomyFilters = (props: TaxonomyFiltersProps) => {
    const { searchParams, handleChange } = props

    const [makes, setMakes] = useState<FilterOptions<string, string>>([]);
    const [models, setModels] = useState<FilterOptions<string, string>>([]);
    const [modelVariants, setModelVariants] = useState<FilterOptions<string, string>>([]);

    useEffect(() => {
        (async function fetchMakesOptions() {
            const params = new URLSearchParams();
            for (const [k, v] of Object.entries(
                searchParams as Record<string, string>,
            )) {
                if (v) params.set(k, v as string);
            }

            const url = new URL(endpoints.taxonomy, window.location.href);

            url.search = params.toString();

            const data = await api.get<{
                makes: FilterOptions<string, string>;
                models: FilterOptions<string, string>;
                modelVariants: FilterOptions<string, string>;
            }>(url.toString());


            setMakes(data.makes);
            setModels(data.models);
            setModelVariants(data.modelVariants);
        })();
    }, [searchParams]);

    return (
        <>
          <Select
            label="Make"
            name="make"
            value={searchParams?.make as string}
            onChange={handleChange}
            options={makes}
            placeholder={searchParams?.make ? `Select a ${searchParams.make} make` : "Select a make"}
          /> 
          <Select
            label="Model"
            name="model"
            value={searchParams?.model as string}
            onChange={handleChange}
            options={models}
            disabled={!models.length}
            placeholder={searchParams?.model ? `Select a ${searchParams.model} model` : "Select a model"}
          />
          <Select
            label="Model Variant"
            name="modelVariant"
            value={searchParams?.modelVariant as string}
            onChange={handleChange}
            options={modelVariants}
            disabled={!modelVariants.length}
            placeholder={searchParams?.model ? `Select a ${searchParams.model} variant` : "Select a model variant"}
          />

        </>
    )
}