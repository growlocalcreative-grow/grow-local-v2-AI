"use client";

import type { ReactNode } from "react";
import { ContactModalProvider, useContactModal } from "@/lib/contact-modal-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactModal } from "@/components/ContactModal";

function ChromeInner({ children }: { children: ReactNode }) {
  const { isOpen, close } = useContactModal();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {children}
      <Footer />
      <ContactModal isOpen={isOpen} onClose={close} />
    </div>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <ContactModalProvider>
      <ChromeInner>{children}</ChromeInner>
    </ContactModalProvider>
  );
}
