import { useState } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Noto+Sans+KR:wght@300;400;500;600&display=swap');`;

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #1a1008; }
  .app {
    min-height: 100vh; background: #1a1008; color: #f0e6d3;
    font-family: 'Noto Sans KR', sans-serif; padding: 40px 20px 60px;
  }
  .hd { text-align: center; margin-bottom: 44px; }
  .hd-eye {
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 3px;
    color: #c49a6c; text-transform: uppercase; margin-bottom: 10px;
  }
  .hd-title {
    font-family: 'DM Serif Display', serif; font-size: clamp(26px,6vw,42px);
    color: #f5e6cc; line-height: 1.15; margin-bottom: 8px;
  }
  .hd-title em { font-style: italic; color: #c49a6c; }
  .hd-sub { font-size: 12px; color: #6a5840; }
  .card {
    background: #231608; border: 1px solid #3a2510; border-radius: 16px;
    padding: 24px 22px; margin-bottom: 14px;
    max-width: 560px; margin-left: auto; margin-right: auto;
  }
  .card-ttl {
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2.5px;
    color: #c49a6c; text-transform: uppercase; margin-bottom: 18px;
    display: flex; align-items: center; gap: 8px;
  }
  .card-ttl::after { content: ''; flex: 1; height: 1px; background: #3a2510; }
  .field { margin-bottom: 16px; }
  .field:last-child { margin-bottom: 0; }
  .field-lbl {
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 13px; color: #b09070; margin-bottom: 7px;
  }
  .field-lbl span { font-family: 'DM Mono', monospace; font-size: 10px; color: #4a3020; }
  .inp-wrap { position: relative; display: flex; align-items: center; }
  .inp-wrap input {
    width: 100%; background: #0f0905; border: 1px solid #3a2510; border-radius: 8px;
    padding: 11px 64px 11px 14px; color: #f0e6d3;
    font-family: 'DM Mono', monospace; font-size: 15px;
    outline: none; transition: border-color 0.2s; -moz-appearance: textfield;
  }
  .inp-wrap input::-webkit-outer-spin-button,
  .inp-wrap input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .inp-wrap input:focus { border-color: #c49a6c; }
  .inp-unit {
    position: absolute; right: 12px; font-family: 'DM Mono', monospace;
    font-size: 11px; color: #4a3020; pointer-events: none; white-space: nowrap;
  }
  .unit-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .unit-btn {
    flex: 1; min-width: calc(33% - 6px); padding: 10px 0; border-radius: 8px;
    border: 1px solid #3a2510; font-family: 'DM Mono', monospace; font-size: 14px;
    cursor: pointer; transition: all 0.15s; background: #0f0905; color: #5a4030;
  }
  .unit-btn.on { background: #c49a6c; border-color: #c49a6c; color: #1a1008; font-weight: 700; }
  .yield-flow {
    display: flex; align-items: center;
    background: #0f0905; border: 1px solid #2a1a08; border-radius: 12px;
    padding: 16px; margin-bottom: 18px;
  }
  .yield-box { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .yield-num { font-family: 'DM Mono', monospace; font-size: 18px; color: #c49a6c; font-weight: 500; }
  .yield-desc { font-size: 10px; color: #4a3020; }
  .yield-mid { display: flex; flex-direction: column; align-items: center; padding: 0 10px; gap: 4px; }
  .yield-arr { width: 40px; height: 2px; background: #3a2510; position: relative; }
  .yield-arr::after {
    content: ''; position: absolute; right: -6px; top: -4px;
    border: 5px solid transparent; border-left-color: #3a2510;
  }
  .yield-pct { font-family: 'DM Mono', monospace; font-size: 9px; color: #3a2510; }
  .derived {
    background: #0f0905; border: 1px solid #2a1a08; border-radius: 10px;
    padding: 14px 16px; margin: -2px 0 18px;
  }
  .d-row { display: flex; justify-content: space-between; align-items: center; padding: 3px 0; }
  .d-lbl { font-size: 11px; color: #5a4030; }
  .d-val { font-family: 'DM Mono', monospace; font-size: 12px; color: #7a6050; }
  .d-sep { height: 1px; background: #2a1a08; margin: 7px 0; }
  .d-total-lbl { font-size: 12px; color: #9a7850; }
  .d-total-val { font-family: 'DM Mono', monospace; font-size: 14px; color: #c49a6c; }
  .toggle-row { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px 0; }
  .toggle-track {
    width: 36px; height: 20px; background: #3a2510; border-radius: 10px;
    position: relative; transition: background 0.2s; flex-shrink: 0;
  }
  .toggle-track.on { background: #c49a6c; }
  .toggle-track::after {
    content: ''; position: absolute; width: 14px; height: 14px;
    background: #1a1008; border-radius: 50%; top: 3px; left: 3px; transition: transform 0.2s;
  }
  .toggle-track.on::after { transform: translateX(16px); }
  .toggle-lbl { font-size: 13px; color: #b09070; }
  .tier-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
  .tier-btn {
    flex: 1; padding: 9px 8px; background: #0f0905; border: 1px solid #3a2510;
    border-radius: 8px; color: #5a4030; font-size: 11px;
    font-family: 'Noto Sans KR', sans-serif; cursor: pointer;
    transition: all 0.15s; white-space: nowrap;
  }
  .tier-btn.on { background: #c49a6c; border-color: #c49a6c; color: #1a1008; font-weight: 600; }
  .fee-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .fee-chip { background: #0f0905; border: 1px solid #2a1a08; border-radius: 8px; padding: 12px 14px; }
  .fee-chip-lbl { font-size: 11px; color: #5a4030; margin-bottom: 4px; }
  .fee-chip-val { font-family: 'DM Mono', monospace; font-size: 15px; color: #c49a6c; }
  .fee-total-row {
    display: flex; justify-content: space-between; align-items: center;
    border-top: 1px solid #3a2510; padding-top: 14px; margin-top: 14px;
  }
  .fee-total-lbl { font-size: 13px; color: #b09070; }
  .fee-total-val { font-family: 'DM Mono', monospace; font-size: 17px; color: #e8b87a; }
  .slider-wrap { padding: 4px 0; }
  .slider-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .slider-val { font-family: 'DM Mono', monospace; font-size: 20px; color: #c49a6c; }
  .slider-hint { font-size: 11px; color: #4a3020; }
  input[type=range] {
    width: 100%; -webkit-appearance: none; height: 4px;
    background: #3a2510; border-radius: 2px; outline: none; cursor: pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%;
    background: #c49a6c; border: 3px solid #1a1008; box-shadow: 0 0 0 1px #c49a6c;
  }
  .slider-ends { display: flex; justify-content: space-between; margin-top: 5px; }
  .slider-end { font-family: 'DM Mono', monospace; font-size: 10px; color: #3a2510; }
  .divider { height: 1px; background: #2a1a08; max-width: 560px; margin: 4px auto 18px; }
  .result-card {
    background: linear-gradient(135deg, #2a1a08, #180e04);
    border: 1px solid #c49a6c44; border-radius: 16px;
    padding: 28px 24px; max-width: 560px; margin: 0 auto 14px;
    position: relative; overflow: hidden;
  }
  .result-card::before {
    content: '☕'; position: absolute; right: 20px; top: 16px;
    font-size: 44px; opacity: 0.07;
  }
  .result-eye {
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px;
    color: #c49a6c; text-transform: uppercase; margin-bottom: 6px;
  }
  .result-price {
    font-family: 'DM Serif Display', serif; font-size: clamp(38px,9vw,54px);
    color: #f5e6cc; letter-spacing: -1px; line-height: 1;
  }
  .result-price em { font-size: 22px; color: #c49a6c; font-style: normal; margin-left: 4px; }
  .result-note { font-family: 'DM Mono', monospace; font-size: 10px; color: #4a3020; margin: 6px 0 22px; }
  .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .r-item { display: flex; flex-direction: column; gap: 3px; }
  .r-lbl { font-size: 11px; color: #4a3020; }
  .r-val { font-family: 'DM Mono', monospace; font-size: 13px; color: #7a6050; }
  .r-val.big { font-size: 15px; }
  .formula {
    background: #0f0905; border: 1px dashed #2a1a08; border-radius: 12px;
    padding: 18px 16px; max-width: 560px; margin: 0 auto;
  }
  .formula-ttl {
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px;
    color: #3a2510; text-transform: uppercase; margin-bottom: 10px;
  }
  .formula-body { font-family: 'DM Mono', monospace; font-size: 11px; color: #5a4030; line-height: 2; }
  .hl { color: #c49a6c; }
`;

const FEE_TIERS = [
  { label: "연매출 1억 미만", pay: 3.74 },
  { label: "연매출 1~10억", pay: 2.97 },
  { label: "연매출 10억 이상", pay: 1.98 },
];
const CATEGORY_FEE = 2.0;
const YIELD = 0.8;
const SELL_UNITS = [100, 200, 400, 500, 800];

function fmt(n) { return Math.round(n).toLocaleString("ko-KR"); }

export default function App() {
  const [greenBean, setGreenBean] = useState(15000);
  const [roasting,  setRoasting]  = useState(3000);
  const [sellUnit,  setSellUnit]  = useState(100);
  const [packaging, setPackaging] = useState(800);
  const [shipping,  setShipping]  = useState(3000);
  const [freeShip,  setFreeShip]  = useState(true);
  const [margin,    setMargin]    = useState(35);
  const [tierIdx,   setTierIdx]   = useState(0);

  const greenNeeded = sellUnit / YIELD;
  const greenCost   = (greenBean / 1000) * greenNeeded;
  const roastCost   = (roasting  / 1000) * greenNeeded;
  const coffeeCost  = greenCost + roastCost;
  const totalCost   = coffeeCost + packaging + (freeShip ? shipping : 0);

  const payFee   = FEE_TIERS[tierIdx].pay;
  const feeRate  = (CATEGORY_FEE + payFee) / 100;
  const margRate = margin / 100;
  const divisor  = 1 - feeRate - margRate;
  const rawPrice = divisor > 0 ? totalCost / divisor : 0;
  const salePrice = Math.ceil(rawPrice / 100) * 100;

  const feeAmt   = salePrice * feeRate;
  const profit   = salePrice - feeAmt - totalCost;
  const realMarg = salePrice > 0 ? (profit / salePrice) * 100 : 0;
  const mCol     = realMarg >= 30 ? "#80c870" : realMarg >= 20 ? "#e8c890" : "#e07060";

  return (
    <>
      <style>{FONT}{css}</style>
      <div className="app">
        <div className="hd">
          <div className="hd-eye">Corner Coffee Gongbang</div>
          <div className="hd-title">스마트스토어<br /><em>판매가 계산기</em></div>
          <div className="hd-sub">네이버 수수료 역산 · 로스팅 수율 80% 반영</div>
        </div>

        <div className="card">
          <div className="card-ttl">판매 단위</div>
          <div className="unit-row">
            {SELL_UNITS.map(u => (
              <button key={u} className={`unit-btn${sellUnit === u ? " on" : ""}`}
                onClick={() => setSellUnit(u)}>{u}g</button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-ttl">원가 구성</div>
          <div className="yield-flow">
            <div className="yield-box">
              <div className="yield-num">{Math.round(greenNeeded)}g</div>
              <div className="yield-desc">생두 투입</div>
            </div>
            <div className="yield-mid">
              <div className="yield-arr" />
              <div className="yield-pct">수율 80%</div>
            </div>
            <div className="yield-box">
              <div className="yield-num">{sellUnit}g</div>
              <div className="yield-desc">원두 완성</div>
            </div>
          </div>
          <div className="field">
            <div className="field-lbl">생두 구매가 <span>1kg 기준 입력</span></div>
            <div className="inp-wrap">
              <input type="number" value={greenBean}
                onChange={e => setGreenBean(Number(e.target.value))} />
              <span className="inp-unit">원 / kg</span>
            </div>
          </div>
          <div className="field">
            <div className="field-lbl">로스팅 비용 <span>생두 1kg 투입 기준</span></div>
            <div className="inp-wrap">
              <input type="number" value={roasting}
                onChange={e => setRoasting(Number(e.target.value))} />
              <span className="inp-unit">원 / kg</span>
            </div>
          </div>
          <div className="derived">
            <div className="d-row">
              <span className="d-lbl">생두 {Math.round(greenNeeded)}g 원가</span>
              <span className="d-val">{fmt(greenCost)}원</span>
            </div>
            <div className="d-row">
              <span className="d-lbl">로스팅비 ({Math.round(greenNeeded)}g 기준)</span>
              <span className="d-val">{fmt(roastCost)}원</span>
            </div>
            <div className="d-sep" />
            <div className="d-row">
              <span className="d-total-lbl">커피 원가 합계</span>
              <span className="d-total-val">{fmt(coffeeCost)}원</span>
            </div>
          </div>
          <div className="field">
            <div className="field-lbl">포장재비 <span>봉투 + 라벨 + 테이프</span></div>
            <div className="inp-wrap">
              <input type="number" value={packaging}
                onChange={e => setPackaging(Number(e.target.value))} />
              <span className="inp-unit">원</span>
            </div>
          </div>
          <div className="field">
            <div className="field-lbl">배송비</div>
            <div className="toggle-row" onClick={() => setFreeShip(v => !v)}>
              <div className={`toggle-track${freeShip ? " on" : ""}`} />
              <span className="toggle-lbl">
                {freeShip ? "무료배송 — 판매가에 포함" : "고객 부담 — 판매가 제외"}
              </span>
            </div>
            {freeShip && (
              <div className="inp-wrap" style={{ marginTop: 8 }}>
                <input type="number" value={shipping}
                  onChange={e => setShipping(Number(e.target.value))} />
                <span className="inp-unit">원</span>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-ttl">네이버 수수료</div>
          <div className="tier-row">
            {FEE_TIERS.map((t, i) => (
              <button key={i} className={`tier-btn${tierIdx === i ? " on" : ""}`}
                onClick={() => setTierIdx(i)}>{t.label}</button>
            ))}
          </div>
          <div className="fee-grid">
            <div className="fee-chip">
              <div className="fee-chip-lbl">카테고리 수수료 (식품)</div>
              <div className="fee-chip-val">{CATEGORY_FEE.toFixed(2)}%</div>
            </div>
            <div className="fee-chip">
              <div className="fee-chip-lbl">네이버페이 결제수수료</div>
              <div className="fee-chip-val">{payFee.toFixed(2)}%</div>
            </div>
          </div>
          <div className="fee-total-row">
            <span className="fee-total-lbl">합산 수수료율</span>
            <span className="fee-total-val">{(CATEGORY_FEE + payFee).toFixed(2)}%</span>
          </div>
        </div>

        <div className="card">
          <div className="card-ttl">목표 이익률</div>
          <div className="slider-wrap">
            <div className="slider-top">
              <span className="slider-val">{margin}%</span>
              <span className="slider-hint">
                {margin >= 40 ? "프리미엄 스페셜티" : margin >= 30 ? "적정 마진" : margin >= 20 ? "최소 권장" : "⚠ 낮음"}
              </span>
            </div>
            <input type="range" min={10} max={60} step={1}
              value={margin} onChange={e => setMargin(Number(e.target.value))} />
            <div className="slider-ends">
              <span className="slider-end">10%</span>
              <span className="slider-end">60%</span>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="result-card">
          <div className="result-eye">권장 판매가 ({sellUnit}g · 100원 올림)</div>
          <div className="result-price">
            {divisor > 0 ? fmt(salePrice) : "—"}<em>원</em>
          </div>
          <div className="result-note">
            정확값 {divisor > 0 ? fmt(Math.round(rawPrice)) : "—"}원 → 100원 올림 적용
          </div>
          <div className="result-grid">
            <div className="r-item">
              <span className="r-lbl">커피 원가 ({sellUnit}g)</span>
              <span className="r-val">{fmt(coffeeCost)}원</span>
            </div>
            <div className="r-item">
              <span className="r-lbl">포장 + 배송</span>
              <span className="r-val">{fmt(packaging + (freeShip ? shipping : 0))}원</span>
            </div>
            <div className="r-item">
              <span className="r-lbl">수수료 ({(feeRate*100).toFixed(2)}%)</span>
              <span className="r-val">{fmt(feeAmt)}원</span>
            </div>
            <div className="r-item">
              <span className="r-lbl">총원가</span>
              <span className="r-val">{fmt(totalCost)}원</span>
            </div>
            <div className="r-item">
              <span className="r-lbl">실제 이익</span>
              <span className="r-val big" style={{ color: mCol }}>{fmt(profit)}원</span>
            </div>
            <div className="r-item">
              <span className="r-lbl">실제 이익률</span>
              <span className="r-val big" style={{ color: mCol }}>{realMarg.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="formula">
          <div className="formula-ttl">역산 공식</div>
          <div className="formula-body">
            <span className="hl">판매가</span> = 총원가 ÷ (1 − 수수료율 − 이익률)<br />
            <br />
            생두 필요량 = {sellUnit}g ÷ 0.8 = <span className="hl">{Math.round(greenNeeded)}g</span><br />
            생두원가 = {fmt(greenBean)}원 × {Math.round(greenNeeded)} ÷ 1000 = {fmt(greenCost)}원<br />
            로스팅비 = {fmt(roasting)}원 × {Math.round(greenNeeded)} ÷ 1000 = {fmt(roastCost)}원<br />
            커피원가 = <span className="hl">{fmt(coffeeCost)}원</span><br />
            총원가 = {fmt(coffeeCost)} + {fmt(packaging)}{freeShip ? ` + ${fmt(shipping)}` : ""} = <span className="hl">{fmt(totalCost)}원</span><br />
            <br />
            {fmt(totalCost)} ÷ {divisor > 0 ? divisor.toFixed(4) : "—"} = <span className="hl">{divisor > 0 ? fmt(Math.round(rawPrice)) : "—"}원</span>
          </div>
        </div>
      </div>
    </>
  );
}
