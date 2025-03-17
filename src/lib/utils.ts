import { ClassfiedFilterSchema } from "@/app/schemas/classified.schema";
import { AwaitedPageProps } from "@/config/types";
import { BodyType, ClassifiedStatus, Color, CurrencyCode, FuelType, OdoUnit, Prisma, Transmission } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatNumber(
  num: number | null,
  options?: Intl.NumberFormatOptions,
) {
  if (!num) return "0";
  return new Intl.NumberFormat("en-GB", options).format(num);
}

export function formatOdometerUnit(unit: OdoUnit) {
  return unit === OdoUnit.MILES ? "mi" : "km";
}

export function formatTransmission(transmission: Transmission) {
  return transmission === Transmission.AUTOMATIC ? "Automatic" : "Maual";
}

export function formatFuelType(fuelType:FuelType) {
  switch (fuelType) {
    case FuelType.PETROL:
      return "Petrol";
    case FuelType.DIESEL:
      return "Diesel";
    case FuelType.ELECTRIC:
      return "Electric";
    case FuelType.HYBRID:
      return "Hybrid";
    default:
      return "unknown";
  }
}

export function formatBodyType(bodyType: BodyType) {
	switch (bodyType) {
		case BodyType.CONVERTIBLE:
			return "Convertible";
		case BodyType.COUPE:
			return "Coupe";
		case BodyType.HAICHBACK:
			return "Hatchback";
		case BodyType.SUV:
			return "SUV";
		case BodyType.WAGON:
			return "Wagon";
		case BodyType.SEDAN:
			return "Sedan";
		default:
			return "Unknown";
	}
}

export function formatColor(color: Color) {
  switch (color) {
    case Color.BLACK:
        return "black";
    case Color.WHITE:
        return "white";
    case Color.GRAY:
        return "gray";
    case Color.SILVER:
        return "silver";
    case Color.BLUE:
        return "blue";
    case Color.RED:
        return "red";
    case Color.GREEN:
        return "green";
    case Color.YELLOW:
        return "yellow";
    case Color.ORANGE:
        return "orange";
    case Color.BROWN:
        return "brown";
    case Color.BEIGE:
        return "beige";
    case Color.PURPLE:
        return "purple";
    case Color.PINK:
        return "pink";
    case Color.GOLD:
        return "gold";
    case Color.BRONZE:
        return "bronze";
    case Color.MAROON:
        return "maroon";
    case Color.TURQUOISE:
        return "turquoise";
    case Color.NAVY:
        return "navy";
    default:
        return "unknown";
}
}

// Add FormatPrice with currency code
export function formatPrice(price: number, currencyCode: CurrencyCode) {
  const currencyMap = {
    [CurrencyCode.DZ]: "DZD",
    [CurrencyCode.EUR]: "EUR",
    [CurrencyCode.USD]: "USD",
    [CurrencyCode.GBP]: "GBP"
  }
  const currency = currencyMap[currencyCode] || "DZD";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "DZD",
  }).format(price);
}
// 2nd Price Format function to use in Filters
interface FormatPriceArgs {
  price: number | null;
  currency: CurrencyCode | null;
}

export function formatPriceFilter({ price, currency }: FormatPriceArgs) {
  if (!price) return "0";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    ...(currency && { currency }),
    maximumFractionDigits: 0,
  });
  return formatter.format(price / 100);
}

export const buildClassifiedFilterQuery = (
  searchParams: AwaitedPageProps["searchParams"] | undefined,
): Prisma.ClassifiedWhereInput => {
  const { data } = ClassfiedFilterSchema.safeParse(searchParams);

  if(!data) return { status: ClassifiedStatus.LIVE };

  const keys = Object.keys(data);

  const taxonomyFilters = ["make", "model", "modelVariant"];

  const rangeFilters = {
    minYear: "year",
    maxYear: "year",
    minPrice: "price",
    maxPrice: "price",
    minReading: "odoReading",
    maxReeading: "odoReading",
  }

  const numFilters = ["seats", "doors"];
  const enumFilters = [
    "odoUnit",
    "currency",
    "transmission",
    "bodyType",
    "fuelType",
    "color",
  ]

  const mapParamsToFields = keys.reduce((acc, key) => {
    const value = searchParams?.[key] as string | undefined;
    if(!value) return acc;

    if (taxonomyFilters.includes(key)) {
      acc[key] = { id: Number(value) }; 
    } else if (enumFilters.includes(key)) {
      acc[key] = value.toUpperCase();
    } else if (numFilters.includes(key)) {
      acc[key] = Number(value);
    } else if (key in rangeFilters) {
      const field = rangeFilters[key as keyof typeof rangeFilters];
      acc[field] = acc[field] || {};
      if(key.startsWith("min")) {
        acc[field].gte = Number(value);
      } else if (key.startsWith("max")) {
        acc[field].lte = Number(value);
      }
    }
    return acc;
  },
  {} as { [key: string]: any },
);
  return {
    status: ClassifiedStatus.LIVE,
    ...(searchParams?.q && {
			OR: [
				{
					title: {
						contains: searchParams.q as string,
						mode: "insensitive",
					},
				},

				{
					description: {
						contains: searchParams.q as string,
						mode: "insensitive",
					},
				},
			],
		}),
    ...mapParamsToFields
  }
}