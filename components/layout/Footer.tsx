import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Lock } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-secondary/20 bg-white p-1">
                <img 
                  src="/logo.png" 
                  alt="Grow Local Creative Logo" 
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://picsum.photos/seed/growlocal/100/100";
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-heading text-2xl font-semibold tracking-tight">Grow Local Creative</span>
            </div>
            <p className="text-primary-foreground/80 max-w-xs leading-relaxed">
              Helping small businesses, nonprofits, and makers across the Georgetown Divide push the right buttons so life stays simpler.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-medium">Get in Touch</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:growlocalcreative@gmail.com" className="flex items-center gap-3 hover:text-secondary transition-colors">
                  <Mail className="h-5 w-5 text-secondary" />
                  <span>growlocalcreative@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:9168694142" className="flex items-center gap-3 hover:text-secondary transition-colors">
                  <Phone className="h-5 w-5 text-secondary" />
                  <span>916-869-4142</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-1" />
                <span className="text-primary-foreground/80">
                  Based in Cool, CA · Serving the Georgetown Divide, Northern Foothill Sierras, El Dorado & Placer Counties.
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-medium">Follow Along</h3>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-primary-foreground/60 pt-4">
              A Neighbor, Not a Corporation.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/40">
          <p>© {currentYear} Grow Local Creative. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-secondary">Privacy Policy</a>
            <a href="#" className="hover:text-secondary">Terms of Service</a>
            <a href="/admin" className="hover:text-secondary flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
              <Lock className="h-3 w-3" />
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
