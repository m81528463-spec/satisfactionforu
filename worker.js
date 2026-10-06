const DATA_KEY = "site";
const AUTH_KEY = "admin_auth";
const RESET_KEY = "admin_reset";

function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store"}})}
async function hashPassword(password){
  const b=new TextEncoder().encode(String(password));
  const h=await crypto.subtle.digest("SHA-256",b);
  return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
async function getAuth(env){
  const raw=await env.SFU_DATA.get(AUTH_KEY);
  if(raw) return JSON.parse(raw);
  const auth={username:"Manoj",passwordHash:await hashPassword("Manoj@2027"),recoveryEmail:"",createdAt:Date.now()};
  await env.SFU_DATA.put(AUTH_KEY,JSON.stringify(auth));
  return auth;
}
async function sendResetEmail(env,to,code){
  const key=env.RESEND_API_KEY;
  if(!key) return {ok:false,error:"RESEND_API_KEY is not configured"};
  const from=env.RESEND_FROM || "onboarding@resend.dev";
  const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from,to:[to],subject:"Satisfaction for U - Password reset code",html:`<div style="font-family:Arial,sans-serif"><h2>Password reset</h2><p>Your verification code is:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px">${code}</div><p>This code expires in 10 minutes.</p><p>If you did not request this, ignore this email.</p></div>`})});
  if(!r.ok) return {ok:false,error:await r.text()};
  return {ok:true};
}
export default {
 async fetch(request,env,ctx){
  const url=new URL(request.url);
  if(url.pathname==="/api/data"){
   if(request.method==="GET"){
    const raw=await env.SFU_DATA.get(DATA_KEY);
    return new Response(raw||JSON.stringify({profiles:[],reviews:[],settings:{},content:{}}),{headers:{"content-type":"application/json","cache-control":"no-store"}});
   }
   if(request.method==="PUT"){
    if(!request.headers.get("content-type")?.includes("application/json"))return new Response("JSON required",{status:415});
    const data=await request.json();
    const clean={profiles:Array.isArray(data.profiles)?data.profiles:[],reviews:Array.isArray(data.reviews)?data.reviews:[],settings:data.settings&&typeof data.settings==="object"?data.settings:{},content:data.content&&typeof data.content==="object"?data.content:{}};
    const body=JSON.stringify(clean); if(body.length>24*1024*1024)return new Response("Data too large",{status:413});
    await env.SFU_DATA.put(DATA_KEY,body); return json({ok:true});
   }
   return new Response("Method not allowed",{status:405});
  }
  if(url.pathname==="/api/auth/status"&&request.method==="GET"){
   const a=await getAuth(env); return json({ok:true,username:a.username,recoveryEmail:a.recoveryEmail||""});
  }
  if(url.pathname==="/api/auth/login"&&request.method==="POST"){
   const {username,password}=await request.json(); const a=await getAuth(env);
   const ok=String(username||"").trim()===a.username && (await hashPassword(password||""))===a.passwordHash;
   return ok?json({ok:true}):json({ok:false,error:"Invalid username or password."},401);
  }
  if(url.pathname==="/api/auth/change"&&request.method==="POST"){
   const {currentUsername,currentPassword,newUsername,newPassword,recoveryEmail}=await request.json(); const a=await getAuth(env);
   if(String(currentUsername||"").trim()!==a.username || (await hashPassword(currentPassword||""))!==a.passwordHash)return json({ok:false,error:"Current username or password is incorrect."},401);
   if(String(newUsername||"").trim().length<3)return json({ok:false,error:"Username must be at least 3 characters."},400);
   if(String(newPassword||"").length<8)return json({ok:false,error:"Password must be at least 8 characters."},400);
   a.username=String(newUsername).trim(); a.passwordHash=await hashPassword(newPassword); if(recoveryEmail!==undefined)a.recoveryEmail=String(recoveryEmail).trim();
   await env.SFU_DATA.put(AUTH_KEY,JSON.stringify(a)); return json({ok:true,username:a.username,recoveryEmail:a.recoveryEmail||""});
  }
  if(url.pathname==="/api/auth/forgot"&&request.method==="POST"){
   const {username,email}=await request.json(); const a=await getAuth(env);
   if(String(username||"").trim()!==a.username || !a.recoveryEmail || String(email||"").trim().toLowerCase()!==a.recoveryEmail.toLowerCase())return json({ok:false,error:"Recovery details do not match."},400);
   const code=String(Math.floor(100000+Math.random()*900000)); await env.SFU_DATA.put(RESET_KEY,JSON.stringify({username:a.username,email:a.recoveryEmail,code,expires:Date.now()+10*60*1000}),{expirationTtl:600});
   const sent=await sendResetEmail(env,a.recoveryEmail,code); if(!sent.ok)return json({ok:false,error:"Email could not be sent. Configure RESEND_API_KEY in Cloudflare Worker Secrets."},503);
   return json({ok:true,message:"Verification code sent to your recovery Gmail."});
  }
  if(url.pathname==="/api/auth/reset"&&request.method==="POST"){
   const {username,email,code,newPassword}=await request.json(); const a=await getAuth(env); const raw=await env.SFU_DATA.get(RESET_KEY); const rec=raw?JSON.parse(raw):null;
   if(!rec || Date.now()>rec.expires || rec.username!==a.username || String(email||"").trim().toLowerCase()!==rec.email.toLowerCase() || String(code||"").trim()!==rec.code)return json({ok:false,error:"Invalid or expired verification code."},400);
   if(String(newPassword||"").length<8)return json({ok:false,error:"Password must be at least 8 characters."},400);
   a.passwordHash=await hashPassword(newPassword); await env.SFU_DATA.put(AUTH_KEY,JSON.stringify(a)); await env.SFU_DATA.delete(RESET_KEY); return json({ok:true});
  }
  if(url.pathname==="/api/health")return new Response("ok");
  return env.ASSETS.fetch(request);
 }
};
