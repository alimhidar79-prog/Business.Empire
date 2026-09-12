const B=[
{id:"coffee",n:"مقهى فاخر",i:"☕",c:500,d:18,u:350},
{id:"wash",n:"مغسلة سيارات",i:"🚗",c:2500,d:75,u:1600},
{id:"tech",n:"متجر إلكترونيات",i:"📱",c:9000,d:260,u:6000},
{id:"factory",n:"مصنع",i:"🏭",c:30000,d:900,u:18000},
{id:"hotel",n:"فندق",i:"🏨",c:90000,d:2700,u:55000},
{id:"mall",n:"مول تجاري",i:"🏬",c:250000,d:8000,u:150000}
];
const districts=[["downtown","وسط المدينة","🏙️",0],["business","حي الأعمال","🏢",5],["harbor","الميناء","⚓",10],["airport","المطار","✈️",15],["elite","الحي الراقي","🌆",20],["capital","العاصمة","👑",25]];
let S=JSON.parse(localStorage.getItem("beV2")||"null")||{money:1000,owned:{},workers:0,level:1,xp:0,district:1,market:[1,1,1]};
const fmt=n=>"$"+Math.floor(n).toLocaleString();
const baseIncome=()=>B.reduce((x,b)=>x+(S.owned[b.id]?.income||0),0);
const income=()=>baseIncome()*(1+S.workers*.08)*(1+(S.district-1)*.03);
const save=()=>localStorage.setItem("beV2",JSON.stringify(S));
function toast(t){let x=document.getElementById("toast");x.textContent=t;x.style.display="block";setTimeout(()=>x.style.display="none",1700)}
function xp(n){S.xp+=n;let need=S.level*150;if(S.xp>=need){S.xp-=need;S.level++;toast("🎉 وصلت للمستوى "+S.level)}}
function buy(id){let b=B.find(x=>x.id===id);if(S.money<b.c)return toast("❌ رأس المال غير كافٍ");S.money-=b.c;S.owned[id]={level:1,income:b.d};xp(60);toast("🏢 تم افتتاح "+b.n);render();save()}
function upgrade(id){let b=B.find(x=>x.id===id),o=S.owned[id],c=Math.floor(b.u*Math.pow(1.38,o.level-1));if(S.money<c)return toast("❌ لا تملك ما يكفي");S.money-=c;o.level++;o.income=Math.floor(b.d*Math.pow(1.5,o.level-1));xp(45);toast("📈 تم تطوير "+b.n);render();save()}
function hire(){let c=Math.floor(700*Math.pow(1.25,S.workers));if(S.money<c)return toast("❌ لا تستطيع دفع راتب التوظيف");S.money-=c;S.workers++;xp(25);toast("👤 تم توظيف موظف");render();save()}
function collect(){let n=income()/2;S.money+=n;xp(Math.floor(n/12));toast("💰 جمعت "+fmt(n));render();save()}
function render(){
money.textContent=fmt(S.money);document.getElementById("income").textContent=fmt(income())+"/د";workers.textContent=S.workers;level.textContent=S.level;document.getElementById("xp").textContent=`⭐ خبرة ${S.xp}/${S.level*150}`;
document.getElementById("businesses").innerHTML=B.map(b=>{let o=S.owned[b.id];if(!o)return `<div class="card"><div class="row"><span class="icon">${b.i}</span><div><h3>${b.n}</h3><span class="small">دخل ${fmt(b.d)}/دقيقة</span></div><button onclick="buy('${b.id}')" ${S.money<b.c?"disabled":""}>شراء ${fmt(b.c)}</button></div></div>`;let c=Math.floor(b.u*Math.pow(1.38,o.level-1));return `<div class="card"><div class="row"><span class="icon">${b.i}</span><div><h3>${b.n} <small>Lv.${o.level}</small></h3><span class="small">دخل ${fmt(o.income)}/دقيقة</span></div><button onclick="upgrade('${b.id}')" ${S.money<c?"disabled":""}>تطوير ${fmt(c)}</button></div></div>`}).join("");
document.getElementById("staff").innerHTML=`<div class="card"><div class="row"><div><h3>👤 الموظفون: ${S.workers}</h3><span class="small">كفاءة إضافية: +${S.workers*8}%</span></div><button onclick="hire()">توظيف — ${fmt(Math.floor(700*Math.pow(1.25,S.workers)))}</button></div></div>`;
document.getElementById("citygrid").innerHTML=districts.map((d,i)=>{let unlocked=i<S.level;return `<div class="district ${unlocked?"":"locked"}"><div class="icon">${d[2]}</div><h3>${d[1]}</h3><span class="small">${unlocked?"+ "+(i*3)+"% دخل المدينة":"🔒 يفتح عند المستوى "+(i+1)}</span></div>`}).join("");
let sectors=["المقاهي","السيارات","الإلكترونيات"];document.getElementById("marketbox").innerHTML=`<div class="market">${sectors.map((x,i)=>{let v=S.market[i];return `<div><h3>${x}</h3><b class="${v>=1?'up':'down'}">${v>=1?"▲":"▼"} ${Math.round(Math.abs(v-1)*100)}%</b><p class="small">تغير الطلب اليوم</p></div>`}).join("")}</div>`;
}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button,.tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById(b.dataset.tab).classList.add("active")});
document.getElementById("collect").onclick=collect;
document.getElementById("reset").onclick=()=>{if(confirm("بدء لعبة جديدة؟")){localStorage.removeItem("beV2");location.reload()}};
setInterval(()=>{S.money+=income()/60;render();save()},1000);setInterval(()=>{S.market=S.market.map(v=>Math.max(.75,Math.min(1.3,v+(Math.random()-.5)*.08)));render();save()},15000);
render();