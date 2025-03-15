import { prisma } from "@/lib/prisma";

import { AwaitedPageProps, PageProps } from "@/config/types";
import { ClassifiedList } from "@/components/inventory/classifieds-list";



const getInventory = async (searchParams: AwaitedPageProps['searchParams']) => {
    return prisma.classified.findMany({
        include: {
            images: true,
        }
    });
}

export default async function InventoryPage(props: PageProps) {
    const searchParams = await props.searchParams
    const classifieds = await getInventory(searchParams);
    const count = await prisma.classified.count();
    
    return (
        <>
            <ClassifiedList classifieds={classifieds} />
        </>
    )
}