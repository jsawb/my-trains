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
function boardURL(endpoint,r){const u=new URL(endpoint);if(u.protocol!=='https:'&&u.hostname!=='localhost')throw Error('Use an HTTPS endpoint');u.searchParams.set('from',r.from);u.searchParams.set('to',r.to);return u.toString();}
function validateBoard(b){if(!b||!Array.isArray(b.services)||!Number.isFinite(Date.parse(b.generatedAt)))throw Error('Invalid departure response');if(Math.abs(Date.now()-Date.parse(b.generatedAt))>5*60000)throw Error('Departure response is stale');return b;}

export {stations,london,journey,boardURL,validateBoard};