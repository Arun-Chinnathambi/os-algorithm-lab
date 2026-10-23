const $=id=>document.getElementById(id),C=i=>'var(--c'+(i%6)+')';
function tabsUI(el,names,cb){el.innerHTML='';names.forEach((n,i)=>{const b=document.createElement('button');b.className='tab';b.innerHTML='<span class="sw" style="background:'+C(i)+'"></span>'+n;b.onclick=()=>{[...el.children].forEach((x,j)=>x.setAttribute('aria-selected',j===i));cb(i)};el.appendChild(b)});el.children[0].click()}
function bars(el,items,fmt){const m=Math.max(...items.map(x=>x.v))||1;el.innerHTML=items.map((x,i)=>'<div><span>'+x.n+'</span><span class="track"><span class="fill" style="width:'+Math.max(x.v/m*100,1)+'%;background:'+C(i)+'"></span></span><span class="r">'+fmt(x.v)+'</span></div>').join('')}
function tbl(h,rows,best){return '<tr>'+h.map(x=>'<th>'+x+'</th>').join('')+'</tr>'+rows.map((r,i)=>'<tr'+(i===best?' class="best"':'')+'>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')}
const nums=s=>s.split(/[\s,;]+/).filter(Boolean).map(Number);
const bad=a=>a.some(x=>!Number.isInteger(x)||x<0);

/* theme toggle (remembered between visits) */
(function(){
 const r=document.documentElement;
 try{const s=localStorage.getItem('theme');if(s)r.dataset.theme=s}catch(e){}
 const b=$('theme');if(!b)return;
 b.onclick=()=>{const d=matchMedia('(prefers-color-scheme:dark)').matches,n=r.dataset.theme||(d?'dark':'light'),m=n==='dark'?'light':'dark';r.dataset.theme=m;try{localStorage.setItem('theme',m)}catch(e){}};
})();
