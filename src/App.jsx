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
