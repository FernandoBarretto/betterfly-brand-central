import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Home,
  Target,
  Mic2,
  Palette,
  FolderOpen,
  Ruler,
  ChevronRight,
  TrendingUp,
  Shield,
  BarChart2,
  Zap,
  Library,
  Sparkles,
  Heart,
  Menu,
  X,
  LayoutList,
  ClipboardList,
  PaintBucket,
  Search,
  BookOpen,
  Key,
  DollarSign,
  ChevronDown,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface NavGroup {
  label: string;
  muted?: boolean;
  collapsible?: boolean;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Use Cases",
    items: [
      { icon: ClipboardList, label: "Get Smart", path: "/use-cases/broker-meeting-prep" },
      { icon: PaintBucket, label: "Campaign Build", path: "/use-cases/campaign-build" },
      { icon: Search, label: "Competitive Review", path: "/market-intelligence/intel-digest" },
    ],
  },
  {
    label: "Brand Hub",
    collapsible: true,
    items: [
      { icon: BookOpen, label: "Brand Guidelines", path: "/brand-guidelines" },
      { icon: Target, label: "Audience Playbooks", path: "/playbooks" },
      { icon: Heart, label: "Social Impact", path: "/social-impact" },
      { icon: DollarSign, label: "Marketing Budget", path: "/marketing-budget" },
    ],
  },
  {
    label: "Market Intelligence",
    items: [
      { icon: Zap, label: "Intel Digest", path: "/market-intelligence/intel-digest" },
      { icon: Shield, label: "Battle Cards", path: "/market-intelligence/battle-cards" },
      { icon: BarChart2, label: "Competitive Overview", path: "/market-intelligence/trends" },
    ],
  },
  {
    label: "Utilities",
    muted: true,
    items: [
      { icon: Sparkles, label: "Asset Generator", path: "/asset-generator" },
      { icon: Library, label: "File Library", path: "/file-library" },
      { icon: FolderOpen, label: "Templates", path: "/templates" },
      { icon: Key, label: "API Keys", path: "/admin/api-keys" },
    ],
  },
];

const playbookSubItems: NavItem[] = [
  { icon: LayoutList, label: "Carriers", path: "/playbooks/carriers" },
  { icon: TrendingUp, label: "Brokers", path: "/playbooks/brokers" },
  { icon: Zap, label: "Employers", path: "/playbooks/employers" },
  { icon: Target, label: "Employees", path: "/playbooks/employees" },
];

const brandGuidelinesSubItems: NavItem[] = [
  { icon: Mic2, label: "Tone", path: "/brand-guidelines/tone" },
  { icon: Palette, label: "Visual Identity", path: "/brand-guidelines/visual-identity" },
];

