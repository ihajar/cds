import { PropsWithChildren } from "react";
import { PublicLayout } from "@/components/layouts/public-layout";


export default function PresentationLayout(props: PropsWithChildren) {
    return <PublicLayout>{props.children}</PublicLayout> ;
}