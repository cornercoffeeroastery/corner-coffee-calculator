import { useState, useEffect } from "react";

const DK={bg:"#1a1008",card:"#231608",bdr:"#3a2510",tx:"#f0e6d3",sub:"#7a6050",ac:"#c49a6c",ip:"#0f0905",tx2:"#b09070",dim:"#4a3020"};
const LT={bg:"#f5f0e8",card:"#ffffff",bdr:"#ddd0b8",tx:"#2a1a08",sub:"#8a7060",ac:"#9a6a30",ip:"#faf8f4",tx2:"#6a5040",dim:"#8a7060"};
const TIERS=[{label:"1억 미만",pay:3.74},{label:"1~10억",pay:2.97},{label:"10억+",pay:1.98}];
const CAT=2.0;const UNITS=[100,200,400,500,800,1000];
const f=n=>Math.round(n).toLocaleString("ko-KR");
const TABS=["원두","블렌딩","드립백","생두DB"];
const LS="cornerprice_v2";
const DEF=[{name:"Ethiopia",price:20000,ratio:40},{name:"Colombia",price:15000,ratio:30},{name:"Brazil",price:12000,ratio:30},{name:"",price:0,ratio:0},{name:"",price:0,ratio:0}];
const PROCESSES=["Natural","Washed","Honey","Anaerobic","Co-fermentation","기타"];
const ORIGINS=["Ethiopia","Colombia","Brazil","Guatemala","Costa Rica","Kenya","Yemen","Panama","Peru","기타"];
const EMPTY={name:"",origin:"Ethiopia",process:"Natural",notes:"",date:new Date().toISOString().slice(0,10),suppliers:[{name:"",price:0,current:true}]};

function load(k,d){try{const v=localStorage.getItem(LS);if(v){const p=JSON.parse(v);if(p[k]!==undefined)return p[k];}return d;}catch{return d;}}
function save(s){try{localStorage.setItem(LS,JSON.stringify(s));}catch{}}

