import Link from "next/link";
import Image from "next/image";
import { HeartIcon, MenuIcon } from "lucide-react";

import { navLinks } from "@/config/constants";
import { Favourites } from "@/config/types";
import { routes } from "@/config/routes";

import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle
} from "../ui/sheet";


export const PublicHeader = async () => {
  const sourceId = await getSourceId();
  const favourites = await redis.get<Favourites>(sourceId ?? "");

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white gap-6 w-full bg-opacity-50 backdrop-filter backdrop-blur-lg py-4 shadow-sm">
      <div className="flex items-center justify-between w-2/3 lg:w-2/4">
        <Link href={routes.home} className="flex items-center">
          <Image
            width={100}
            height={50}
            alt="logo"
            className="relative"
            src="/logo.svg"
          />
        </Link>
        <nav className="hidden md:block">
            {navLinks.map((link) => (
                <Link
                    key={link.id}
                    href={link.href}
                    className="group font-heading rounded px-3 py-2 text-base text-black hover:text-primary hover:underline duration-300 transition-all ease-in-out"
                >
                    {link.label}
                </Link>
            ))}
        </nav>
      </div>
      {/* When user is authenticated shows avatar... */}
      <div className="w-1/3 justify-end flex">
      <Button
        asChild
        variant={"ghost"}
        size={"icon"}
        className="relative inline-block group"
      >
        <Link href={routes.favourites}>
            <div className="flex group-hover:bg-[#403D39] diratopm-200 transition-colors ease-in-out items-center justify-center w-10 h-10 bg-muted rounded-xl">
              <HeartIcon className="w-10 h-10 text-[#252422] group-hover:text-white group-hover:fill-white" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 text-white bg-primary rounded-full group-hover:bg-primary">
              <span className="text-xs">
                {favourites ? favourites.ids.length : 0}
              </span>
            </div>
        </Link>
      </Button>
      </div>
      {/* Mobile navbar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={"link"} size={"icon"}
            className="md:hidden border-none"
          >
            <MenuIcon className="w-6 h-6 text-primary" />
            <SheetTitle className="sr-only">Toggle nav menu</SheetTitle>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full max-w-xs p-4 bg-white"
        >
          <nav className="flex flex-col items-center gap-2 pt-10">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="flex items-center gap-2 py-2 font-medium hover:text-primary hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};
