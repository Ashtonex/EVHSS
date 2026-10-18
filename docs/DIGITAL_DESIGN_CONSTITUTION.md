# DIGITAL DESIGN CONSTITUTION: EHVS ECOSYSTEM

**TARGET DATE:** June 30, 2026 | **REGION:** Mutare, Zimbabwe
**STACK:** Next.js, Tailwind CSS, shadcn/ui, Framer Motion, Supabase
**STATUS:** Closed system specification — see §0.1

---

## 0. PROJECT CONTEXT & THE TROJAN HORSE STRATEGY

This document governs the dual-brand digital ecosystem for Eastern Highlands Veterinary Surgery & Shampooch Dog Grooming Spa (EHVS).

**The Dual-Brand Reality:** A single codebase housing two distinct emotional registers: Clinical Trust (Vet) and Playful Indulgence (Grooming).

**The Trojan Horse:** Phase 1 is a $250 front-end website. Architecturally, it is the visible 10% of a 12-module, Supabase-backed enterprise system. Every component built for the $250 site must serve as the literal foundation for the future $2,500+ ecosystem.

**The Mutare Context:** Mobile-first interaction, variable connectivity (3G/Edge fallbacks), a diverse user base ranging from rural livestock owners to urban pet parents.

### 0.1 System Constraint Enforcement Rule *(new — binding on all future work, human or AI)*

This document is a **closed system specification**, not a creative brief. Any agent — human developer or AI coding assistant — operating against this document is **forbidden** from:

- Introducing new UI primitives not defined in §4.0
- Introducing new navigation paradigms not defined in §3
- Inventing new component categories outside the atomic structure in §5
- Proposing solutions that require redesigning the Phase 1 foundation

Any requirement that cannot be solved within these constraints must be explicitly flagged in code comments or PR descriptions as:

> **"Deferred to Phase X expansion module — requires constitution amendment."**

It must NOT be silently solved with an improvised pattern. Improvisation is how Phase 1 becomes Phase 4's legacy debt.

---

## 1. VISION & PRODUCT PHILOSOPHY

### 1.1 Decision Pressure Model *(new — mandatory framing for every principle below)*

Every principle in this section is the resolution of a binary tension. No hybrids. Each entry below states: the two options on the table, which one wins, and what future modules explicitly sacrifice as a result of that rejection.

**Rule 1: Context Dictates Chrome.**
- **Tension:** A — one unified visual theme across departments (consistency, faster to build) vs. B — fully divergent theme per department, switched atomically (trust, but doubles design surface area).
- **Canonical choice:** B.
- **What's sacrificed:** Any future cross-department page (e.g., a combined "Pet Health & Beauty" loyalty dashboard) cannot exist as a single visually-coherent screen — it must live in one department's theme and treat the other as a guest, never a blend.
- **Failure mode if ignored:** The system feels like a generic template, eroding the specialized trust required for veterinary care.
- **UI decision:** The global "Department Switcher" dictates the entire CSS variable theme (`--radius`, `--primary`, `--font-heading`). No page may mix themes.

**Rule 2: WhatsApp-Familiarity Over Novelty.**
- **Tension:** A — modern web-app interaction patterns (multi-step wizards, complex filters) vs. B — flat, chat-app-familiar patterns (linear lists, big tap targets, minimal nesting).
- **Canonical choice:** B.
- **What's sacrificed:** Power-user features (bulk actions, advanced filtering, multi-select) are explicitly out of scope for client-facing surfaces, even in later modules. They are admin-only territory (§8).
- **Failure mode if ignored:** High bounce rates from rural or older demographics confused by complex web-app paradigms.
- **UI decision:** Mobile layout uses a fixed bottom tab bar and stacked list views — no data tables on mobile, ever, for client-facing surfaces.