export default function App(){
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
  const [beans,setBeans]=useState(()=>load("beans",DEF));
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
  const [beanDB,setBeanDB]=useState(()=>load("beanDB",[]));
  const [showForm,setShowForm]=useState(false);
  const [editIdx,setEditIdx]=useState(null);
  const [form,setForm]=useState(EMPTY);
  const [toast,setToast]=useState("");

  useEffect(()=>{save({dark,ti,mg,vt,gb,ro,yr,su,pk,sh,fs,beans,dbSrc,dbGb,dbRo,dbYr,dbCg,dbFl,dbBg,dbBx,dbPk,dbSh,dbFs,beanDB});},[dark,ti,mg,vt,gb,ro,yr,su,pk,sh,fs,beans,dbSrc,dbGb,dbRo,dbYr,dbCg,dbFl,dbBg,dbBx,dbPk,dbSh,dbFs,beanDB]);

  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2200);};

  const getBestPrice=b=>{const valid=b.suppliers.filter(s=>s.name&&s.price>0);return valid.length?Math.min(...valid.map(s=>s.price)):0;};
  const getCurrentPrice=b=>{const cur=b.suppliers.find(s=>s.current&&s.price>0);return cur?cur.price:getBestPrice(b);};

  const applyToCalc=b=>{setGb(getCurrentPrice(b));setTab(0);showToast(`${b.name} → 원두탭 적용 ✓`);};
  const applyPrice=(b,price)=>{setGb(price);setTab(0);showToast(`${f(price)}원/kg → 원두탭 적용 ✓`);};
  const applyToBlend=b=>{
    setBeans(prev=>{
      const empty=prev.findIndex(x=>!x.name);
      if(empty===-1){showToast("블렌딩 슬롯이 가득 찼어요");return prev;}
      const next=[...prev];next[empty]={...next[empty],name:b.name,price:getCurrentPrice(b)};
      showToast(`${b.name} → 블렌딩 추가 ✓`);return next;
    });setTab(1);
  };

  const saveBean=()=>{
    if(!form.name){showToast("생두명을 입력해주세요");return;}
    const validSup=form.suppliers.filter(s=>s.name||s.price>0);
    if(validSup.length===0){showToast("공급업체를 최소 1개 입력해주세요");return;}
    const cleaned={...form,suppliers:validSup};
    if(editIdx!==null){setBeanDB(prev=>prev.map((b,i)=>i===editIdx?cleaned:b));showToast("수정 완료 ✓");}
    else{setBeanDB(prev=>[cleaned,...prev]);showToast("저장 완료 ✓");}
    setShowForm(false);setEditIdx(null);setForm(EMPTY);
  };

  const addSupplier=()=>setForm(p=>({...p,suppliers:[...p.suppliers,{name:"",price:0,current:false}]}));
  const updateSupplier=(i,field,val)=>setForm(p=>({...p,suppliers:p.suppliers.map((s,idx)=>idx===i?{...s,[field]:field==="price"?Number(val):val}:s)}));
  const setCurrent=(i)=>setForm(p=>({...p,suppliers:p.suppliers.map((s,idx)=>({...s,current:idx===i}))}));
  const removeSupplier=(i)=>setForm(p=>({...p,suppliers:p.suppliers.filter((_,idx)=>idx!==i)}));
  const deleteBean=i=>{setBeanDB(prev=>prev.filter((_,idx)=>idx!==i));showToast("삭제됨");};

  const shareCSV=async(rows,fname,title)=>{
    const csv="\uFEFF"+rows.map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
    try{const file=new File([blob],fname,{type:"text/csv"});if(navigator.share&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title});return;}}catch{}
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=fname;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
  };

  const exportCSV=()=>{
    const rows=[["생두명","산지","가공방식","공급업체","가격(원/kg)","현재구매처","구매일","메모"]];
    beanDB.forEach(b=>b.suppliers.forEach(s=>rows.push([b.name,b.origin,b.process,s.name,s.price,s.current?"Y":"",b.date,b.notes])));
    shareCSV(rows,`cornerprice_생두DB_${new Date().toISOString().slice(0,10)}.csv`,"생두 DB");
  };

  const exportBeanCSV=()=>{
    const date=new Date().toISOString().slice(0,10);
    const rows=[["날짜","생두구매가(원/kg)","로스팅비(원/kg)","로스율(%)","판매단위","커피원가(원)","포장+배송(원)","수수료(원)","판매가(원)","이익(원)","이익률(%)"]];
    UNITS.forEach(u=>{
      const n=u/(yr/100);const gc2=(gb/1000)*n;const rc2=(ro/1000)*n;const cc2=gc2+rc2;
      const tc2=cc2+pk+(fs?sh:0);const price=calc(tc2);
      const fa2=price*fr;const va2=vt?Math.round(price/11):0;const pf2=price-fa2-va2-tc2;
      const rm2=price>0?((pf2/price)*100).toFixed(1):0;
      rows.push([date,gb,ro,yr,u>=1000?"1kg":`${u}g`,Math.round(cc2),pk+(fs?sh:0),Math.round(fa2),price,Math.round(pf2),rm2]);
    });
    shareCSV(rows,`cornerprice_원두_${date}.csv`,"원두 판매가");
  };

  const exportBlendCSV=()=>{
    const date=new Date().toISOString().slice(0,10);
    const rows=[["날짜","블렌딩단가(원/kg)","판매단위","커피원가(원)","포장+배송(원)","판매가(원)","이익률(%)"]];
    [200,500,1000].forEach(u=>{
      const cost=buc(u)+pk+(fs?sh:0);const price=calc(cost);
      const p2=price-price*fr-(vt?Math.round(price/11):0)-cost;
      const m2=price>0?((p2/price)*100).toFixed(1):0;
      rows.push([date,Math.round(bkc),u>=1000?"1kg":`${u}g`,Math.round(buc(u)),pk+(fs?sh:0),price,m2]);
    });
    shareCSV(rows,`cornerprice_블렌딩_${date}.csv`,"블렌딩 판매가");
  };

  const exportDripCSV=()=>{
    const date=new Date().toISOString().slice(0,10);
    const rows=[["날짜","개입수","커피원가(원)","필터+봉투(원)","박스+기타(원)","판매가(원)","개당가격(원)","이익률(%)"]];
    [8,10].forEach(n=>{
      const nd=(dbCg*n)/(dlyr/100);const cc2=((dlgb+dlro)/1000)*nd;
      const fc=dbFl*n;const bc=dbBg*n;const tc2=cc2+fc+bc+dbBx+dbPk+(dbFs?dbSh:0);
      const price=calc(tc2);const p2=price-price*fr-(vt?Math.round(price/11):0)-tc2;
      const m2=price>0?((p2/price)*100).toFixed(1):0;
      rows.push([date,`${n}개입`,Math.round(cc2),Math.round(fc+bc),Math.round(dbBx+dbPk+(dbFs?dbSh:0)),price,Math.round(price/n),m2]);
    });
    shareCSV(rows,`cornerprice_드립백_${date}.csv`,"드립백 판매가");
  };

  const fr=(CAT+TIERS[ti].pay)/100;const mr=mg/100;const vf=vt?10/11:1;const dv=vf-fr-mr;
  const calc=cost=>dv>0?Math.ceil((cost/dv)/100)*100:0;
  const gn=su/(yr/100);const gc=(gb/1000)*gn;const rc=(ro/1000)*gn;
  const cc=gc+rc;const tc=cc+pk+(fs?sh:0);const sp=calc(tc);
  const fa=sp*fr;const va=vt?Math.round(sp/11):0;const pf=sp-va-fa-tc;
  const rm=sp>0?(pf/sp)*100:0;const mc=rm>=30?"#4ade80":rm>=20?"#fbbf24":"#f87171";
  const tr=beans.reduce((s,b)=>s+b.ratio,0);
  const bkc=tr>0?beans.reduce((s,b)=>s+(b.price*(b.ratio/tr)),0):0;
  const buc=u=>{const n=u/(yr/100);return((bkc+ro)/1000)*n;};
  const dlgb=dbSrc===0?gb:dbSrc===1?bkc:dbGb;
  const dlro=dbSrc===0?ro:dbSrc===1?ro:dbRo;
  const dlyr=dbSrc===0?yr:dbSrc===1?yr:dbYr;

  const C=(ex={})=>({background:T.card,border:`1px solid ${T.bdr}`,borderRadius:16,padding:"20px 18px",marginBottom:12,maxWidth:560,marginLeft:"auto",marginRight:"auto",...ex});
  const I=(ex={})=>({width:"100%",background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:8,padding:"9px 12px",color:T.tx,fontSize:14,fontFamily:"monospace",outline:"none",boxSizing:"border-box",...ex});
  const tg=on=>({width:36,height:20,background:on?T.ac:"#3a2510",borderRadius:10,position:"relative",flexShrink:0,cursor:"pointer"});
  const tb=on=>({position:"absolute",width:14,height:14,background:"#1a1008",borderRadius:"50%",top:3,left:on?19:3,transition:"left 0.2s"});
  const r2={display:"flex",justifyContent:"space-between",padding:"3px 0"};
  const sp2=<div style={{height:1,background:T.bdr,margin:"8px 0"}}/>;
  const lb=(t,s="")=><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.sub,marginBottom:5}}><span>{t}</span>{s&&<span style={{color:T.ac,fontFamily:"monospace"}}>{s}</span>}</div>;
  const RB={background:dark?"linear-gradient(135deg,#2a1a08,#180e04)":"linear-gradient(135deg,#fff8ee,#fff3e0)",border:`1px solid ${T.ac}44`,borderRadius:16,padding:"24px 20px",maxWidth:560,margin:"0 auto"};
  const ttl={fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase",marginBottom:14};
  const yh=r=>r>=90?"라이트":r>=83?"미디엄":r>=77?"미디엄다크":"다크";
  const UB=on=>({flex:1,minWidth:"calc(33% - 6px)",padding:"9px 0",borderRadius:8,border:`1px solid ${on?T.ac:T.bdr}`,background:on?T.ac:"transparent",color:on?"#1a1008":T.sub,fontWeight:on?700:400,fontSize:13,cursor:"pointer"});
  const ub=(i,field,val)=>setBeans(prev=>prev.map((b,idx)=>idx===i?{...b,[field]:field==="name"?val:Number(val)}:b));
  const Sel=({val,opts,onChange})=><select value={val} onChange={e=>onChange(e.target.value)} style={{...I(),marginBottom:10}}>{opts.map(o=><option key={o}>{o}</option>)}</select>;

  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.tx,fontFamily:"sans-serif",padding:"28px 16px 60px",transition:"background 0.3s"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@1&display=swap" rel="stylesheet"/>

      {toast&&<div style={{position:"fixed",top:24,left:"50%",transform:"translateX(-50%)",background:T.ac,color:"#1a1008",padding:"10px 20px",borderRadius:20,fontSize:13,fontWeight:600,zIndex:999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>{toast}</div>}

      <div style={{maxWidth:560,margin:"0 auto 20px",display:"flex",justifyContent:"flex-end",alignItems:"center",gap:8}}>
        <span>☀️</span><div style={tg(dark)} onClick={()=>setDark(v=>!v)}><div style={tb(dark)}/></div><span>🌙</span>
      </div>

      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:10,letterSpacing:3,color:T.ac,textTransform:"uppercase",marginBottom:8}}>Corner Coffee Gongbang</div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:32,color:T.tx,lineHeight:1.2}}>스마트스토어<br/><em style={{color:T.ac}}>판매가 계산기</em></div>
        <div style={{fontSize:11,color:T.sub,marginTop:6}}>수수료 · 로스율 · 부가세 반영</div>
      </div>

      <div style={{display:"flex",gap:6,maxWidth:560,margin:"0 auto 16px",flexWrap:"wrap"}}>
        {TABS.map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{flex:1,minWidth:"calc(25% - 6px)",padding:"9px 0",borderRadius:10,border:`1px solid ${tab===i?T.ac:T.bdr}`,background:tab===i?T.ac:"transparent",color:tab===i?"#1a1008":T.sub,fontSize:12,fontWeight:tab===i?700:400,cursor:"pointer"}}>{t}</button>)}
      </div>

      {tab===0&&<>
        <div style={C()}><div style={ttl}>판매 단위</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{UNITS.map(u=><button key={u} onClick={()=>setSu(u)} style={UB(su===u)}>{u>=1000?"1kg":`${u}g`}</button>)}</div>
        </div>
        <div style={C()}><div style={ttl}>원가 구성</div>
          <div style={{background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"12px",marginBottom:14,display:"flex",justifyContent:"space-around",alignItems:"center"}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:18,color:T.ac,fontFamily:"monospace"}}>{Math.round(gn)}g</div><div style={{fontSize:10,color:T.dim}}>생두</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:11,color:T.ac}}>→{yr}%→</div><div style={{fontSize:9,color:T.dim}}>{yh(yr)}</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:18,color:T.ac,fontFamily:"monospace"}}>{su>=1000?"1kg":`${su}g`}</div><div style={{fontSize:10,color:T.dim}}>원두</div></div>
          </div>
          {lb("로스율",`${yr}% — 1kg→${yr*10}g`)}
          <input type="range" min={70} max={95} step={1} value={yr} onChange={e=>setYr(+e.target.value)} style={{width:"100%",marginBottom:14}}/>
          {lb("생두 구매가","1kg 기준")}<input type="number" value={gb} onChange={e=>setGb(+e.target.value)} style={{...I(),marginBottom:10}}/>
          {lb("로스팅 비용","생두 1kg 기준")}<input type="number" value={ro} onChange={e=>setRo(+e.target.value)} style={{...I(),marginBottom:10}}/>
          <div style={{background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"12px",marginBottom:14}}>
            <div style={r2}><span style={{fontSize:11,color:T.dim}}>생두 {Math.round(gn)}g 원가</span><span style={{fontFamily:"monospace",fontSize:12,color:T.sub}}>{f(gc)}원</span></div>
            <div style={r2}><span style={{fontSize:11,color:T.dim}}>로스팅비</span><span style={{fontFamily:"monospace",fontSize:12,color:T.sub}}>{f(rc)}원</span></div>
            {sp2}<div style={r2}><span style={{fontSize:12,color:T.tx2}}>커피 원가</span><span style={{fontFamily:"monospace",fontSize:14,color:T.ac}}>{f(cc)}원</span></div>
          </div>
          {lb("포장재비")}<input type="number" value={pk} onChange={e=>setPk(+e.target.value)} style={{...I(),marginBottom:10}}/>
          {lb("배송비")}
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:8}} onClick={()=>setFs(v=>!v)}>
            <div style={tg(fs)}><div style={tb(fs)}/></div>
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
        <button onClick={exportBeanCSV} style={{display:"block",width:"100%",maxWidth:560,margin:"12px auto 0",padding:"11px",borderRadius:10,border:`1px solid ${T.ac}`,background:"transparent",color:T.ac,fontSize:13,cursor:"pointer"}}>⬇ 원두 판매가 CSV</button>
      </>}

      {tab===1&&<>
        <div style={C()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase"}}>생두 블렌딩 구성</span>
            <button onClick={()=>{setBeans([{name:"",price:0,ratio:0},{name:"",price:0,ratio:0},{name:"",price:0,ratio:0},{name:"",price:0,ratio:0},{name:"",price:0,ratio:0}]);showToast("블렌딩 초기화 ✓");}} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #f87171",background:"transparent",color:"#f87171",fontSize:12,cursor:"pointer"}}>초기화</button>
          </div>
          <div style={{fontSize:11,color:T.sub,marginBottom:12}}>비율 합계: <span style={{color:tr===100?T.ac:"#f87171",fontFamily:"monospace",fontWeight:700}}>{tr}%</span>{tr!==100&&<span style={{color:"#f87171"}}> ← 100%여야 합니다</span>}</div>
          {beans.map((b,i)=>(
            <div key={i} style={{background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"12px",marginBottom:10}}>
              <div style={{fontSize:10,color:T.ac,marginBottom:8,fontFamily:"monospace"}}>원두 {i+1}</div>
              <input placeholder="이름 (예: Ethiopia Natural)" value={b.name} onChange={e=>ub(i,"name",e.target.value)} style={{...I(),marginBottom:8}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div><div style={{fontSize:10,color:T.dim,marginBottom:4}}>구매가 (원/kg)</div><input type="number" value={b.price} onChange={e=>ub(i,"price",e.target.value)} style={I()}/></div>
                <div><div style={{fontSize:10,color:T.dim,marginBottom:4}}>비율 (%)</div><input type="number" value={b.ratio} onChange={e=>ub(i,"ratio",e.target.value)} style={I()}/></div>
              </div>
            </div>
          ))}
        </div>
        <div style={C()}><div style={ttl}>로스팅 설정</div>
          {lb("로스팅 비용","생두 1kg 기준")}<input type="number" value={ro} onChange={e=>setRo(+e.target.value)} style={{...I(),marginBottom:12}}/>
          {lb("로스율",`${yr}% — 1kg→${yr*10}g`)}
          <input type="range" min={70} max={95} step={1} value={yr} onChange={e=>setYr(+e.target.value)} style={{width:"100%"}}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:10,color:T.dim}}>70% 다크</span><span style={{fontSize:10,color:T.dim}}>95% 라이트</span></div>
        </div>
        <div style={RB}>
          <div style={{fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase",marginBottom:4}}>블렌딩 단가</div>
          <div style={{fontFamily:"monospace",fontSize:22,color:T.tx,marginBottom:4}}>{f(bkc)}<span style={{fontSize:13,color:T.ac,marginLeft:4}}>원/kg</span></div>
          <div style={{fontFamily:"monospace",fontSize:10,color:T.dim,marginBottom:14}}>생두 가중평균 단가</div>
          {sp2}
          <div style={{fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase",margin:"14px 0 10px"}}>단위별 판매가</div>
          {tr===100?[200,500,1000].map(u=>{
            const cost=buc(u)+pk+(fs?sh:0);const price=calc(cost);
            const p2=price-price*fr-(vt?Math.round(price/11):0)-cost;const m2=price>0?(p2/price)*100:0;
            return <div key={u} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.bdr}`}}>
              <span style={{fontSize:14,color:T.sub}}>{u>=1000?"1kg":`${u}g`}</span>
              <div style={{textAlign:"right"}}><div style={{fontFamily:"monospace",fontSize:18,color:T.ac}}>{f(price)}원</div><div style={{fontSize:10,color:m2>=30?"#4ade80":m2>=20?"#fbbf24":"#f87171",fontFamily:"monospace"}}>이익률 {m2.toFixed(1)}%</div></div>
            </div>
          }):<div style={{color:"#f87171",fontSize:12}}>비율 합계를 100%로 맞춰주세요</div>}
        </div>
        {tr===100&&<button onClick={exportBlendCSV} style={{display:"block",width:"100%",maxWidth:560,margin:"12px auto 0",padding:"11px",borderRadius:10,border:`1px solid ${T.ac}`,background:"transparent",color:T.ac,fontSize:13,cursor:"pointer"}}>⬇ 블렌딩 판매가 CSV</button>}
      </>}

      {tab===2&&<>
        <div style={C()}><div style={ttl}>원두 원가 소스</div>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {["원두 탭","블렌딩 탭","직접 입력"].map((l,i)=>(
              <button key={i} onClick={()=>setDbSrc(i)} style={{flex:1,padding:"10px 6px",borderRadius:10,border:`1px solid ${dbSrc===i?T.ac:T.bdr}`,background:dbSrc===i?T.ac:"transparent",color:dbSrc===i?"#1a1008":T.sub,fontSize:11,cursor:"pointer",fontWeight:dbSrc===i?600:400}}>{l}</button>
            ))}
          </div>
          <div style={{background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"12px"}}>
            <div style={r2}><span style={{fontSize:11,color:T.dim}}>생두 단가</span><span style={{fontFamily:"monospace",color:T.ac}}>{f(dlgb)}원/kg</span></div>
            <div style={r2}><span style={{fontSize:11,color:T.dim}}>로스팅비</span><span style={{fontFamily:"monospace",color:T.sub}}>{f(dlro)}원/kg</span></div>
            <div style={r2}><span style={{fontSize:11,color:T.dim}}>로스율</span><span style={{fontFamily:"monospace",color:T.sub}}>{dlyr}%</span></div>
          </div>
        </div>
        {dbSrc===2&&<div style={C()}><div style={ttl}>직접 입력</div>
          {lb("생두 구매가","1kg")}<input type="number" value={dbGb} onChange={e=>setDbGb(+e.target.value)} style={{...I(),marginBottom:10}}/>
          {lb("로스팅 비용","1kg")}<input type="number" value={dbRo} onChange={e=>setDbRo(+e.target.value)} style={{...I(),marginBottom:10}}/>
          {lb("로스율",`${dbYr}%`)}<input type="range" min={70} max={95} step={1} value={dbYr} onChange={e=>setDbYr(+e.target.value)} style={{width:"100%"}}/>
        </div>}
        <div style={C()}><div style={ttl}>드립백 설정</div>
          {lb("1개당 커피량","보통 10~12g")}<input type="number" value={dbCg} onChange={e=>setDbCg(+e.target.value)} style={{...I(),marginBottom:10}}/>
          {lb("필터 단가 (개당)")}<input type="number" value={dbFl} onChange={e=>setDbFl(+e.target.value)} style={{...I(),marginBottom:10}}/>
          {lb("봉투 단가 (개당)")}<input type="number" value={dbBg} onChange={e=>setDbBg(+e.target.value)} style={{...I(),marginBottom:10}}/>
          {lb("박스 (박스당)")}<input type="number" value={dbBx} onChange={e=>setDbBx(+e.target.value)} style={{...I(),marginBottom:10}}/>
          {lb("기타 포장재")}<input type="number" value={dbPk} onChange={e=>setDbPk(+e.target.value)} style={{...I(),marginBottom:10}}/>
          {lb("배송비")}
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:8}} onClick={()=>setDbFs(v=>!v)}>
            <div style={tg(dbFs)}><div style={tb(dbFs)}/></div>
            <span style={{fontSize:13,color:T.tx2}}>{dbFs?"무료배송 — 판매가 포함":"고객 부담"}</span>
          </div>
          {dbFs&&<input type="number" value={dbSh} onChange={e=>setDbSh(+e.target.value)} style={I()}/>}
        </div>
        <div style={RB}>
          <div style={{fontSize:10,letterSpacing:2,color:T.ac,textTransform:"uppercase",marginBottom:16}}>드립백 권장 판매가</div>
          {[8,10].map(n=>{
            const nd=(dbCg*n)/(dlyr/100);const cc2=((dlgb+dlro)/1000)*nd;
            const fc=dbFl*n;const bc=dbBg*n;const tc2=cc2+fc+bc+dbBx+dbPk+(dbFs?dbSh:0);
            const price=calc(tc2);const p2=price-price*fr-(vt?Math.round(price/11):0)-tc2;const m2=price>0?(p2/price)*100:0;
            return(<div key={n} style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${T.bdr}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:14,color:T.sub}}>드립백 <span style={{fontFamily:"monospace",fontSize:20,color:T.tx}}>{n}개입</span></span>
                <span style={{fontFamily:"'DM Serif Display',serif",fontSize:30,color:T.ac}}>{f(price)}<span style={{fontSize:14,marginLeft:2}}>원</span></span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
                {[["커피원가",f(cc2)],["필터+봉투",f(fc+bc)],["박스+기타",f(dbBx+dbPk+(dbFs?dbSh:0))]].map(([l,v])=>(
                  <div key={l} style={{background:T.ip,borderRadius:8,padding:"6px 8px"}}><div style={{fontSize:9,color:T.dim}}>{l}</div><div style={{fontFamily:"monospace",fontSize:11,color:T.sub}}>{v}원</div></div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:T.dim}}>개당 {f(Math.round(price/n))}원</span>
                <span style={{fontSize:11,color:m2>=30?"#4ade80":m2>=20?"#fbbf24":"#f87171",fontFamily:"monospace"}}>이익률 {m2.toFixed(1)}%</span>
              </div>
            </div>);
          })}
        </div>
        <button onClick={exportDripCSV} style={{display:"block",width:"100%",maxWidth:560,margin:"12px auto 0",padding:"11px",borderRadius:10,border:`1px solid ${T.ac}`,background:"transparent",color:T.ac,fontSize:13,cursor:"pointer"}}>⬇ 드립백 판매가 CSV</button>
      </>}

      {tab===3&&<>
        <div style={C()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={ttl}>생두 DB</div>
            <button onClick={()=>{setForm(EMPTY);setEditIdx(null);setShowForm(true);}} style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${T.ac}`,background:T.ac,color:"#1a1008",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ 추가</button>
          </div>
          {beanDB.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:T.dim,fontSize:13}}>저장된 생두가 없어요<br/>+ 추가 버튼으로 등록해보세요</div>}
          {beanDB.map((b,i)=>{
            const validSup=b.suppliers.filter(s=>s.name&&s.price>0);
            const minPrice=validSup.length?Math.min(...validSup.map(s=>s.price)):0;
            const curSup=b.suppliers.find(s=>s.current&&s.price>0);
            const saving=curSup&&curSup.price>minPrice?curSup.price-minPrice:0;
            return(
              <div key={i} style={{background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:12,padding:"16px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontSize:15,color:T.tx,fontWeight:600,marginBottom:2}}>{b.name}</div>
                    <div style={{fontSize:11,color:T.sub}}>{b.origin} · {b.process}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"monospace",fontSize:16,color:T.ac}}>{f(minPrice>0?minPrice:getCurrentPrice(b))}원</div>
                    <div style={{fontSize:9,color:T.dim}}>{minPrice>0?"최저가":"/kg"}</div>
                  </div>
                </div>

                {/* 공급업체 가격 비교 */}
                <div style={{background:T.card,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"10px",marginBottom:10}}>
                  <div style={{fontSize:9,letterSpacing:1,color:T.dim,textTransform:"uppercase",marginBottom:8}}>공급업체 가격 비교</div>
                  {validSup.sort((a,z)=>a.price-z.price).map((s,si)=>{
                    const isMin=s.price===minPrice;const isCur=s.current;
                    return(
                      <div key={si} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:si<validSup.length-1?`1px solid ${T.bdr}`:"none"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          {isMin&&<span style={{fontSize:9,background:"#4ade8022",color:"#4ade80",padding:"1px 6px",borderRadius:4}}>최저</span>}
                          {isCur&&<span style={{fontSize:9,background:`${T.ac}22`,color:T.ac,padding:"1px 6px",borderRadius:4}}>현재</span>}
                          <span style={{fontSize:12,color:T.tx}}>{s.name}</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontFamily:"monospace",fontSize:13,color:isMin?"#4ade80":T.sub}}>{f(s.price)}원</span>
                          <button onClick={()=>applyPrice(b,s.price)} style={{padding:"3px 8px",borderRadius:6,border:`1px solid ${T.ac}`,background:"transparent",color:T.ac,fontSize:10,cursor:"pointer"}}>적용</button>
                        </div>
                      </div>
                    );
                  })}
                  {saving>0&&<div style={{marginTop:8,padding:"6px 8px",background:"#4ade8015",borderRadius:8,fontSize:11,color:"#4ade80"}}>💡 최저가로 바꾸면 kg당 {f(saving)}원 절약 가능</div>}
                </div>

                {b.notes&&<div style={{fontSize:11,color:T.dim,marginBottom:8,fontStyle:"italic"}}>"{b.notes}"</div>}
                <div style={{fontSize:10,color:T.dim,marginBottom:10}}>{b.date}</div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>applyToCalc(b)} style={{flex:1,padding:"8px 0",borderRadius:8,border:`1px solid ${T.ac}`,background:T.ac,color:"#1a1008",fontSize:11,fontWeight:600,cursor:"pointer"}}>☕ 원두탭</button>
                  <button onClick={()=>applyToBlend(b)} style={{flex:1,padding:"8px 0",borderRadius:8,border:`1px solid ${T.bdr}`,background:"transparent",color:T.sub,fontSize:11,cursor:"pointer"}}>＋ 블렌딩</button>
                  <button onClick={()=>{setForm({...b,suppliers:b.suppliers.length?b.suppliers:[{name:"",price:0,current:true}]});setEditIdx(i);setShowForm(true);}} style={{padding:"8px 10px",borderRadius:8,border:`1px solid ${T.bdr}`,background:"transparent",color:T.sub,fontSize:11,cursor:"pointer"}}>✏️</button>
                  <button onClick={()=>deleteBean(i)} style={{padding:"8px 10px",borderRadius:8,border:"1px solid #f87171",background:"transparent",color:"#f87171",fontSize:11,cursor:"pointer"}}>🗑</button>
                </div>
              </div>
            );
          })}
          {beanDB.length>0&&<button onClick={exportCSV} style={{width:"100%",padding:"12px",borderRadius:10,border:`1px solid ${T.ac}`,background:"transparent",color:T.ac,fontSize:13,cursor:"pointer",marginTop:4}}>⬇ CSV 내보내기</button>}
        </div>

        {showForm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:100,display:"flex",alignItems:"flex-end"}}>
          <div style={{width:"100%",maxHeight:"90vh",overflowY:"auto",background:T.card,borderRadius:"20px 20px 0 0",padding:"24px 20px 40px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:700,color:T.tx}}>{editIdx!==null?"생두 수정":"새 생두 등록"}</div>
              <button onClick={()=>setShowForm(false)} style={{background:"transparent",border:"none",color:T.sub,fontSize:22,cursor:"pointer"}}>✕</button>
            </div>
            {lb("생두명 *")}
            <input placeholder="예: Ethiopia Yirgacheffe Natural" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={{...I(),marginBottom:10}}/>
            {lb("산지")}<Sel val={form.origin} opts={ORIGINS} onChange={v=>setForm(p=>({...p,origin:v}))}/>
            {lb("가공방식")}<Sel val={form.process} opts={PROCESSES} onChange={v=>setForm(p=>({...p,process:v}))}/>

            <div style={{fontSize:10,letterSpacing:1,color:T.ac,textTransform:"uppercase",marginBottom:10,marginTop:4}}>공급업체 가격 비교</div>
            {form.suppliers.map((s,i)=>(
              <div key={i} style={{background:T.ip,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"10px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={()=>setCurrent(i)}>
                    <div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${s.current?T.ac:T.bdr}`,background:s.current?T.ac:"transparent"}}/>
                    <span style={{fontSize:10,color:s.current?T.ac:T.sub}}>현재 구매처</span>
                  </div>
                  {form.suppliers.length>1&&<button onClick={()=>removeSupplier(i)} style={{background:"transparent",border:"none",color:"#f87171",cursor:"pointer",fontSize:14}}>✕</button>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <input placeholder="업체명" value={s.name} onChange={e=>updateSupplier(i,"name",e.target.value)} style={I()}/>
                  <input type="number" placeholder="가격 (원/kg)" value={s.price||""} onChange={e=>updateSupplier(i,"price",e.target.value)} style={I()}/>
                </div>
              </div>
            ))}
            <button onClick={addSupplier} style={{width:"100%",padding:"9px",borderRadius:8,border:`1px dashed ${T.bdr}`,background:"transparent",color:T.sub,fontSize:12,cursor:"pointer",marginBottom:14}}>+ 업체 추가</button>

            {lb("구매일")}
            <input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={{...I(),marginBottom:10}}/>
            {lb("메모 (향미 노트, 고도 등)")}
            <input placeholder="Blueberry, Jasmine / 1900m" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={{...I(),marginBottom:20}}/>
            <button onClick={saveBean} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:T.ac,color:"#1a1008",fontSize:15,fontWeight:700,cursor:"pointer"}}>{editIdx!==null?"수정 완료":"저장"}</button>
          </div>
        </div>}
      </>}

      {tab!==3&&<div style={{...C(),marginTop:16}}>
        <div style={ttl}>공통 설정</div>
        <div style={{fontSize:11,color:T.sub,marginBottom:8}}>네이버 수수료 구간</div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {TIERS.map((t,i)=><button key={i} onClick={()=>setTi(i)} style={{flex:1,padding:"9px 6px",borderRadius:8,border:`1px solid ${ti===i?T.ac:T.bdr}`,background:ti===i?T.ac:"transparent",color:ti===i?"#1a1008":T.sub,fontSize:11,cursor:"pointer",fontWeight:ti===i?600:400}}>{t.label}</button>)}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontFamily:"monospace",fontSize:18,color:T.ac}}>{mg}%</span><span style={{fontSize:11,color:T.dim}}>{mg>=40?"프리미엄":mg>=30?"적정 마진":mg>=20?"최소 권장":"⚠ 낮음"}</span></div>
        <input type="range" min={10} max={60} step={1} value={mg} onChange={e=>setMg(+e.target.value)} style={{width:"100%",marginBottom:14}}/>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setVt(v=>!v)}>
          <div style={tg(vt)}><div style={tb(vt)}/></div>
          <span style={{fontSize:13,color:T.tx2}}>{vt?"부가세 10% 포함":"부가세 미적용 (간이과세자)"}</span>
        </div>
      </div>}
    </div>
  );
}
