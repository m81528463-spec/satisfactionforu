export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/data") {
      if (request.method === "OPTIONS") return cors(new Response(null,{status:204}));
      if (request.method === "GET") {
        const raw = await env.SFU_DATA.get("site_data");
        const data = raw ? JSON.parse(raw) : {profiles:[],reviews:[],settings:{},content:{}};
        return cors(json(data));
      }
      if (request.method === "PUT") {
        try {
          const data = await request.json();
          await env.SFU_DATA.put("site_data", JSON.stringify({
            profiles: Array.isArray(data.profiles) ? data.profiles : [],
            reviews: Array.isArray(data.reviews) ? data.reviews : [],
            settings: data.settings && typeof data.settings === "object" ? data.settings : {},
            content: data.content && typeof data.content === "object" ? data.content : {}
          }));
          return cors(json({ok:true,savedAt:new Date().toISOString()}));
        } catch(e) { return cors(json({ok:false,error:"Invalid data"},400)); }
      }
      return cors(json({error:"Method not allowed"},405));
    }
    if (url.pathname === "/api/review" && request.method === "POST") {
      try {
        const review = await request.json();
        const raw = await env.SFU_DATA.get("site_data");
        const data = raw ? JSON.parse(raw) : {profiles:[],reviews:[],settings:{},content:{}};
        data.reviews = Array.isArray(data.reviews) ? data.reviews : [];
        data.reviews.push({...review, id: review.id || Date.now(), approved:false});
        await env.SFU_DATA.put("site_data", JSON.stringify(data));
        return cors(json({ok:true}));
      } catch(e) { return cors(json({ok:false},400)); }
    }
    return env.ASSETS.fetch(request);
  }
};
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json;charset=UTF-8"}})}
function cors(response){const h=new Headers(response.headers);h.set("access-control-allow-origin","*");h.set("access-control-allow-methods","GET,PUT,POST,OPTIONS");h.set("access-control-allow-headers","content-type");return new Response(response.body,{status:response.status,headers:h})}
