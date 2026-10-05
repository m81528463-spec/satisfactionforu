SATISFACTION FOR U — PERMANENT SAVE VERSION

This version moves profiles, profile photos (when uploaded as data), website settings and reviews from browser-only localStorage to Cloudflare Workers KV.

IMPORTANT: The existing static Worker cannot provide server-side storage by itself. This package includes worker.js + wrangler.toml and requires one Cloudflare KV namespace binding before deploying.

Deployment steps:
1. In Cloudflare Dashboard open Workers & Pages.
2. Create/edit the Worker using worker.js as the Worker code and the website files as static assets.
3. Create a KV namespace, for example: SFU_DATA.
4. Bind that KV namespace to the Worker with variable name: SFU_DATA.
5. Deploy the Worker with the assets in this folder.
6. Keep the existing custom domains satisfactionforu.cyou and www.satisfactionforu.cyou on this Worker.

Do NOT delete the existing custom domains.
Do NOT delete the KV namespace after deployment.

After deployment, add/edit a profile in /admin.html, save it, then open the public website in a different browser/device. The saved data should load from the server.
