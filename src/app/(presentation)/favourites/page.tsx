import { PageSchema } from "@/app/schemas/page.schema";

import { Favourites, PageProps } from "@/config/types";
import { CLASSIFIED_PER_PAGE } from "@/config/constants";

import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";
import { prisma } from "@/lib/prisma";
import { ClassifiedCard } from "@/components/inventory/classified-card";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { routes } from "@/config/routes";

export default async function FavouritesPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const sourceId = await getSourceId();
    const favourites = await redis.get<Favourites>(sourceId ?? "");

    const validPage = PageSchema.parse(searchParams?.page);

    const page = validPage ? validPage : 1;
    const offset = (page -1) * CLASSIFIED_PER_PAGE;

    const classifieds = await prisma.classified.findMany({
        where: { id: { in: favourites ? favourites.ids: [] } },
        include: { images: { take: 1 } },
        skip: offset,
        take: CLASSIFIED_PER_PAGE,
    });

    const count = await prisma.classified.count({
        where: { id: { in: favourites ? favourites.ids : [] } },
    });

    const totalPages = Math.ceil(count / CLASSIFIED_PER_PAGE);

    return (
        <div className="bg-muted-foreground/10 mx-auto container px-4 py-8 min-h-[80dvh]">
            <h1 className="text-3xl font-bold mb-6">
                {count === 0 
                    ? "You have no favourites yet!"
                    : count === 1
                    ? "You have one Favourite car"
                    : `You have ${count} favourite cars`
                }
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {classifieds.map((classified) => {
                    return (
                        <ClassifiedCard
                            key={classified.id}
                            classified={classified}
                            favourites={favourites ? favourites.ids : []}
                        />
                    );
                })}
            </div>
            <div className="mt-8 flex">
                <CustomPagination
                    baseUrl={routes.favourites}
                    totalPages={totalPages}
                    styles={{
                        paginationRoot: "justify-center",
                        paginationPrevious: "",
                        paginationNext: "",
                        paginationLinkActive: "",
                        paginationLink: "border-none active:border",

                    }}
                />
            </div>
        </div>
    );
};