**Rule 3: Bandwidth Is a Feature, Not a Bug.**
- **Tension:** A — rich media-first design (hero video, high-res galleries) vs. B — text/skeleton-first design with media as strictly optional enhancement.
- **Canonical choice:** B.
- **What's sacrificed:** Marketing pages cannot lean on cinematic imagery or video as a primary persuasion device. Persuasion must work through copy, layout, and motion alone.
- **Failure mode if ignored:** Users on slow connections see white screens and abandon the booking.
- **UI decision:** Text, system fonts, and skeleton loaders (`animate-pulse`) render instantly. Images are lazy-loaded and strictly decorative.

### 1.2 Dual-Register Definition

- **Veterinary (Clinical Calm):** Utilitarian, precise, high-contrast, sharp corners.
- **Grooming (Playful Warmth):** Soft, inviting, low-contrast shadows, rounded corners.
- **Boundary:** The transition occurs only via the top-level navigation toggle. A user is either in the Vet context or the Grooming context. Cross-pollination occurs only post-conversion (e.g., a "Book a bath too?" prompt on the Vet appointment confirmation screen).

---

## 2. EXPERIENCE ARCHITECTURE

**Shared Chrome:** Global auth state (login/register), the top Department Switcher toggle, the bottom mobile tab bar.

**Divergent Chrome:** Page backgrounds, typography pairings, button styling, empty states.

**The Upsell Rule:** Cross-department discovery is aggressive but context-aware. A routine vaccination booking (Vet) success screen offers a Grooming discount. An emergency trauma visit booking disables the grooming upsell entirely — no exceptions, no A/B test overrides this.

**Role-Based Layering (The Secret Infrastructure):** Routing must accommodate these states from Day 1, even where 80% route to a "Coming Soon" shell in Phase 1.

| Role | Lands On |
|---|---|
| Anonymous | Marketing site; basic booking flows (auth forced at final step) |
| Registered Client | "Upcoming Appointments" + "My Pets" dashboard |
| Staff (future) | "Today's Roster" (Kanban/List view) |
| Admin/Owner | "Command Center" (financials, high-level KPIs) |

---

## 3. INFORMATION ARCHITECTURE

**Phase 1 Sitemap (Dual Routing):**
- `/` (Root): Split-screen or high-contrast toggle hero. Forces user to choose a lane immediately.
- `/vet/...`: Services, Team, Emergency Protocol, Book.
- `/spa/...`: Services, Gallery, Pricing, Book.
- `/portal/...`: Entry point for locked modules.

**Data Density Rules:**
- **Clinical Records (Vet):** High density. 8px (`p-2`) padding. Inter font for numbers. Table layouts on desktop, tight list-items on mobile.
- **Grooming Records (Spa):** Low density. 16–24px (`p-4`/`p-6`) padding. Large thumbnail avatars. Visuals over text.

### 3.1 Canonical UI Surfaces *(new — every screen in the product must belong to exactly one)*

No component may exist outside a defined surface. There are five, and only five, for the lifetime of this constitution unless amended:

| Surface | Allowed Components (from §4.0 registry) | Disallowed | Density | Emotional Tone |
|---|---|---|---|---|
| **Public Experience Surface** | Card, Button, Badge, Avatar, Toast, Skeleton | Table, Drawer, Tabs (limit nav complexity) | Low | Persuasive, welcoming, brand-led |
| **Booking Flow Surface** | Input, Button, Card, Badge, Toast, Skeleton | Table, Modal-within-Modal | Low–Medium | Reassuring, linear, zero-friction |
| **Pet Profile Surface** | Card, Avatar, Badge, Tabs, Toast | Table on mobile (desktop OK) | Medium | Personal, warm regardless of department |
| **Staff Operations Surface** *(future)* | Table, Tabs, Drawer, Badge, Tooltip, Toast | Card-heavy marketing patterns | High | Efficient, neutral, fast-scan |
| **Admin Intelligence Surface** *(future)* | Table, Tabs, Modal, Tooltip, Badge, Toast | Playful motion, mascot, Spa soft-shadow language | High | Authoritative, dense, executive |

