Satisfaction for U — corrected permanent Cloudflare package

Files:
- index.html — public website
- admin.html — admin editor
- worker.js — Cloudflare Worker + KV API
- wrangler.toml — SFU_DATA KV binding

Features:
- Server-side permanent save through Cloudflare KV
- Original dark/glass visual design retained
- White/light and dark theme controls
- Profile photo upload/edit (compressed in browser)
- Website hero/background photo upload already supported
- Contact/background photo setting
- Editable website text/content
- Ready-made meeting-request banner removed

Important:
Deploy this as the existing satisfactionforu-permanent Worker through the GitHub deployment already configured.
Do NOT delete the current divine-queen-6f86 Worker or change the custom-domain DNS until this version is tested.

Image uploads are compressed client-side and stored inside the KV data record. Keep individual uploads reasonably sized and avoid uploading dozens of very large images.
