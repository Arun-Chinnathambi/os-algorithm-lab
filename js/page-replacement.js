/* Page replacement simulator */
let pR=[],pRefs=[];
function prSim(algo,refs,F){let fr=Array(F).fill(null),ptr=0,last={},snaps=[],faults=0;
 refs.forEach((p,i)=>{const hit=fr.includes(p);
  if(!hit){faults++;let s=fr.indexOf(null);
   if(s<0){if(algo==='FIFO'){s=ptr;ptr=(ptr+1)%F}
    else if(algo==='LRU'){s=0;fr.forEach((x,j)=>{if(last[x]<last[fr[s]])s=j})}
    else{let far=-1;fr.forEach((x,j)=>{let n=refs.indexOf(x,i+1);if(n<0)n=1e9;if(n>far){far=n;s=j}})}}
   fr[s]=p}
  last[p]=i;snaps.push({fr:[...fr],hit})});
 return{snaps,faults}}
function pageRun(){
 const refs=nums($('pR').value),F=+$('pF').value;
 if(!refs.length||bad(refs)||!(F>=1))return $('pErr').textContent='Enter whole-number pages and at least 1 frame.';
 $('pErr').textContent='';pRefs=refs;pR=['FIFO','LRU','Optimal'].map(n=>({name:n,...prSim(n==='Optimal'?'OPT':n,refs,F)}));
 tabsUI($('pTabs'),pR.map(r=>r.name),i=>{const r=pR[i];let h='<tr><th>Page</th>'+refs.map(x=>'<th>'+x+'</th>').join('')+'</tr>';
  for(let f=0;f<F;f++)h+='<tr><td>Frame '+(f+1)+'</td>'+r.snaps.map(s=>'<td class="r">'+(s.fr[f]===null?'·':s.fr[f])+'</td>').join('')+'</tr>';
  h+='<tr><td>Result</td>'+r.snaps.map(s=>'<td class="'+(s.hit?'h':'f')+'">'+(s.hit?'H':'F')+'</td>').join('')+'</tr>';$('pT').innerHTML=h});
 const best=pR.reduce((a,b,i)=>b.faults<pR[a].faults?i:a,0),n=refs.length;
 $('pC').innerHTML=tbl(['Algorithm','Page faults','Hits','Hit ratio','Fault rate'],pR.map(r=>[r.name,r.faults,n-r.faults,((n-r.faults)/n*100).toFixed(1)+'%',(r.faults/n*100).toFixed(1)+'%']),best);
 bars($('pB'),pR.map(r=>({n:r.name,v:r.faults})),v=>v);
 $('pV').textContent='Fewest page faults: '+pR[best].name+' with '+pR[best].faults+' of '+n+' references. F marks a fault, H a hit.';
}

$('pRun').onclick=pageRun;
pageRun();
