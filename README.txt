Satisfaction for U - FINAL SYNC FIX

Files:
- index.html: public site; loads profiles/settings from /api/data
- admin.html: admin panel; saves profiles/settings/content to /api/data
- worker.js: Cloudflare Worker + SFU_DATA KV API
- wrangler.toml: Worker/KV configuration

Important fixes:
1. Admin-added/edited profiles are loaded on the public site from Cloudflare KV.
2. Hero/top background loads from saved settings.background.
3. Why Choose Us background loads from saved settings.whyBackground.
4. Existing white/dark controls and visual design are preserved.
5. Admin data remains stored in Cloudflare KV.

Deploy the four files together with: npx wrangler deploy
