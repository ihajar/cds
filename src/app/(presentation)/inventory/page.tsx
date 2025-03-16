import { prisma } from "@/lib/prisma";

import { AwaitedPageProps, Favourites, PageProps } from "@/config/types";
import { ClassifiedList } from "@/components/inventory/classifieds-list";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  return prisma.classified.findMany({
    include: {
      images: true,
    },
  });
};

export default async function InventoryPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const classifieds = await getInventory(searchParams);
  const count = await prisma.classified.count();

  const sourceId = await getSourceId();
  const favourites = await redis.get<Favourites>(sourceId ?? "");
  console.log({ favourites });

  return (
    // <div className="flex">
    //     {/* TODO: Sidebar for filters */}
    //     <div className="flex-1 p-4 bg-white">
    //         <div className="flex space-y-2 items-center justify-between pb-4 -mt-1">
    //             <div className="flex justify-between items-center w-full">
    //                 <h2 className="text-sm md:text-base lg:text-xl font-semibold min-w-fit">
    //                 Explore and Buy from <span className="bg-primary text-white p-1 rounded-md">{count}</span> Car Models Today!
    //                 </h2>
    //                 {/* TODO:  DialogFilters for mobile */}
    //             </div>
    //             <Pagination />
    //             <ClassifiedList classifieds={classifieds} favourites={favourites ? favourites.ids : []} />
    //         </div>
    //     </div>
    // </div>

    <div className="bg-muted-foreground/10 min-h-screen w-full flex flex-col items-center">
        <div className="w-full flex flex-col space-y-5 items-center p-4">
            <div className="flex w-full">
                <h1 className="text-base md:text-xl lg:text-3xl font-semibold min-w-fit">
                    Explore and Buy <span className="bg-primary text-white p-1 rounded-md">{count}</span> Car Models Today!
                </h1>
            </div>
            <div className="bg-pink-300 hidden md:flex overflow-hidden justify-end items-end w-full">
                <p>Pagination goes here</p>
            </div>
            {/* Dialog Filters  for Mobile */}
        </div>
        <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden">
            <div className="bg-sky-300 p-4 md:w-1/4 overflow-y-auto">
                <h2>Filter here</h2>
                {/* Sidebar */}
            </div>
            <div className="p-4 lg:w-3/4 overflow-y-auto">
            <ClassifiedList classifieds={classifieds} favourites={favourites ? favourites.ids : []} />
            </div>
        </div>
    </div>
  );
}
