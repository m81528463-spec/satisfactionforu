const DATA_KEY = "site-data";
const json = (data, status=200) => new Response(JSON.stringify(data), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});
function b64url(bytes) {
  let s = ""; for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
async function sign(payload, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
}
async function validToken(request, env) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const parts = token.split(".");
  if (parts.length !== 2 || !env.ADMIN_SECRET) return false;
  const expected = await sign(parts[0], env.ADMIN_SECRET);
  if (expected !== parts[1]) return false;
  try { const p = JSON.parse(atob(parts[0].replace(/-/g,"+").replace(/_/g,"/"))); return p.exp > Date.now(); } catch { return false; }
}
async function getData(env) {
  if (!env.SFU_DATA) return { profiles: [], settings: {} };
  try { return await env.SFU_DATA.get(DATA_KEY, "json") || {profiles:[], settings:{}}; } catch { return {profiles:[]}; }
}
async function saveData(env, data) {
  if (!env.SFU_DATA) throw new Error("KV binding SFU_DATA is missing. Add it in Worker Settings → Bindings.");
  await env.SFU_DATA.put(DATA_KEY, JSON.stringify(data));
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      if (request.method === "OPTIONS") return new Response(null,{status:204,headers:{"access-control-allow-origin":url.origin,"access-control-allow-methods":"GET,POST,PUT,DELETE,OPTIONS","access-control-allow-headers":"Content-Type,Authorization"}});
      if (url.pathname === "/api/data" && request.method === "GET") return json(await getData(env));
      if (url.pathname === "/api/login" && request.method === "POST") {
        if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD || !env.ADMIN_SECRET) return json({error:"Admin secrets are not configured in Cloudflare Worker Settings."},503);
        let body; try { body=await request.json(); } catch { return json({error:"Invalid JSON."},400); }
        if (body.username !== env.ADMIN_USERNAME || body.password !== env.ADMIN_PASSWORD) return json({error:"Incorrect username or password."},401);
        const payload = b64url(new TextEncoder().encode(JSON.stringify({sub:body.username,exp:Date.now()+4*60*60*1000})));
        return json({token:payload+"."+await sign(payload,env.ADMIN_SECRET)});
      }
      if (url.pathname.startsWith("/api/admin/")) {
        if (!(await validToken(request,env))) return json({error:"Please sign in again."},401);
        if (url.pathname === "/api/admin/data" && request.method === "GET") return json(await getData(env));
        if (url.pathname === "/api/admin/settings" && request.method === "PUT") {
          let body; try { body=await request.json(); } catch { return json({error:"Invalid JSON."},400); }
          const data=await getData(env); const input=body.settings || {};
          const allowed=["brand","heroEyebrow","heroTitle","heroDescription","heroButton","whyTitle","whyDescription","heroBackground","whyBackground","seoTitle","seoDescription","canonical","themeAccent","themeAccent2"];
          const clean={}; for (const k of allowed) if (input[k] !== undefined) clean[k]=String(input[k]).slice(0, k.includes("Background")?1500000:2000);
          data.settings={...(data.settings||{}),...clean};
          try { await saveData(env,data); return json({ok:true,settings:data.settings}); } catch(e) { return json({error:e.message},503); }
        }
        if (url.pathname === "/api/admin/profiles" && (request.method==="PUT" || request.method==="DELETE")) {
          let body; try { body=await request.json(); } catch { return json({error:"Invalid JSON."},400); }
          const data=await getData(env); data.profiles=Array.isArray(data.profiles)?data.profiles:[];
          if (request.method==="PUT") {
            const p=body.profile;
            if (!p || !p.id || !String(p.name||"").trim()) return json({error:"Profile ID and name are required."},400);
            if (p.photo && !(/^https:\/\//i.test(p.photo) || /^data:image\/(jpeg|png|webp);base64,/i.test(p.photo))) return json({error:"Photo must be an HTTPS URL or a supported uploaded image."},400);
            const gallery=Array.isArray(p.photos)?p.photos.slice(0,10).map(x=>String(x).slice(0,1500000)):[];
            const clean={id:String(p.id).slice(0,80),name:String(p.name).slice(0,80),location:String(p.location||"").slice(0,100),photo:String(p.photo||gallery[0]||"").slice(0,1500000),photos:gallery,phone:String(p.phone||"").slice(0,30),whatsapp:String(p.whatsapp||"").slice(0,20),description:String(p.description||"").slice(0,500),active:p.active!==false};
            const i=data.profiles.findIndex(x=>x.id===clean.id); if(i>=0)data.profiles[i]=clean;else data.profiles.push(clean);
          } else { data.profiles=data.profiles.filter(p=>p.id!==body.id); }
          try { await saveData(env,data); return json({ok:true,profiles:data.profiles}); } catch(e) { return json({error:e.message},503); }
        }
      }
      return json({error:"Not found."},404);
    }
    return env.ASSETS.fetch(request);
  }
};
