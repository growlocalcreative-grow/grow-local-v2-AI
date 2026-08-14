"use client";

import { useState } from "react";
import { Menu, Mail, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContactModal } from "@/lib/contact-modal-context";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { open: onContactOpen } = useContactModal();

  const navLinks = [
    { name: "About", href: isHome ? "#about" : "/#about" },
    { name: "Upcoming Tools", href: isHome ? "#upcoming" : "/#upcoming" },
    { name: "Services", href: isHome ? "#services" : "/#services" },
    { name: "Free Tools", href: isHome ? "#freebies" : "/#freebies" },
    { name: "Admin Login", href: "/admin", icon: Lock },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/10 transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Grow Local Creative Logo"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://picsum.photos/seed/growlocal/100/100";
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight hidden sm:block">Grow Local Creative</span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                link.name === "Admin Login" 
                  ? "text-muted-foreground/50 hover:text-primary flex items-center gap-1.5" 
                  : "text-muted-foreground"
              }`}
            >
              {link.name === "Admin Login" && <Lock className="h-3.5 w-3.5" />}
              {link.name}
            </a>
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
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`font-heading font-medium transition-colors hover:text-primary ${
                      link.name === "Admin Login"
                        ? "text-lg text-muted-foreground/60 flex items-center gap-2 mt-4 pt-4 border-t"
                        : "text-2xl text-foreground"
                    }`}
                  >
                    {link.name === "Admin Login" && <Lock className="h-4 w-4" />}
                    {link.name}
                  </a>
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
