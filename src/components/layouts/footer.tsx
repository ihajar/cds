import Link from "next/link";
import Image from "next/image";
import { SiMeta, SiInstagram, SiX } from "@icons-pack/react-simple-icons";

import { routes } from "@/config/routes";
import { navLinks } from "@/config/constants";
import { NewsLetterForm } from "../shared/newsletter.form";

const socialLinks = [
  {
    id: 1,
    href: "https://facebook.com",
    icon: <SiMeta className="w-5 h-5  transition-colors" />,
  },
  {
    id: 2,
    href: "https://instagram.com",
    icon: <SiInstagram className="w-5 h-5  transition-colors" />,
  },
  {
    id: 3,
    href: "https://twitter.com",
    icon: <SiX className="w-5 h-5  transition-colors" />,
  },
];

const footLinks = [
  {
    id: 1,
    href: routes.home,
    label: "Company",
  },
  {
    id: 2,
    href: routes.home,
    label: "Contacts",
  },
  {
    id: 3,
    href: routes.home,
    label: "Career",
  },
  {
    id: 4,
    href: routes.home,
    label: "Admin",
  },
];

export const PublicFooter = () => {
  return (
    <footer className="bg-white flex flex-col justify-between">
      <div className="flex flex-col w-full items-center md:items-start md:justify-between py-4">
        <Link href={routes.home}>
          <Image
            width={180}
            height={80}
            alt="logo"
            className="h-8 relative"
            src="/logo.svg"
            objectFit="cover"
          />
        </Link>
        <div className="flex flex-col md:flex-row w-full items-center justify-between p-8 space-y-3 md:space-y-0">
          <div className="grid grid-cols-2 w-2/3 space-y-2">
            <ul className="flex flex-col space-y-2">
              {navLinks.map((navLink) => (
                <li key={navLink.id}>
                  <Link
                    href={navLink.href}
                    className="text-foreground hover:text-primary"
                  >
                    {navLink.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col space-y-2">
              {footLinks.map((navLink) => (
                <li key={navLink.id}>
                  <Link
                    href={navLink.href}
                    className="text-foreground hover:text-primary"
                  >
                    {navLink.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full space-y-3 flex flex-col items-center md:items-end justify-center md:justify-end">
            <NewsLetterForm />
            <div className="flex space-x-4 items-center w-full justify-center md:items-end md:justify-end">
              {socialLinks.map((link) => {
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="bg-foreground text-white p-2 rounded-xl hover:bg-primary"
                  >
                    {link.icon}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-muted-foreground/30 w-full" />
      <div className="flex flex-col md:flex-row items-center justify-between p-8 w-full">
        <div className="flex items-start justify-items-start gap-x-1.5">
          <h4>&copy; 2025 &laquo;MotoLand&raquo;</h4>
          <span>All rights reserved</span>
        </div>
        <div className="flex items-end justify-end pt-4 md:pt-0">
          <ul className="flex items-center gap-x-4">
            <li className="hover:text-primary">Terms of use</li>
            <li className="hover:text-primary">Privacy Policy</li>
            <li className="hover:text-primary">User Agreement</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
