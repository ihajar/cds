import { InventorySkeleton } from "@/components/inventory/inventory-skeleton";

export default function FavouritesLoadingPage() {
    return (
        <div className="bg-muted-foreground/10 mx-auto container px-4 py-8 min-h-[80dvh]">
            <h1 className="text-3xl font-bold mb-6">Your Favourite Cars</h1>
            <InventorySkeleton />
        </div>
    )
}