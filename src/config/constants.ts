import { routes } from "./routes";

export const imageSources = {
    classifiedPlaceHolder: "https://majestic-motors.s3.eu-west-2.amazonaws.com/uploads/classified-placeholder.jpeg"
}


export const CLASSIFIED_PER_PAGE = 3;

export const navLinks = [
    {
        id: 1,
        href: routes.buy,
        label: "Buy"
    },
    {
        id: 2,
        href: routes.sell,
        label: "Sell"
    },
    {
        id: 3,
        href: routes.reviews,
        label: "Reviews"
    },
    {
        id: 4,
        href: routes.about,
        label: "About"
    },
]