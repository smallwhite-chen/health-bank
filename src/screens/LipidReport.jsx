// 血脂檢驗報告 — 四項獨立檢驗卡片 + 趨勢圖/衛教說明 Bottom Sheet
function lipidStatus(item) {
  if (item.refType === "max") {
    return item.value > item.ref ? { label: "異常", cls: "high" } : { label: "正常", cls: "ok" };
  }
  // refType "min"：數值越高越好（如 HDL）
  return item.value < item.ref ? { label: "異常", cls: "low" } : { label: "正常", cls: "ok" };
}

function LipidReport() {
  const { lipidItems, lipidMeta } = window.Data;
  const [sheet, setSheet] = React.useState(null); // { itemId, tab }
  const triggerRef = React.useRef(null);

  const openSheet = (e, itemId, tab) => {
    triggerRef.current = e.currentTarget;
    setSheet({ itemId, tab });
  };
  const closeSheet = () => {
    setSheet(null);
    if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  };

  const activeItem = sheet ? lipidItems.find((it) => it.id === sheet.itemId) : null;

  return (
    <div className="lipid" data-screen-label="血脂檢驗報告">
      <LipidOverview items={lipidItems} />

      <h3 className="lipid-detail-heading">各檢查項目詳細資料</h3>

      {lipidItems.map((it) => (
        <LipidCard key={it.id} item={it} onOpen={openSheet} />
      ))}

      {/* 備註說明 */}
      <div className="glu-note" style={{ margin: "16px 0 6px" }}>
        <div className="glu-note-title">備註：</div>
        <ol className="glu-note-list">
          <li>資料來源說明：A-特約醫事機構不定期上傳、B-特約醫事機構定期上傳、C-院所上傳自費健檢、D-自行登打自費健檢。</li>
          <li>資料來源為 A、B 者，提供區間為 {lipidMeta.noteRange}。</li>
          <li>另本資料非醫師法及醫療法規定之病歷，實際之診斷、病名、治療、處置及用藥等詳細就醫情形，應以各該醫事服務機構之病歷記載為準。</li>
          <li>針對資料來源為 A、B、C 有疑義者，洽請相關醫事服務機構；資料來源為 D 者，請至「<span className="glu-note-link">自費健檢資料登錄</span>」作業自行修改。</li>
        </ol>
      </div>

      <div className="h-16" />

      {activeItem && ReactDOM.createPortal(
        <LipidSheet item={activeItem} initialTab={sheet.tab} onClose={closeSheet} />,
        document.querySelector(".app-shell") || document.querySelector(".desktop-shell") || document.body
      )}
    </div>
  );
}

