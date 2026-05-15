
import { useState, useEffect } from "react";

const DK={bg:"#1a1008",card:"#231608",bdr:"#3a2510",tx:"#f0e6d3",sub:"#7a6050",ac:"#c49a6c",ip:"#0f0905",tx2:"#b09070",dim:"#4a3020"};
const LT={bg:"#f5f0e8",card:"#ffffff",bdr:"#ddd0b8",tx:"#2a1a08",sub:"#8a7060",ac:"#9a6a30",ip:"#faf8f4",tx2:"#6a5040",dim:"#8a7060"};
const TIERS=[{label:"1억 미만",pay:3.74},{label:"1~10억",pay:2.97},{label:"10억+",pay:1.98}];
const CAT=2.0;
const UNITS=[100,200,400,500,800,1000];
const f=n=>Math.round(n).toLocaleString("ko-KR");
const TABS=["원두","블렌딩","드립백"];
const LS="cornerprice_v1";

const DEF_BEANS=[
{name:"Ethiopia",price:20000,ratio:40},
{name:"Colombia",price:15000,ratio:30},
{name:"Brazil",price:12000,ratio:30},
{name:"",price:0,ratio:0},
{name:"",price:0,ratio:0},
];

function load(key,def){try{const v=localStorage.getItem(LS);if(v){const d=JSON.parse(v);return d[key]??def;}return def;}catch{return def;}}
function saveAll(state){try{localStorage.setItem(LS,JSON.stringify(state));}catch{}}

