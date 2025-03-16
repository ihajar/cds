"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Cog, Fuel, GaugeCircle, Paintbrush2 } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import { routes } from "@/config/routes";
import {
  ClassifiedWithImages,
  MultiStepFormEnum,
} from "@/config/types";
import {
  formatColor,
  formatFuelType,
  formatNumber,
  formatOdometerUnit,
  formatTransmission,
} from "@/lib/utils";

import { HTMLParser } from "../shared/html-parser";
import { FavouriteButton } from "./favorite-button";
import { Button } from "../ui/button";

interface ClassifiedCardProps {
  classified: ClassifiedWithImages;
  favourites: number[];
}

const getKeyClassifiedInfo = (classified: ClassifiedWithImages) => {
  return [
    {
      id: "odoReading",
      icon: <GaugeCircle className="w-4 h-4" />,
      value: `${formatNumber(classified.odoReading)} ${formatOdometerUnit(
        classified.odoUnit
      )}`,
    },
    {
      id: "tansmission",
      icon: <Cog className="w-4 h-4" />,
      value: classified?.transmission
        ? formatTransmission(classified?.transmission)
        : null,
    },
    {
      id: "fuelType",
      icon: <Fuel className="w-4 h-4" />,
      value: classified?.fuelType ? formatFuelType(classified.fuelType) : null,
    },
    {
      id: "color",
      icon: <Paintbrush2 className="w-4 h-4" />,
      value: classified?.color ? formatColor(classified.color) : null,
    },
  ];
};

export const ClassifiedCard = (props: ClassifiedCardProps) => {
  const { classified, favourites } = props;
  const pathname = usePathname();

  const [isFavourite, setIsFavourite] = useState(
    favourites.includes(classified.id)
  );
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isFavourite && pathname === routes.favourites) setIsVisible(false);
  }, [isFavourite, pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white relative rounded-md shadow-md overflow-hidden flex flex-col"
        >
          <div className="aspect-3/2 relative">
            <Link href={routes.singleClassified(classified.slug)}>
              <Image
                placeholder="blur"
                blurDataURL={classified.images[0]?.blurhash}
                src={classified.images[0]?.src}
                alt={classified.images[0]?.alt}
                className="object-cover"
                fill={true}
                quality={25}
              />
            </Link>
            <FavouriteButton
              setIsFavourite={setIsFavourite}
              isFavourite={isFavourite}
              id={classified.id}
            />
            <div className="absolute top-2.5 right-3.5 bg-primary text-slate-50 font-bold px-2 py-1 rounded">
              <p className="text-xs lg:text-base xl:text-lg font-semibold">
                {classified.price}
              </p>
            </div>
          </div>
          <div className="p-4 flex flex-col space-y-3">
            <div>
              <Link
                className="text-sm md:text-base lg:text-lg font-semibold line-clamp-1 transition-colors hover:text-primary"
                href={routes.singleClassified(classified.slug)}
              >
                {classified.title}
              </Link>
              {classified.description && (
                <div className="text-xs md:text-sm xl:text-base text-gray-500 line-clamp-2">
                  <HTMLParser html={classified.description} />
                  &nbsp;{" "}
                </div>
              )}
              <ul className="text-xs md:text-sm text-gray-600 xl:flex grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-4 items-center justify-between w-full">
                {getKeyClassifiedInfo(classified)
                  .filter((v) => v.value)
                  .map(({ id, icon, value }) => (
                    <li
                      key={id}
                      className="font-semibold flex xl:flex-col items-center gap-x-1.5"
                    >
                      {icon} {value}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:gap-x-2 w-ful">
            <Button
              asChild
              variant={"outline"}
              size="sm"
              className="flex-1 transition-colors hover:border-white hover:bg-primary hover:text-white py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base"
            >
              <Link
                href={routes.reserve(
                  classified.slug,
                  MultiStepFormEnum.WELCOME
                )}
              >
                Rserve
              </Link>
            </Button>
            <Button
              className="flex-1 py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base"
              asChild
              size="sm"
            >
              <Link href={routes.singleClassified(classified.slug)}>
                View Details
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
