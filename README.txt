Satisfaction for U — Why Choose Us Background Fix

Changed ONLY:
1. Admin -> Website settings now has "Why choose us background" upload/URL/preview/remove.
2. The saved Why choose us background is stored in the existing sfu_settings data and sent through /api/data.
3. Public index.html reads the saved setting from /api/data and applies it to the Why choose us section.
4. Existing fallback background remains if no custom image is saved.
5. Existing profile design, WhatsApp, login, theme and other settings are not intentionally changed.

Files:
- index.html
- admin.html

Deploy/replace these two files in the same project that already contains your existing worker.js and wrangler.toml. Do not delete the existing worker.js or wrangler.toml.
