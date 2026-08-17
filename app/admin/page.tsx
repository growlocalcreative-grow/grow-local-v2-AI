"use client";

import { useState, useEffect } from "react";
import { getAuthInstance, getDb, getSiteSettings, updateFirestoreDoc, firebaseConfig } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, type User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock, Save, LogOut, CheckCircle2, AlertCircle, Plus, Trash2 } from "lucide-react";
import { ICON_OPTIONS } from "@/lib/icon-map";
import {
  DEFAULT_HERO,
  DEFAULT_ABOUT,
  DEFAULT_SERVICES,
  DEFAULT_FREEBIES,
  DEFAULT_FAQ,
  DEFAULT_SETTINGS,
  type HeroContent,
  type AboutContent,
  type ServicesContent,
  type FreebiesContent,
  type FaqContent,
} from "@/lib/content";

type Status = { type: "success" | "error"; message: string } | null;

function StatusLine({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <div className={`flex items-center gap-2 text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
      {status.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {status.message}
    </div>
  );
}

async function loadContentDoc<T>(docId: string, fallback: T): Promise<T> {
  try {
    const snap = await getDoc(doc(getDb(), "content", docId));
    if (snap.exists()) return { ...fallback, ...(snap.data() as Partial<T>) };
  } catch (error) {
    console.error(error);
  }
  return fallback;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<any>(null);
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO);
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT);
  const [services, setServices] = useState<ServicesContent>(DEFAULT_SERVICES);
  const [freebies, setFreebies] = useState<FreebiesContent>(DEFAULT_FREEBIES);
  const [faq, setFaq] = useState<FaqContent>(DEFAULT_FAQ);

  const [saving, setSaving] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, Status>>({});

  useEffect(() => {
    try {
      const auth = getAuthInstance();
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
        if (u) {
          const isAdmin = u.email === 'growlocalcreative@gmail.com' || u.uid === 'bQkiEyF4dSVHrK9xvFtKNXuTE2p2';
          if (isAdmin) {
            loadAll();
          } else {
            setError("You are signed in, but you do not have admin permissions for this site.");
          }
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Auth initialization failed:", e);
      setLoading(false);
    }
  }, []);

  async function loadAll() {
    const [siteSettings, heroData, aboutData, servicesData, freebiesData, faqData] = await Promise.all([
      getSiteSettings(),
      loadContentDoc("hero", DEFAULT_HERO),
      loadContentDoc("about", DEFAULT_ABOUT),
      loadContentDoc("services", DEFAULT_SERVICES),
      loadContentDoc("freebies", DEFAULT_FREEBIES),
      loadContentDoc("faq", DEFAULT_FAQ),
    ]);
    
    // Merge database settings with code-level defaults to ensure all fields exist
    setSettings({
      ...DEFAULT_SETTINGS,
      ...(siteSettings || {})
    });

    setHero(heroData);
    setAbout(aboutData);
    setServices(servicesData);
    setFreebies(freebiesData);
    setFaq(faqData);
  }

  async function handleLogin() {
    const provider = new GoogleAuthProvider();
    setError(null);
    try {
      const auth = getAuthInstance();
      const { browserPopupRedirectResolver } = await import("firebase/auth");
      
      console.log("[Auth] Attempting login for project:", auth.app.options.projectId);
      console.log("[Auth] Current origin:", window.location.origin);
      
      await signInWithPopup(auth, provider, browserPopupRedirectResolver);
    } catch (error: any) {
      console.error("Login failed:", error);
      
      let friendlyMessage = error.message;
      if (error.code === 'auth/invalid-continue-uri') {
        friendlyMessage = "The URL you are trying to return to is not whitelisted in your Firebase Console. Please check 'Authorized Domains' settings.";
      } else if (error.code === 'auth/unauthorized-domain') {
        friendlyMessage = "This domain is not whitelisted in your Firebase project's Authentication settings.";
      }
      
      setError(`${friendlyMessage} (Error code: ${error.code || 'unknown'})`);
    }
  }

  async function saveSection(key: string, docId: string, data: any) {
    setSaving(key);
    setStatus((s) => ({ ...s, [key]: null }));
    try {
      await updateFirestoreDoc(docId === "global" ? "site_settings" : "content", docId, data);
      setStatus((s) => ({ ...s, [key]: { type: "success", message: "Saved! Live site updates within a minute." } }));
    } catch (error) {
      setStatus((s) => ({ ...s, [key]: { type: "error", message: "Failed to save. Are you signed in as the admin?" } }));
      console.error(error);
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (!user || error?.includes("admin permissions")) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>{error?.includes("admin permissions") ? "Unauthorized" : "Admin Access"}</CardTitle>
            <CardDescription>
              {error?.includes("admin permissions") 
                ? "You do not have permission to access this dashboard. Please sign in with an admin account."
                : "Sign in with your Google account to manage Grow Local Creative."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{error?.includes("admin permissions") ? "Access Denied" : "Login failed"}</span>
                </div>
                <p className="text-sm text-red-600 mb-4">{error}</p>
                
                {error.includes('unauthorized-domain') && (
                  <div className="mt-2 pt-4 border-t border-red-100">
                    <p className="text-xs font-bold text-red-800 uppercase mb-2">Debug Information:</p>
                    <div className="space-y-2 text-xs text-red-700 bg-white/50 p-2 rounded">
                      <p><strong>Project ID:</strong> {firebaseConfig.projectId}</p>
                      <p><strong>API Key (Start):</strong> {firebaseConfig.apiKey?.substring(0, 8)}...</p>
                      <p><strong>Auth Domain:</strong> {firebaseConfig.authDomain}</p>
                      <p><strong>Whitelisted Domain Needed:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'loading...'}</p>
                    </div>
                    <p className="mt-3 text-xs text-red-600 italic">
                      1. Check that the Project ID matches your Firebase project.<br />
                      2. Ensure the "Auth Domain" is whitelisted in Firebase Console (Auth &gt; Settings &gt; Authorized Domains).<br />
                      3. Ensure the "Whitelisted Domain" is ALSO added to your "Authorized Domains".
                    </p>
                  </div>
                )}
              </div>
            )}
            <Button onClick={error?.includes("admin permissions") ? () => { getAuthInstance().signOut(); setError(null); } : handleLogin} className="w-full">
              {error?.includes("admin permissions") ? "Sign out and switch accounts" : "Sign in with Google"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your site settings and page content.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
          <Button variant="outline" size="sm" onClick={() => getAuthInstance().signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="freebies">Freebies</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>

        {/* HERO */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>The first thing visitors and AI crawlers see.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Eyebrow (small text above headline)</Label>
                <Input value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Headline</Label>
                  <Input value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Headline Emphasis (italic part)</Label>
                  <Input value={hero.headlineEmphasis} onChange={(e) => setHero({ ...hero, headlineEmphasis: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subhead</Label>
                <Textarea rows={3} value={hero.subhead} onChange={(e) => setHero({ ...hero, subhead: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Button Label</Label>
                <Input value={hero.ctaLabel} onChange={(e) => setHero({ ...hero, ctaLabel: e.target.value })} />
              </div>
              <div className="flex items-center gap-4 pt-2">
                <Button onClick={() => saveSection("hero", "hero", hero)} disabled={saving === "hero"}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving === "hero" ? "Saving..." : "Save Hero"}
                </Button>
                <StatusLine status={status.hero ?? null} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABOUT */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>Your story, in your voice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge Text</Label>
                <Input value={about.badgeText} onChange={(e) => setAbout({ ...about, badgeText: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Heading</Label>
                <Input value={about.heading} onChange={(e) => setAbout({ ...about, heading: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Paragraphs</Label>
                {about.paragraphs.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <Textarea
                      rows={3}
                      value={p}
                      onChange={(e) => {
                        const next = [...about.paragraphs];
                        next[i] = e.target.value;
                        setAbout({ ...about, paragraphs: next });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAbout({ ...about, paragraphs: about.paragraphs.filter((_, idx) => idx !== i) })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setAbout({ ...about, paragraphs: [...about.paragraphs, ""] })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Paragraph
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <Button onClick={() => saveSection("about", "about", about)} disabled={saving === "about"}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving === "about" ? "Saving..." : "Save About"}
                </Button>
                <StatusLine status={status.about ?? null} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SERVICES */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services Section</CardTitle>
              <CardDescription>Your offerings, listed one card per item.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input value={services.heading} onChange={(e) => setServices({ ...services, heading: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Subheading</Label>
                  <Input value={services.subheading} onChange={(e) => setServices({ ...services, subheading: e.target.value })} />
                </div>
              </div>

              <div className="space-y-6">
                {services.items.map((item, i) => (
                  <div key={i} className="border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Service {i + 1}</Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setServices({ ...services, items: services.items.filter((_, idx) => idx !== i) })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...services.items];
                        next[i] = { ...next[i], title: e.target.value };
                        setServices({ ...services, items: next });
                      }}
                    />
                    <Textarea
                      placeholder="Description"
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const next = [...services.items];
                        next[i] = { ...next[i], description: e.target.value };
                        setServices({ ...services, items: next });
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        className="border rounded-md px-3 py-2 text-sm bg-background"
                        value={item.icon}
                        onChange={(e) => {
                          const next = [...services.items];
                          next[i] = { ...next[i], icon: e.target.value };
                          setServices({ ...services, items: next });
                        }}
                      >
                        {ICON_OPTIONS.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                      <Input
                        placeholder="Badge (optional, e.g. POPULAR)"
                        value={item.badge || ""}
                        onChange={(e) => {
                          const next = [...services.items];
                          next[i] = { ...next[i], badge: e.target.value };
                          setServices({ ...services, items: next });
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setServices({
                      ...services,
                      items: [...services.items, { title: "", description: "", icon: "Sparkles" }],
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Service
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Button onClick={() => saveSection("services", "services", services)} disabled={saving === "services"}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving === "services" ? "Saving..." : "Save Services"}
                </Button>
                <StatusLine status={status.services ?? null} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FREEBIES */}
        <TabsContent value="freebies">
          <Card>
            <CardHeader>
              <CardTitle>Freebies Section</CardTitle>
              <CardDescription>Your free offers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Eyebrow</Label>
                  <Input value={freebies.eyebrow} onChange={(e) => setFreebies({ ...freebies, eyebrow: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input value={freebies.heading} onChange={(e) => setFreebies({ ...freebies, heading: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Subheading</Label>
                  <Input value={freebies.subheading} onChange={(e) => setFreebies({ ...freebies, subheading: e.target.value })} />
                </div>
              </div>

              <div className="space-y-6">
                {freebies.items.map((item, i) => (
                  <div key={i} className="border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Freebie {i + 1}</Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFreebies({ ...freebies, items: freebies.items.filter((_, idx) => idx !== i) })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...freebies.items];
                        next[i] = { ...next[i], title: e.target.value };
                        setFreebies({ ...freebies, items: next });
                      }}
                    />
                    <Textarea
                      placeholder="Description"
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const next = [...freebies.items];
                        next[i] = { ...next[i], description: e.target.value };
                        setFreebies({ ...freebies, items: next });
                      }}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <select
                        className="border rounded-md px-3 py-2 text-sm bg-background"
                        value={item.icon}
                        onChange={(e) => {
                          const next = [...freebies.items];
                          next[i] = { ...next[i], icon: e.target.value };
                          setFreebies({ ...freebies, items: next });
                        }}
                      >
                        {ICON_OPTIONS.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                      <Input
                        placeholder="Button Text"
                        value={item.buttonText}
                        onChange={(e) => {
                          const next = [...freebies.items];
                          next[i] = { ...next[i], buttonText: e.target.value };
                          setFreebies({ ...freebies, items: next });
                        }}
                      />
                      <Input
                        placeholder="Link (mailto: or URL)"
                        value={item.href}
                        onChange={(e) => {
                          const next = [...freebies.items];
                          next[i] = { ...next[i], href: e.target.value };
                          setFreebies({ ...freebies, items: next });
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFreebies({
                      ...freebies,
                      items: [...freebies.items, { title: "", description: "", icon: "Gift", buttonText: "", href: "" }],
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Freebie
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Button onClick={() => saveSection("freebies", "freebies", freebies)} disabled={saving === "freebies"}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving === "freebies" ? "Saving..." : "Save Freebies"}
                </Button>
                <StatusLine status={status.freebies ?? null} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>FAQ Section</CardTitle>
              <CardDescription>Powers both the visible FAQ and the FAQ schema search engines and AI answer engines read directly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input value={faq.heading} onChange={(e) => setFaq({ ...faq, heading: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Subheading</Label>
                  <Input value={faq.subheading} onChange={(e) => setFaq({ ...faq, subheading: e.target.value })} />
                </div>
              </div>

              <div className="space-y-6">
                {faq.items.map((item, i) => (
                  <div key={i} className="border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Question {i + 1}</Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFaq({ ...faq, items: faq.items.filter((_, idx) => idx !== i) })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Question"
                      value={item.question}
                      onChange={(e) => {
                        const next = [...faq.items];
                        next[i] = { ...next[i], question: e.target.value };
                        setFaq({ ...faq, items: next });
                      }}
                    />
                    <Textarea
                      placeholder="Answer"
                      rows={3}
                      value={item.answer}
                      onChange={(e) => {
                        const next = [...faq.items];
                        next[i] = { ...next[i], answer: e.target.value };
                        setFaq({ ...faq, items: next });
                      }}
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFaq({ ...faq, items: [...faq.items, { question: "", answer: "" }] })}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Question
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Button onClick={() => saveSection("faq", "faq", faq)} disabled={saving === "faq"}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving === "faq" ? "Saving..." : "Save FAQ"}
                </Button>
                <StatusLine status={status.faq ?? null} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SITE SETTINGS */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>Global configuration for the agency website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agencyName">Agency Name</Label>
                  <Input id="agencyName" value={settings?.agencyName || ""} onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" value={settings?.email || ""} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={settings?.phone || ""} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location Text</Label>
                  <Input id="location" value={settings?.location || ""} onChange={(e) => setSettings({ ...settings, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color (Buttons, Icons)</Label>
                  <div className="flex gap-2">
                    <Input id="primaryColor" type="color" className="w-12 h-10 p-1" value={settings?.primaryColor || "#3D4337"} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} />
                    <Input value={settings?.primaryColor || ""} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryForeground">Primary Foreground (Text on Buttons)</Label>
                  <div className="flex gap-2">
                    <Input id="primaryForeground" type="color" className="w-12 h-10 p-1" value={settings?.primaryForeground || "#F7F4ED"} onChange={(e) => setSettings({ ...settings, primaryForeground: e.target.value })} />
                    <Input value={settings?.primaryForeground || ""} onChange={(e) => setSettings({ ...settings, primaryForeground: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color (Accents, Hero Emphasis)</Label>
                  <div className="flex gap-2">
                    <Input id="secondaryColor" type="color" className="w-12 h-10 p-1" value={settings?.secondaryColor || "#A1A68C"} onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })} />
                    <Input value={settings?.secondaryColor || ""} onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryForeground">Secondary Foreground (Text on Accents)</Label>
                  <div className="flex gap-2">
                    <Input id="secondaryForeground" type="color" className="w-12 h-10 p-1" value={settings?.secondaryForeground || "#3D4337"} onChange={(e) => setSettings({ ...settings, secondaryForeground: e.target.value })} />
                    <Input value={settings?.secondaryForeground || ""} onChange={(e) => setSettings({ ...settings, secondaryForeground: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <Input id="backgroundColor" type="color" className="w-12 h-10 p-1" value={settings?.backgroundColor || "#F7F4ED"} onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })} />
                    <Input value={settings?.backgroundColor || ""} onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foregroundColor">Text Color (Foreground)</Label>
                  <div className="flex gap-2">
                    <Input id="foregroundColor" type="color" className="w-12 h-10 p-1" value={settings?.foregroundColor || "#1A1A1A"} onChange={(e) => setSettings({ ...settings, foregroundColor: e.target.value })} />
                    <Input value={settings?.foregroundColor || ""} onChange={(e) => setSettings({ ...settings, foregroundColor: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardColor">Card Background Color</Label>
                  <div className="flex gap-2">
                    <Input id="cardColor" type="color" className="w-12 h-10 p-1" value={settings?.cardColor || "#FFFFFF"} onChange={(e) => setSettings({ ...settings, cardColor: e.target.value })} />
                    <Input value={settings?.cardColor || ""} onChange={(e) => setSettings({ ...settings, cardColor: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="borderColor">Border Color</Label>
                  <div className="flex gap-2">
                    <Input id="borderColor" type="color" className="w-12 h-10 p-1" value={settings?.borderColor || "#E5E5E5"} onChange={(e) => setSettings({ ...settings, borderColor: e.target.value })} />
                    <Input value={settings?.borderColor || ""} onChange={(e) => setSettings({ ...settings, borderColor: e.target.value })} />
                  </div>
                </div>

                <div className="h-px bg-border my-6" />
                <h3 className="text-lg font-medium">Footer Content</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="footerDescription">Footer Description</Label>
                  <Textarea 
                    id="footerDescription" 
                    value={settings?.footerDescription || ""} 
                    onChange={(e) => setSettings({ ...settings, footerDescription: e.target.value })} 
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Social Links</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const newLinks = [...(settings?.socialLinks || [])];
                        newLinks.push({ platform: "Instagram", url: "", isEnabled: true });
                        setSettings({ ...settings, socialLinks: newLinks });
                      }}
                    >
                      Add Link
                    </Button>
                  </div>
                  
                  {(settings?.socialLinks || []).map((link, idx) => (
                    <div key={idx} className="flex gap-4 items-end border p-3 rounded-md">
                      <div className="flex-1 space-y-2">
                        <Label>Platform</Label>
                        <select 
                          className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={link.platform}
                          onChange={(e) => {
                            const newLinks = [...settings.socialLinks];
                            newLinks[idx].platform = e.target.value;
                            setSettings({ ...settings, socialLinks: newLinks });
                          }}
                        >
                          <option value="Instagram">Instagram</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Linkedin">LinkedIn</option>
                          <option value="Twitter">Twitter</option>
                          <option value="Youtube">YouTube</option>
                          <option value="Github">GitHub</option>
                          <option value="Website">Other Website</option>
                        </select>
                      </div>
                      <div className="flex-[2] space-y-2">
                        <Label>URL</Label>
                        <Input 
                          value={link.url} 
                          onChange={(e) => {
                            const newLinks = [...settings.socialLinks];
                            newLinks[idx].url = e.target.value;
                            setSettings({ ...settings, socialLinks: newLinks });
                          }} 
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-center pb-2">
                        <Label className="text-xs">Show</Label>
                        <input 
                          type="checkbox" 
                          checked={link.isEnabled} 
                          onChange={(e) => {
                            const newLinks = [...settings.socialLinks];
                            newLinks[idx].isEnabled = e.target.checked;
                            setSettings({ ...settings, socialLinks: newLinks });
                          }}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          const newLinks = settings.socialLinks.filter((_, i) => i !== idx);
                          setSettings({ ...settings, socialLinks: newLinks });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button onClick={() => saveSection("settings", "global", settings)} disabled={saving === "settings"}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving === "settings" ? "Saving..." : "Save Settings"}
                </Button>
                <StatusLine status={status.settings ?? null} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-center text-muted-foreground">
        Note: Firestore Rules restrict write access to the admin user email: growlocalcreative@gmail.com
      </p>
    </div>
  );
}
