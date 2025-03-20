import { notFound, redirect } from "next/navigation";

import { PageProps } from "@/config/types";
import { routes } from "@/config/routes";

import { prisma } from "@/lib/prisma";

import { ClassifiedStatus } from "@prisma/client";



export default async function ClassifiedPage(props: PageProps) {
    const params = await props?.params;
    const slug = decodeURIComponent(params?.slug as string);
    if(!slug) notFound();

    const classified = await prisma.classified.findUnique({
        where: { slug },
        include: { make: true, images: true },
    });

    if(!classified) notFound();

    if(classified.status === ClassifiedStatus.SOLD) {
        redirect(routes.notAvailable(classified.slug));
    }

    // return <Classi
}