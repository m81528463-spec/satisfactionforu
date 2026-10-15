Satisfaction for U — Cloudflare deploy package

ఈ ZIPలో index.html, admin.html, worker.js, wrangler.toml, sitemap.xml, robots.txt ఉన్నాయి.

ముఖ్యమైన జాగ్రత్తలు:
1. Cloudflare KV namespace SFU_DATA లేదా అందులోని data ని delete చేయకండి.
2. GitHub main branch లో ఈ ZIPని extract చేసి ఉన్న files ను update చేయండి. ZIP ఫైల్‌ను ఒక్కటే repositoryలో పెట్టడం వల్ల deploy కాదు.
3. wrangler.toml లో ఉన్న KV namespace ID మీ ప్రస్తుత namespace IDతో సరిపోతుందో చూసుకోండి; ID వేరైతే మార్చకుండా deploy చేయకండి.
4. Admin login default (KVలో ముందుగా మార్చకపోతే): Manoj / Manoj@2027. Login చేసిన తర్వాత Adminలో credentials మార్చండి.
5. ఈ updated packageలో /api/data PUT కు server-issued Admin session token అవసరం; public website నుంచి మొత్తం site data overwrite చేయడం block చేయబడింది. Session 12 గంటల తర్వాత expire అవుతుంది.
6. Forgot-password email కోసం Cloudflare Worker Secrets లో RESEND_API_KEY, అవసరమైతే RESEND_FROM configure చేయాలి.
7. Adminలో Save చేసిన Profiles/Settings/Content Cloudflare KVలో నిల్వవుతాయి; ఫోన్‌లో local history/cache delete செய்தாலும் KV data delete ஆகாது.
8. Deployment తర్వాత site మరియు /api/health சோதிக்கவும். இந்த package உங்கள் live KV data-ஐ வாசிக்க/சோதிக்கவில்லை; deployக்கு முன் backup வைத்திருக்கவும்.
