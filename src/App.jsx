import { useState } from "react";

const T = [
  { label: "연매출 1억 미만", pay: 3.74 },
  { label: "연매출 1~10억", pay: 2.97 },
  { label: "연매출 10억 이상", pay: 1.98 },
];
const UNITS = [100, 200, 400, 500, 800];
const CAT = 2.0;
const f = n => Math.round(n).toLocaleString("ko-KR");

export default function App() {
  const [gb, setGb] = useState(15000);
  const [ro, setRo] = useState(3000);
  const [yr, setYr] = useState(80);
  const [su, setSu] = useState(100);
  const [pk, setPk] = useState(800);
  const [sh, setSh] = useState(3000);
  const [fs, setFs] = useState(true);
  const [mg, setMg] = useState(35);
  const [ti, setTi] = useState(0);
  const [vt, setVt] = useState(false);

  const gn = su / (yr / 100);
  const gc = (gb / 1000) * gn;
  const rc = (ro / 1000) * gn;
  const cc = gc + rc;
  const tc = cc + pk + (fs ? sh : 0);
  const fr = (CAT + T[ti].pay) / 100;
  const mr = mg / 100;
  const vf = vt ? 10 / 11 : 1;
  const dv = vf - fr - mr;
  const rp = dv > 0 ? tc / dv : 0;
  const sp = Math.ceil(rp / 100) * 100;
  const va = vt ? Math.round(sp / 11) : 0;
  const fa = sp * fr;
  const pf = sp - va - fa - tc;
  const rm = sp > 0 ? (pf / sp) * 100 : 0;
  const mc = rm >= 30 ? "#4ade80" : rm >= 20 ? "#fbbf24" : "#f87171";
  const yh = yr >= 90 ? "라이트" : yr >= 83 ? "미디엄" : yr >= 77 ? "미디엄다크" : "다크";

  const s = (obj) => Object.entries(obj).reduce((a,[k,v])=>(a[k]=v,a),{});
  const card = s({background:"#231608",border:"1px solid #3a2510",borderRadius:16,padding:"20px 18px",marginBottom:12,maxWidth:560,marginLeft:"auto",marginRight:"auto"});
  const lbl = s({fontSize:11,color:"#7a6050",marginBottom:6,display:"flex",justifyContent:"space-between"});
  const inp = s({width:"100%",background:"#0f0905",border:"1px solid #3a2510",borderRadius:8,padding:"10px 14px",color:"#f0e6d3",fontSize:15,fontFamily:"monospace",outline:"none",marginBottom:10});
  const row = s({display:"flex",gap:8,flexWrap:"wrap",marginBottom:10});
  const chip = (on) => s({flex:1,minWidth:"calc(33% - 6px)",padding:"9px 0",borderRadius:8,border:`1px solid ${on?"#c49a6c":"#3a2510"}`,background:on?"#c49a6c":"#0f0905",color:on?"#1a1008":"#5a4030",fontWeight:on?700:400,fontSize:13,cursor:"pointer"});
  const tog = (on) => s({width:36,height:20,background:on?"#c49a6c":"#3a2510",borderRadius:10,position:"relative",flexShrink:0,transition:"background 0.2s"});

  return (
    <div style={{minHeight:"100vh",background:"#1a1008",color:"#f0e6d3",fontFamily:"sans-serif",padding:"36px 16px 60px"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@1&display=swap" rel="stylesheet"/>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontSize:10,letterSpacing:3,color:"#c49a6c",textTransform:"uppercase",marginBottom:8}}>Corner Coffee Gongbang</div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:36,color:"#f5e6cc",lineHeight:1.2}}>스마트스토어<br/><em style={{color:"#c49a6c"}}>판매가 계산기</em></div>
        <div style={{fontSize:11,color:"#6a5840",marginTop:6}}>수수료 · 로스율 · 부가세 반영</div>
      </div>

      <div style={card}>
        <div style={{fontSize:10,letterSpacing:2,color:"#c49a6c",textTransform:"uppercase",marginBottom:14}}>판매 단위</div>
        <div style={row}>{UNITS.map(u=><button key={u} style={chip(su===u)} onClick={()=>setSu(u)}>{u}g</button>)}</div>
      </div>

      <div style={card}>
        <div style={{fontSize:10,letterSpacing:2,color:"#c49a6c",textTransform:"uppercase",marginBottom:14}}>원가 구성</div>
        <div style={{background:"#0f0905",border:"1px solid #2a1a08",borderRadius:10,padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-around"}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:18,color:"#c49a6c",fontFamily:"monospace"}}>{Math.round(gn)}g</div><div style={{fontSize:10,color:"#4a3020"}}>생두 투입</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:11,color:"#c49a6c",fontFamily:"monospace"}}>→ {yr}% →</div><div style={{fontSize:9,color:"#3a2510"}}>{yh}</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:18,color:"#c49a6c",fontFamily:"monospace"}}>{su}g</div><div style={{fontSize:10,color:"#4a3020"}}>원두 완성</div></div>
        </div>
        <div style={lbl}><span>로스율</span><span style={{color:"#c49a6c",fontFamily:"monospace"}}>{yr}% — 1kg→{Math.round(yr*10)}g</span></div>
        <input type="range" min={70} max={95} step={1} value={yr} onChange={e=>setYr(+e.target.value)} style={{width:"100%",marginBottom:14}}/>
        <div style={lbl}><span>생두 구매가</span><span>1kg 기준</span></div>
        <input type="number" value={gb} onChange={e=>setGb(+e.target.value)} style={inp} placeholder="15000"/>
        <div style={lbl}><span>로스팅 비용</span><span>생두 1kg 기준</span></div>
        <input type="number" value={ro} onChange={e=>setRo(+e.target.value)} style={inp} placeholder="3000"/>
        <div style={{background:"#0f0905",border:"1px solid #2a1a08",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span style={{fontSize:11,color:"#5a4030"}}>생두 {Math.round(gn)}g 원가</span><span style={{fontFamily:"monospace",fontSize:12,color:"#7a6050"}}>{f(gc)}원</span></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span style={{fontSize:11,color:"#5a4030"}}>로스팅비</span><span style={{fontFamily:"monospace",fontSize:12,color:"#7a6050"}}>{f(rc)}원</span></div>
          <div style={{height:1,background:"#2a1a08",margin:"8px 0"}}/>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#9a7850"}}>커피 원가</span><span style={{fontFamily:"monospace",fontSize:14,color:"#c49a6c"}}>{f(cc)}원</span></div>
        </div>
        <div style={lbl}><span>포장재비</span></div>
        <input type="number" value={pk} onChange={e=>setPk(+e.target.value)} style={inp}/>
        <div style={lbl}><span>배송비</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:10}} onClick={()=>setFs(v=>!v)}>
          <div style={tog(fs)}><div style={{position:"absolute",width:14,height:14,background:"#1a1008",borderRadius:"50%",top:3,left:fs?19:3,transition:"left 0.2s"}}/></div>
          <span style={{fontSize:13,color:"#b09070"}}>{fs?"무료배송 — 판매가에 포함":"고객 부담 — 판매가 제외"}</span>
        </div>
        {fs && <input type="number" value={sh} onChange={e=>setSh(+e.target.value)} style={inp}/>}
      </div>

      <div style={card}>
        <div style={{fontSize:10,letterSpacing:2,color:"#c49a6c",textTransform:"uppercase",marginBottom:14}}>네이버 수수료</div>
        <div style={row}>{T.map((t,i)=><button key={i} style={chip(ti===i)} onClick={()=>setTi(i)}>{t.label}</button>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div style={{background:"#0f0905",border:"1px solid #2a1a08",borderRadius:8,padding:"12px 14px"}}><div style={{fontSize:11,color:"#5a4030",marginBottom:4}}>카테고리 수수료</div><div style={{fontFamily:"monospace",fontSize:15,color:"#c49a6c"}}>{CAT.toFixed(2)}%</div></div>
          <div style={{background:"#0f0905",border:"1px solid #2a1a08",borderRadius:8,padding:"12px 14px"}}><div style={{fontSize:11,color:"#5a4030",marginBottom:4}}>네이버페이 수수료</div><div style={{fontFamily:"monospace",fontSize:15,color:"#c49a6c"}}>{T[ti].pay.toFixed(2)}%</div></div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid #3a2510",paddingTop:12}}><span style={{fontSize:13,color:"#b09070"}}>합산 수수료율</span><span style={{fontFamily:"monospace",fontSize:17,color:"#e8b87a"}}>{(CAT+T[ti].pay).toFixed(2)}%</span></div>
      </div>

      <div style={card}>
        <div style={{fontSize:10,letterSpacing:2,color:"#c49a6c",textTransform:"uppercase",marginBottom:14}}>부가세</div>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setVt(v=>!v)}>
          <div style={tog(vt)}><div style={{position:"absolute",width:14,height:14,background:"#1a1008",borderRadius:"50%",top:3,left:vt?19:3,transition:"left 0.2s"}}/></div>
          <span style={{fontSize:13,color:"#b09070"}}>{vt?"부가세 10% 포함":"부가세 미적용 (간이과세자)"}</span>
        </div>
        {vt && <div style={{background:"#1a2a10",border:"1px solid #2a4a18",borderRadius:10,padding:"12px 14px",marginTop:12,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#6a9050"}}>납부 세액 (1/11)</span><span style={{fontFamily:"monospace",color:"#90c870"}}>{f(va)}원</span></div>}
      </div>

      <div style={card}>
        <div style={{fontSize:10,letterSpacing:2,color:"#c49a6c",textTransform:"uppercase",marginBottom:14}}>목표 이익률</div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontFamily:"monospace",fontSize:20,color:"#c49a6c"}}>{mg}%</span><span style={{fontSize:11,color:"#4a3020"}}>{mg>=40?"프리미엄 스페셜티":mg>=30?"적정 마진":mg>=20?"최소 권장":"⚠ 낮음"}</span></div>
        <input type="range" min={10} max={60} step={1} value={mg} onChange={e=>setMg(+e.target.value)} style={{width:"100%"}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:10,color:"#3a2510",fontFamily:"monospace"}}>10%</span><span style={{fontSize:10,color:"#3a2510",fontFamily:"monospace"}}>60%</span></div>
      </div>

      <div style={{height:1,background:"#2a1a08",maxWidth:560,margin:"4px auto 18px"}}/>

      <div style={{background:"linear-gradient(135deg,#2a1a08,#180e04)",border:"1px solid #c49a6c44",borderRadius:16,padding:"28px 22px",maxWidth:560,margin:"0 auto 14px",position:"relative"}}>
        <div style={{position:"absolute",right:20,top:16,fontSize:44,opacity:0.07}}>☕</div>
        <div style={{fontSize:10,letterSpacing:2,color:"#c49a6c",textTransform:"uppercase",marginBottom:6}}>권장 판매가 ({su}g · 100원 올림)</div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:48,color:"#f5e6cc",lineHeight:1}}>{dv>0?f(sp):"—"}<span style={{fontSize:22,color:"#c49a6c",marginLeft:4}}>원</span></div>
        <div style={{fontFamily:"monospace",fontSize:10,color:"#4a3020",margin:"6px 0 22px"}}>정확값 {dv>0?f(Math.round(rp)):"—"}원 → 100원 올림{vt?" · 부가세 포함":""}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[["커피 원가",f(cc)+"원"],["포장+배송",f(pk+(fs?sh:0))+"원"],["수수료",f(fa)+"원"],vt?["부가세",f(va)+"원"]:null,["실제 이익",f(pf)+"원",mc],["실제 이익률",rm.toFixed(1)+"%",mc]].filter(Boolean).map(([l,v,c])=>(
            <div key={l}><div style={{fontSize:11,color:"#4a3020"}}>{l}</div><div style={{fontFamily:"monospace",fontSize:c?15:13,color:c||"#7a6050"}}>{v}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

