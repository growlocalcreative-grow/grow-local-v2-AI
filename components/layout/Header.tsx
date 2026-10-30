"use client";

import { useState } from "react";
import { Menu, Mail, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContactModal } from "@/lib/contact-modal-context";
import type { SiteSettings } from "@/lib/content";

export function Header({ settings }: { settings: SiteSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { open: onContactOpen } = useContactModal();

  const sectionMap: Record<string, { name: string; href: string }> = {
    about: { name: "About", href: isHome ? "#about" : "/#about" },
    future: { name: "Upcoming Tools", href: isHome ? "#upcoming" : "/#upcoming" },
    services: { name: "Services", href: isHome ? "#services" : "/#services" },
    freebies: { name: "Free Tools", href: isHome ? "#freebies" : "/#freebies" },
    faq: { name: "FAQ", href: isHome ? "#faq" : "/#faq" },
  };

  const isPartners = pathname === "/partners";

  const dynamicLinks = (settings.sectionOrder || ["hero", "about", "services", "future", "freebies", "faq"])
    .filter(id => id !== "hero" && !(settings.hiddenSections || []).includes(id))
    .map(id => sectionMap[id])
    .filter(Boolean);

  interface NavItem {
    name: string;
    href: string;
    isCurrent?: boolean;
    icon?: any;
  }

  const navLinks: NavItem[] = [
    { name: "Our Work", href: "/partners", isCurrent: isPartners },
    ...dynamicLinks.map(link => ({ ...link, isCurrent: false })),
    { name: "Admin Login", href: "/admin", icon: Lock, isCurrent: pathname === "/admin" },
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link 
            href="/" 
            onClick={() => {
              if (typeof window !== "undefined") {
                (window as unknown as { __targetHash?: string | null }).__targetHash = null;
              }
            }}
            className="flex items-center gap-3 group"
          >
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/10 transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt={`${settings.agencyName} - Georgetown Divide Web Design & SEO`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://picsum.photos/seed/growlocal/100/100";
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight hidden sm:block">{settings.agencyName}</span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                link.isCurrent
                  ? "text-primary font-semibold border-b-2 border-primary pb-0.5"
                  : link.name === "Admin Login"
                  ? "text-muted-foreground/50 hover:text-primary flex items-center gap-1.5"
                  : "text-muted-foreground"
              }`}
            >
              {link.name === "Admin Login" && <Lock className="h-3.5 w-3.5" />}
              {link.name}
            </Link>
          ))}
          <Button variant="default" size="sm" onClick={onContactOpen}>
            Get in Touch
          </Button>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6 mt-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`font-heading font-medium transition-colors hover:text-primary ${
                      link.isCurrent
                        ? "text-2xl text-primary font-bold pl-2 border-l-4 border-primary"
                        : link.name === "Admin Login"
                        ? "text-lg text-muted-foreground/60 flex items-center gap-2 mt-4 pt-4 border-t"
                        : "text-2xl text-foreground"
                    }`}
                  >
                    {link.name === "Admin Login" && <Lock className="h-4 w-4" />}
                    {link.name}
                  </Link>
                ))}
                <div className="pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-4">Contact Info</p>
                  <div className="flex flex-col gap-4">
                    <Button variant="outline" className="justify-start gap-3 rounded-xl" onClick={() => { onContactOpen(); setIsOpen(false); }}>
                      <Phone className="h-4 w-4" /> Get in Touch
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