export function Sidebar() {
  const [location] = useLocation();
  const isPlaybooks = location.startsWith("/playbooks");
  const isBrandGuidelines = location.startsWith("/brand-guidelines");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navGroups.forEach((g) => {
      if (g.collapsible) initial[g.label] = false;
    });
    return initial;
  });

  function toggleGroup(label: string) {
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  useEffect(() => {
    navGroups.forEach((g) => {
      if (g.collapsible && g.items.some((item) => location === item.path || location.startsWith(item.path + "/"))) {
        setCollapsedGroups((prev) => ({ ...prev, [g.label]: false }));
      }
    });
  }, [location]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
      document.addEventListener("keydown", handleEsc);
      return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", handleEsc); };
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function isActive(path: string) {
    if (path === "/") return location === "/";
    return location === path || location.startsWith(path + "/");
  }

  const sidebarContent = (
    <>
      <div className="px-5 py-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <Link href="/">
            <img
              src="/betterfly-wordmark.png"
              alt="Betterfly"
              className="h-7 w-auto object-contain cursor-pointer"
            />
          </Link>
          <p className="text-white/30 text-xs mt-2 pl-0.5">Brand Central</p>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-white/50 hover:text-white p-1"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-full font-sans text-sm transition-all duration-fast group mb-2 ${
            location === "/"
              ? "bg-green-400 text-green-950 font-semibold"
              : "text-white/70 hover:text-white hover:bg-white/10 font-medium"
          }`}
          data-testid="nav-home"
        >
          <Home size={16} className="shrink-0" />
          <span className="flex-1">Home</span>
          {location === "/" && <ChevronRight size={14} className="opacity-60" />}
        </Link>

        {navGroups.map((group) => {
          const isCollapsed = group.collapsible && collapsedGroups[group.label];
          return (
          <div key={group.label} className="mt-4">
            <div className="px-3 mb-1.5">
              {group.collapsible ? (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex items-center gap-1 w-full text-left font-bold uppercase tracking-widest text-white/25 text-[10px] hover:text-white/40 transition-colors"
                >
                  <ChevronDown size={10} className={`transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
                  {group.label}
                </button>
              ) : (
                <p
                  className={`font-bold uppercase tracking-widest ${
                    group.muted
                      ? "text-white/15 text-[9px]"
                      : "text-white/25 text-[10px]"
                  }`}
                >
                  {group.label}
                </p>
              )}
            </div>
            {!isCollapsed && (
            <ul className="space-y-0.5">
              {group.items.map(({ icon: Icon, label, path }) => {
                const active = isActive(path);
                const hasPlaybookSub = path === "/playbooks";
                const hasBrandGuidelinesSub = path === "/brand-guidelines";
                const subItems = hasPlaybookSub && isPlaybooks
                  ? playbookSubItems
                  : hasBrandGuidelinesSub && isBrandGuidelines
                    ? brandGuidelinesSubItems
                    : null;
                return (
                  <li key={path}>
                    <Link
                      href={path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-full font-sans text-sm transition-all duration-fast group ${
                        active
                          ? "bg-green-400 text-green-950 font-semibold"
                          : group.muted
                            ? "text-white/50 hover:text-white/80 hover:bg-white/5 font-medium"
                            : "text-white/70 hover:text-white hover:bg-white/10 font-medium"
                      }`}
                      data-testid={`nav-${path.split("/").pop()}`}
                    >
                      <Icon size={15} className="shrink-0" />
                      <span className="flex-1">{label}</span>
                      {active && <ChevronRight size={14} className="opacity-60" />}
                    </Link>
                    {subItems && (
                      <ul className="mt-1 ml-4 space-y-0.5 border-l border-white/10 pl-3">
                        {subItems.map(({ icon: SubIcon, label: subLabel, path: subPath }) => {
                          const subActive = location === subPath || location.startsWith(subPath + "/");
                          return (
                            <li key={subPath}>
                              <Link
                                href={subPath}
                                className={`flex items-center gap-2 px-3 py-2 rounded-full font-sans text-xs transition-colors duration-fast ${
                                  subActive
                                    ? "bg-green-400/20 text-green-400 font-semibold"
                                    : "text-white/50 hover:text-white hover:bg-white/10 font-medium"
                                }`}
                                data-testid={`nav-${subPath.split("/").pop()}`}
                              >
                                <SubIcon size={13} className="shrink-0" />
                                <span>{subLabel}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            )}
          </div>
        );
        })}
      </nav>

      <div className="px-5 py-5 border-t border-white/10">
        <div className="flex items-center gap-3">
          <img
            src="/betterfly-icon.png"
            alt="Betterfly icon"
            className="w-7 h-7 rounded-full object-cover"
          />
          <p className="text-white/30 text-xs leading-relaxed">
            Internal use only
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-950 border border-white/10 text-white p-2.5 rounded-xl shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-green-950 flex flex-col z-50 transition-[transform,visibility] duration-300 ease-in-out lg:translate-x-0 lg:visible ${
          mobileOpen ? "translate-x-0 visible" : "-translate-x-full invisible lg:visible lg:translate-x-0"
        }`}
        data-testid="sidebar"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
