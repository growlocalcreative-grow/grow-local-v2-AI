import {
  CheckCircle2,
  LifeBuoy,
  Search,
  Share2,
  Terminal,
  Palette,
  Smartphone,
  Monitor,
  Gift,
  Globe,
  Sparkles,
  Wrench,
  Rocket,
  Heart,
  Camera,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  CheckCircle2,
  LifeBuoy,
  Search,
  Share2,
  Terminal,
  Palette,
  Smartphone,
  Monitor,
  Gift,
  Globe,
  Sparkles,
  Wrench,
  Rocket,
  Heart,
  Camera,
  ShoppingBag,
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);

export function getIcon(name: string | undefined): LucideIcon {
  if (name && ICON_MAP[name]) return ICON_MAP[name];
  return Sparkles;
}
