Satisfaction for U — Deployment Guide (Telugu)

ఈ ZIP లో index.html, admin.html, worker.js, wrangler.toml, robots.txt, sitemap.xml ఉన్నాయి.

GitHub లో ZIP ని extract చేసి లోపల ఉన్న ఫైళ్లను repository root లో upload చేయండి. Cloudflare Worker Build deployment command: npx wrangler deploy.

Cloudflare Worker Settings → Bindings లో KV namespace binding పేరు SFU_DATA గా ఉండాలి. wrangler.toml లో binding/namespace ID మీ Cloudflare విలువలతో సరిపోల్చండి.

Worker Settings → Variables and Secrets లో ఈ Secrets పెట్టండి: ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECRET. ADMIN_SECRET కోసం పొడవైన random secret వాడండి. Password ను GitHub code లో పెట్టకండి.

Admin URL: /admin.html. Login అయిన తర్వాత Website Settings లో Hero, Why section, SEO Title/Description, canonical URL మార్చి Save చేయవచ్చు. Profiles లో గరిష్ఠంగా 5 gallery images URL లేదా upload ద్వారా జోడించవచ్చు. Upload చేసిన చిత్రాలు compress అవుతాయి; KV పరిమితులు ఉన్నందున పెద్ద ఫోటోలను చిన్నదిగా చేసి upload చేయండి.

SEO default Title: Visakhapatnam VIP Escorts — Premium Female Escort Services | Satisfaction for U
SEO default Description: Visakhapatnam VIP Escorts — Premium Female Escort Services. 100% Genuine Profiles • Cash Payment Only • No Advance Payment.

ముఖ్య పరిమితి: Gmail OTP password recovery ఈ ప్యాకేజీలో లేదు. Gmail/Email provider (ఉదా. Cloudflare Email Worker లేదా transactional email service) API/SMTP credentials, OTP verification మరియు rate limits configure చేయకుండా నిజమైన OTP పంపడం సాధ్యం కాదు. ప్రస్తుతం admin password ను Cloudflare Secret ద్వారా మార్చాలి.

గమనిక: GitHub upload చేసిన వెంటనే live site మారుతుందని హామీ లేదు; Cloudflare deployment logs లో success చూడండి. Browser cache clear చేసి https://satisfactionforu.cyou/?v=1 పరీక్షించండి.


CALL / WHATSAPP OPTIONS (UPDATED)
- Public profile cards show a Call button when a phone number is saved.
- Public profile cards show a WhatsApp button when a WhatsApp number (with country code, e.g. 91...) or phone number is saved.
- In Admin Panel, enter the full phone number and WhatsApp number for each profile. WhatsApp number should include country code digits, without + or spaces.
- These links are only usable after the updated files are deployed; they do not create or verify profile owners' numbers.


UPDATED FIXES IN THIS PACKAGE
- Profile photos support compressed uploaded data URLs as well as HTTPS URLs; public rendering now allows supported image data URLs and uses lazy loading to reduce initial page load.
- Each published profile has a View profile button. It opens a detail view with available photos, description, location, and contact actions.
- 10-digit Indian numbers are normalized to country code 91 for Call and WhatsApp links. You can also enter a full international number.
- Upload photos at a reasonable size. The admin compresses uploads to a maximum 1000px edge and JPEG quality 68 to reduce load time and KV storage use.
- IMPORTANT: Deploy to the same production Worker used by satisfactionforu.cyou and preserve the existing SFU_DATA KV binding and ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_SECRET secrets. This ZIP's wrangler.toml uses the test Worker name; before CLI deployment, change it to the production Worker name and configure the correct KV namespace ID, or deploy through the existing production Worker setup. Do not overwrite production settings blindly.
