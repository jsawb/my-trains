// Cloudflare module Worker. Credentials must be configured as server secrets.
const pairs=new Set(['KID:BSW','SBJ:BSW','BMO:KID','BMO:SBJ','KID:ROW','ROW:KID']);
export default {async fetch(request,env){
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':env.APP_ORIGIN||'https://jsawb.github.io','Vary':'Origin'};
 const reply=(data,status=200)=>Response.json(data,{status,headers});
 if(request.method!=='GET')return reply({error:'GET required'},405);
 const u=new URL(request.url),from=u.searchParams.get('from'),to=u.searchParams.get('to');if(!pairs.has(from+':'+to))return reply({error:'Unsupported route'},400);
 if(!env.LDB_BASE_URL||!env.LDB_AUTH)return reply({error:'Rail data not configured'},503);
 try{const base=new URL(env.LDB_BASE_URL);if(base.protocol!=='https:')throw Error('HTTPS required');const target=new URL(base.toString().replace(/\/$/,'')+'/api/20220120/GetDepartureBoard/'+from);target.search=new URLSearchParams({numRows:'10',filterCrs:to,filterType:'to',timeOffset:'0',timeWindow:'119'}).toString();
 const result=await fetch(target,{headers:{Authorization:'Basic '+env.LDB_AUTH,Accept:'application/json'},signal:AbortSignal.timeout(12000)});if(!result.ok)throw Error('Upstream error');const b=await result.json();if(!b||!b.generatedAt||!('trainServices'in b))throw Error('Unexpected upstream schema');
 return reply({generatedAt:b.generatedAt,services:(b.trainServices||[]).map(t=>({scheduled:t.std,expected:t.etd,cancelled:!!t.isCancelled,platform:t.platform||null,destination:(t.destination||[]).map(d=>d.locationName).join(' / ')}))});
 }catch{return reply({error:'Rail feed unavailable or incompatible'},502);}
 }};