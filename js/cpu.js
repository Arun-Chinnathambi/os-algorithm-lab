/* CPU scheduling simulator */
const CA=[['FCFS','FCFS'],['SJF','SJF'],['SRTF','SRTF'],['PRI','Priority'],['RR','Round robin']];
function cpuSim(P,algo,q){
 const rem=P.map(p=>p.bt),first=P.map(()=>-1),done=P.map(()=>-1),added=P.map(()=>false);
 let t=0,left=P.length,ready=[],cur=-1,used=0,tl=[];
 while(left){
  P.forEach((p,i)=>{if(!added[i]&&p.at<=t){added[i]=true;ready.push(i)}});
  if(algo==='RR'){if(cur>=0&&(rem[cur]==0||used>=q)){if(rem[cur]>0)ready.push(cur);cur=-1}if(cur<0&&ready.length){cur=ready.shift();used=0}}
  else if(algo==='SRTF'){ready=ready.filter(i=>rem[i]>0);cur=ready.length?ready.reduce((a,b)=>rem[b]<rem[a]?b:a):-1}
  else{if(cur>=0&&rem[cur]==0)cur=-1;if(cur<0&&ready.length){const k=i=>algo==='SJF'?P[i].bt:algo==='PRI'?P[i].pr:0;let b=ready[0];ready.forEach(i=>{if(k(i)<k(b))b=i});ready.splice(ready.indexOf(b),1);cur=b}}
  if(cur<0){tl.push(-1);t++;continue}
  if(first[cur]<0)first[cur]=t;
  tl.push(cur);rem[cur]--;used++;t++;if(rem[cur]==0){done[cur]=t;left--}
 }
 const m=P.map((p,i)=>({wt:done[i]-p.at-p.bt,tat:done[i]-p.at,rt:first[i]-p.at,ct:done[i]}));
 const av=k=>m.reduce((a,x)=>a+x[k],0)/P.length;
 let sw=0;tl.forEach((x,k)=>{if(k&&x>=0&&tl[k-1]>=0&&x!==tl[k-1])sw++});
 return{tl,m,wt:av('wt'),tat:av('tat'),rt:av('rt'),util:tl.filter(x=>x>=0).length/tl.length*100,sw};
}
let cR=[],cP=[];
function cpuRun(){
 const P=$('cIn').value.split('\n').map(l=>l.trim()).filter(Boolean).map((l,i)=>{const f=l.split(/[\s,]+/);return{n:f[0],at:+f[1],bt:+f[2],pr:f[3]===undefined?0:+f[3]}});
 const q=+$('cQ').value;
 if(!P.length||P.some(p=>!Number.isInteger(p.at)||!Number.isInteger(p.bt)||p.at<0||p.bt<1||isNaN(p.pr)))return $('cErr').textContent='Each line needs: name, arrival (0 or more), burst (1 or more), priority.';
 if(!(q>=1))return $('cErr').textContent='Quantum must be at least 1.';
 $('cErr').textContent='';cP=P;cR=CA.map(a=>({name:a[1],...cpuSim(P,a[0],q)}));
 tabsUI($('cTabs'),cR.map(r=>r.name),cpuShow);
 const best=cR.reduce((a,b,i)=>b.wt<cR[a].wt?i:a,0);
 $('cC').innerHTML=tbl(['Algorithm','Avg waiting','Avg turnaround','Avg response','CPU use','Context switches'],cR.map(r=>[r.name,r.wt.toFixed(2),r.tat.toFixed(2),r.rt.toFixed(2),r.util.toFixed(0)+'%',r.sw]),best);
 bars($('cB'),cR.map(r=>({n:r.name,v:r.wt})),v=>v.toFixed(2));
 $('cV').textContent='Lowest average waiting time: '+cR[best].name+' ('+cR[best].wt.toFixed(2)+'). Round robin trades longer waiting for better response time and fairness.';
}
function cpuShow(i){
 const r=cR[i],blocks=[];r.tl.forEach((x,k)=>{const b=blocks[blocks.length-1];if(b&&b.p===x)b.len++;else blocks.push({p:x,len:1,s:k})});
 $('cG').innerHTML='<div class="gantt">'+blocks.map(b=>'<div style="flex:'+b.len+';background:'+(b.p<0?'var(--mute)':C(b.p))+'">'+(b.p<0?'idle':cP[b.p].n)+'<small>'+b.s+'</small></div>').join('')+'</div><p class="note">Finishes at time '+r.tl.length+'.</p>';
 $('cT').innerHTML='<table>'+tbl(['Process','Completion','Turnaround','Waiting','Response'],cP.map((p,k)=>[p.n,r.m[k].ct,r.m[k].tat,r.m[k].wt,r.m[k].rt]))+'</table>';
}

$('cRun').onclick=cpuRun;
cpuRun();