export default function App() {
const [dark,setDark]=useState(()=>load("dark",true));
const [tab,setTab]=useState(0);
const T=dark?DK:LT;

const [ti,setTi]=useState(()=>load("ti",0));
const [mg,setMg]=useState(()=>load("mg",35));
const [vt,setVt]=useState(()=>load("vt",false));

const [gb,setGb]=useState(()=>load("gb",15000));
const [ro,setRo]=useState(()=>load("ro",3000));
const [yr,setYr]=useState(()=>load("yr",80));
const [su,setSu]=useState(()=>load("su",100));
const [pk,setPk]=useState(()=>load("pk",800));
const [sh,setSh]=useState(()=>load("sh",3000));
const [fs,setFs]=useState(()=>load("fs",true));

const [beans,setBeans]=useState(()=>load("beans",DEF_BEANS));

const [dbSrc,setDbSrc]=useState(()=>load("dbSrc",0));
const [dbGb,setDbGb]=useState(()=>load("dbGb",15000));
const [dbRo,setDbRo]=useState(()=>load("dbRo",3000));
const [dbYr,setDbYr]=useState(()=>load("dbYr",80));
const [dbCg,setDbCg]=useState(()=>load("dbCg",12));
const [dbFl,setDbFl]=useState(()=>load("dbFl",150));
const [dbBg,setDbBg]=useState(()=>load("dbBg",200));
const [dbBx,setDbBx]=useState(()=>load("dbBx",1500));
const [dbPk,setDbPk]=useState(()=>load("dbPk",500));
const [dbSh,setDbSh]=useState(()=>load("dbSh",3000));
const [dbFs,setDbFs]=useState(()=>load("dbFs",true));

useEffect(()=>{
saveAll({dark,ti,mg,vt,gb,ro,yr,su,pk,sh,fs,beans,dbSrc,dbGb,dbRo,dbYr,dbCg,dbFl,dbBg,dbBx,dbPk,dbSh,dbFs});
},[dark,ti,mg,vt,gb,ro,yr,su,pk,sh,fs,beans,dbSrc,dbGb,dbRo,dbYr,dbCg,dbFl,dbBg,dbBx,dbPk,dbSh,dbFs]);

const exportCSV=async()=>{
    const date=new Date().toLocaleDateString("ko-KR");
    const rows=[
      ["날짜","구분","생두명","구매가(원/kg)","로스팅비(원/kg)","로스율(%)","비율(%)"],
      [date,"단품원두","(원두탭)",gb,ro,yr,"100"],
      ...beans.filter(b=>b.name).map(b=>[date,"블렌딩",b.name,b.price,ro,yr,b.ratio]),
    ];
    const csv=rows.map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const bom="\uFEFF";
    const blob=new Blob([bom+csv],{type:"text/csv;charset=utf-8;"});
    const filename=`cornerprice_생두장부_${date.replace(/\./g,"")}.csv`;
    const file=new File([blob],filename,{type:"text/csv"});
    if(navigator.share&&navigator.canShare({files:[file]})){
      await navigator.share({files:[file],title:"생두 장부"});
    } else {
      const url=URL.createObjectURL(blob);
      window.open(url,"_blank");
      setTimeout(()=>URL.revokeObjectURL(url),3000);
    }
  };

const fr=(CAT+TIERS[ti].pay)/100;
const mr=mg/100;
const vf=vt?10/11:1;
const dv=vf-fr-mr;
const calc=cost=>dv>0?Math.ceil((cost/dv)/100)*100:0;

const gn=su/(yr/100);
const gc=(gb/1000)*gn;
const rc=(ro/1000)*gn;
const cc=gc+rc;
const tc=cc+pk+(fs?sh:0);
const sp=calc(tc);
const fa=sp*fr;
const va=vt?Math.round(sp/11):0;
const pf=sp-va-fa-tc;
const rm=sp>0?(pf/sp)*100:0;
const mc=rm>=30?"#4ade80":rm>=20?"#fbbf24":"#f87171";

const totalRatio=beans.reduce((s,b)=>s+b.ratio,0);
const blendedKgCost=totalRatio>0?beans.reduce((s,b)=>s+(b.price*(b.ratio/totalRatio)),0):0;
const blendUnitCost=u=>{const n=u/(yr/100);return((blendedKgCost+ro)/1000)*n;};

const dbLinkedGb=dbSrc===0?gb:dbSrc===1?blendedKgCost:dbGb;
const dbLinkedRo=dbSrc===0?ro:dbSrc===1?ro:dbRo;
const dbLinkedYr=dbSrc===0?yr:dbSrc===1?yr:dbYr;
const srcLabel=dbSrc===0?"원두 탭 연동":dbSrc===1?"블렌딩 탭 연동":"직접 입력";

const C=(ex={})=>({background:T.card,border:`1px solid ${T.bdr}`,borderRadius:16,padding:"20px 18px",marginBottom:12,maxWidth:560,marginLeft:"auto",marginRight:"auto",...ex});
const I=(ex={})=>({width:"100%",background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:8,padding:"9px 12px",color:T.tx,fontSize:14,fontFamily:"monospace",outline:"none",boxSizing:"border-box",...ex});
const ttl={fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase",marginBottom:14};
const tog=on=>({width:36,height:20,background:on?T.ac:"#3a2510",borderRadius:10,position:"relative",flexShrink:0,cursor:"pointer"});
const thb=on=>({position:"absolute",width:14,height:14,background:"#1a1008",borderRadius:"50%",top:3,left:on?19:3,transition:"left 0.2s"});
const row2={display:"flex",justifyContent:"space-between",padding:"3px 0"};
const sep=<div style={{height:1,background:T.bdr,margin:"8px 0"}}/>;
const lbl=(t,s="")=><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.sub,marginBottom:5}}><span>{t}</span>{s&&<span style={{color:T.ac,fontFamily:"monospace"}}>{s}</span>}</div>;
const RB={background:dark?"linear-gradient(135deg,#2a1a08,#180e04)":"linear-gradient(135deg,#fff8ee,#fff3e0)",border:`1px solid ${T.ac}44`,borderRadius:16,padding:"24px 20px",maxWidth:560,margin:"0 auto"};
const yh=r=>r>=90?"라이트":r>=83?"미디엄":r>=77?"미디엄다크":"다크";
const UB=on=>({flex:1,minWidth:"calc(33% - 6px)",padding:"9px 0",borderRadius:8,border:`1px solid ${on?T.ac:T.bdr}`,background:on?T.ac:"transparent",color:on?"#1a1008":T.sub,fontWeight:on?700:400,fontSize:13,cursor:"pointer"});
const ub=bean=>setBeans(prev=>prev.map((b,idx)=>idx===bean.i?{...b,[bean.f]:bean.f==="name"?bean.v:Number(bean.v)}:b));

