"use client";

import { useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContactModal } from "@/lib/contact-modal-context";
import type { SiteSettings } from "@/lib/content";

export function Header({ settings }: { settings: SiteSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { open: onContactOpen } = useContactModal();

  const navLinks = [
    { name: "Services", href: "/services", isCurrent: pathname?.startsWith("/services") },
    { name: "Service Areas", href: "/locations", isCurrent: pathname?.startsWith("/locations") },
    { name: "Our Work", href: "/partners", isCurrent: pathname === "/partners" },
    {
      name: "Maps Checklist",
      href: "/checklist/google-maps",
      isCurrent: pathname?.startsWith("/checklist"),
    },
    { name: "FAQ", href: isHome ? "#faq" : "/#faq", isCurrent: false },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);

    if (href.includes("#")) {
      const targetId = href.split("#")[1];
      if (typeof window !== "undefined") {
        (window as unknown as { __targetHash?: string | null }).__targetHash = targetId;
      }

      if (isHome) {
        const elem = document.getElementById(targetId);
        if (elem) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = elem.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          });
          window.history.pushState(null, "", `#${targetId}`);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-8 px-4">
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            onClick={() => {
              if (typeof window !== "undefined") {
                (window as unknown as { __targetHash?: string | null }).__targetHash = null;
              }
            }}
            className="flex items-center gap-3 group whitespace-nowrap shrink-0"
          >
            <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-primary/10 transition-transform group-hover:scale-105 shrink-0">
              <img
                src="/logo.png"
                alt={`${settings.agencyName} - Sierra Foothills Web Design & Local SEO`}
                width={44}
                height={44}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://picsum.photos/seed/growlocal/100/100";
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight hidden sm:block whitespace-nowrap">
              {settings.agencyName}
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap shrink-0 ${
                link.isCurrent
                  ? "text-primary font-semibold underline underline-offset-8 decoration-2"
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center shrink-0">
          <Button variant="default" size="sm" onClick={onContactOpen} className="whitespace-nowrap shrink-0">
            Get in Touch
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile navigation" className="flex flex-col gap-5 mt-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`font-heading font-medium transition-colors hover:text-primary ${
                      link.isCurrent
                        ? "text-2xl text-primary font-bold"
                        : "text-2xl text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-4">Contact Info</p>
                  <div className="flex flex-col gap-4">
                    <Button
                      variant="outline"
                      className="justify-start gap-3 rounded-xl"
                      onClick={() => {
                        onContactOpen();
                        setIsOpen(false);
                      }}
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" /> Get in Touch
                    </Button>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
