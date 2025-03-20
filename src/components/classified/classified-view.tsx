import Link from "next/link";
import Image from "next/image";
import { CarFrontIcon, CarIcon, Fingerprint, FuelIcon, GaugeIcon, PowerIcon, UserIcon } from "lucide-react";

import { routes } from "@/config/routes";
import { MultiStepFormEnum } from "@/config/types";

import { formatBodyType, formatColor, formatFuelType, formatNumber, formatOdometerUnit, formatPrice, formatTransmission } from "@/lib/utils";
import { Prisma } from "@prisma/client";

import { HTMLParser } from "../shared/html-parser";
import { Button } from "../ui/button";




type ClassifiedWithImagesAndMake = Prisma.ClassifiedGetPayload<{
    include: { make: true, images: true };
}>;

const features = (props: ClassifiedWithImagesAndMake) => [
    {
        id: 1,
        icon: <Fingerprint className="w-6 h-6 mx-auto text-foreground" />,
        label: props.vrm,
    },
    {
        id: 2,
        icon: <CarIcon className="w-6 h-6 mx-auto text-foreground"/>,
        label: formatBodyType(props.bodyType),
    },
    {
        id: 3,
        icon: <FuelIcon className="w-6 h-6 mx-auto text-foreground" />,
        label: formatFuelType(props.fuelType),
    },
    {
        id: 4,
        icon: <PowerIcon className="w-6 h-6 mx-auto text-foreground" />,
        label: formatTransmission(props.transmission),
    },
    {
        id: 5,
        icon: <GaugeIcon className="w-6 h-6 mx-auto text-foreground" />,
        label: `${formatNumber(props.odoReading)} ${formatOdometerUnit(props.odoUnit)}`,
    },
    {
        id: 6,
        icon: <UserIcon className="w-6 h-6 mx-auto text-foreground" />,
        label: props.seats,
    },
    {
        id: 7,
        icon: <CarFrontIcon className="w-6 h-6 mx-auto text-foreground" />,
        label: props.doors,
    },
];


export const ClassifiedView = (props: ClassifiedWithImagesAndMake) => {
    return (
        <div className="flex flex-col container mx-auto px-4 md:px-0 py-12">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                {/* ClassifiedCarousel */}
                </div>
                <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                        <Image
                            src={props.make.image}
                            alt={props.make.name}
                            className="w-20 mr-4"
                            width={120}
                            height={120}
                        />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-body">
                                {props.title}
                            </h1>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-2 mb-2">
                        <span className="bg-slate-500 text-foreground text-sm font-medium px-2.5 py-0.5 rounded-md">
                            {props.year}
                        </span>
                        <span className="bg-slate-500 text-foreground text-sm font-medium px-2.5 py-0.5 rounded-md">
                            {formatNumber(props.odoReading)}{" "}
                            {formatOdometerUnit(props.odoUnit)}
                        </span>
                        <span className="bg-slate-500 text-foreground text-sm font-medium px-2.5 py-0.5 rounded-md">
                            {formatColor(props.color)}
                        </span>
                        <span className="bg-slate-500 text-foreground text-sm font-medium px-2.5 py-0.5 rounded-md">
                            {formatFuelType(props.fuelType)}
                        </span>
                    </div>
                    {props.description && (
                        <div className="mb-4"><HTMLParser html={props.description}/></div>
                    )}
                    <div className="text-4xl font-bold my-4 w-full border border-slate-200 flex justify-center items-center rounded-lg py-12">
                        Our Price: {" "}
                        {formatPrice({ price: props.price, currency: props.currency })}
                    </div>
                    <Button
                        asChild
                        size={"lg"}
                        className="uppercase font-bold py-3 px-6 rounded w-full mb-4"
                    >
                        <Link href={routes.reserve(props.slug, MultiStepFormEnum.WELCOME)}>
                            Buy Now
                        </Link>
                    </Button>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {features(props).map(({ id, icon, label }) => (
                            <div
                                key={id}
                                className="bg-gray-100 rounded-lg shadow-xs p-4 text-center flex flex-col items-center"
                            >
                                {icon}
                                <p className="text-sm font-medium mt-2">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}