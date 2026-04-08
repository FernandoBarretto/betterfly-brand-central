export interface SearchResult {
  title: string;
  excerpt: string;
  section: string;
  path: string;
}

const index: SearchResult[] = [
  { title: "Carriers Playbook", excerpt: "Expand your reach with a prevention-first voluntary benefits layer", section: "Audience Playbooks", path: "/playbooks/carriers" },
  { title: "Carriers — Elevator pitch", excerpt: "Betterfly is the prevention-first benefits platform that helps carriers reach SMB employees at the moment they're most engaged with their health", section: "Audience Playbooks", path: "/playbooks/carriers" },
  { title: "Carriers — Distribution at scale", excerpt: "Reach thousands of SMB employees through our platform without additional sales infrastructure", section: "Audience Playbooks", path: "/playbooks/carriers" },
  { title: "Carriers — Prevention-first framing", excerpt: "Benefits shown in the context of healthy habits convert at higher rates and reduce claims", section: "Audience Playbooks", path: "/playbooks/carriers" },
  { title: "Carriers — Seamless enrollment", excerpt: "One-click enrollment embedded in the Betterfly experience reduces drop-off significantly", section: "Audience Playbooks", path: "/playbooks/carriers" },
  { title: "Carrier Overview", excerpt: "Insurance that keeps people healthy — and rewards them for it. Comprehensive carrier partnership overview.", section: "Audience Playbooks", path: "/playbooks/carriers/overview" },
  { title: "Brokers Playbook", excerpt: "Expand your revenue while keeping your clients loyal — turn voluntary benefits into a competitive moat and a new commission stream", section: "Audience Playbooks", path: "/playbooks/brokers" },
  { title: "Brokers — Elevator pitch", excerpt: "Betterfly gives your SMB clients a wellness-led benefits layer that drives real utilization", section: "Audience Playbooks", path: "/playbooks/brokers" },
  { title: "Brokers — Client stickiness", excerpt: "Employers who add Betterfly report higher benefit utilization and employee satisfaction scores", section: "Audience Playbooks", path: "/playbooks/brokers" },
  { title: "Broker Overview", excerpt: "Better books start with better benefits. Full broker partnership narrative.", section: "Audience Playbooks", path: "/playbooks/brokers/overview" },
  { title: "Employers Playbook", excerpt: "Retain your best people with benefits they actually want", section: "Audience Playbooks", path: "/playbooks/employers" },
  { title: "Employers — Elevator pitch", excerpt: "Betterfly is the employee benefits platform that turns passive benefit offerings into active health engagement", section: "Audience Playbooks", path: "/playbooks/employers" },
  { title: "Employers — Zero admin overhead", excerpt: "Set up in under an hour. No dedicated HR tech staff required. We handle onboarding communications.", section: "Audience Playbooks", path: "/playbooks/employers" },
  { title: "Employees Playbook", excerpt: "Your health, your way — benefits that actually work for you", section: "Audience Playbooks", path: "/playbooks/employees" },
  { title: "Employees — Betterflies", excerpt: "Earn Betterflies by walking, meditating, sleeping well — then redeem them for real benefits or donations", section: "Audience Playbooks", path: "/playbooks/employees" },
  { title: "Employees — App onboarding", excerpt: "Welcome to Betterfly. This is your space to build healthy habits, explore your benefits, and protect what matters most", section: "Audience Playbooks", path: "/playbooks/employees" },

  { title: "One-liner", excerpt: "Betterfly is the prevention-first benefits platform built for SMBs — turning healthy habits into real coverage.", section: "Brand Voice", path: "/brand-voice" },
  { title: "Elevator pitch (30 sec)", excerpt: "Betterfly makes voluntary benefits something employees actually want to engage with. We reward healthy habits with Betterflies.", section: "Brand Voice", path: "/brand-voice" },
  { title: "Positioning statement", excerpt: "For SMBs and their teams, Betterfly is the prevention-first benefits platform that transforms passive coverage into active health engagement.", section: "Brand Voice", path: "/brand-voice" },
  { title: "Betterflies", excerpt: "The in-app reward currency earned through healthy habits and benefit actions.", section: "Brand Voice", path: "/brand-voice" },
  { title: "Prevention-first", excerpt: "Our core philosophy: address health before it becomes a problem.", section: "Brand Voice", path: "/brand-voice" },
  { title: "Voluntary benefits", excerpt: "Supplemental coverage employees choose and often fund themselves. Never just say 'insurance'.", section: "Brand Voice", path: "/brand-voice" },
  { title: "SMB", excerpt: "Small and medium businesses — our primary employer market (10-500 employees).", section: "Brand Voice", path: "/brand-voice" },
  { title: "Wellbeing journey", excerpt: "The ongoing, personal process of building healthy habits through the platform.", section: "Brand Voice", path: "/brand-voice" },
  { title: "Enrollment", excerpt: "The act of a user signing up for a specific voluntary benefit. Not 'sign-up'.", section: "Brand Voice", path: "/brand-voice" },
  { title: "Health engagement", excerpt: "Active participation in wellness activities within the platform. Not 'usage'.", section: "Brand Voice", path: "/brand-voice" },
  { title: "Tone Guidelines — Formal", excerpt: "Precise and outcome-oriented. Data-driven language. Credible, not clinical.", section: "Brand Voice", path: "/brand-voice" },
  { title: "Tone Guidelines — Casual", excerpt: "Conversational and warm. Second-person. Contractions are fine. Celebrate progress, not perfection.", section: "Brand Voice", path: "/brand-voice" },

  { title: "LinkedIn Carousel — SMB Benefits Overview", excerpt: "6-slide carousel explaining Betterfly's core value prop for HR decision-makers.", section: "Templates", path: "/templates" },
  { title: "Instagram Story — Betterflies Launch", excerpt: "Animated story template announcing Betterflies rewards program.", section: "Templates", path: "/templates" },
  { title: "Broker Enablement One-Pager", excerpt: "One-page overview for broker reps to share with SMB prospects.", section: "Templates", path: "/templates" },
  { title: "Employer Benefits Overview", excerpt: "HR-facing summary of Betterfly's employee wellbeing platform.", section: "Templates", path: "/templates" },
  { title: "Employee Welcome Sheet", excerpt: "Printable onboarding guide: what Betterfly is and how to get started.", section: "Templates", path: "/templates" },
  { title: "Carrier Partnership Pitch Deck", excerpt: "14-slide deck covering distribution opportunity, data, and co-brand model.", section: "Templates", path: "/templates" },
  { title: "Broker Demo Deck", excerpt: "8-slide walkthrough of the platform for broker discovery meetings.", section: "Templates", path: "/templates" },
  { title: "Enrollment Campaign Landing Page", excerpt: "Clean landing page template for company-specific open enrollment campaigns.", section: "Templates", path: "/templates" },
  { title: "Webinar Registration Page", excerpt: "Registration page for Betterfly-hosted broker education webinars.", section: "Templates", path: "/templates" },
  { title: "Benefits Fair Event Invite", excerpt: "Email + printed invite for employer benefits fair featuring Betterfly.", section: "Templates", path: "/templates" },

  { title: "Use approved color palette", excerpt: "Stick to Betterfly Green (#19F578), Yellow (#E8FB10), Forest Green (#042914), and neutrals.", section: "Brand Guidelines", path: "/brand-guidelines" },
  { title: "Use Obviously Narrow for display", excerpt: "Headlines, hero copy, and section titles use Obviously Narrow Bold. Body copy uses Roboto Regular.", section: "Brand Guidelines", path: "/brand-guidelines" },
  { title: "Maintain clear space around the logo", excerpt: "Minimum clear space = height of the 'B' icon mark on all four sides.", section: "Brand Guidelines", path: "/brand-guidelines" },
  { title: "Co-Branding Rules", excerpt: "Partner logos must appear at equal or smaller size. Use approved co-brand lockups.", section: "Brand Guidelines", path: "/brand-guidelines" },
  { title: "Social Media Governance", excerpt: "LinkedIn posts must include the Betterfly logo. All social imagery must use approved templates.", section: "Brand Guidelines", path: "/brand-guidelines" },
  { title: "Don't alter the logo", excerpt: "No stretching, rotating, recoloring, dropping shadows, or adding outlines to any logo asset.", section: "Brand Guidelines", path: "/brand-guidelines" },
  { title: "Don't use 'insurance' as a lead word", excerpt: "In employee-facing contexts, lead with 'coverage', 'protection', or 'benefits'.", section: "Brand Guidelines", path: "/brand-guidelines" },

  { title: "Social Impact", excerpt: "The Betterfly Effect — how healthy habits become real-world donations. B-Corp certified.", section: "Social Impact", path: "/social-impact" },
  { title: "The Betterfly Effect", excerpt: "When employees take positive actions, their coverage grows and Betterfly generates donations to social and environmental causes automatically.", section: "Social Impact", path: "/social-impact" },
  { title: "B-Corp Certification", excerpt: "Betterfly is B-Corp certified — independently verified to meet the highest standards of social and environmental performance.", section: "Social Impact", path: "/social-impact" },
  { title: "How Donations Work", excerpt: "Employees engage, coverage grows, Betterfly generates donations to vetted foundations. No extra cost. No opt-in required.", section: "Social Impact", path: "/social-impact" },
  { title: "Foundation Partners", excerpt: "Donations go to verified social and environmental organizations like Water is Life and Leche para Haiti.", section: "Social Impact", path: "/social-impact" },
  { title: "Proof Points", excerpt: "Talking points and responses for common broker and employer conversations about the donation mechanic.", section: "Social Impact", path: "/social-impact" },

  { title: "File Library", excerpt: "Every file in one searchable place — PDFs, decks, playbooks, templates, case studies, and live guides.", section: "File Library", path: "/file-library" },
  { title: "Betterfly 3-Pager (US) v2", excerpt: "The definitive US market overview document. Covers value proposition, product summary, and target audiences.", section: "File Library", path: "/file-library" },
  { title: "Meet Betterfly — For Brokers (Extended)", excerpt: "Extended broker enablement deck. Commission structure, onboarding process, and competitive positioning.", section: "File Library", path: "/file-library" },
  { title: "Sales Battle Cards — File Library", excerpt: "Objection handling, weaknesses, and closing questions for 6 key competitors.", section: "File Library", path: "/file-library" },
  { title: "Intel Digest", excerpt: "The competitive landscape at a glance — latest intel feed, competitor pulse grid, and where Betterfly wins.", section: "Market Intelligence", path: "/market-intelligence/intel-digest" },
  { title: "Carrier Partnership Pitch Deck", excerpt: "14-slide deck covering distribution opportunity, data, and co-brand model.", section: "File Library", path: "/file-library" },
  { title: "Broker Demo Deck", excerpt: "8-slide walkthrough of the platform for broker discovery meetings.", section: "File Library", path: "/file-library" },
  { title: "LinkedIn Carousel — SMB Benefits Overview", excerpt: "6-slide carousel explaining Betterfly's core value prop for HR decision-makers.", section: "File Library", path: "/file-library" },
  { title: "Broker Enablement One-Pager", excerpt: "One-page overview for broker reps to share with SMB prospects.", section: "File Library", path: "/file-library" },
  { title: "Employee Welcome Sheet", excerpt: "Printable onboarding guide — what Betterfly is and how to get started.", section: "File Library", path: "/file-library" },
  { title: "SMB Benefits Gap Report 2025", excerpt: "Annual research across 1,200 SMBs revealing the gap between benefit offerings and utilization rates.", section: "File Library", path: "/file-library" },
  { title: "Prevention Pays White Paper", excerpt: "Data-driven analysis of how prevention-first engagement reduces claims and improves carrier outcomes.", section: "File Library", path: "/file-library" },
  { title: "Meadowbrook Manufacturing Case Study", excerpt: "A 200-person manufacturer replaced broker-direct enrollment with Betterfly. Enrollment up 60%.", section: "File Library", path: "/file-library" },
  { title: "Riverside Dental Group Case Study", excerpt: "Regional dental group broker — enrollment rates tripled in a single open enrollment cycle.", section: "File Library", path: "/file-library" },
];

export function search(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return index.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q)
  );
}

export function groupResults(results: SearchResult[]): Record<string, SearchResult[]> {
  const groups: Record<string, SearchResult[]> = {};
  for (const r of results) {
    if (!groups[r.section]) groups[r.section] = [];
    groups[r.section].push(r);
  }
  return groups;
}
