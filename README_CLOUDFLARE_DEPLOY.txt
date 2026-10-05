SATISFACTION FOR U — CLOUDFLARE FINAL PACKAGE

This ZIP is the Cloudflare version of the A-to-Z fixed website.
Netlify files are intentionally NOT included.

INCLUDED
- index.html — public website
- admin.html — admin editor
- worker.js — Cloudflare Worker API + permanent KV storage
- wrangler.toml — Worker + KV + static assets configuration

FEATURES INCLUDED
- Mobile responsive layout; desktop layout maintained
- White / Dark mode; no 5-colour button row
- "your time." in pink
- Clear hero/background photo; background continues behind page sections
- Featured Profiles kept as a clean separate section
- Simple by design / A better way to meet / Private conversations strip removed
- Contact number + Call button
- WhatsApp number + direct WhatsApp opening
- 10-digit Indian WhatsApp number automatically becomes +91XXXXXXXXXX
- Call / WhatsApp visibility ON/OFF
- Profile photo upload with browser-side compression
- Hero/background photo upload with compression
- Permanent profiles, reviews, website settings and SEO data in Cloudflare KV
- Version protection against an older Admin tab overwriting newer data
- Lazy image loading / optimized image decoding
- SEO title, description, canonical, OG image and robots settings

CLOUDFLARE DEPLOYMENT
1. Put this project in a GitHub repository OR deploy it with Wrangler from a computer.
2. In Cloudflare, create/open a Worker for this project.
3. Make sure the KV namespace binding is named exactly: SFU_DATA
4. If the namespace ID in wrangler.toml is not in your Cloudflare account, create a KV namespace and replace the ID.
5. Deploy the Worker. The static website is served by the Worker assets configuration.
6. Test:
   - /api/health should show: ok
   - / should open the website
   - /admin.html should open the Admin page
7. Only after testing, attach the custom domain satisfactionforu.cyou to the Worker.

ADMIN LOGIN
Username: admin
Password: Admin@12345

IMPORTANT
- Do not remove the SFU_DATA KV binding. Without it, Admin edits cannot be permanent.
- Images are compressed in the browser before being stored. Keep uploads reasonably sized.
- The Worker protects against stale Admin saves using a version number. If an older Admin tab tries to overwrite newer data, it will ask you to refresh.
- Keep a backup of the ZIP before changing the deployed project.
