import { Color, CurrencyCode, FuelType, OdoUnit, Transmission } from "@prisma/client";
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