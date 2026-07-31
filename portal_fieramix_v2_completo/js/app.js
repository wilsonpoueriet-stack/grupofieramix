
const SOCIALS={
 facebook:"https://www.facebook.com/FieraMIXRD",
 instagram:"https://www.instagram.com/fieramix",
 x:"https://x.com/FieraMIX",
 tiktok:"https://www.tiktok.com/@elgrupofieramix",
 youtube:"https://www.youtube.com/@fieramixtv5937",
 whatsapp:"https://wa.me/18098419586"
};
let stations=[],current=0,metadataTimer=null;
const $=s=>document.querySelector(s);
const audio=$("#audio");

async function init(){
 stations=await (await fetch("stations.json")).json();
 renderStations(stations); bindSocials(); setupCharts(); renderAllLive(); setupWhatsApp(); setupClubPopup(); selectStation(0,false);
 $("#year").textContent=new Date().getFullYear();
 $("#search").addEventListener("input",e=>{
   const q=e.target.value.toLowerCase();
   renderStations(stations.filter(s=>(s.name+" "+s.subtitle+" "+s.genre).toLowerCase().includes(q)));
 });
 $("#playBtn").onclick=togglePlay; $("#heroPlay").onclick=togglePlay;
 $("#muteBtn").onclick=()=>{audio.muted=!audio.muted;$("#muteBtn").textContent=audio.muted?"🔇":"🔊"};
 $("#volume").oninput=e=>{audio.volume=Number(e.target.value);audio.muted=false};
 $("#shareBtn").onclick=shareCurrent;
 audio.volume=.85;
 audio.addEventListener("playing",()=>setStatus("Reproduciendo en vivo"));
 audio.addEventListener("waiting",()=>setStatus("Conectando con la señal…"));
 audio.addEventListener("error",()=>setStatus("No se pudo conectar. Intenta nuevamente."));
}
function bindSocials(){
 Object.entries(SOCIALS).forEach(([k,v])=>{document.querySelectorAll(`[data-social="${k}"]`).forEach(el=>{el.href=v;el.rel="noopener noreferrer"})});
}
function renderStations(list){
 $("#grid").innerHTML=list.map(st=>{
  const i=stations.findIndex(x=>x.name===st.name);
  return `<article class="card ${i===current?"active":""}" data-index="${i}">
   <div class="card-media"><img src="${st.logo}" alt="${st.name}"></div>
   <div class="card-body station-identity">
     <h3 class="station-name">${st.name}</h3>
     <p class="station-slogan">${st.subtitle}</p>
     <span class="station-genre">${st.genre}</span>
     <div class="card-bottom"><span class="pill">EN VIVO</span><button class="play-mini" aria-label="Escuchar ${st.name}">▶</button></div>
   </div>
  </article>`;
 }).join("");
 document.querySelectorAll(".card").forEach(c=>c.onclick=()=>selectStation(Number(c.dataset.index),true));
}
function selectStation(i,autoplay=true){
 current=i;const s=stations[i];audio.src=s.stream;
 $("#heroLogo").src=s.logo;$("#heroName").textContent=s.name;$("#heroTag").textContent=s.subtitle;
 $("#playerLogo").src=s.logo;$("#playerName").textContent=s.name;$("#playerTag").textContent=s.subtitle;
 $("#cover").src=s.logo;$("#trackTitle").textContent="Transmisión en vivo";$("#trackArtist").textContent=s.name;
 renderStations(stations.filter(s=>(s.name+" "+s.subtitle+" "+s.genre).toLowerCase().includes($("#search").value.toLowerCase())));
 startMetadata(); if(autoplay)play();
}
async function play(){
 try{await audio.play();$("#playBtn").textContent="❚❚";$("#heroPlay").textContent="❚❚ Pausar";setStatus("Reproduciendo en vivo")}
 catch{setStatus("Pulsa nuevamente para iniciar")}
}
function togglePlay(){
 if(audio.paused)play();else{audio.pause();$("#playBtn").textContent="▶";$("#heroPlay").textContent="▶ Escuchar ahora";setStatus("Pausado")}
}
function setStatus(t){$("#status").textContent=t}
async function shareCurrent(){
 const s=stations[current],data={title:s.name,text:`Escucha ${s.name} en Grupo Fieramix.com`,url:location.href};
 try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(location.href);setStatus("Enlace copiado")}}catch{}
}
function splitTrack(raw=""){
 const p=String(raw).trim().split(/\s+-\s+/);
 return p.length>1?{artist:p.shift(),title:p.join(" - ")}:{artist:stations[current].name,title:raw||"Transmisión en vivo"};
}
async function artwork(artist,title,fallback){
 try{const r=await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist+" "+title)}&entity=song&limit=1`);
 const d=await r.json();return d.results?.[0]?.artworkUrl100?.replace("100x100bb","600x600bb")||fallback}catch{return fallback}
}
async function fetchMetadata(){
 const s=stations[current];
 try{
  const statusUrl=s.stream.replace("/stream","/status-json.xsl");
  const r=await fetch(statusUrl,{cache:"no-store"});
  if(!r.ok)throw 0;const d=await r.json();
  const src=Array.isArray(d.icestats?.source)?d.icestats.source[0]:d.icestats?.source;
  const track=splitTrack(src?.title||"Transmisión en vivo");
  $("#trackTitle").textContent=track.title;$("#trackArtist").textContent=track.artist;
  $("#cover").src=await artwork(track.artist,track.title,s.logo);
  $("#metadataNote").textContent="Información actualizada automáticamente.";
  addHistory(track);
  const lastChartId=(track.artist+"|||"+track.title).toLowerCase();
  const chartStampKey="chartstamp:"+stations[current].name;
  const lastStamp=JSON.parse(localStorage.getItem(chartStampKey)||"{}");
  if(lastStamp.id!==lastChartId || Date.now()-Number(lastStamp.time||0)>120000){
    recordChartPlay(track);
    localStorage.setItem(chartStampKey,JSON.stringify({id:lastChartId,time:Date.now()}));
  }
 }catch{
  $("#metadataNote").textContent="El servidor debe permitir metadata pública o configurarse con la API de RadioBOSS para mostrar las últimas canciones reales.";
 }
}
function addHistory(track){
 const key=stations[current].name,stored=JSON.parse(localStorage.getItem("history:"+key)||"[]");
 if(!stored.length||stored[0].title!==track.title){
  stored.unshift({...track,time:new Date().toLocaleTimeString("es-DO",{hour:"2-digit",minute:"2-digit"})});
  localStorage.setItem("history:"+key,JSON.stringify(stored.slice(0,10)));
 }
 renderHistory(stored.slice(0,10));
}
function renderHistory(items){
 $("#historyList").innerHTML=items.length?items.map(x=>`<div class="history-item"><img src="${stations[current].logo}"><div><strong>${x.title}</strong><span>${x.artist}</span></div><div class="history-time">${x.time}</div></div>`).join(""):'<div class="note">El historial aparecerá cuando la emisora entregue metadata.</div>';
}
function startMetadata(){clearInterval(metadataTimer);fetchMetadata();renderHistory(JSON.parse(localStorage.getItem("history:"+stations[current].name)||"[]"));metadataTimer=setInterval(fetchMetadata,30000)}

function chartKey(stationName){return "chart:"+stationName}
function normalizeTrack(track){
  return {
    artist:(track.artist||"").trim() || "Artista desconocido",
    title:(track.title||"").trim() || "Sin título"
  };
}
function recordChartPlay(track){
  const t=normalizeTrack(track);
  if(!t.title || t.title==="Transmisión en vivo") return;
  const station=stations[current].name;
  const stationData=JSON.parse(localStorage.getItem(chartKey(station))||"{}");
  const id=(t.artist+"|||"+t.title).toLowerCase();
  const prev=stationData[id]||{artist:t.artist,title:t.title,count:0,lastPlayed:0,logo:stations[current].logo};
  prev.count+=1;
  prev.lastPlayed=Date.now();
  prev.logo=stations[current].logo;
  stationData[id]=prev;
  localStorage.setItem(chartKey(station),JSON.stringify(stationData));
  renderCharts();
}
function setupCharts(){
  const select=$("#chartStation");
  select.innerHTML=stations.map((s,i)=>`<option value="${i}">${s.name}</option>`).join("");
  select.onchange=renderCharts;
  renderCharts();
}
function sortedChartForStation(index){
  const s=stations[index];
  const data=JSON.parse(localStorage.getItem(chartKey(s.name))||"{}");
  return Object.values(data).sort((a,b)=>b.count-a.count || b.lastPlayed-a.lastPlayed);
}
function generalChart(){
  const merged={};
  stations.forEach((s,i)=>{
    sortedChartForStation(i).forEach(x=>{
      const id=(x.artist+"|||"+x.title).toLowerCase();
      if(!merged[id]) merged[id]={...x,count:0};
      merged[id].count+=x.count;
      merged[id].lastPlayed=Math.max(merged[id].lastPlayed||0,x.lastPlayed||0);
    });
  });
  return Object.values(merged).sort((a,b)=>b.count-a.count || b.lastPlayed-a.lastPlayed);
}
function chartRow(item,index){
  return `<div class="chart-row">
    <div class="chart-rank">${index+1}</div>
    <img src="${item.logo||stations[current].logo}" alt="">
    <div class="chart-track"><strong>${item.title}</strong><span>${item.artist}</span></div>
    <div class="chart-count">${item.count} ${item.count===1?"reproducción":"reproducciones"}</div>
  </div>`;
}
function renderCharts(){
  const selected=Number($("#chartStation")?.value||0);
  const stationItems=sortedChartForStation(selected).slice(0,10);
  const generalItems=generalChart().slice(0,25);
  if($("#stationTop10")) $("#stationTop10").innerHTML=stationItems.length?stationItems.map(chartRow).join(""):'<div class="empty-chart">El Top 10 aparecerá cuando se detecten canciones en esta emisora.</div>';
  if($("#generalTop25")) $("#generalTop25").innerHTML=generalItems.length?generalItems.map(chartRow).join(""):'<div class="empty-chart">El Top 25 general aparecerá cuando se registren canciones reproducidas.</div>';
}

function renderAllLive(){
  const grid=$("#allLiveGrid");
  if(!grid) return;
  grid.innerHTML=stations.map((s,i)=>`<article class="panel live-station">
    <img src="${s.logo}" alt="${s.name}">
    <div><h3>${s.name}</h3><p>${s.subtitle}</p></div>
    <button type="button" data-live-index="${i}" aria-label="Escuchar ${s.name}">▶</button>
  </article>`).join("");
  document.querySelectorAll("[data-live-index]").forEach(btn=>{
    btn.onclick=()=>{selectStation(Number(btn.dataset.liveIndex),true);window.scrollTo({top:0,behavior:"smooth"})}
  });
}
function setupWhatsApp(){
  const toggle=$("#waToggle"),menu=$("#waMenu");
  if(!toggle||!menu)return;
  toggle.onclick=e=>{e.stopPropagation();menu.classList.toggle("open")};
  document.addEventListener("click",()=>menu.classList.remove("open"));
  menu.onclick=e=>e.stopPropagation();
}
function setupClubPopup(){
  const popup=$("#clubPopup"),close=$("#popupClose"),later=$("#popupLater");
  if(!popup)return;
  const key="fieramixClubPopupClosedAt";
  const last=Number(localStorage.getItem(key)||0);
  const thirtyDays=30*24*60*60*1000;
  if(Date.now()-last>thirtyDays){
    setTimeout(()=>{popup.classList.add("show");popup.setAttribute("aria-hidden","false")},20000);
  }
  const hide=()=>{popup.classList.remove("show");popup.setAttribute("aria-hidden","true");localStorage.setItem(key,String(Date.now()))};
  close.onclick=hide;later.onclick=hide;
  popup.onclick=e=>{if(e.target===popup)hide()};
}

init();
