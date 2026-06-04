# Melanated In Tech — Homepage Wireframe

---

**Purpose:** Section-by-section homepage wireframe with copy, layout specifications, and design direction. Use this to build the new homepage.

**Owner:** UX Lead / Developer

**Dependencies:** `brand-positioning.md`, `new-site-architecture.md`

**Status:** Ready to implement

**Last Updated:** 2026-06-03

**Next Actions:** Implement using components in `components/` directory; rewrite `app/page.tsx`

---

## Section 1 — Hero

**Layout:** Full viewport height (100vh desktop, 80vh mobile). Dark background `#080808` with animated gradient mesh in dark greens and purples moving slowly. Left 60% / Right 40% split on desktop; stacked on mobile.

**Eyebrow (above headline):**
Text: "The Global AI Platform for Builders"
Style: Small caps, neon green `#00FF85`, tracked out, 12px

**H1 Headline (3 options — pick one):**
1. "Build the Future. Own the Technology. Secure the Bag."
2. "AI Agents. MCP Servers. Automation. This Is Where Our Community Learns to Build All of It."
3. "The AI Revolution Is Happening. Here's How You Stop Watching It and Start Building It."

Style: 64px desktop / 40px mobile, white, Space Grotesk 700

**Subheadline (3 options):**
1. Melanated In Tech is the platform where Black and melanated professionals learn to build AI Agents, deploy automation, and monetize what they create. The tools are here. The community is here. The only thing missing is you.
2. An academy, a marketplace, and a community — built specifically for people who are ready to move from using AI to owning AI-powered income streams.
3. Learn the technical stack. Build real tools. Sell them in our marketplace. Melanated In Tech is the full-stack ecosystem for builders who are serious about what comes next.

Style: 20px, Inter 400, gray `#A0A0A0`

**CTAs:**
- Primary: "Start Building Free" — full neon green `#00FF85`, black text, 54px height desktop, rounded-lg
- Secondary: "Explore the Marketplace →" — ghost button, neon green border and text

**Trust Line:**
5 avatar circles (real member photos) + "Join 48,000+ builders already learning"
Style: Small, centered below CTAs

**Right Side Visual (desktop only):**
Animated illustration: interconnected agent nodes with data flows and a central user. Neon green accents on black background. Lottie animation or CSS animation. No stock photos.

---

## Section 2 — Social Proof Bar

**Layout:** Full-width strip, `#111111` background, 80px tall. Subtle top/bottom borders `#1F1F1F`.

**Content Options:**
- Stats: "48,000+ Members | 200+ Courses | 1,200+ Agents Listed | $2.4M Earned by Builders"
- OR logos of featured-in publications / partner tools

Stats styled as large white numbers with muted gray labels. Counter animation on scroll enter.

---

## Section 3 — Value Proposition ("Why Melanated In Tech")

**Layout:** Three-column card grid desktop, single column mobile. Background `#080808`.

**Section Header:** "Three Things You Can't Get Anywhere Else — Together in One Place"
Style: H2, centered, 36px, white

**Card 1 — The Academy:**
- Icon: Terminal/Code (neon green)
- Title: "The Academy"
- Body: "Curriculum that goes deep on AI Agents, MCP Servers, prompt engineering, automation architecture, and deployment. Built for professionals who want to build, not just understand. Self-paced. Practitioner-led. No fluff."
- CTA link: "Explore the Academy →"

**Card 2 — The Marketplace:**
- Icon: Storefront/Grid (neon green)
- Title: "The Marketplace"
- Body: "A dedicated marketplace where community builders list and sell AI Agents, MCP Servers, automation workflows, and templates. You learn it in the Academy. You monetize it in the Marketplace. The loop closes here."
- CTA link: "Browse the Marketplace →"

**Card 3 — The Community:**
- Icon: Network/Nodes (neon green)
- Title: "The Community"
- Body: "A network of builders, not a Discord full of lurkers. Peer accountability, real collaboration, shared resources, and access to people navigating the same technical and professional landscape you are."
- CTA link: "Join the Community →"

**Card styling:** `#111111` background, `rounded-xl`, 2px neon green top border, hover elevates with subtle glow.

---

## Section 4 — Featured Marketplace Products

**Layout:** Full-width section, dark `#080808` background.

**Section Header (left-aligned):**
- Eyebrow: "Built by the Community"
- H2: "Top-Rated Agents and Tools This Week"
- Right side: "Browse All 1,200+ Products →" link

**Filter Pills (below header):**
All | Agents | Prompts | MCP Servers | Blueprints

