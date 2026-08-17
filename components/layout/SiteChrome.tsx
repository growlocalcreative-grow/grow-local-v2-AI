"use client";

import type { ReactNode } from "react";
import { ContactModalProvider, useContactModal } from "@/lib/contact-modal-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactModal } from "@/components/ContactModal";
import type { SiteSettings } from "@/lib/content";

function ChromeInner({ children, settings }: { children: ReactNode; settings: SiteSettings }) {
  const { isOpen, close } = useContactModal();
  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      {children}
      <Footer settings={settings} />
      <ContactModal isOpen={isOpen} onClose={close} />
    </div>
  );
}

export function SiteChrome({ children, settings }: { children: ReactNode; settings: SiteSettings }) {
  return (
    <ContactModalProvider>
      <ChromeInner settings={settings}>{children}</ChromeInner>
    </ContactModalProvider>
  );
}
