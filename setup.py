#!/usr/bin/env python3
"""
setup.py - Interactive CLI configuration tool for your Neo-Brutalist Portfolio.

Easily personalize your portfolio by updating SEO metadata, site URL, branding,
social media links, and Supabase environment variables without manually hunting
through HTML and source files.
"""

import os
import re
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent

def prompt_input(label: str, default: str = "") -> str:
    prompt_str = f"{label} [{default}]: " if default else f"{label}: "
    try:
        val = input(prompt_str).strip()
    except (KeyboardInterrupt, EOFError):
        print("\nAborted.")
        sys.exit(0)
    return val if val else default

def update_env(config: dict):
    env_file = ROOT_DIR / ".env"
    env_example = ROOT_DIR / ".env.example"

    existing_lines = []
    if env_file.exists():
        existing_lines = env_file.read_text(encoding="utf-8").splitlines()
    elif env_example.exists():
        existing_lines = env_example.read_text(encoding="utf-8").splitlines()

    env_map = {}
    for line in existing_lines:
        line_clean = line.strip()
        if line_clean and not line_clean.startswith("#") and "=" in line_clean:
            k, v = line_clean.split("=", 1)
            env_map[k.strip()] = v.strip()

    if config.get("supabase_url"):
        env_map["VITE_SUPABASE_URL"] = config["supabase_url"]
    if config.get("supabase_anon_key"):
        env_map["VITE_SUPABASE_ANON_KEY"] = config["supabase_anon_key"]

    out = [
        f"VITE_SUPABASE_URL={env_map.get('VITE_SUPABASE_URL', '')}",
        f"VITE_SUPABASE_ANON_KEY={env_map.get('VITE_SUPABASE_ANON_KEY', '')}",
        ""
    ]
    env_file.write_text("\n".join(out), encoding="utf-8")
    print("  [OK] Saved .env configuration")

def update_index_html(config: dict):
    index_file = ROOT_DIR / "index.html"
    if not index_file.exists():
        print("  [!] index.html not found, skipping.")
        return

    content = index_file.read_text(encoding="utf-8")

    name = config["full_name"]
    short_name = config["short_name"]
    title = config["title"]
    description = config["description"]
    site_url = config["site_url"].rstrip("/")
    email = config["email"]
    github = config["github_url"]
    linkedin = config["linkedin_url"]
    facebook = config["facebook_url"]
    instagram = config["instagram_url"]
    twitter = config["twitter_handle"]
    if not twitter.startswith("@") and twitter:
        twitter = "@" + twitter

    # 1. Update <title>
    content = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", content)

    # 2. Meta tags
    content = re.sub(r'<meta name="description" content=".*?"', f'<meta name="description" content="{description}"', content)
    content = re.sub(r'<meta name="author" content=".*?"', f'<meta name="author" content="{name}"', content)
    content = re.sub(r'<link rel="canonical" href=".*?"', f'<link rel="canonical" href="{site_url}/"', content)

    # Open Graph
    content = re.sub(r'<meta property="og:title" content=".*?"', f'<meta property="og:title" content="{title}"', content)
    content = re.sub(r'<meta property="og:description" content=".*?"', f'<meta property="og:description" content="{description}"', content)
    content = re.sub(r'<meta property="og:url" content=".*?"', f'<meta property="og:url" content="{site_url}/"', content)
    content = re.sub(r'<meta property="og:site_name" content=".*?"', f'<meta property="og:site_name" content="{short_name} Portfolio"', content)
    content = re.sub(r'<meta property="og:image" content=".*?"', f'<meta property="og:image" content="{site_url}/og-image.png"', content)

    # Twitter
    content = re.sub(r'<meta property="twitter:title" content=".*?"', f'<meta property="twitter:title" content="{title}"', content)
    content = re.sub(r'<meta property="twitter:description" content=".*?"', f'<meta property="twitter:description" content="{description}"', content)
    content = re.sub(r'<meta property="twitter:url" content=".*?"', f'<meta property="twitter:url" content="{site_url}/"', content)
    content = re.sub(r'<meta property="twitter:image" content=".*?"', f'<meta property="twitter:image" content="{site_url}/og-image.png"', content)
    if twitter:
        content = re.sub(r'<meta name="twitter:creator" content=".*?"', f'<meta name="twitter:creator" content="{twitter}"', content)

    # JSON-LD Structured Data
    content = re.sub(r'"@id":\s*".*?#person"', f'"@id": "{site_url}/#person"', content)
    content = re.sub(r'"name":\s*"TR Tajim"', f'"name": "{short_name}"', content)
    content = re.sub(r'"alternateName":\s*"Tajbir Roman Tajim"', f'"alternateName": "{name}"', content)
    content = re.sub(r'"url":\s*"https://tajimz\.xyz"', f'"url": "{site_url}"', content)
    content = re.sub(r'"email":\s*"mailto:.*?"', f'"email": "mailto:{email}"', content)
    content = re.sub(r'"@id":\s*".*?#website"', f'"@id": "{site_url}/#website"', content)

    # Noscript header & text
    content = re.sub(r'<h1>.*?</h1>', f'<h1>{title}</h1>', content, count=1)

    index_file.write_text(content, encoding="utf-8")
    print("  [OK] Updated index.html metadata, JSON-LD, and fallback content")

