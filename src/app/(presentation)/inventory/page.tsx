import { prisma } from "@/lib/prisma";
import { routes } from "@/config/routes";
import { CLASSIFIED_PER_PAGE } from "@/config/constants";
import { AwaitedPageProps, Favourites, PageProps } from "@/config/types";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";
import { PageSchema } from "@/app/schemas/page.schema";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { ClassifiedList } from "@/components/inventory/classifieds-list";
import { Sidebar } from "@/components/inventory/sidebar";
import { buildClassifiedFilterQuery } from "@/lib/utils";
import { ClassifiedStatus } from "@prisma/client";


const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  const validePage = PageSchema.parse(searchParams?.page);

  const page = validePage ? validePage : 1;

  const offset = (page - 1) * CLASSIFIED_PER_PAGE;
  
  return prisma.classified.findMany({
    where: buildClassifiedFilterQuery(searchParams),
    include: { images: { take: 1 } },
    skip: offset,
    take: CLASSIFIED_PER_PAGE,
  });
};

export default async function InventoryPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const classifieds = await getInventory(searchParams);
  const count = await prisma.classified.count({
    where: buildClassifiedFilterQuery(searchParams),
  });

  const minMaxResult = await prisma.classified.aggregate({
    where: { status: ClassifiedStatus.LIVE },
    _min: {
      year: true,
      price: true,
      odoReading: true,
    },
    _max: {
      year: true,
      price: true,
      odoReading: true,
    },
  });

  const sourceId = await getSourceId();
  const favourites = await redis.get<Favourites>(sourceId ?? "");
  // console.log({ favourites });
  const totalPages = Math.ceil(count / CLASSIFIED_PER_PAGE);

  return (
    <div className="bg-muted-foreground/10 min-h-screen w-full flex flex-col items-center">
      <div className="w-full flex flex-col space-y-5 items-center p-4">
        <div className="flex w-full">
          <h1 className="text-base md:text-xl lg:text-3xl font-semibold min-w-fit">
            Explore and Buy{" "}
            <span className="bg-primary text-white p-1 rounded-md">
              {count}
            </span>{" "}
            Car Models Today!
          </h1>
        </div>
        {/* <div className="hidden md:flex justify-end items-end w-full">
          <CustomPagination
            baseUrl={routes.inventory}
            totalPages={totalPages}
            styles={{
              paginationRoot: "justify-end hidden lg:flex",
              paginationNext: "",
              paginationPrevious: "",
              paginationLink: "border-none active:border text-black",
              paginationLinkActive: "",
            }}
          />
        </div> */}
        {/* Dialog Filters  for Mobile */}
      </div>
      <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden">
        <div className="p-4 md:w-1/4 overflow-y-auto">
          <Sidebar minMaxValues={minMaxResult} searchParams={searchParams} />
        </div>
        <div className="p-4 lg:w-3/4 overflow-y-auto flex flex-col items-center justify-between gap-y-4">
          <ClassifiedList
            classifieds={classifieds}
            favourites={favourites ? favourites.ids : []}
          />
          <CustomPagination
            baseUrl={routes.inventory}
            totalPages={totalPages}
            styles={{
              paginationRoot: "justify-end flex",
              paginationNext: "",
              paginationPrevious: "",
              paginationLink: "border-none active:border text-black",
              paginationLinkActive: "",
            }}
          />
        </div>
      </div>
      <div className="flex overflow-hidden justify-end items-end w-full"></div>
    </div>
  );
}
