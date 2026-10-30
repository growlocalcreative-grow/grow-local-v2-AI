import { Metadata } from "next";
import Link from "next/link";
import { Download, Printer, ArrowLeft, CheckCircle2, ShieldAlert, Sparkles, MapPin, Star, Phone, Mail } from "lucide-react";
import { ChecklistInteractiveView } from "./ChecklistInteractiveView";

export const metadata: Metadata = {
  title: "5-Minute Google Maps Setup Checklist | Grow Local Creative",
  description:
    "The step-by-step cheatsheet for Cool, Auburn, Placerville, and Georgetown Divide businesses to rank higher on Google Maps without paying for ads.",
};

export default function ChecklistPage() {
  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8 text-stone-900 print:bg-white print:p-0">
      {/* Top action header (hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href="/api/checklist/download"
            download="Foothills-Google-Maps-Setup-Checklist.pdf"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow hover:bg-primary/90 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download 1-Page PDF</span>
          </a>
        </div>
      </div>

      {/* Main Checklist Document (Letter Paper Simulation) */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">
        <ChecklistInteractiveView />
      </div>

      {/* Footer note (hidden on print) */}
      <div className="max-w-4xl mx-auto mt-6 text-center text-xs text-stone-500 print:hidden">
        Grow Local Creative · Cool, CA · Serving El Dorado &amp; Placer Counties
      </div>
    </div>
  );
}