**Product Cards (horizontal scroll):**
5 visible desktop, 2 mobile. Each card (280px wide, `#111111`, `rounded-xl`):
- Category badge (top): "Agent" in neon green pill
- Thumbnail (16:9): tool screenshot or illustrated icon
- Product name: 16px semibold white
- Seller name + avatar: small, muted gray
- Star rating + review count
- Price or "Free" badge
- "Get It →" ghost button (appears on hover)

---

## Section 5 — Academy Preview

**Layout:** Two-column split desktop (40% copy / 60% carousel). Stack on mobile.

**Left Copy:**
- Eyebrow: "AI Academy"
- H2: "Go from curious to capable in weeks, not years."
- Body: "Our curriculum is built by people who build with AI every day. No fluff. No theory-only courses. Just practical skills you can use tomorrow."
- CTAs: "Explore All Courses →" and "See Learning Tracks →"

**Course Carousel (right):**
3 featured courses, auto-plays, dot navigation. Each card (360px):
- Thumbnail (16:9)
- Track badge
- Course title
- Instructor name + avatar
- Star rating + student count
- Duration + skill level pill (Beginner/Intermediate/Advanced)
- Price or "Free"
- "Preview" button on hover

---

## Section 6 — Community Section

**Layout:** Dark section `#050505`. Photo collage or grid of community members (diverse, real, not stock). Centered copy overlay or adjacent text.

**Content:**
- Eyebrow: "Community"
- H2: "A global network of AI builders who look like you."
- Body: "The community is where you get unstuck, find collaborators, celebrate wins, and stay ahead of what's next in AI."
- Stat pills: "48K Members" | "200+ Events/Year" | "Active Discord"
- CTA: "Join the Community →"

**Live Community Feed (below):**
3 recent community posts showing: member avatar, name, short post excerpt, reaction count.
Powered by Supabase Realtime.

---

## Section 7 — Newsletter Lead Capture

**Layout:** Full-width, centered content, `#050505` background, max-width 600px.

**Content:**
- Icon: Envelope with neon green glow
- H2: "The AI Edge — Weekly Newsletter"
- Body: "Every Tuesday: the AI tools, agents, and strategies the best builders are using right now. 22,000 subscribers. Zero fluff."
- Email input (full width): placeholder "Your email address"
- CTA Button: "Subscribe Free" (neon green)
- Fine print: "No spam. Unsubscribe anytime. We respect your inbox."

**Optional:** Two-option toggle before submit — "Tools Digest" vs. "Builder's Brief" — to segment list on signup.

---

## Section 8 — Latest from the Blog

**Layout:** 3-column grid desktop, single column mobile. `#080808` background.

**Section Header:** "Latest from the Blog" (left-aligned)

**Article Cards (3):**
- Category tag (neon green pill)
- Article title (H3, white, 18px)
- Excerpt (2 lines, muted gray)
- Author + date + read time (small, muted)
- "Read →" link

---

## Section 9 — Footer

**Layout:** 4-column desktop, 2-column tablet, stacked mobile. `#050505` background, 1px neon green top border.

**Column 1 — Brand:**
- Logo + wordmark
- "The global AI platform where Black and melanated builders learn, build, and monetize AI-powered systems."
- Social links: LinkedIn, Twitter/X, YouTube, Instagram, Discord

**Column 2 — Platform:**
Academy, Marketplace, Tools Directory, Community, Blog, Roadmap, Pricing

**Column 3 — Build & Sell:**
Become an Instructor, Become a Seller, Submit a Tool, Consulting, Enterprise, Affiliate Program

**Column 4 — Company & Legal:**
About, Team, Careers, Press, Contact, Help Center, Privacy Policy, Terms, Cookie Policy, GDPR, Accessibility, Status

**Bottom Bar:**
- Left: "© 2026 Melanated In Tech. All rights reserved."
- Center: "Built with love and Claude."
- Right: Language/region selector (future)

---

## Implementation Notes

**Existing components to refactor (not rebuild):**
- `components/HeroSection.tsx` → refactor for new copy and layout
- `components/FeaturedToolsSection.tsx` → refactor for marketplace cards
- `components/CommunityFeatures.tsx` → refactor for community section
- `components/ValueProposition.tsx` → refactor for 3-pillar layout
- `components/Footer.tsx` → refactor with new links
- `components/Navigation.tsx` → refactor with mega-menu structure

**Color tokens to use (from Tailwind config):**
- Background: `bg-brand-black` (`#080808`)
- Surface: `bg-[#111111]`
- Accent: `text-brand-green` / `bg-brand-green` (`#00FF85`)
- Primary text: `text-white`
- Muted text: `text-[#A0A0A0]`

**Remove from current homepage:**
- "100% Free Tools" stat — conflicts with paid strategy
- "24/7 Updated" — not meaningful
- Placeholder testimonials (no photos, no specific results)
- "Submit Resource" as primary CTA