Any new screen must be assigned to one of these surfaces before a single component is chosen. If it doesn't fit any of the five, that is a signal the screen belongs to a future module needing its own constitution amendment — not a reason to invent a sixth surface ad hoc.

---

## 4. DESIGN SYSTEM FOUNDATION

These tokens map directly to `tailwind.config.js` and `globals.css`.

### 4.0 Primitive Component Lock *(new — the hard boundary against drift)*

The system may use **only** the following 12 primitives. Every component in §5, and every component in every future module, must be a composition of these and nothing else:

`Button` · `Input` · `Card` · `Modal` · `Drawer` · `Badge` · `Table` · `Tabs` · `Tooltip` · `Avatar` · `Toast` · `Skeleton`

No additional primitive may be created without explicit sign-off per the Governance Layer (§12). If a design need seems to require a 13th primitive, the correct response is to recompose existing primitives more cleverly — not to add one. This is the single highest-leverage rule in this document for preventing Phase 4 legacy debt.

### 4.1 Design Tokens

- **Base Neutrals:** Zinc scale (`bg-zinc-50` to `zinc-950`). Sterile, professional gray — no blue tint of Slate, no muddy warmth of Stone.

**Vet Brand (Clinical Calm):**
- Primary: `hsl(214, 100%, 30%)` (Trust Blue)
- Secondary: `hsl(214, 30%, 90%)` (Sterile Light Blue)
- Radius: `0.375rem` (`rounded-md`) — precise, sharp
- Font: Inter (sans-serif, legible for clinical data)

**Grooming Brand (Playful Warmth):**
- Primary: `hsl(24, 95%, 53%)` (Warm Amber)
- Secondary: `hsl(24, 100%, 90%)` (Soft Peach)
- Radius: `1rem` (`rounded-2xl`) — soft, approachable
- Font: Nunito (headings only) + Inter (body)

- **Spacing:** Strict 4pt (`0.25rem`) grid. Tailwind default scale (4, 8, 12, 16, 24, 32).

### 4.2 Grid & Breakpoints

- Mobile-first. Base styling: 320–768px.
- `md` (768px): Tablet. Bottom mobile nav shifts to a sidebar.
- `lg` (1024px+): Desktop. Max-width expands to `max-w-5xl`.
- **Low-Bandwidth Rule:** Skeletons use pure CSS background colors (`bg-zinc-200`) — never image-based loading states.

---

## 5. COMPONENT ARCHITECTURE (shadcn/ui mapped, primitive-locked)

All components pull from the CSS variables defined by the active context, and all are compositions of the §4.0 registry only.

**The Department Switcher** *(Organism — Tabs + Badge composition)*
- Floating pill, top center. Two states: "Medical" / "Spa".
- A Framer Motion layout animation slides the active pill background; `--primary` and `--radius` hot-swap instantly.

**Dual-Service Booking Card** *(Molecule — Card + Badge + Avatar composition)*
- Vet context: `rounded-md`, blue accent border, compact detail list (Time, Vet, Reason).
- Spa context: `rounded-2xl`, amber soft shadow (`shadow-md shadow-amber-500/10`), prominent pet avatar, loose spacing.

**Pet Profile Badge** *(Atom — Avatar + Badge composition)*
- 40×40px avatar + name + species icon (dog/cat/cow).
- Built once. Reused in header, booking form, and future clinical module — this is the component that proves the Trojan horse thesis works.

**The Admin Shell** *(The Trojan Horse — Table + Tabs + Tooltip + Badge composition)*
- Desktop sidebar lists all 12 future modules.
- Phase 1 state: unbuilt modules visible but locked — 50% opacity, lock icon, tooltip ("Available in v2.0"). Clicking reveals a skeleton layout of the future module, functioning as an integrated sales pitch.

---

## 6. INTERACTION & MOTION DESIGN

Framer Motion is restricted to state changes, not scroll-jacking.

