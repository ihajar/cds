"use client";

import { ClassifiedWithImages } from "@/config/types";
import { ClassifiedCard } from "./classified-card";
import { use } from "react";

interface ClassifiedListProps {
  classifieds: Promise<ClassifiedWithImages[]>;
  favourites: number[];
}

export const ClassifiedList = (props: ClassifiedListProps) => {
  const { classifieds, favourites } = props;
  const inventory = use(classifieds);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {inventory.map((classified) => {
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
