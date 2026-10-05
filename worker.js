const DATA_KEY = "sfu-data-v1";
const DEFAULT = {profiles: [], reviews: [], settings: {}, content: {}};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/data") {
      if (request.method === "GET") {
        const raw = await env.SFU_DATA.get(DATA_KEY);
        return json(raw ? JSON.parse(raw) : DEFAULT, 200, {"Cache-Control":"no-store"});
      }
      if (request.method === "PUT") {
        const body = await request.json();
        const data = {
          profiles: Array.isArray(body.profiles) ? body.profiles : [],
          reviews: Array.isArray(body.reviews) ? body.reviews : [],
          settings: body.settings && typeof body.settings === "object" ? body.settings : {},
          content: body.content && typeof body.content === "object" ? body.content : {}
        };
        await env.SFU_DATA.put(DATA_KEY, JSON.stringify(data));
        return json({ok:true}, 200, {"Cache-Control":"no-store"});
      }
      return json({error:"Method not allowed"},405);
    }

    if (request.method === "POST" && url.pathname === "/api/review") {
      const body = await request.json();
      const raw = await env.SFU_DATA.get(DATA_KEY);
      const data = raw ? JSON.parse(raw) : DEFAULT;
      const id = Number(body.profileId);
      if (!id || !body.text) return json({error:"Invalid review"},400);
      data.reviews.push({id:Date.now(), profileId:id, rating:Math.max(1,Math.min(5,Number(body.rating)||5)), text:String(body.text).slice(0,2000), approved:false});
      await env.SFU_DATA.put(DATA_KEY, JSON.stringify(data));
      return json({ok:true},200,{"Cache-Control":"no-store"});
    }

    return env.ASSETS.fetch(request);
  }
};

function json(value,status=200,extra={}){
  return new Response(JSON.stringify(value),{status,headers:{"content-type":"application/json; charset=utf-8",...extra}});
}
