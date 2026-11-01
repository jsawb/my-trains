// My Trains Shared V1. Paste JSON into the widget parameter; no rail credentials.

const stations={KID:'Kidderminster',SBJ:'Stourbridge Junction',BSW:'Birmingham Snow Hill',BMO:'Birmingham Moor Street',ROW:'Rowley Regis'};
function london(date=new Date()){const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).map(x=>[x.type,x.value]));return {day:p.weekday,minutes:Number(p.hour)*60+Number(p.minute)};}
function journey(s,mode='auto',date=new Date()){
 const t=london(date);let m=mode;
 if(m==='auto')m=s.wednesday&&t.day==='Wed'&&t.minutes>=17*60?(t.minutes<20*60?'out':'back'):(t.minutes<12*60?'morning':'evening');
 if(!s.wednesday&&['out','back'].includes(m))m='morning';
 const home=s.home==='SBJ'?'SBJ':'KID';
 const [from,to,label]=({morning:[home,'BSW','Morning commute'],evening:['BMO',home,'Evening commute'],out:['KID','ROW','Wednesday · around 19:00'],back:['ROW','KID','Wednesday · around 21:00']})[m];
 return {from,to,label,mode:m};
}
const API='https://api.traini.ac/v1/departures/';
function boardURL(_endpoint,r){const u=new URL(API+r.from);u.searchParams.set('calling_at',r.to);u.searchParams.set('limit','6');return u.href;}
function validateBoard(b,now=Date.now()){
 if(b?.type!=='ok'||!Array.isArray(b.data)||!Number.isFinite(Date.parse(b.generated_at)))throw Error('Unexpected rail data response');
 if(Math.abs(now-Date.parse(b.generated_at))>300000)throw Error('Rail response is stale; try again later');
 return {generatedAt:b.generated_at,services:b.data.filter(t=>t.advertised!==false&&['passenger','bus'].includes(t.service_class)).map(t=>{
 if(!t.departs?.scheduled||!t.departs?.estimate?.type)throw Error('Incomplete train data');
 const e=t.departs.estimate;const clock=x=>new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(x));
 const expected=({no_information:'No live estimate',delayed_no_estimate:'Delayed · time unknown',cancelled:'Cancelled'})[e.type]||(e.type==='actual'?'Departed '+clock(e.at):e.type==='forecast'?'Expected '+clock(e.at):'No live estimate');
 return {scheduled:clock(t.departs.scheduled),expected,cancelled:e.type==='cancelled',platform:t.platform?.type==='known'?t.platform.number+(t.platform.source==='timetable'?' (planned)':''):t.platform?.type==='withheld'?'withheld':null,destination:t.destination?.name,reason:t.delay_reason,operator:t.train?.operator?.name,bus:t.service_class==='bus'};
 })};
}

let s={home:'KID',wednesday:false,endpoint:'',appURL:'https://jsawb.github.io/my-trains/',mode:'auto'};let configError='';try{if(args.widgetParameter)s={...s,...JSON.parse(args.widgetParameter)};}catch{configError='Invalid widget settings JSON';}
if(!['auto','morning','evening','out','back'].includes(s.mode))s.mode='auto';
const r=journey(s,s.mode);const w=new ListWidget();w.backgroundColor=new Color('102e32');w.setPadding(16,16,16,16);function line(t,size=13){const x=w.addText(String(t));x.textColor=Color.white();x.font=Font.systemFont(size);return x;}line('MY TRAINS',13);w.addSpacer(8);line(r.from+' → '+r.to,22);line(r.label,11);w.addSpacer(8);
try{if(configError)throw Error(configError);const req=new Request(boardURL(s.endpoint,r));req.timeoutInterval=15;const raw=await req.loadJSON();if(req.response.statusCode!==200)throw Error('Departure service unavailable');const b=validateBoard(raw);for(const t of b.services.slice(0,3))line((t.scheduled||'—')+'  '+(t.cancelled?'Cancelled':t.expected||'Unknown')+'  P'+(t.platform||'?'));if(!b.services.length)line('No departures in current window');line('Updated '+new Date(b.generatedAt).toLocaleTimeString('en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit'}),10);}catch(e){line(e.message,12);}
line('Data: Trainiac / Network Rail / RDG',9);w.url=s.appURL;w.refreshAfterDate=new Date(Date.now()+10*60000);Script.setWidget(w);if(!config.runsInWidget)await w.presentMedium();Script.complete();