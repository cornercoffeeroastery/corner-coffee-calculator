import { useState } from “react”;
import { FONT, css, FEE_TIERS, CATEGORY_FEE, SELL_UNITS, fmt } from “./styles.js”;

export default function App() {
const [greenBean, setGreenBean] = useState(15000);
const [roasting,  setRoasting]  = useState(3000);
const [yieldRate, setYieldRate] = useState(80);
const [sellUnit,  setSellUnit]  = useState(100);
const [packaging, setPackaging] = useState(800);
const [shipping,  setShipping]  = useState(3000);
const [freeShip,  setFreeShip]  = useState(true);
const [margin,    setMargin]    = useState(35);
const [tierIdx,   setTierIdx]   = useState(0);
const [vat,       setVat]       = useState(false);

const yieldDecimal = yieldRate / 100;
const greenNeeded  = sellUnit / yieldDecimal;
const greenCost    = (greenBean / 1000) * greenNeeded;
const roastCost    = (roasting  / 1000) * greenNeeded;
const coffeeCost   = greenCost + roastCost;
const totalCost    = coffeeCost + packaging + (freeShip ? shipping : 0);

const payFee   = FEE_TIERS[tierIdx].pay;
const feeRate  = (CATEGORY_FEE + payFee) / 100;
const margRate = margin / 100;
const vatFactor = vat ? (10 / 11) : 1;
const divisor  = vatFactor - feeRate - margRate;
const rawPrice = divisor > 0 ? totalCost / divisor : 0;
const salePrice = Math.ceil(rawPrice / 100) * 100;

const vatAmt   = vat ? Math.round(salePrice / 11) : 0;
const feeAmt   = salePrice * feeRate;
const profit   = salePrice - vatAmt - feeAmt - totalCost;
const realMarg = salePrice > 0 ? (profit / salePrice) * 100 : 0;
const mCol     = realMarg >= 30 ? “#80c870” : realMarg >= 20 ? “#e8c890” : “#e07060”;
const yieldHint = yieldRate >= 90 ? “라이트” : yieldRate >= 83 ? “미디엄” : yieldRate >= 77 ? “미디엄 다크” : “다크”;

return (
<>
<style>{FONT}{css}</style>
<div className="app">

```
    <div className="hd">
      <div className="hd-eye">Corner Coffee Gongbang</div>
      <div className="hd-title">스마트스토어<br /><em>판매가 계산기</em></div>
      <div className="hd-sub">수수료 · 로스율 · 부가세 반영</div>
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
          <div className="yield-pct">{yieldRate}% 수율</div>
        </div>
        <div className="yield-box">
          <div className="yield-num">{sellUnit}g</div>
          <div className="yield-desc">원두 완성</div>
        </div>
      </div>

      <div className="field">
        <div className="field-lbl">로스율 (수율) <span>{yieldHint} — 1kg → {Math.round(yieldDecimal * 1000)}g</span></div>
        <div className="slider-wrap">
          <div className="slider-top">
            <span className="slider-val">{yieldRate}%</span>
          </div>
          <input type="range" min={70} max={95} step={1}
            value={yieldRate} onChange={e => setYieldRate(Number(e.target.value))} />
          <div className="slider-ends">
            <span className="slider-end">70% 다크</span>
            <span className="slider-end">95% 라이트</span>
          </div>
        </div>
      </div>

      <div className="field">
        <div className="field-lbl">생두 구매가 <span>1kg 기준</span></div>
        <div className="inp-wrap">
          <input type="number" value={greenBean} onChange={e => setGreenBean(Number(e.target.value))} />
          <span className="inp-unit">원 / kg</span>
        </div>
      </div>

      <div className="field">
        <div className="field-lbl">로스팅 비용 <span>생두 1kg 기준</span></div>
        <div className="inp-wrap">
          <input type="number" value={roasting} onChange={e => setRoasting(Number(e.target.value))} />
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
          <input type="number" value={packaging} onChange={e => setPackaging(Number(e.target.value))} />
          <span className="inp-unit">원</span>
        </div>
      </div>

      <div className="field">
        <div className="field-lbl">배송비</div>
        <div className="toggle-row" onClick={() => setFreeShip(v => !v)}>
          <div className={`toggle-track${freeShip ? " on" : ""}`} />
          <span className="toggle-lbl">{freeShip ? "무료배송 — 판매가에 포함" : "고객 부담 — 판매가 제외"}</span>
        </div>
        {freeShip && (
          <div className="inp-wrap" style={{ marginTop: 8 }}>
            <input type="number" value={shipping} onChange={e => setShipping(Number(e.target.value))} />
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
      <div className="card-ttl">부가세</div>
      <div className="toggle-row" onClick={() => setVat(v => !v)}>
        <div className={`toggle-track${vat ? " on" : ""}`} />
        <span className="toggle-lbl">{vat ? "부가세 10% 포함 — 판매가에 반영" : "부가세 미적용 (간이과세자)"}</span>
      </div>
      {vat && (
        <div className="vat-banner">
          <span className="vat-banner-lbl">판매가 중 납부 세액 (1/11)</span>
          <span className="vat-banner-val">{fmt(vatAmt)}원</span>
        </div>
      )}
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
        정확값 {divisor > 0 ? fmt(Math.round(rawPrice)) : "—"}원 → 100원 올림{vat ? " · 부가세 포함" : ""}
      </div>
      <div className="result-grid">
        <div className="r-item">
          <span className="r-lbl">커피 원가</span>
          <span className="r-val">{fmt(coffeeCost)}원</span>
        </div>
        <div className="r-item">
          <span className="r-lbl">포장 + 배송</span>
          <span className="r-val">{fmt(packaging + (freeShip ? shipping : 0))}원</span>
        </div>
        <div className="r-item">
          <span className="r-lbl">수수료</span>
          <span className="r-val">{fmt(feeAmt)}원</span>
        </div>
        {vat && (
          <div className="r-item">
            <span className="r-lbl">부가세</span>
            <span className="r-val vat">{fmt(vatAmt)}원</span>
          </div>
        )}
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
        <span className="hl">판매가</span> = 총원가 ÷ ({vat ? "10/11" : "1"} − 수수료율 − 이익률)<br />
        생두 필요량 = {sellUnit}g ÷ {yieldRate/100} = <span className="hl">{Math.round(greenNeeded)}g</span><br />
        커피원가 = <span className="hl">{fmt(coffeeCost)}원</span> / 총원가 = <span className="hl">{fmt(totalCost)}원</span><br />
        {fmt(totalCost)} ÷ {divisor > 0 ? divisor.toFixed(4) : "—"} = <span className="hl">{divisor > 0 ? fmt(Math.round(rawPrice)) : "—"}원</span>
      </div>
    </div>

  </div>
</>
```

);
}