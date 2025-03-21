"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Cog, Fuel, GaugeCircle, Paintbrush2 } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import { routes } from "@/config/routes";
import { ClassifiedWithImages, MultiStepFormEnum } from "@/config/types";
import {
  formatColor,
  formatFuelType,
  formatNumber,
  formatOdometerUnit,
  formatPrice,
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
          className="bg-white relative rounded-lg shadow-md overflow-hidden flex flex-col justify-between"
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
            <div className="absolute top-2.5 right-3.5 bg-primary/80 text-slate-50 font-bold px-2 py-1 rounded">
              <p className="text-xs lg:text-base xl:text-lg font-semibold">
                {formatPrice({price: classified.price, currency: classified.currency})}
              </p>
            </div>
          </div>
          <div className="p-4 flex flex-col">
            <div className="flex flex-col items-startjustify-evenly space-y-3">
              <Link
                className="text-sm md:text-base lg:text-lg font-semibold line-clamp-1 transition-colors hover:text-primary"
                href={routes.singleClassified(classified.slug)}
              >
                {classified.title}
              </Link>
              <ul className="text-sm md:text-md grid grid-cols-2 gap-2 md:flex md:flex-row md:items-start md:justify-between w-full">
                {getKeyClassifiedInfo(classified)
                  .filter((v) => v.value)
                  .map(({ id, icon, value }) => (
                    <li
                      key={id}
                      className="font-semibold flex md:flex-col bg-muted-foreground/10 w-full items-start gap-x-1.5 p-2 rounded-lg text-slate-700"
                    >
                      {icon} {value}
                    </li>
                  ))}
              </ul>
              {classified.description && (
                <div className="mt-2 text-xs md:text-sm xl:text-baseline-clamp-2 w-full">
                  <HTMLParser html={classified.description} />
                  &nbsp;{" "}
                </div>
              )}
            </div>
          </div>
          <div className="p-4 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:gap-x-2 w-ful">
            <Button
              asChild
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
              variant={"outline"}
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
