import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type FavouriteButtonProps = {
    setIsFavourite: (isFavourite: boolean) => void;
    isFavourite: boolean;
    id: number;
};

export const FavouriteButton = () => {
    // const { setIsFavourite, isFavourite, id } = props;

    const router = useRouter();

    return (
        <Button
            variant={"ghost"}
            size="icon"
            className={cn(
                "absolute top-2.5 left-3.5 rounded-full z-10 group !h-6 !w-6 lg:!h-8 lg:!w-8 xl:!h-10 xl:!w-10",
            )}
        >
            <HeartIcon 
                className={cn(
                    "duration-200 transition-colors ease-in-out w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-6 xl:h-6 text-white",
                )}
            />
        </Button>
    )
}