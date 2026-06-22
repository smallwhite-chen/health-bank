// 血糖檢驗報告 — 醣化血紅素 (HbA1c) 圖表 + 近三次檢驗結果表格
function GlucoseReport() {
  const { glucoseReadings, glucoseMeta } = window.Data;
  const PERIODS = ["近1年", "近2年", "近3年", "自訂區間"];
  const [period, setPeriod] = React.useState("近3年");
  const [custom, setCustom] = React.useState({ start: "", end: "" });

  const pad = (n) => String(n).padStart(2, "0");
  const keyOf = (y, m, d) => y * 10000 + m * 100 + d;
  const parseRoc = (s) => {
    const m = (s || "").match(/(\d+)年(\d+)月(\d+)日/);
    return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
  };
  const fmt = (o) => `${o.y}/${pad(o.m)}/${pad(o.d)}`;
  const gregToRocKey = (iso) => {
    const m = (iso || "").match(/(\d+)-(\d+)-(\d+)/);
    if (!m) return null;
    return keyOf(+m[1] - 1911, +m[2], +m[3]);
  };

  const all = glucoseReadings.map((r) => {
    const o = parseRoc(r.date);
    return { ...r, o, key: keyOf(o.y, o.m, o.d) };
  });

  const t = glucoseMeta.today;
  const yearsBack = { "近1年": 1, "近2年": 2, "近3年": 3 };

  // 計算區間
  let cutoff = null, rangeStart = null, rangeEnd = null, caption = "";
  if (period === "自訂區間") {
    rangeStart = gregToRocKey(custom.start);
    rangeEnd = gregToRocKey(custom.end);
    if (custom.start && custom.end) {
      const s = custom.start.match(/(\d+)-(\d+)-(\d+)/), e = custom.end.match(/(\d+)-(\d+)-(\d+)/);
      caption = `${+s[1] - 1911}/${s[2]}/${s[3]} 至 ${+e[1] - 1911}/${e[2]}/${e[3]}`;
    } else {
      caption = "請設定自訂區間";
    }
  } else {
    const n = yearsBack[period];
    cutoff = keyOf(t.y - n, t.m, t.d);
    caption = `近 ${n} 年（${t.y - n}/${pad(t.m)}/${pad(t.d)} 起）`;
  }

  const inRange = (k) => {
    if (period === "自訂區間") {
      if (rangeStart == null || rangeEnd == null) return false;
      return k >= rangeStart && k <= rangeEnd;
    }
    return k >= cutoff;
  };

  const filtered = all.filter((r) => inRange(r.key));
  const asc = [...filtered].sort((a, b) => a.key - b.key);   // 舊→新（圖表，隨時間段連動）
  // 下方表格不連動：永遠取全部資料中最近三次
  const recent3 = [...all].sort((a, b) => b.key - a.key).slice(0, 3);

  const pickPeriod = (p) => {
    setPeriod(p);
  };

  return (
    <div className="glu">
      <div className="glu-cols">
      <div className="glu-col-trend">
      {/* 時間段選擇 */}
      <div className="glu-trend-title">檢驗結果趨勢(112/06/10 起)</div>
      <div className="glu-range-row">
        {PERIODS.map((p) => (
          <button
            key={p}
            className={`glu-range-btn ${period === p ? "active" : ""}`}
            onClick={() => pickPeriod(p)}
          >{p}</button>
        ))}
      </div>

      {period === "自訂區間" && (
        <div className="lipid-custom-range">
          <label>開始<input type="date" value={custom.start} max={custom.end || undefined} onChange={(e) => setCustom({ ...custom, start: e.target.value })} className="glu-date-input" /></label>
          <label>結束<input type="date" value={custom.end} min={custom.start || undefined} onChange={(e) => setCustom({ ...custom, end: e.target.value })} className="glu-date-input" /></label>
        </div>
      )}

      {/* 圖表卡 */}
      <div className="glu-card">
        <div className="glu-card-title">{glucoseMeta.metric}（{glucoseMeta.unit}）趨勢</div>
        {asc.length === 0 ? (
          <div className="glu-empty">此區間沒有檢驗紀錄</div>
        ) : (
          <GluChart points={asc} meta={glucoseMeta} fmt={fmt} pad={pad} />
        )}
        <div className="glu-legend">
          <span className="glu-legend-item"><span className="glu-legend-dot" />{glucoseMeta.metric}（{glucoseMeta.unit}）</span>
          <span className="glu-legend-item"><span className="glu-legend-ref" />參考值 {glucoseMeta.refLow.toFixed(1)}-{glucoseMeta.refHigh.toFixed(1)}</span>
        </div>
      </div>
      </div>

      <div className="glu-col-table">
      {/* 近三次檢驗結果表格 */}
      <div className="glu-table-head">近三次檢驗結果</div>
      <div className="glu-card glu-table-card">
        <div className="glu-table">
          <div className="glu-trow glu-thead">
            <span>檢驗日期</span>
            <span>來源</span>
            <span>{glucoseMeta.metric}</span>
            <span>判讀</span>
          </div>
          {recent3.length === 0 ? (
            <div className="glu-empty" style={{ padding: "20px 0" }}>此區間沒有檢驗紀錄</div>
          ) : recent3.map((r, i) => {
            const high = r.value > glucoseMeta.refHigh;
            return (
              <div className="glu-trow" key={i}>
                <span className="glu-td-date">{fmt(r.o)}</span>
                <span className="glu-td-src">B</span>
                <span className="glu-td-val">{r.value.toFixed(1)} <em>{glucoseMeta.unit}</em></span>
                <span className={`glu-badge ${high ? "high" : "ok"}`}>{high ? "異常" : "正常"}</span>
              </div>
            );
          })}
        </div>
        <div className="glu-ref">參考值：<span className="glu-ref-val">{glucoseMeta.refText}</span></div>
      </div>

      {/* 備註說明 */}
      <div className="glu-note">
        <div className="glu-note-title">備註：</div>
        <ol className="glu-note-list">
          <li>資料來源說明：A-特約醫事機構不定期上傳、B-特約醫事機構定期上傳、C-院所上傳自費健檢、D-自行登打自費健檢。</li>
          <li>資料來源為 A、B 者，提供區間為 112/01/01 至 115/01/20。</li>
          <li>另本資料非醫師法及醫療法規定之病歷，實際之診斷、病名、治療、處置及用藥等詳細就醫情形，應以各該醫事服務機構之病歷記載為準。</li>
          <li>針對資料來源為 A、B、C 有疑義者，洽請相關醫事服務機構；資料來源為 D 者，請至「<span className="glu-note-link">自費健檢資料登錄</span>」作業自行修改。</li>
        </ol>
      </div>
      </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

// SVG 折線圖
function GluChart({ points, meta, fmt, pad }) {
  const W = 340, H = 240;
  const mL = 38, mR = 14, mT = 14, mB = 52;
  const pw = W - mL - mR, ph = H - mT - mB;

  const vals = points.map((p) => p.value);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (lo === hi) { lo -= 0.1; hi += 0.1; }
  const padY = (hi - lo) * 0.35 || 0.1;
  let ymin = Math.floor((lo - padY) / 0.05) * 0.05;
  let ymax = Math.ceil((hi + padY) / 0.05) * 0.05;
  // 刻度
  let step = 0.05;
  while ((ymax - ymin) / step > 7) step += 0.05;
  const ticks = [];
  for (let v = ymin; v <= ymax + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);

  const n = points.length;
  const x = (i) => n === 1 ? mL + pw / 2 : mL + (i / (n - 1)) * pw;
  const y = (v) => mT + (1 - (v - ymin) / (ymax - ymin)) * ph;

  const rotate = n > 4;
  const lineColor = "#3E84CF";
  const showRef = meta.refHigh >= ymin && meta.refHigh <= ymax;
  // 安全範圍（參考上限以下）綠色底色
  const zoneTop = y(Math.min(meta.refHigh, ymax));
  const zoneBottom = mT + ph;
  const showZone = meta.refHigh > ymin;

  return (
    <svg className="glu-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="醣化血紅素趨勢圖">
      {/* 安全範圍底色 */}
      {showZone && <rect x={mL} y={zoneTop} width={pw} height={zoneBottom - zoneTop} fill="rgba(0, 160, 142, 0.08)" />}
      {/* 格線 + y 標籤 */}
      {ticks.map((tk, i) => (
        <g key={i}>
          <line x1={mL} y1={y(tk)} x2={W - mR} y2={y(tk)} stroke="#E6E9ED" strokeWidth="1" />
          <text x={mL - 8} y={y(tk) + 3.5} textAnchor="end" fontSize="10" fill="#9AA3AD">{tk.toFixed(2)}</text>
        </g>
      ))}

      {/* 參考上限 */}
      {showRef && (
        <g>
          <line x1={mL} y1={y(meta.refHigh)} x2={W - mR} y2={y(meta.refHigh)} stroke="#E0A94B" strokeWidth="1" strokeDasharray="4 4" />
        </g>
      )}

      {/* 折線 */}
      {n > 1 && (
        <polyline
          fill="none"
          stroke={lineColor}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ")}
        />
      )}

      {/* 點 + x 標籤 */}
      {points.map((p, i) => {
        const anchor = rotate ? "end" : (i === 0 ? "start" : i === n - 1 ? "end" : "middle");
        return (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.value)} r="4.5" fill={lineColor} stroke="#fff" strokeWidth="2" />
          <text
            x={x(i)}
            y={H - mB + 18}
            textAnchor={anchor}
            fontSize="9.5"
            fill="#7A828C"
            transform={rotate ? `rotate(-32 ${x(i)} ${H - mB + 18})` : undefined}
          >{fmt(p.o)}</text>
        </g>
        );
      })}
    </svg>
  );
}

window.GlucoseReport = GlucoseReport;
