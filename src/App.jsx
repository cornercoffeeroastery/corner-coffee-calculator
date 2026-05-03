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
  .inp-wrap { position: relative; display: flex​​​​​​​​​​​​​​​​
