import { ClassifiedWithImages, Favourites } from "@/config/types";
import { ClassifiedCard } from "./classified-card";

interface ClassifiedListProps {
  classifieds: ClassifiedWithImages[];
  favourites: number[];
}

export const ClassifiedList = (props: ClassifiedListProps) => {
  const { classifieds, favourites } = props;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {classifieds.map((classified) => {
        return (
          <ClassifiedCard
            key={classified.id}
            classified={classified}
            favourites={favourites}
          />
        );
      })}
    </div>
  );
};
