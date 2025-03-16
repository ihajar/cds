import { MultiStepFormEnum } from "./types";

export const routes = {
    home: "/",
    singleClassified: (slug: string) => `/inventory/${slug}`,
    reserve: (slug: string, step: MultiStepFormEnum) => 
        `/inventory/${slug}/reseve?step=${step}`,
    success: (slug: string) => `/inventory/${slug}/success`,
    favourites: "/favourites",
    inventory: "/inventory",
    notAvailable: (slug: string) => `/inventory/${slug}/not-available`,
    signIn: "/auth/sign-in",
}