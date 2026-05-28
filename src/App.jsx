import { useState, useEffect } from "react";

const DK={bg:"#0f1a0f",card:"#162016",bdr:"#1e3a1e",tx:"#e8f0e8",sub:"#6a8a6a",ac:"#7ec87e",ip:"#0a120a",tx2:"#a8c4a8",dim:"#3a5a3a"};
const LT={bg:"#f0f5f0",card:"#ffffff",bdr:"#c8dcc8",tx:"#1a2a1a",sub:"#5a7a5a",ac:"#3a7a3a",ip:"#f8fdf8",tx2:"#4a6a4a",dim:"#7a9a7a"};

const SOURCES=[
  {id:"pdg",name:"Perfect Daily Grind",url:"https://perfectdailygrind.com/feed/",color:"#7ec87e",emoji:"🌿"},
  {id:"dcn",name:"Daily Coffee News",url:"https://dailycoffeenews.com/feed/",color:"#c4a87e",emoji:"📰"},
  {id:"sprudge",name:"Sprudge",url:"https://sprudge.com/feed",color:"#c47e7e",emoji:"☕"},
  {id:"cr",name:"Coffee Review",url:"https://www.coffeereview.com/feed/",color:"#7eaac4",emoji:"⭐"},
];

const KEYWORDS=["Ethiopia","Colombia","Kenya","Panama","Geisha","Natural","Washed","Anaerobic","Honey","Yirgacheffe","Huila","Sidama","Burundi","Rwanda","Yemen"];

const NAVER_LINKS=[
  {label:"스페셜티 원두 인기순",url:"https://search.shopping.naver.com/search/all?query=스페셜티원두&sort=review"},
  {label:"Ethiopia 원두",url:"https://search.shopping.naver.com/search/all?query=에티오피아+원두"},
  {label:"게이샤 원두",url:"https://search.shopping.naver.com/search/all?query=게이샤+원두"},
  {label:"내추럴 원두",url:"https://search.shopping.naver.com/search/all?query=내추럴+원두"},
  {label:"커피리브레 블로그",url:"https://blog.naver.com/coffeelibre"},
  {label:"모모스커피 블로그",url:"https://blog.naver.com/momoscoffee"},
];

const RSSAPI="https://api.rss2json.com/v1/api.json?rss_url=";
const LS_KEY="coffee_radar_v1";

function load(k,d){try{const v=localStorage.getItem(LS_KEY);if(v){const p=JSON.parse(v);if(p[k]!==undefined)return p[k];}return d;}catch{return d;}}
function save(k,val){try{const v=localStorage.getItem(LS_KEY);const p=v?JSON.parse(v):{};p[k]=val;localStorage.setItem(LS_KEY,JSON.stringify(p));}catch{}}

