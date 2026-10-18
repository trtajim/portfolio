# TR Tajim - Portfolio & Content Management System

A personal portfolio website and full-featured Neobrutalist admin studio built with Vue 3, TypeScript, Pinia, Supabase, and Vite.

## Features

- **Neobrutalist Design System**: High contrast, bold borders (`3px`), solid offset shadows, responsive layouts, and accessible color palettes.
- **Dynamic Content Management (CRUD)**:
  - Edit name, tagline, multi-paragraph WhoAmI bio, and main stack.
  - Dynamic key-value tech stack builder (`Category` ➔ `Items`).
  - Social & contact link builder with auto-cycling neo-brutal button colors.
  - Project showcase with stack pill, custom metric badges (e.g. `1,000+ registered users`), category filtering, and Markdown deep-dive pages.
  - Writing studio with split-screen live Markdown preview.
- **Client-Side Cache & Invalidation**: Instant tab/page transitions via Pinia with automatic invalidation upon any admin save/delete.
- **Supabase Backend**: PostgreSQL database with Row Level Security (RLS) policies and authentication.
- **Vercel Ready**: Preconfigured with `vercel.json` rewrite rules for HTML5 history mode.

## Setup & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your Supabase URL and Anon Key:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Setup Database in Supabase
Run the SQL script located at `supabase/schema.sql` in your Supabase SQL Editor. This will create:
- `profile` table (with seed data)
- `projects` table
- `posts` table
- Row Level Security (RLS) policies allowing public read and authenticated admin CRUD.

### 4. Create an Admin Account
In your Supabase dashboard under **Authentication > Users**, create an admin user (email & password). You will use these credentials to log in at `/admin/login`.

### 5. Run Development Server
```bash
npm run dev
```

### 6. Production Build
```bash
npm run build
```
