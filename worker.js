const DATA_KEY = "site-data";

const seedProfiles = [
  {id:1,name:"Ananya",location:"MVP Colony",description:"Warm, social and interested in meaningful conversations, coffee dates and discovering new places.",photo:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=90",rating:4.9,reviews:18,contact:"",whatsapp:"",showContact:false,showWhatsapp:false},
  {id:2,name:"Meera",location:"Dwaraka Nagar",description:"Enjoys travel, music, good food and relaxed conversations with respectful people.",photo:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=90",rating:4.8,reviews:15,contact:"",whatsapp:"",showContact:false,showWhatsapp:false},
  {id:3,name:"Kavya",location:"Siripuram",description:"Friendly adult dating profile focused on conversation, shared interests and good company.",photo:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=90",rating:4.7,reviews:12,contact:"",whatsapp:"",showContact:false,showWhatsapp:false},
  {id:4,name:"Isha",location:"Maddilapalem",description:"Loves movies, cafes and weekend outings. Looking for respectful adult connections.",photo:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=90",rating:4.6,reviews:11,contact:"",whatsapp:"",showContact:false,showWhatsapp:false},
  {id:5,name:"Nisha",location:"Rushikonda",description:"Beach walks, travel and conversations over coffee. Privacy and mutual respect are important.",photo:"https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=90",rating:4.5,reviews:9,contact:"",whatsapp:"",showContact:false,showWhatsapp:false},
  {id:6,name:"Pooja",location:"Gajuwaka",description:"A polished demo profile for adult dating and companionship.",photo:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=90",rating:4.4,reviews:8,contact:"",whatsapp:"",showContact:false,showWhatsapp:false},
  {id:7,name:"Riya",location:"Akkayyapalem",description:"Enjoys fitness, food and city life. Open to meeting after getting to know someone.",photo:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=90",rating:4.3,reviews:7,contact:"",whatsapp:"",showContact:false,showWhatsapp:false},
  {id:8,name:"Sneha",location:"Waltair",description:"Creative, outgoing and interested in respectful adult companionship.",photo:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=90",rating:4.2,reviews:6,contact:"",whatsapp:"",showContact:false,showWhatsapp:false},
  {id:9,name:"Divya",location:"Beach Road",description:"Travel, restaurants and relaxed evenings. Clear communication and privacy come first.",photo:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=90",rating:4.1,reviews:5,contact:"",whatsapp:"",showContact:false,showWhatsapp:false},
  {id:10,name:"Asha",location:"MVP Colony",description:"Demo adult profile. Contact details are intentionally blank until an admin adds consented information.",photo:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=90",rating:4.0,reviews:4,contact:"",whatsapp:"",showContact:false,showWhatsapp:false},
  {id:11,name:"Priya",location:"Dwaraka Nagar",description:"Enjoys books, music and exploring new cafes. Looking for genuine adult connections.",photo:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=90",rating:3.9,reviews:4,contact:"",whatsapp:"",showContact:false,showWhatsapp:false},
  {id:12,name:"Lakshmi",location:"Siripuram",description:"Demo listing with a clean, professional profile presentation.",photo:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=90",rating:3.8,reviews:3,contact:"",whatsapp:"",showContact:false,showWhatsapp:false}
];

const defaultContent = {
  brand:"Satisfaction for U", eyebrow:"PRIVATE CONNECTIONS",
  heroTitle:'Meet someone worth<br><span class="hero-pink">your time.</span>',
  heroDescription:"Discover adult dating and companionship profiles in your area, with privacy, consent and respectful communication at the center.",
  heroPrimary:"Browse profiles", heroSecondary:"Our safety standards",
  featuredTitle:"Featured profiles", featuredSubtitle:"Explore profiles and start with a respectful conversation.",
  safetyTitle:"Safety & respect", safetyText:"Adults only. Consent first. Keep conversations respectful and protect your privacy.",
  howTitle:"How it works", howText:"Browse profiles, review general details, then start a private conversation.",
  promptsTitle:"Women seeking men", promptsText:"Use clear, respectful profile prompts to describe interests, expectations and boundaries.",
  footerNote:"Adults 18+ • Consent first • Respectful connections",
  seoTitle:"Satisfaction for U — Adult Dating & Companionship", seoDescription:"Discover adult dating and companionship profiles with privacy, consent and respectful communication.",
  siteUrl:"", ogImage:"", robots:"index,follow"
};

const initialData = () => ({version:0,profiles:seedProfiles,reviews:[],settings:{theme:"dark"},content:defaultContent});

function json(body,status=200){
  return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
}

async function readData(env){
  const raw = await env.SFU_DATA.get(DATA_KEY);
  if(raw){
    try { return JSON.parse(raw); } catch {}
  }
  const data=initialData();
  await env.SFU_DATA.put(DATA_KEY,JSON.stringify(data));
  return data;
}

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==="/api/health") return new Response("ok",{headers:{"cache-control":"no-store"}});
    if(url.pathname==="/api/data"){
      const data=await readData(env);
      if(request.method==="GET") return json(data);
      if(request.method!=="PUT") return json({error:"Method not allowed"},405);
      if(!request.headers.get("content-type")?.includes("application/json")) return json({error:"JSON required"},415);
      let incoming;
      try { incoming=await request.json(); } catch { return json({error:"Invalid JSON"},400); }
      const expected=Number(incoming.expectedVersion ?? -1);
      if(expected!==Number(data.version)) return json({error:"Version conflict",version:data.version},409);
      const next={
        version:Number(data.version)+1,
        profiles:Array.isArray(incoming.profiles)?incoming.profiles:data.profiles,
        reviews:Array.isArray(incoming.reviews)?incoming.reviews:data.reviews,
        settings:incoming.settings&&typeof incoming.settings==="object"?incoming.settings:data.settings,
        content:incoming.content&&typeof incoming.content==="object"?incoming.content:data.content
      };
      const body=JSON.stringify(next);
      if(body.length>24*1024*1024) return json({error:"Data too large. Please use smaller/compressed images."},413);
      await env.SFU_DATA.put(DATA_KEY,body);
      return json({ok:true,version:next.version});
    }
    return env.ASSETS.fetch(request);
  }
};