export default function App(){
  const [dark,setDark]=useState(()=>load("dark",true));
  const T=dark?DK:LT;
  const [articles,setArticles]=useState({});
  const [loading,setLoading]=useState({});
  const [errors,setErrors]=useState({});
  const [activeTab,setActiveTab]=useState("feed");
  const [activeSrc,setActiveSrc]=useState("all");
  const [keyword,setKeyword]=useState("");
  const [saved,setSaved]=useState(()=>load("saved",[]));
  const [lastFetch,setLastFetch]=useState(()=>load("lastFetch",null));

  const fetchFeed=async(src)=>{
    setLoading(p=>({...p,[src.id]:true}));
    setErrors(p=>({...p,[src.id]:null}));
    try{
      const res=await fetch(`${RSSAPI}${encodeURIComponent(src.url)}&count=20`);
      const data=await res.json();
      if(data.status==="ok"){
        setArticles(p=>({...p,[src.id]:data.items}));
      } else {
        setErrors(p=>({...p,[src.id]:"불러오기 실패"}));
      }
    }catch{
      setErrors(p=>({...p,[src.id]:"네트워크 오류"}));
    }
    setLoading(p=>({...p,[src.id]:false}));
  };

  const fetchAll=()=>{
    const now=new Date().toISOString();
    setLastFetch(now);save("lastFetch",now);
    SOURCES.forEach(s=>fetchFeed(s));
  };

  useEffect(()=>{fetchAll();},[]);

  const toggleSave=art=>{
    setSaved(prev=>{
      const exists=prev.find(a=>a.link===art.link);
      const next=exists?prev.filter(a=>a.link!==art.link):[{...art,savedAt:new Date().toISOString()},...prev];
      save("saved",next);return next;
    });
  };

  const isSaved=art=>saved.some(a=>a.link===art.link);

  const allArticles=SOURCES.flatMap(s=>(articles[s.id]||[]).map(a=>({...a,srcId:s.id,srcName:s.name,srcColor:s.color,srcEmoji:s.emoji})))
    .sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));

  const filtered=(activeSrc==="all"?allArticles:allArticles.filter(a=>a.srcId===activeSrc))
    .filter(a=>!keyword||a.title.toLowerCase().includes(keyword.toLowerCase())||KEYWORDS.filter(k=>k.toLowerCase()===keyword.toLowerCase()).some(k=>a.title.includes(k)));

  const isLoading=Object.values(loading).some(Boolean);
  const fmtDate=d=>{try{return new Date(d).toLocaleDateString("ko-KR",{month:"short",day:"numeric"});}catch{return "";}};
  const cleanDesc=d=>{if(!d)return"";return d.replace(/<[^>]+>/g,"").slice(0,120)+"...";};

  const C=(ex={})=>({background:T.card,border:`1px solid ${T.bdr}`,borderRadius:16,padding:"18px 16px",marginBottom:12,maxWidth:560,marginLeft:"auto",marginRight:"auto",...ex});
  const tg=on=>({width:36,height:20,background:on?T.ac:"#2a3a2a",borderRadius:10,position:"relative",flexShrink:0,cursor:"pointer"});
  const tb=on=>({position:"absolute",width:14,height:14,background:"#0f1a0f",borderRadius:"50%",top:3,left:on?19:3,transition:"left 0.2s"});

  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.tx,fontFamily:"sans-serif",padding:"28px 16px 60px",transition:"background 0.3s"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@1&display=swap" rel="stylesheet"/>

      {/* 헤더 */}
      <div style={{maxWidth:560,margin:"0 auto 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:9,letterSpacing:3,color:T.ac,textTransform:"uppercase",marginBottom:4}}>Corner Coffee Gongbang</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:T.tx,lineHeight:1.1}}>Coffee<br/><em style={{color:T.ac}}>Radar</em></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:12}}>☀️</span>
            <div style={tg(dark)} onClick={()=>setDark(v=>!v)}><div style={tb(dark)}/></div>
            <span style={{fontSize:12}}>🌙</span>
          </div>
          <button onClick={fetchAll} disabled={isLoading} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${T.ac}`,background:"transparent",color:T.ac,fontSize:11,cursor:"pointer"}}>
            {isLoading?"⏳ 로딩...":"🔄 새로고침"}
          </button>
        </div>
      </div>

      {lastFetch&&<div style={{textAlign:"center",fontSize:10,color:T.dim,marginBottom:16,maxWidth:560,margin:"0 auto 16px"}}>마지막 업데이트: {new Date(lastFetch).toLocaleString("ko-KR",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>}

      {/* 탭 */}
      <div style={{display:"flex",gap:8,maxWidth:560,margin:"0 auto 16px"}}>
        {[["feed","📡 피드"],["saved","🔖 저장됨"],["naver","🇰🇷 한국"]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{flex:1,padding:"10px 0",borderRadius:10,border:`1px solid ${activeTab===id?T.ac:T.bdr}`,background:activeTab===id?T.ac:"transparent",color:activeTab===id?"#0f1a0f":T.sub,fontSize:12,fontWeight:activeTab===id?700:400,cursor:"pointer"}}>{label}</button>
        ))}
      </div>

      {/* 피드 탭 */}
      {activeTab==="feed"&&<>
        {/* 소스 필터 */}
        <div style={{display:"flex",gap:6,maxWidth:560,margin:"0 auto 12px",overflowX:"auto",paddingBottom:4}}>
          <button onClick={()=>setActiveSrc("all")} style={{flexShrink:0,padding:"6px 12px",borderRadius:20,border:`1px solid ${activeSrc==="all"?T.ac:T.bdr}`,background:activeSrc==="all"?T.ac:"transparent",color:activeSrc==="all"?"#0f1a0f":T.sub,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>전체</button>
          {SOURCES.map(s=>(
            <button key={s.id} onClick={()=>setActiveSrc(s.id)} style={{flexShrink:0,padding:"6px 12px",borderRadius:20,border:`1px solid ${activeSrc===s.id?s.color:T.bdr}`,background:activeSrc===s.id?s.color:"transparent",color:activeSrc===s.id?"#0f1a0f":T.sub,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>{s.emoji} {s.name.split(" ")[0]}</button>
          ))}
        </div>

        {/* 키워드 필터 */}
        <div style={{maxWidth:560,margin:"0 auto 12px"}}>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
            {KEYWORDS.map(k=>(
              <button key={k} onClick={()=>setKeyword(keyword===k?"":k)} style={{flexShrink:0,padding:"5px 10px",borderRadius:14,border:`1px solid ${keyword===k?T.ac:T.bdr}`,background:keyword===k?T.ac+"22":"transparent",color:keyword===k?T.ac:T.dim,fontSize:10,cursor:"pointer",whiteSpace:"nowrap"}}>{k}</button>
            ))}
          </div>
        </div>

        {/* 에러 표시 */}
        {Object.entries(errors).filter(([,e])=>e).map(([id,e])=>(
          <div key={id} style={{maxWidth:560,margin:"0 auto 8px",padding:"8px 12px",background:"#3a1a1a",borderRadius:8,fontSize:11,color:"#f87171"}}>{SOURCES.find(s=>s.id===id)?.name}: {e}</div>
        ))}

        {/* 기사 목록 */}
        {filtered.length===0&&!isLoading&&<div style={{textAlign:"center",padding:"40px 0",color:T.dim,fontSize:13}}>기사가 없어요<br/>키워드나 소스를 바꿔보세요</div>}
        {isLoading&&filtered.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:T.dim,fontSize:13}}>☕ 피드 불러오는 중...</div>}

        {filtered.map((a,i)=>(
          <div key={i} style={C()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:10,padding:"2px 7px",borderRadius:10,background:a.srcColor+"22",color:a.srcColor}}>{a.srcEmoji} {a.srcName.split(" ")[0]}</span>
                <span style={{fontSize:10,color:T.dim}}>{fmtDate(a.pubDate)}</span>
              </div>
              <button onClick={()=>toggleSave(a)} style={{background:"transparent",border:"none",fontSize:16,cursor:"pointer",padding:0}}>{isSaved(a)?"🔖":"🏳️"}</button>
            </div>
            <div style={{fontSize:14,color:T.tx,fontWeight:600,lineHeight:1.4,marginBottom:6}}>{a.title}</div>
            <div style={{fontSize:11,color:T.sub,lineHeight:1.5,marginBottom:10}}>{cleanDesc(a.description)}</div>
            {KEYWORDS.filter(k=>a.title.includes(k)).map(k=>(
              <span key={k} style={{display:"inline-block",marginRight:4,marginBottom:4,padding:"2px 8px",borderRadius:10,background:T.ac+"18",color:T.ac,fontSize:10}}>#{k}</span>
            ))}
            <a href={a.link} target="_blank" rel="noreferrer" style={{display:"block",marginTop:8,padding:"8px",borderRadius:8,border:`1px solid ${T.bdr}`,textAlign:"center",color:T.ac,fontSize:12,textDecoration:"none"}}>원문 읽기 →</a>
          </div>
        ))}
      </>}

      {/* 저장된 기사 */}
      {activeTab==="saved"&&<>
        {saved.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:T.dim,fontSize:13}}>저장된 기사가 없어요<br/>피드에서 🏳️ 버튼으로 저장하세요</div>}
        {saved.map((a,i)=>(
          <div key={i} style={C()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <span style={{fontSize:10,color:T.dim}}>{fmtDate(a.savedAt)} 저장</span>
              <button onClick={()=>toggleSave(a)} style={{background:"transparent",border:"none",fontSize:16,cursor:"pointer",padding:0}}>🔖</button>
            </div>
            <div style={{fontSize:14,color:T.tx,fontWeight:600,lineHeight:1.4,marginBottom:10}}>{a.title}</div>
            <a href={a.link} target="_blank" rel="noreferrer" style={{display:"block",padding:"8px",borderRadius:8,border:`1px solid ${T.bdr}`,textAlign:"center",color:T.ac,fontSize:12,textDecoration:"none"}}>원문 읽기 →</a>
          </div>
        ))}
      </>}

      {/* 한국 링크 */}
      {activeTab==="naver"&&<>
        <div style={C()}>
          <div style={{fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase",marginBottom:14}}>네이버 쇼핑 바로가기</div>
          {NAVER_LINKS.map((l,i)=>(
            <a key={i} href={l.url} target="_blank" rel="noreferrer" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<NAVER_LINKS.length-1?`1px solid ${T.bdr}`:"none",textDecoration:"none"}}>
              <span style={{fontSize:13,color:T.tx}}>{l.label}</span>
              <span style={{color:T.ac,fontSize:14}}>→</span>
            </a>
          ))}
        </div>

        <div style={C()}>
          <div style={{fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase",marginBottom:14}}>인스타그램 태그</div>
          {["생두","스페셜티커피","coffeeroaster","greencoffee","specialtycoffee","coffeeharvest"].map((tag,i,arr)=>(
            <a key={tag} href={`https://www.instagram.com/explore/tags/${tag}/`} target="_blank" rel="noreferrer" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<arr.length-1?`1px solid ${T.bdr}`:"none",textDecoration:"none"}}>
              <span style={{fontSize:13,color:T.tx}}>#{tag}</span>
              <span style={{color:T.ac,fontSize:14}}>→</span>
            </a>
          ))}
        </div>

        <div style={C()}>
          <div style={{fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase",marginBottom:14}}>생두 수입사</div>
          {[
            {name:"커피리브레",url:"https://coffeelibre.kr"},
            {name:"에스프레소코리아",url:"https://www.espressokorea.co.kr"},
            {name:"생두박스",url:"https://www.saengdubox.com"},
            {name:"커피앤컵",url:"https://www.coffeencup.co.kr"},
          ].map((l,i,arr)=>(
            <a key={l.name} href={l.url} target="_blank" rel="noreferrer" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<arr.length-1?`1px solid ${T.bdr}`:"none",textDecoration:"none"}}>
              <span style={{fontSize:13,color:T.tx}}>{l.name}</span>
              <span style={{color:T.ac,fontSize:14}}>→</span>
            </a>
          ))}
        </div>
      </>}
    </div>
  );
}
