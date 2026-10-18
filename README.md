# Hey, I'm TR Tajim 👋

This is the repository for my personal portfolio and blog, built with Vue 3, Vite, and Supabase. 

I designed it with a bold neo-brutalist theme (sharp borders, thick offset shadows, and clean monospaced accents) and wired it up to an admin panel so I can easily update my projects, write articles in Markdown, and tweak my tech stack on the go.

---

## ⚡ What’s inside?

- **Vue 3 + TypeScript + Vite**: Fast build setup with scoped Neobrutalist design elements.
- **Supabase Backend**:
  - PostgreSQL database with **Row Level Security (RLS)** enabled for all tables.
  - Public read-only access for visitors; full authenticated CRUD access for the admin panel.
  - **Supabase Storage**: Drag-and-drop or file select for profile avatars, project covers, and article banners.
  - **Supabase Realtime**: Any edits saved in the admin panel push live to active visitors immediately.
- **Fast Client-Side Caching**: Pinia stores project and post data in-memory so navigating between pages takes 0ms, while updates automatically bust the cache.
- **Markdown Writing Studio**: Built-in split-view Markdown editor with live preview for articles and project case studies.
- **Vercel Ready**: Preconfigured with `vercel.json` rewrites for smooth SPA routing.

---

## 🛠️ Local Development

### 1. Clone & install dependencies
```bash
git clone https://github.com/trtajim/portfolio.git
cd portfolio
npm install
```

### 2. Configure environment variables
Create a `.env` file in the root folder:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Run the database migrations
Open `supabase/schema.sql` and run it directly in your **Supabase SQL Editor**. This will:
- Set up the `profile`, `projects`, and `posts` tables.
- Enable RLS policies.
- Create the `portfolio-assets` storage bucket.
- Enable real-time updates for live syncing.

### 4. Create your admin user
In your Supabase dashboard under **Authentication > Users**, add your email & password. You'll use these credentials to log in at `/admin/login`.

### 5. Start building
```bash
npm run dev
```

---

## 🚀 Deployment (Vercel)

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your Vercel Project Environment Variables.
4. Deploy!