- **Clinical Motion (Vet):** Snappy, urgent. `ease: "easeOut", duration: 0.15`. Philosophy: do not waste the user's time in an emergency.
- **Delight Motion (Grooming):** Playful, physical. `type: "spring", stiffness: 300, damping: 20`. Philosophy: interacting with the UI should feel slightly tactile and fun.

**Error States (Supabase callbacks):**
- Vet: Red standard alerts (`destructive` in shadcn). Clinical copy. *"Error: Slot unavailable."*
- Spa: Amber warnings. Warmer copy. *"Oops! Another pup grabbed that spot."*

---

## 7. ACCESSIBILITY & USABILITY

Engineered for the Mutare demographic — variable tech-literacy, smaller screens, bright outdoor sunlight.

- **Tap Targets:** Minimum 48×48px on mobile.
- **Contrast:** WCAG AA minimum. No light gray text on white. `text-zinc-600` minimum for secondary text.
- **Inputs:** Numeric inputs (phone numbers, weights) trigger correct mobile keyboard (`type="tel"`, `inputMode="decimal"`). No complex multi-select dropdowns — vertical radio lists for service selection.

---

## 8. ROLE-BASED UX SYSTEM

Row-Level Security (RLS) in Supabase dictates UI rendering.

- **Anonymous:** Nav limited to Marketing pages + "Book Now".
- **Registered:** Nav expands to "My Portal". Density remains low (consumer-friendly).
- **Admin (Ashton/EHVS Owner):** Nav expands to "System Settings", "Database View", "Revenue". Density switches to high (enterprise-friendly). Standard shadcn data tables enabled here only.

---

## 9. CROSS-PLATFORM LOGIC

**Optimistic UI for Bookings:** Rural connections drop. On "Confirm Appointment," the UI instantly reflects success locally; the Supabase insert runs in the background. On failure or conflict, a toast gently reverts state and prompts retry.

**Real-time Subscriptions:** The future front-desk module subscribes to Supabase channels. A new web booking triggers a subtle notification badge on the staff dashboard without a page refresh.

---

## 10. VISUAL LANGUAGE SYSTEM

**Mascot Usage:** Reserved for empty states, 404 pages, and success screens ONLY. Never adjacent to clinical forms, pricing tables, or medical histories.

**Data Visualization (future-proofing):**
- Vet Dashboards: Strict line charts and bar graphs (shadcn/recharts).
- Spa Dashboards: Donut charts and radial progress bars.

---

## 11. SYSTEM SCALABILITY RULES

**The Component Slotting Rule:** Any new module (e.g., Inventory Management) must be built using exclusively the §4.0 primitive registry. A requested new primitive requires Governance (§12) sign-off and retrofit into the global Flectēre component library first — never a one-off addition for a single module.

**Flectēre vs. EHVS:** Flectēre owns the Next.js scaffolding, auth logic, and structural layouts. EHVS owns the CSS variables (tokens) and content. When Flectēre onboards a new client, the scaffold is duplicated and CSS variables swapped. The skeleton remains intact — this is the entire reusability thesis of the Flectēre business model, not just this project.

### 11.1 Module Integration Contract *(new — every future module must pass this before it ships)*

Each of the 12 future modules must conform to:
- The same authentication layer (§8 role ladder)
- The same navigation shell (§2 shared chrome)
- The same component library (§4.0 primitive registry, §5 compositions)
- The same design tokens (§4.1)

A module is permitted to **extend functionality**. It is **not** permitted to **redefine the UX system** — no new navigation paradigm, no new primitive, no new surface (§3.1) invented on the fly.

Before any module is scoped for build, it must declare, in writing, as part of its build brief:

1. **Dependencies** — which existing primitives, tokens, and shared chrome it consumes
2. **UI surfaces used** — which of the five canonical surfaces (§3.1) it lives in
3. **New components introduced, if any** — composed exclusively from the §4.0 registry, explicitly flagged for Governance review if a genuinely new composition pattern is needed

A module that cannot complete this declaration without requesting something outside the closed system (§0.1) is flagged as **"Deferred to Phase X expansion module — requires constitution amendment"** rather than improvised into existence.

