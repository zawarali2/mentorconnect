# MentorConnect

A university mentorship web app: junior students browse mentor profiles (senior students + industry pros), watch 1-min intro videos, and request 20-minute sessions filtered by topic.

## Stack

- **Frontend**: React 18 + Vite, Tailwind CSS 4, shadcn/ui, wouter for routing, TanStack Query for data
- **Backend**: Express + Drizzle ORM + Postgres (`@workspace/api-server`)
- **API contract**: OpenAPI spec → generated React Query hooks (`@workspace/api-client-react`)
- **Monorepo**: pnpm workspace (`artifacts/api-server`, `artifacts/mentor-connect`, `artifacts/mockup-sandbox`)

## App code is JSX (not TSX)

By the user's request (final-year project), the entire app surface is plain JavaScript with `.jsx` extension:

- `src/main.jsx`, `src/App.jsx`
- `src/components/layout/*.jsx` (Navbar, Footer, PageHero)
- `src/pages/*.jsx` (Home, Mentors, MentorProfile, Sessions, Profile, Features, About, BecomeMentor, NotFound)
- `src/pages/home/*.jsx` (Hero, HowItWorks, MentorTypes, FeaturedMentors, Topics, SuccessStories, Faq, Cta) + `scroll-theme.js`

The vendored shadcn primitives in `src/components/ui/*.tsx` and the small framework hooks in `src/hooks/*` and `src/lib/utils.ts` remain as TypeScript &mdash; Vite handles `.jsx` and `.tsx` side-by-side natively, so they coexist fine. This keeps the shadcn library intact while presenting a clean JS app surface for the project demo.

## Pages

- `/` &mdash; Home with 8 scroll-themed sections (Hero → CTA), each colour-shifting via `useActiveSection`
- `/mentors` &mdash; Browse with topic, mentor-type, sort filters
- `/mentors/:id` &mdash; Mentor profile with intro video, reviews, session request form
- `/sessions` &mdash; Learner + mentor session management with reviews
- `/profile` &mdash; Current user profile with mentor-stats card if applicable
- `/features` &mdash; 9 colourful feature cards + comparison table
- `/about` &mdash; Mission, values, stats strip
- `/become-mentor` &mdash; Mentor pitch + 4-step process + application form

## Design system

Reusable utility classes in `src/index.css`:

- `.mc-eyebrow` &mdash; pill above hero headlines
- `.mc-hero-bg`, `.mc-blob`, `.mc-blob--{peach,lavender,mint}` &mdash; soft floating gradient blobs (honours `prefers-reduced-motion`)
- `.mc-grain` &mdash; subtle paper-grain overlay
- `.mc-brand-text` &mdash; orange→pink→purple gradient on the MentorConnect wordmark
- `.mc-page-hero--{default,blue,purple,teal}` &mdash; page-hero background variants

Scroll-themed home palette is defined in `src/pages/home/scroll-theme.js` (`SECTION_THEMES`).

## Demo user switcher

The avatar dropdown in the navbar lets you switch between seeded demo users to test learner vs mentor flows. Backed by `useSetCurrentUser` and a session cookie.
