import { ClassifiedCardSkeleton } from "@/components/inventory/classified-card-skeleton"

export const InventorySkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 8 }, (_, index) => index + 1).map((id) => (
                <ClassifiedCardSkeleton key={id} />
            ))}
        </div>
    )
}