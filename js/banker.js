/* Banker's algorithm simulator */
const mat=s=>s.split('\n').map(l=>l.trim()).filter(Boolean).map(nums);
function safety(av,A,N){let w=[...av],fin=A.map(()=>false),seq=[],steps=[];
 for(;;){const k=A.findIndex((_,i)=>!fin[i]&&N[i].every((x,j)=>x<=w[j]));if(k<0)break;const b=[...w];w=w.map((x,j)=>x+A[k][j]);fin[k]=true;seq.push(k);steps.push([seq.length,'P'+k,'['+N[k]+']','['+b+']','['+w+']'])}
 return{safe:fin.every(Boolean),seq,steps,stuck:fin.map((f,i)=>f?'':'P'+i).filter(Boolean)}}
function bankRun(){
 const A=mat($('bA').value),M=mat($('bM').value),av=nums($('bV').value),m=av.length,e=$('bErr');
 if(!A.length||A.length!==M.length||[...A,...M].some(r=>r.length!==m||bad(r))||bad(av))return e.textContent='Allocation and Maximum need the same number of rows, and every row needs '+m+' whole numbers (one per resource).';
 if(A.some((r,i)=>r.some((x,j)=>x>M[i][j])))return e.textContent='Allocation cannot exceed Maximum for any process.';
 e.textContent='';
 const N=M.map((r,i)=>r.map((x,j)=>x-A[i][j])),s=safety(av,A,N);
 $('bN').innerHTML=tbl(['Process','Allocation','Maximum','Need'],A.map((r,i)=>['P'+i,'['+r+']','['+M[i]+']','['+N[i]+']']));
 $('bS').innerHTML=tbl(['Step','Process runs','Its need','Work before','Work after'],s.steps);
 const v=$('bV1');v.className='verdict'+(s.safe?'':' bad');
 v.textContent=s.safe?'Safe state. Safe sequence: '+s.seq.map(i=>'P'+i).join(' → ')+'.':'Unsafe state. '+s.stuck.join(', ')+' can never be guaranteed to finish, so deadlock is possible.';
 const rq=nums($('bR').value),p=+$('bP').value,o=$('bV2');o.hidden=true;
 if($('bR').value.trim()){o.hidden=false;o.className='verdict bad';
  if(!(p>=0&&p<A.length)||rq.length!==m||bad(rq))o.textContent='Request not checked: use a valid process number and '+m+' whole numbers.';
  else if(rq.some((x,j)=>x>N[p][j]))o.textContent='P'+p+' asked for more than its remaining need, which is an error.';
  else if(rq.some((x,j)=>x>av[j]))o.textContent='P'+p+' must wait: the resources are not available right now.';
  else{const A2=A.map(r=>[...r]),N2=N.map(r=>[...r]);rq.forEach((x,j)=>{A2[p][j]+=x;N2[p][j]-=x});const s2=safety(av.map((x,j)=>x-rq[j]),A2,N2);
   o.className='verdict'+(s2.safe?'':' bad');o.textContent=s2.safe?'Request ['+rq+'] from P'+p+' can be granted. Safe sequence afterwards: '+s2.seq.map(i=>'P'+i).join(' → ')+'.':'Request ['+rq+'] from P'+p+' is denied: granting it would leave the system in an unsafe state.'}}
}

$('bRun').onclick=bankRun;
bankRun();