def update_router(config: dict):
    router_file = ROOT_DIR / "src" / "router" / "index.ts"
    if not router_file.exists():
        return

    content = router_file.read_text(encoding="utf-8")
    title = config["title"]
    description = config["description"]

    content = re.sub(r"title:\s*'TR Tajim \| [^']*'", f"title: '{title}'", content)
    content = re.sub(r"description:\s*'TR Tajim is a full-stack[^']*'", f"description: '{description}'", content)

    router_file.write_text(content, encoding="utf-8")
    print("  [OK] Updated src/router/index.ts default route meta")

def main():
    print("=" * 65)
    print("  🚀 Neo-Brutalist Portfolio — Setup & Personalization Wizard")
    print("=" * 65)
    print("This script configures your personal metadata, SEO, and credentials.\n")

    # Read current defaults if possible
    defaults = {
        "full_name": "Tajbir Roman Tajim",
        "short_name": "TR Tajim",
        "title": "TR Tajim | Full-Stack Developer & Competitive Programmer",
        "description": "Tajbir Roman Tajim is a full-stack developer & competitive programmer building high-performance web applications, native Android apps, and IoT tools.",
        "site_url": "https://tajimz.xyz",
        "email": "com.tajim@gmail.com",
        "twitter_handle": "@trtajim",
        "github_url": "https://github.com/trtajim",
        "linkedin_url": "https://www.linkedin.com/in/trtajim",
        "facebook_url": "https://www.facebook.com/trtajim",
        "instagram_url": "https://www.instagram.com/trtajim",
        "supabase_url": "",
        "supabase_anon_key": ""
    }

    config = {}
    print("--- 1. Personal & SEO Identity ---")
    config["short_name"] = prompt_input("Display Name / Brand", defaults["short_name"])
    config["full_name"] = prompt_input("Full Name", defaults["full_name"])
    config["title"] = prompt_input("Page / SEO Title", f"{config['short_name']} | Full-Stack Developer & Competitive Programmer")
    config["description"] = prompt_input("Meta Description (recommended ~140-155 chars)", defaults["description"])
    config["site_url"] = prompt_input("Production Site URL", defaults["site_url"])
    config["email"] = prompt_input("Contact Email", defaults["email"])
    config["twitter_handle"] = prompt_input("Twitter / X Handle", defaults["twitter_handle"])

    print("\n--- 2. Social Links ---")
    config["github_url"] = prompt_input("GitHub URL", defaults["github_url"])
    config["linkedin_url"] = prompt_input("LinkedIn URL", defaults["linkedin_url"])
    config["facebook_url"] = prompt_input("Facebook URL", defaults["facebook_url"])
    config["instagram_url"] = prompt_input("Instagram URL", defaults["instagram_url"])

    print("\n--- 3. Database Credentials (Optional - Press Enter to skip) ---")
    config["supabase_url"] = prompt_input("Supabase Project URL", "")
    config["supabase_anon_key"] = prompt_input("Supabase Anon Key", "")

    print("\nApplying configuration...")
    update_index_html(config)
    update_router(config)
    if config["supabase_url"] or config["supabase_anon_key"]:
        update_env(config)

    print("\n" + "=" * 65)
    print("✨ Portfolio successfully configured!")
    print("Next steps:")
    print("  1. npm install")
    print("  2. npm run dev")
    print("=" * 65 + "\n")

if __name__ == "__main__":
    main()
