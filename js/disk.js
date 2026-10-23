/* Disk scheduling simulator */
const DA=[['FCFS','FCFS','Fair, but long zig-zags'],['SSTF','SSTF','Low movement; can starve far requests'],['SCAN','SCAN','Elevator; sweeps to the disk edge'],['CSCAN','C-SCAN','Uniform wait; one-way sweeps'],['LOOK','LOOK','SCAN that turns at the last request'],['CLOOK','C-LOOK','C-SCAN that turns at the last request']];
function dSched(id,reqs,head,size,up){const max=size-1,s0=[...reqs].sort((a,b)=>a-b),hi=s0.filter(r=>r>=head),lo=s0.filter(r=>r<head).reverse(),loA=[...lo].reverse(),hiD=[...hi].reverse();let s=[head];
 if(id==='FCFS')s.push(...reqs);
 else if(id==='SSTF'){let p=[...reqs],pos=head;while(p.length){let b=0;p.forEach((r,i)=>{if(Math.abs(r-pos)<Math.abs(p[b]-pos))b=i});pos=p.splice(b,1)[0];s.push(pos)}}
 else if(id==='SCAN'){if(up){s.push(...hi);if(lo.length)s.push(max,...lo)}else{s.push(...lo);if(hi.length)s.push(0,...hi)}}
 else if(id==='CSCAN'){if(up){s.push(...hi);if(lo.length)s.push(max,0,...loA)}else{s.push(...lo);if(hi.length)s.push(0,max,...hiD)}}
 else if(id==='LOOK'){up?s.push(...hi,...lo):s.push(...lo,...hi)}
 else{up?s.push(...hi,...loA):s.push(...lo,...hiD)}
 return s}
let dR=[],dC={};
function diskRun(){
 const size=+$('dS').value,head=+$('dH').value,reqs=nums($('dQ').value),e=$('dErr');
 if(!(size>=2)||!(head>=0&&head<size)||!reqs.length||reqs.some(r=>!Number.isInteger(r)||r<0||r>=size))return e.textContent='Head and every request must be whole numbers from 0 to '+(size-1)+'.';
 e.textContent='';dC={size,reqs:new Set(reqs)};const n=reqs.length;
 dR=DA.map(a=>{const seq=dSched(a[0],reqs,head,size,$('dD').value==='up');let t=0,mx=0;for(let i=1;i<seq.length;i++){const d=Math.abs(seq[i]-seq[i-1]);t+=d;mx=Math.max(mx,d)}return{name:a[1],note:a[2],seq,total:t,avg:t/n,mx}});
 tabsUI($('dTabs'),dR.map(r=>r.name),diskShow);
 const min=Math.min(...dR.map(r=>r.total)),b=dR.findIndex(r=>r.total===min),base=dR[0].total;
 $('dC').innerHTML=tbl(['Algorithm','Total movement','Avg seek','Longest seek','vs FCFS','Trade-off'],dR.map(r=>{const d=base?(r.total-base)/base*100:0;return[r.name,r.total,r.avg.toFixed(1),r.mx,d===0?'baseline':(d>0?'+':'')+d.toFixed(1)+'%','<span style="color:var(--mute)">'+r.note+'</span>']}),b);
 bars($('dB'),dR.map(r=>({n:r.name,v:r.total})),v=>v);
 $('dV').textContent='Lowest total head movement: '+dR[b].name+' with '+min+' cylinders'+(base>min?', '+Math.round((base-min)/base*100)+'% less than FCFS':'')+'.';
}
function diskShow(i){
 const r=dR[i],W=720,pd=34,rh=28,n=r.seq.length,H=pd*2+rh*(n-1),x=c=>pd+c/(dC.size-1)*(W-2*pd),y=k=>pd+k*rh;
 $('dSt').innerHTML='<div><b>'+r.total+'</b><span>total head movement</span></div><div><b>'+r.avg.toFixed(1)+'</b><span>average seek</span></div><div><b>'+r.mx+'</b><span>longest seek</span></div>';
 let g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Head path for '+r.name+'">';
 for(let t=0;t<=4;t++){const c=Math.round((dC.size-1)*t/4);g+='<line x1="'+x(c)+'" x2="'+x(c)+'" y1="'+(pd-10)+'" y2="'+(H-pd+10)+'" stroke="var(--line)" stroke-dasharray="3 4"/><text x="'+x(c)+'" y="14" text-anchor="middle">'+c+'</text>'}
 const len=r.seq.reduce((a,c,k)=>k?a+Math.hypot(x(c)-x(r.seq[k-1]),rh):0,0);
 g+='<polyline class="anim" points="'+r.seq.map((c,k)=>x(c)+','+y(k)).join(' ')+'" fill="none" stroke="'+C(i)+'" stroke-width="2.2" stroke-linejoin="round" style="stroke-dasharray:'+len+';stroke-dashoffset:'+len+'"/>';
 r.seq.forEach((c,k)=>{const f=k===0||dC.reqs.has(c),end=x(c)>W-70;g+='<circle cx="'+x(c)+'" cy="'+y(k)+'" r="'+(k?4.5:6)+'" fill="'+(f?C(i):'var(--panel)')+'" stroke="'+C(i)+'" stroke-width="2"/><text x="'+(x(c)+(end?-9:9))+'" y="'+(y(k)+4)+'" text-anchor="'+(end?'end':'start')+'">'+c+(k?'':' (start)')+'</text>'});
 $('dCh').innerHTML=g+'</svg>';
 $('dSq').textContent='Service order: '+r.seq.join(' → ')+'. Filled dots are served requests; hollow dots are disk-edge moves.';
}
$('dRand').onclick=()=>{const s=+$('dS').value||200;$('dQ').value=Array.from({length:10},()=>Math.floor(Math.random()*s)).join(', ');$('dH').value=Math.floor(Math.random()*s);diskRun()};
$('dRun').onclick=diskRun;
diskRun();