// ---------------------------------------------------------------- 總覽卡片
function LipidOverview({ items }) {
  return (
    <div className="lipid-overview">
      <div className="lipid-ov-row lipid-ov-head">
        <span>檢查項目</span>
        <span className="num">檢查結果</span>
        <span className="num">參考值</span>
        <span className="res">結果</span>
      </div>
      {items.map((it) => {
        const st = lipidStatus(it);
        const abnormal = st.cls !== "ok";
        return (
          <div className="lipid-ov-row" key={it.id}>
            <span className="lipid-ov-name">{it.name}</span>
            <span className="num"><b>{it.value}</b> <em>{it.unit}</em></span>
            <span className="num ref">{it.refText}</span>
            <span className="res">
              <span className={`lipid-badge ${abnormal ? "high" : "ok"}`}>{abnormal ? "異常" : "正常"}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- 項目卡片
function LipidCard({ item, onOpen }) {
  const st = lipidStatus(item);
  return (
    <article className="lipid-card lipid-kv-card">
      <h3 className="lipid-kv-title">{item.name}</h3>
      <div className="lipid-kv-rows">
        <div className="kv2"><span className="k">檢查日期</span><span className="v">{item.date}</span></div>
        <div className="kv2"><span className="k">檢查結果</span><span className="v strong">{item.value} {item.unit}</span></div>
        <div className="kv2"><span className="k">參考值</span><span className="v">{item.refText}</span></div>
        <div className="kv2"><span className="k">判讀</span><span className={`v judge ${st.cls}`}>{st.label}</span></div>
        <div className="kv2"><span className="k">資料來源</span><span className="v">{item.source}</span></div>
      </div>
      <div className="lipid-links">
        <button type="button" className="lipid-link" onClick={(e) => onOpen(e, item.id, "trend")}>
          <Icon name="pulse" size={14} /> 趨勢圖
        </button>
        <button type="button" className="lipid-link" onClick={(e) => onOpen(e, item.id, "edu")}>
          <Icon name="report" size={14} /> 衛教說明
        </button>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------- Bottom Sheet
function LipidSheet({ item, initialTab, onClose }) {
  const [tab, setTab] = React.useState(initialTab);
  const [period, setPeriod] = React.useState("近3年");
  const [custom, setCustom] = React.useState({ start: "", end: "" });
  const sheetRef = React.useRef(null);
  const [dragY, setDragY] = React.useState(0);
  const dragStart = React.useRef(null);
  const titleId = "lipid-sheet-title";

  // 依時段過濾趨勢資料
  const PERIODS = ["近1年", "近2年", "近3年", "自訂區間"];
  const parseRoc = (s) => { const m = s.split("/").map(Number); return m[0] * 10000 + m[1] * 100 + m[2]; };
  const gregToRocKey = (iso) => { const m = (iso || "").match(/(\d+)-(\d+)-(\d+)/); return m ? (+m[1] - 1911) * 10000 + (+m[2]) * 100 + (+m[3]) : null; };
  const keys = item.history.map((h) => parseRoc(h.date));
  const newest = Math.max(...keys);
  const newestY = Math.floor(newest / 10000), newestRest = newest % 10000;
  let trendPoints;
  if (period === "自訂區間") {
    const s = gregToRocKey(custom.start), e = gregToRocKey(custom.end);
    trendPoints = (s && e) ? item.history.filter((h) => { const k = parseRoc(h.date); return k >= s && k <= e; }) : item.history;
  } else {
    const n = { "近1年": 1, "近2年": 2, "近3年": 3 }[period];
    const cutoff = (newestY - n) * 10000 + newestRest;
    trendPoints = item.history.filter((h) => parseRoc(h.date) >= cutoff);
  }

  // 開啟 / 切換頁籤時，focus 移到對應 tab
  React.useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const active = el.querySelector('[role="tab"][aria-selected="true"]');
    if (active) active.focus({ preventScroll: true });
  }, [tab]);

  // Focus trap + Esc 關閉
  const onKeyDown = (e) => {
    if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
    if (e.key !== "Tab") return;
    const els = [...sheetRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter((x) => !x.disabled && x.offsetParent !== null);
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus({ preventScroll: true }); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus({ preventScroll: true }); }
  };

  // 頁籤鍵盤左右切換
  const onTabKey = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setTab((t) => (t === "trend" ? "edu" : "trend"));
    }
  };

  // 下拉關閉手勢（拖曳頂部區域）
  const onPointerDown = (e) => {
    if (e.target.closest(".close")) return; // 不攔截關閉按鈕
    dragStart.current = e.clientY;
    setDragY(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (dragStart.current == null) return;
    setDragY(Math.max(0, e.clientY - dragStart.current));
  };
  const onPointerUp = () => {
    if (dragStart.current == null) return;
    if (dragY > 80) onClose(); else setDragY(0);
    dragStart.current = null;
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet lipid-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={sheetRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        style={dragY ? { transform: `translateY(${dragY}px)`, animation: "none" } : undefined}
      >
        <div
          className="lipid-sheet-drag"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="grabber" />
          <div className="sheet-head">
            <div className="sheet-title" id={titleId}>{item.name}</div>
            <button className="close" aria-label="關閉" onClick={onClose}>
              <Icon name="plus" size={18} style={{ transform: "rotate(45deg)" }} />
            </button>
          </div>
        </div>

        <div className="lipid-tabs" role="tablist" aria-label="報告內容切換">
          <button
            type="button"
            role="tab"
            id="lipid-tab-trend"
            aria-selected={tab === "trend"}
            aria-controls="lipid-panel-trend"
            tabIndex={tab === "trend" ? 0 : -1}
            onClick={() => setTab("trend")}
            onKeyDown={onTabKey}
          >趨勢圖</button>
          <button
            type="button"
            role="tab"
            id="lipid-tab-edu"
            aria-selected={tab === "edu"}
            aria-controls="lipid-panel-edu"
            tabIndex={tab === "edu" ? 0 : -1}
            onClick={() => setTab("edu")}
            onKeyDown={onTabKey}
          >衛教說明</button>
        </div>

        <div className="sheet-body lipid-sheet-body">
          {tab === "trend" ? (
            <div role="tabpanel" id="lipid-panel-trend" aria-labelledby="lipid-tab-trend">
              <div className="glu-range-row" role="group" aria-label="趨勢圖時段切換">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`glu-range-btn ${period === p ? "active" : ""}`}
                    aria-pressed={period === p}
                    onClick={() => setPeriod(p)}
                  >{p}</button>
                ))}
              </div>
              {period === "自訂區間" && (
                <div className="lipid-custom-range">
                  <label>開始<input type="date" value={custom.start} max={custom.end || undefined} onChange={(e) => setCustom({ ...custom, start: e.target.value })} className="glu-date-input" /></label>
                  <label>結束<input type="date" value={custom.end} min={custom.start || undefined} onChange={(e) => setCustom({ ...custom, end: e.target.value })} className="glu-date-input" /></label>
                </div>
              )}
              {trendPoints.length === 0 ? (
                <div className="glu-empty" style={{ padding: "32px 0" }}>此區間沒有檢驗紀錄</div>
              ) : (
                <LipidChart item={{ ...item, history: trendPoints }} />
              )}
              <div className="glu-ref" style={{ marginTop: 4 }}>參考值：<span className="glu-ref-val">{item.refText}</span></div>
            </div>
          ) : (
            <div role="tabpanel" id="lipid-panel-edu" aria-labelledby="lipid-tab-edu" className="lipid-edu">
              <p className="lipid-edu-disclaimer">下列資料僅供參考，診斷結果仍應由醫師診療後判斷。</p>
              <p className="lipid-edu-ref">參考值：<b>{item.education.ref}</b></p>
              <p className="lipid-edu-body">{item.education.body}</p>
              <div className="lipid-edu-res">
                <div className="lipid-edu-res-title">更多衛教資訊：</div>
                <ul>
                  {item.education.resources.map((r, i) => (
                    <li key={i}><span className="lipid-edu-link">{r}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- 趨勢折線圖
function LipidChart({ item }) {
  const points = item.history;
  const W = 340, H = 230;
  const mL = 42, mR = 14, mT = 16, mB = 46;
  const pw = W - mL - mR, ph = H - mT - mB;

  const vals = points.map((p) => p.value).concat([item.ref]);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (lo === hi) { lo -= 5; hi += 5; }
  const padY = (hi - lo) * 0.25 || 5;
  let ymin = lo - padY, ymax = hi + padY;

  // 取「漂亮」的刻度間距
  const rawStep = (ymax - ymin) / 5;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => (ymax - ymin) / s <= 6) || 10 * mag;
  ymin = Math.floor(ymin / step) * step;
  ymax = Math.ceil(ymax / step) * step;
  const ticks = [];
  for (let v = ymin; v <= ymax + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);

  const n = points.length;
  const x = (i) => (n === 1 ? mL + pw / 2 : mL + (i / (n - 1)) * pw);
  const y = (v) => mT + (1 - (v - ymin) / (ymax - ymin)) * ph;

  const lineColor = "#3E84CF";
  const refY = y(item.ref);
  // 正常區間（綠色淡色帶）：max 型在參考線以下、min 型在參考線以上
  const zoneY = item.refType === "max" ? refY : mT;
  const zoneH = item.refType === "max" ? mT + ph - refY : refY - mT;
  const rotate = n > 4;
  const fmtTick = (t) => (step >= 1 ? String(Math.round(t)) : t.toFixed(1));

  return (
    <svg className="glu-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${item.name}歷史趨勢圖，參考值${item.refText}`}>
      {/* 正常區間 */}
      {zoneH > 0 && <rect x={mL} y={zoneY} width={pw} height={zoneH} fill="rgba(0, 160, 142, 0.08)" />}

      {/* 格線 + y 標籤 */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={mL} y1={y(t)} x2={W - mR} y2={y(t)} stroke="#E6E9ED" strokeWidth="1" />
          <text x={mL - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="#9AA3AD">{fmtTick(t)}</text>
        </g>
      ))}

      {/* 參考值界線 */}
      <line x1={mL} y1={refY} x2={W - mR} y2={refY} stroke="#E0A94B" strokeWidth="1" strokeDasharray="4 4" />
      <text x={W - mR} y={refY - 5} textAnchor="end" fontSize="9" fill="#C8902F">
        {item.refType === "max" ? "參考上限" : "參考下限"} {item.ref}
      </text>

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

      {/* 點 + 數值 + x 標籤 */}
      {points.map((p, i) => {
        const anchor = rotate ? "end" : (i === 0 ? "start" : i === n - 1 ? "end" : "middle");
        return (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.value)} r="4.5" fill={lineColor} stroke="#fff" strokeWidth="2" />
            <text x={x(i)} y={y(p.value) - 9} textAnchor="middle" fontSize="10" fill="#4b5565" fontWeight="600">{p.value}</text>
            <text
              x={x(i)}
              y={H - mB + 18}
              textAnchor={anchor}
              fontSize="9.5"
              fill="#7A828C"
              transform={rotate ? `rotate(-32 ${x(i)} ${H - mB + 18})` : undefined}
            >{p.date}</text>
          </g>
        );
      })}
    </svg>
  );
}

window.LipidReport = LipidReport;