return (
<div style={{minHeight:"100vh",background:T.bg,color:T.tx,fontFamily:"sans-serif",padding:"28px 16px 60px",transition:"background 0.3s"}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@1&display=swap" rel="stylesheet"/>

  <div style={{maxWidth:560,margin:"0 auto 20px",display:"flex",justifyContent:"flex-end",alignItems:"center",gap:8}}>
    <span style={{fontSize:13}}>☀️</span>
    <div style={tog(dark)} onClick={()=>setDark(v=>!v)}><div style={thb(dark)}/></div>
    <span style={{fontSize:13}}>🌙</span>
  </div>

  <div style={{textAlign:"center",marginBottom:28}}>
    <div style={{fontSize:10,letterSpacing:3,color:T.ac,textTransform:"uppercase",marginBottom:8}}>Corner Coffee Gongbang</div>
    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:32,color:T.tx,lineHeight:1.2}}>스마트스토어<br/><em style={{color:T.ac}}>판매가 계산기</em></div>
    <div style={{fontSize:11,color:T.sub,marginTop:6}}>수수료 · 로스율 · 부가세 반영</div>
  </div>

  <div style={{display:"flex",gap:8,maxWidth:560,margin:"0 auto 16px"}}>
    {TABS.map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 0",borderRadius:10,border:`1px solid ${tab===i?T.ac:T.bdr}`,background:tab===i?T.ac:"transparent",color:tab===i?"#1a1008":T.sub,fontSize:13,fontWeight:tab===i?700:400,cursor:"pointer"}}>{t}</button>)}
  </div>

  {tab===0&&<>
    <div style={C()}>
      <div style={ttl}>판매 단위</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {UNITS.map(u=><button key={u} onClick={()=>setSu(u)} style={UB(su===u)}>{u>=1000?"1kg":`${u}g`}</button>)}
      </div>
    </div>
    <div style={C()}>
      <div style={ttl}>원가 구성</div>
      <div style={{background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"12px",marginBottom:14,display:"flex",justifyContent:"space-around",alignItems:"center"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:18,color:T.ac,fontFamily:"monospace"}}>{Math.round(gn)}g</div><div style={{fontSize:10,color:T.dim}}>생두</div></div>
        <div style={{textAlign:"center"}}><div style={{fontSize:11,color:T.ac}}>→{yr}%→</div><div style={{fontSize:9,color:T.dim}}>{yh(yr)}</div></div>
        <div style={{textAlign:"center"}}><div style={{fontSize:18,color:T.ac,fontFamily:"monospace"}}>{su>=1000?"1kg":`${su}g`}</div><div style={{fontSize:10,color:T.dim}}>원두</div></div>
      </div>
      {lbl("로스율",`${yr}% — 1kg→${yr*10}g`)}
      <input type="range" min={70} max={95} step={1} value={yr} onChange={e=>setYr(+e.target.value)} style={{width:"100%",marginBottom:14}}/>
      {lbl("생두 구매가","1kg 기준")}
      <input type="number" value={gb} onChange={e=>setGb(+e.target.value)} style={{...I(),marginBottom:10}}/>
      {lbl("로스팅 비용","생두 1kg 기준")}
      <input type="number" value={ro} onChange={e=>setRo(+e.target.value)} style={{...I(),marginBottom:10}}/>
      <div style={{background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"12px",marginBottom:14}}>
        <div style={row2}><span style={{fontSize:11,color:T.dim}}>생두 {Math.round(gn)}g 원가</span><span style={{fontFamily:"monospace",fontSize:12,color:T.sub}}>{f(gc)}원</span></div>
        <div style={row2}><span style={{fontSize:11,color:T.dim}}>로스팅비</span><span style={{fontFamily:"monospace",fontSize:12,color:T.sub}}>{f(rc)}원</span></div>
        {sep}
        <div style={row2}><span style={{fontSize:12,color:T.tx2}}>커피 원가</span><span style={{fontFamily:"monospace",fontSize:14,color:T.ac}}>{f(cc)}원</span></div>
      </div>
      {lbl("포장재비")}
      <input type="number" value={pk} onChange={e=>setPk(+e.target.value)} style={{...I(),marginBottom:10}}/>
      {lbl("배송비")}
      <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:8}} onClick={()=>setFs(v=>!v)}>
        <div style={tog(fs)}><div style={thb(fs)}/></div>
        <span style={{fontSize:13,color:T.tx2}}>{fs?"무료배송 — 판매가 포함":"고객 부담"}</span>
      </div>
      {fs&&<input type="number" value={sh} onChange={e=>setSh(+e.target.value)} style={I()}/>}
    </div>
    <div style={RB}>
      <div style={{fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase",marginBottom:6}}>권장 판매가 ({su>=1000?"1kg":`${su}g`})</div>
      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:46,color:T.tx,lineHeight:1}}>{dv>0?f(sp):"—"}<span style={{fontSize:20,color:T.ac,marginLeft:4}}>원</span></div>
      <div style={{fontFamily:"monospace",fontSize:10,color:T.dim,margin:"6px 0 18px"}}>100원 올림{vt?" · 부가세 포함":""}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[["커피원가",f(cc)+"원"],["포장+배송",f(pk+(fs?sh:0))+"원"],["수수료",f(fa)+"원"],vt?["부가세",f(va)+"원"]:null,["실제이익",f(pf)+"원",mc],["이익률",rm.toFixed(1)+"%",mc]].filter(Boolean).map(([l,v,c])=>(
          <div key={l}><div style={{fontSize:11,color:T.dim}}>{l}</div><div style={{fontFamily:"monospace",fontSize:c?15:13,color:c||T.sub}}>{v}</div></div>
        ))}
      </div>
    </div>
  </>}

  {tab===1&&<>
    <div style={C()}>
      <div style={ttl}>생두 블렌딩 구성</div>
      <div style={{fontSize:11,color:T.sub,marginBottom:12}}>비율 합계: <span style={{color:totalRatio===100?T.ac:"#f87171",fontFamily:"monospace",fontWeight:700}}>{totalRatio}%</span>{totalRatio!==100&&<span style={{color:"#f87171"}}> ← 100%여야 합니다</span>}</div>
      {beans.map((b,i)=>(
        <div key={i} style={{background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"12px",marginBottom:10}}>
          <div style={{fontSize:10,color:T.ac,marginBottom:8,fontFamily:"monospace"}}>원두 {i+1}</div>
          <input placeholder="이름 (예: Ethiopia Natural)" value={b.name} onChange={e=>ub({i,f:"name",v:e.target.value})} style={{...I(),marginBottom:8}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div><div style={{fontSize:10,color:T.dim,marginBottom:4}}>구매가 (원/kg)</div><input type="number" value={b.price} onChange={e=>ub({i,f:"price",v:e.target.value})} style={I()}/></div>
            <div><div style={{fontSize:10,color:T.dim,marginBottom:4}}>비율 (%)</div><input type="number" value={b.ratio} onChange={e=>ub({i,f:"ratio",v:e.target.value})} style={I()}/></div>
          </div>
        </div>
      ))}
    </div>
    <div style={C()}>
      <div style={ttl}>로스팅 설정</div>
      {lbl("로스팅 비용","생두 1kg 기준")}
      <input type="number" value={ro} onChange={e=>setRo(+e.target.value)} style={{...I(),marginBottom:12}}/>
      {lbl("로스율",`${yr}% — 1kg→${yr*10}g`)}
      <input type="range" min={70} max={95} step={1} value={yr} onChange={e=>setYr(+e.target.value)} style={{width:"100%"}}/>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:10,color:T.dim}}>70% 다크</span><span style={{fontSize:10,color:T.dim}}>95% 라이트</span></div>
    </div>
    <div style={RB}>
      <div style={{fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase",marginBottom:4}}>블렌딩 단가</div>
      <div style={{fontFamily:"monospace",fontSize:22,color:T.tx,marginBottom:4}}>{f(blendedKgCost)}<span style={{fontSize:13,color:T.ac,marginLeft:4}}>원/kg</span></div>
      <div style={{fontFamily:"monospace",fontSize:10,color:T.dim,marginBottom:14}}>생두 가중평균 단가</div>
      {sep}
      <div style={{fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase",margin:"14px 0 10px"}}>단위별 판매가</div>
      {totalRatio===100?[500,1000].map(u=>{
        const cost=blendUnitCost(u)+pk+(fs?sh:0);
        const price=calc(cost);
        const p2=price-price*fr-(vt?Math.round(price/11):0)-cost;
        const m2=price>0?(p2/price)*100:0;
        return <div key={u} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.bdr}`}}>
          <span style={{fontSize:14,color:T.sub}}>{u>=1000?"1kg":`${u}g`}</span>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"monospace",fontSize:18,color:T.ac}}>{f(price)}원</div>
            <div style={{fontSize:10,color:m2>=30?"#4ade80":m2>=20?"#fbbf24":"#f87171",fontFamily:"monospace"}}>이익률 {m2.toFixed(1)}%</div>
          </div>
        </div>
      }):<div style={{color:"#f87171",fontSize:12}}>비율 합계를 100%로 맞춰주세요</div>}
    </div>
  </>}

  {tab===2&&<>
    <div style={C()}>
      <div style={ttl}>원두 원가 소스</div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {["원두 탭 연동","블렌딩 탭 연동","직접 입력"].map((l,i)=>(
          <button key={i} onClick={()=>setDbSrc(i)} style={{flex:1,padding:"10px 6px",borderRadius:10,border:`1px solid ${dbSrc===i?T.ac:T.bdr}`,background:dbSrc===i?T.ac:"transparent",color:dbSrc===i?"#1a1008":T.sub,fontSize:11,cursor:"pointer",fontWeight:dbSrc===i?600:400}}>{l}</button>
        ))}
      </div>
      <div style={{background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"12px"}}>
        <div style={row2}><span style={{fontSize:11,color:T.dim}}>적용 생두 단가</span><span style={{fontFamily:"monospace",color:T.ac}}>{f(dbLinkedGb)}원/kg</span></div>
        <div style={row2}><span style={{fontSize:11,color:T.dim}}>로스팅비</span><span style={{fontFamily:"monospace",color:T.sub}}>{f(dbLinkedRo)}원/kg</span></div>
        <div style={row2}><span style={{fontSize:11,color:T.dim}}>로스율</span><span style={{fontFamily:"monospace",color:T.sub}}>{dbLinkedYr}%</span></div>
        {dbSrc===1&&totalRatio!==100&&<div style={{color:"#f87171",fontSize:11,marginTop:6}}>블렌딩 비율 합계가 100%가 아닙니다</div>}
      </div>
    </div>
    {dbSrc===2&&<div style={C()}>
      <div style={ttl}>원두 원가 직접 입력</div>
      {lbl("생두 구매가","1kg")}
      <input type="number" value={dbGb} onChange={e=>setDbGb(+e.target.value)} style={{...I(),marginBottom:10}}/>
      {lbl("로스팅 비용","1kg")}
      <input type="number" value={dbRo} onChange={e=>setDbRo(+e.target.value)} style={{...I(),marginBottom:10}}/>
      {lbl("로스율",`${dbYr}%`)}
      <input type="range" min={70} max={95} step={1} value={dbYr} onChange={e=>setDbYr(+e.target.value)} style={{width:"100%"}}/>
    </div>}
    <div style={C()}>
      <div style={ttl}>드립백 설정</div>
      {lbl("1개당 커피량","보통 10~12g")}
      <input type="number" value={dbCg} onChange={e=>setDbCg(+e.target.value)} style={{...I(),marginBottom:10}}/>
      {lbl("필터 (개당)")}
      <input type="number" value={dbFl} onChange={e=>setDbFl(+e.target.value)} style={{...I(),marginBottom:10}}/>
      {lbl("봉투 (개당)")}
      <input type="number" value={dbBg} onChange={e=>setDbBg(+e.target.value)} style={{...I(),marginBottom:10}}/>
      {lbl("박스 (박스당)")}
      <input type="number" value={dbBx} onChange={e=>setDbBx(+e.target.value)} style={{...I(),marginBottom:10}}/>
      {lbl("기타 포장재")}
      <input type="number" value={dbPk} onChange={e=>setDbPk(+e.target.value)} style={{...I(),marginBottom:10}}/>
      {lbl("배송비")}
      <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:8}} onClick={()=>setDbFs(v=>!v)}>
        <div style={tog(dbFs)}><div style={thb(dbFs)}/></div>
        <span style={{fontSize:13,color:T.tx2}}>{dbFs?"무료배송 — 판매가 포함":"고객 부담"}</span>
      </div>
      {dbFs&&<input type="number" value={dbSh} onChange={e=>setDbSh(+e.target.value)} style={I()}/>}
    </div>
    <div style={RB}>
      <div style={{fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase",marginBottom:4}}>드립백 권장 판매가</div>
      <div style={{fontSize:10,color:T.dim,marginBottom:16,fontFamily:"monospace"}}>{srcLabel} 기준</div>
      {[8,10].map(n=>{
        const needed=(dbCg*n)/(dbLinkedYr/100);
        const coffeeC=((dbLinkedGb+dbLinkedRo)/1000)*needed;
        const filterC=dbFl*n; const bagC=dbBg*n;
        const totalC=coffeeC+filterC+bagC+dbBx+dbPk+(dbFs?dbSh:0);
        const price=calc(totalC);
        const p2=price-price*fr-(vt?Math.round(price/11):0)-totalC;
        const m2=price>0?(p2/price)*100:0;
        return(
          <div key={n} style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${T.bdr}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:14,color:T.sub}}>드립백 <span style={{fontFamily:"monospace",fontSize:20,color:T.tx}}>{n}개입</span></span>
              <span style={{fontFamily:"'DM Serif Display',serif",fontSize:30,color:T.ac}}>{f(price)}<span style={{fontSize:14,marginLeft:2}}>원</span></span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
              {[["커피원가",f(coffeeC)],["필터+봉투",f(filterC+bagC)],["박스+배송",f(dbBx+dbPk+(dbFs?dbSh:0))]].map(([l,v])=>(
                <div key={l} style={{background:T.ip,borderRadius:8,padding:"6px 8px"}}><div style={{fontSize:9,color:T.dim}}>{l}</div><div style={{fontFamily:"monospace",fontSize:11,color:T.sub}}>{v}원</div></div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:11,color:T.dim}}>개당 {f(Math.round(price/n))}원</span>
              <span style={{fontSize:11,color:m2>=30?"#4ade80":m2>=20?"#fbbf24":"#f87171",fontFamily:"monospace"}}>이익률 {m2.toFixed(1)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  </>}

  <div style={{...C(),marginTop:16}}>
    <div style={ttl}>공통 설정</div>
    <div style={{fontSize:11,color:T.sub,marginBottom:8}}>네이버 수수료 구간</div>
    <div style={{display:"flex",gap:8,marginBottom:16}}>
      {TIERS.map((t,i)=><button key={i} onClick={()=>setTi(i)} style={{flex:1,padding:"9px 6px",borderRadius:8,border:`1px solid ${ti===i?T.ac:T.bdr}`,background:ti===i?T.ac:"transparent",color:ti===i?"#1a1008":T.sub,fontSize:11,cursor:"pointer",fontWeight:ti===i?600:400}}>{t.label}</button>)}
    </div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontFamily:"monospace",fontSize:18,color:T.ac}}>{mg}%</span><span style={{fontSize:11,color:T.dim}}>{mg>=40?"프리미엄":mg>=30?"적정 마진":mg>=20?"최소 권장":"⚠ 낮음"}</span></div>
    <input type="range" min={10} max={60} step={1} value={mg} onChange={e=>setMg(+e.target.value)} style={{width:"100%",marginBottom:14}}/>
    <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setVt(v=>!v)}>
      <div style={tog(vt)}><div style={thb(vt)}/></div>
      <span style={{fontSize:13,color:T.tx2}}>{vt?"부가세 10% 포함":"부가세 미적용 (간이과세자)"}</span>
    </div>
  </div>

  <div style={{...C(),marginTop:4}}>
    <div style={ttl}>생두 장부</div>
    <div style={{fontSize:11,color:T.sub,marginBottom:14}}>원두 탭 + 블렌딩 탭의 생두 정보를 CSV로 내보냅니다. 아이폰 파일 앱에 저장되며 Numbers·엑셀로 열 수 있어요.</div>
    <div style={{background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"12px",marginBottom:14}}>
      <div style={row2}><span style={{fontSize:11,color:T.dim}}>단품 원두</span><span style={{fontFamily:"monospace",fontSize:12,color:T.sub}}>{gb.toLocaleString()}원/kg</span></div>
      {beans.filter(b=>b.name).map((b,i)=>(
        <div key={i} style={row2}><span style={{fontSize:11,color:T.dim}}>{b.name}</span><span style={{fontFamily:"monospace",fontSize:12,color:T.sub}}>{b.price.toLocaleString()}원/kg · {b.ratio}%</span></div>
      ))}
    </div>
    <button onClick={exportCSV} style={{width:"100%",padding:"13px",borderRadius:10,border:`1px solid ${T.ac}`,background:"transparent",color:T.ac,fontSize:14,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>
      ⬇ CSV 내보내기
    </button>
    <div style={{fontSize:10,color:T.dim,marginTop:8,textAlign:"center"}}>앱을 닫아도 입력값이 자동 저장됩니다 ✓</div>
  </div>
</div>
);
}