---

## 12. DESIGN LAWS

These laws form the core identity of the enterprise design system.

1. **Law 1:** Navigation never moves.
2. **Law 2:** One primary action.
3. **Law 3:** Everything belongs to a surface.
4. **Law 4:** Everything derives from primitives.
5. **Law 5:** Motion communicates state.
6. **Law 6:** Color communicates department.
7. **Law 7:** Typography communicates hierarchy.
8. **Law 8:** Data never surprises users.
9. **Law 9:** Performance outranks decoration.
10. **Law 10:** Consistency outranks creativity.

---

## 13. PRODUCT OPERATING PRINCIPLES

Every feature request must pass these gates:
1. Does it reduce user effort?
2. Does it increase trust?
3. Does it reduce future maintenance?
4. Does it increase system consistency?
5. Does it create reusable capability?

If fewer than 4 of 5 are true: **Reject it**. This forces product discipline.

---

## 14. SYSTEM METRICS

Every screen should target the following success metrics:
- **Time to first interaction:** < 1 second
- **Booking completion:** < 90 seconds
- **Max taps to booking:** ≤ 8
- **Largest Contentful Paint (LCP):** < 2.5 s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Accessibility score:** 95+
- **Lighthouse score:** 95+
- **Mobile performance:** 90+

These numbers are non-negotiable engineering requirements.

---

## 15. COGNITIVE LOAD RULES

To prevent UI bloat, adhere to these maximums per screen:
- **Maximum 7** navigation items
- **Maximum 3** visual hierarchy levels
- **Maximum 2** simultaneous CTAs
- **Maximum 5** actions per screen
- **Maximum 1** dominant color

---

## 16. PERFORMANCE BUDGET

Performance IS UX in Zimbabwe. The following limits are hard engineering constraints:
- **Homepage:** < 900 KB
- **Booking:** < 600 KB
- **Initial JS:** < 250 KB
- **Images:** WebP only
- **Fonts:** 2 maximum
- **HTTP Requests:** < 60
- **Lazy load:** Everything below the fold

---

## 17. DESIGN LIFECYCLE

Every feature should flow through this exact process. Skipping steps leads to legacy debt.

`Discovery` → `UX Spec` → `Wireframe` → `Component Mapping` → `Prototype` → `Review` → `Development` → `QA` → `Accessibility Audit` → `Release` → `Post-launch Metrics`

---

## 18. GOVERNANCE LAYER & REVIEW

**The Single Approver:** Ashton (or the designated Lead Architect) is the sole approver of PRs affecting `globals.css`, `tailwind.config.js`, the base shadcn component files, or any addition to the §4.0 primitive registry.

**The "No Custom CSS" Law:** No inline styles. No custom classes in standard files. If a design cannot be achieved using standard Tailwind utility classes or Framer Motion properties, the design is too complex and must be simplified.

### 18.1 Design Review Checklist

Every PR must answer:
- [ ] Uses existing primitives?
- [ ] Uses existing tokens?
- [ ] Uses existing surfaces?
- [ ] Responsive?
- [ ] Accessible?
- [ ] Passes Lighthouse?
- [ ] Motion conforms?
- [ ] Works offline gracefully?
- [ ] RLS respected?
- [ ] Mobile first?
- [ ] No custom CSS?

If any answer is **"No"**: PR rejected.

---

## 19. AI AGENT RULES (AI DEVELOPMENT CONSTITUTION)

The AI (Antigravity, Claude Code, Codex, GPT, etc.) operating against this document must self-report a drift audit after any build session. Furthermore, the AI must strictly adhere to the following rules:

The AI must **never**:
- rename components
- rename routes
- duplicate primitives
- duplicate database tables
- create CSS outside Tailwind
- introduce state libraries
- bypass Supabase RLS
- hardcode colors
- hardcode spacing
- hardcode typography
- invent icons

**If uncertain: Stop. Explain uncertainty. Wait for approval.**
