// 個人量測紀錄 — 總覽 / 生理量測（完整）/ 飲食・運動・生理期（骨架示意）
const { useState: useHState } = React;

// 迷你趨勢縮圖
function Sparkline({ values, color = "var(--brand-700)", w = 76, h = 30 }) {
  if (!values || values.length === 0) return null;
  const lo = Math.min(...values), hi = Math.max(...values);
  const span = (hi - lo) || 1;
  const n = values.length;
  const pad = 3;
  const pts = values.map((v, i) => {
    const x = n === 1 ? w / 2 : (i / (n - 1)) * (w - pad * 2) + pad;
    const y = h - pad - ((v - lo) / span) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = pts[pts.length - 1].split(",");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="spark" aria-hidden="true">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts.join(" ")} />
      <circle cx={last[0]} cy={last[1]} r="2.4" fill={color} />
    </svg>
  );
}
window.Sparkline = Sparkline;

// 血壓迷你長條圖：每筆量測一根垂直長條（上=收縮壓、下=舒張壓），含參考虛線
function BpBars({ pairs, w = 132, h = 46, sysRef, diaRef }) {
  if (!pairs || pairs.length === 0) return null;
  const gid = React.useId();
  const sysArr = pairs.map((p) => p.sys);
  const diaArr = pairs.map((p) => p.dia);
  const vals = [...sysArr, ...diaArr];
  if (sysRef != null) vals.push(sysRef);
  if (diaRef != null) vals.push(diaRef);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const padV = (hi - lo) * 0.18 || 5;
  lo -= padV; hi += padV;
  const span = (hi - lo) || 1;
  const padX = 8, padY = 6;
  const n = pairs.length;
  const y = (v) => padY + (1 - (v - lo) / span) * (h - padY * 2);
  const xAt = (i) => (n === 1 ? w / 2 : padX + (i / (n - 1)) * (w - padX * 2));
  const barW = 5;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="spark" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2FA295" />
          <stop offset="1" stopColor="#9AD7CF" />
        </linearGradient>
      </defs>
      {sysRef != null && <line x1="0" x2={w} y1={y(sysRef)} y2={y(sysRef)} stroke="#C9CED1" strokeWidth="1" strokeDasharray="3 3" />}
      {diaRef != null && <line x1="0" x2={w} y1={y(diaRef)} y2={y(diaRef)} stroke="#E0A94B" strokeWidth="1" strokeDasharray="3 3" />}
      {pairs.map((p, i) => {
        const x = xAt(i);
        const yt = y(p.sys), yb = y(p.dia);
        return (
          <g key={i}>
            <rect x={x - barW / 2} y={yt} width={barW} height={Math.max(barW, yb - yt)} rx={barW / 2} fill={`url(#${gid})`} />
            <circle cx={x} cy={yt} r="2.6" fill="#2FA295" />
            <circle cx={x} cy={yb} r="2.6" fill="#9AD7CF" />
          </g>
        );
      })}
    </svg>
  );
}
window.BpBars = BpBars;

function PinnedCard({ metric, onOpen, onUnpin }) {
  const latest = window.HealthUtil.latestOf(metric.id);
  const spark = window.HealthUtil.sparkValues(metric.id);
  const bpPairs = metric.id === "bp" ? window.HealthUtil.genSeries(metric.id, "月") : null;
  return (
    <div className="hm-pin-card" onClick={onOpen}>
      <div className="hm-pin-left">
        <div className="hm-pin-top">
          <span className="hm-ico"><Icon name={metric.icon} size={16} /></span>
          <span className="hm-pin-name">{metric.id === "bp" ? "血壓 / 心率" : metric.short}</span>
        </div>
        <div className="hm-pin-val">{latest.text}<em>{latest.unit}</em></div>
        {metric.id === "bp" && <div className="hm-pin-sub">心率 71 <em>bpm</em></div>}
        <div className="hm-pin-time">{metric.id === "bp" ? "115/6/15 08:12" : "115/6/15 07:30"}</div>
      </div>
      <div className="hm-pin-right">
        <button
          className="hm-pin-btn hm-pin-go"
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          aria-label="進入紀錄"
        ><Icon name="chev-right" size={18} /></button>
        {metric.id === "bp"
          ? <BpBars pairs={bpPairs} sysRef={metric.normal && metric.normal.sysHigh} diaRef={metric.normal && metric.normal.diaHigh} w={132} h={46} />
          : <Sparkline values={spark} w={132} h={46} />}
      </div>
    </div>
  );
}

function MetricRow({ metric, pinned, onOpen, onTogglePin, empty }) {
  const latest = window.HealthUtil.latestOf(metric.id);
  const spark = window.HealthUtil.sparkValues(metric.id);
  const bpPairs = metric.id === "bp" ? window.HealthUtil.genSeries(metric.id, "月") : null;
  const isBp = metric.id === "bp";
  const time = isBp ? "115/6/15 08:12" : "115/6/15 07:30";
  const valText = empty ? (isBp ? "0/0" : "0") : latest.text;
  return (
    <div className="hm-row" onClick={onOpen}>
      <div className="hm-pin-left">
        <div className="hm-pin-top">
          <span className="hm-ico"><Icon name={metric.icon} size={16} /></span>
          <span className="hm-pin-name">{isBp ? "血壓 / 心率" : metric.name}</span>
        </div>
        <div className="hm-pin-val">{valText}<em>{metric.unit}</em></div>
        {isBp && <div className="hm-pin-sub">心率 {empty ? "0" : "71"} <em>bpm</em></div>}
        <div className="hm-pin-time">{empty ? "—" : time}</div>
      </div>
      <div className="hm-pin-right">
        <button
          className="hm-pin-btn hm-pin-go"
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          aria-label="進入詳細紀錄"
        ><Icon name="chev-right" size={18} /></button>
        {!empty && (isBp
          ? <BpBars pairs={bpPairs} sysRef={metric.normal && metric.normal.sysHigh} diaRef={metric.normal && metric.normal.diaHigh} w={132} h={46} />
          : <Sparkline values={spark} w={132} h={46} />)}
      </div>
    </div>
  );
}

// 飲食記錄（骨架）
function DietSkeleton() {
  const { diet } = window.Data.health;
  return (
    <div className="hm-section">
      <div className="hm-nutri-row">
        {diet.nutrients.map((nu) => (
          <div key={nu.key} className={`hm-nutri ${nu.key === "cal" ? "is-primary" : ""}`}>
            <div className="hm-nutri-val">{nu.value}<em>{nu.unit}</em></div>
            <div className="hm-nutri-label">{nu.label}</div>
            <div className="hm-nutri-goal">目標 {nu.goal}{nu.unit}</div>
          </div>
        ))}
      </div>
      <div className="hm-list-head">今日飲食</div>
      {diet.meals.map((m) => (
        <div className="hm-entry" key={m.id}>
          <span className="hm-ico hm-ico-lg"><Icon name="utensils" size={18} /></span>
          <div className="hm-entry-main">
            <div className="hm-entry-name">{m.name}</div>
            <div className="hm-entry-sub">{m.items}</div>
          </div>
          <div className="hm-entry-right">
            <div className="hm-entry-val">{m.cal}<em>kcal</em></div>
            <div className="hm-entry-time">{m.time}</div>
          </div>
        </div>
      ))}
      <div className="hm-hint"><Icon name="info-circle" size={14} />新增資料時可選擇各種食物項目，系統自動統計蛋白質、脂肪、糖、鈉與熱量。</div>
    </div>
  );
}

// 運動紀錄（骨架）
function ExerciseSkeleton() {
  const { exercise } = window.Data.health;
  return (
    <div className="hm-section">
      <div className="hm-stat-row">
        {exercise.summary.map((s) => (
          <div key={s.key} className="hm-stat">
            <span className="hm-stat-ico"><Icon name={s.icon} size={18} /></span>
            <div className="hm-stat-val">{s.value.toLocaleString()}<em>{s.unit}</em></div>
            <div className="hm-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="hm-list-head">運動項目</div>
      {exercise.items.map((m) => (
        <div className="hm-entry" key={m.id}>
          <span className="hm-ico hm-ico-lg"><Icon name="dumbbell" size={18} /></span>
          <div className="hm-entry-main">
            <div className="hm-entry-name">{m.name} <span className="hm-tag">{m.intensity}</span></div>
            <div className="hm-entry-sub">{m.dur}</div>
          </div>
          <div className="hm-entry-right">
            <div className="hm-entry-val">{m.cal}<em>kcal</em></div>
            <div className="hm-entry-time">{m.time}</div>
          </div>
        </div>
      ))}
      <div className="hm-hint"><Icon name="info-circle" size={14} />可選擇運動項目並設定強度與時間，系統自動統計步數、距離與消耗熱量。</div>
    </div>
  );
}

// 生理期紀錄（骨架）— 月曆標示
function MenstrualSkeleton() {
  const { menstrual } = window.Data.health;
  const firstDay = new Date(2026, 5, 1).getDay(); // 6月1日為星期幾
  const daysInMonth = 30;
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const inPeriod = (d) => menstrual.periods.some((p) => d >= p.start && d <= p.end);
  return (
    <div className="hm-section">
      <div className="hm-cal-card">
        <div className="hm-cal-title">{menstrual.monthLabel}</div>
        <div className="hm-cal-grid hm-cal-head">
          {["日", "一", "二", "三", "四", "五", "六"].map((w) => <span key={w}>{w}</span>)}
        </div>
        <div className="hm-cal-grid">
          {cells.map((d, i) => (
            <span key={i} className={`hm-cal-cell ${d == null ? "is-empty" : ""} ${d != null && inPeriod(d) ? "is-period" : ""}`}>
              {d || ""}
            </span>
          ))}
        </div>
        <div className="hm-cal-legend">
          <span><i className="dot period" /> 經期</span>
          <span className="hm-cal-predict">預測下次：{menstrual.predictNextStart}</span>
        </div>
      </div>
      <div className="hm-stat-row">
        <div className="hm-stat"><div className="hm-stat-val">{menstrual.cycleAvg}<em>天</em></div><div className="hm-stat-label">平均週期</div></div>
        <div className="hm-stat"><div className="hm-stat-val">{menstrual.periodAvg}<em>天</em></div><div className="hm-stat-label">平均經期</div></div>
        <div className="hm-stat"><div className="hm-stat-val hm-stat-sm">{menstrual.lastStart}</div><div className="hm-stat-label">上次開始</div></div>
      </div>
      <div className="hm-hint"><Icon name="info-circle" size={14} />可新增生理期的開始與結束日期，系統會標示於月曆並預測下次週期。</div>
    </div>
  );
}

function HealthRecordsScreen({ navigate, openSheet }) {
  const { categories, physio } = window.Data.health;
  const [cat, setCat] = useHState("生理量測");
  const [showAll, setShowAll] = useHState(false);
  const catIcon = { "生理量測": "pulse", "飲食記錄": "utensils", "運動紀錄": "dumbbell", "生理期紀錄": "drop" };
  const [favCats, setFavCats] = useHState(() => {
    try { const s = JSON.parse(localStorage.getItem("hb_health_fav_cats") || "null"); return Array.isArray(s) ? s : []; } catch (e) { return []; }
  });
  const toggleFavCat = (c) => setFavCats((prev) => {
    const next = prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c];
    try { localStorage.setItem("hb_health_fav_cats", JSON.stringify(next)); } catch (e) {}
    return next;
  });
  const [pins, setPins] = useHState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("hb_health_pins") || "null");
      return Array.isArray(s) ? s : window.Data.health.pinnedDefault.slice();
    } catch (e) { return window.Data.health.pinnedDefault.slice(); }
  });
  const togglePin = (id) => setPins((prev) => {
    const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
    try { localStorage.setItem("hb_health_pins", JSON.stringify(next)); } catch (e) {}
    return next;
  });

  const empty = useEmptyState();
  const pinnedMetrics = empty ? [] : pins.map((id) => window.Data.healthById[id]).filter(Boolean);
  const [linkBannerHidden, setLinkBannerHidden] = useHState(() => {
    try { return localStorage.getItem("hb_health_link_banner_hidden") === "1"; } catch (e) { return false; }
  });
  const hideLinkBanner = () => {
    try { localStorage.setItem("hb_health_link_banner_hidden", "1"); } catch (e) {}
    setLinkBannerHidden(true);
  };
  const toggleLinkBanner = () => setLinkBannerHidden((h) => {
    const next = !h;
    try { localStorage.setItem("hb_health_link_banner_hidden", next ? "1" : "0"); } catch (e) {}
    return next;
  });

  return (
    <>
      <TopBar onA11y={() => openSheet("a11y")} onReminders={() => navigate("reminders")} onLogo={() => navigate("home")}/>
      <div className="app-scroll hm-scroll">
        <PageTitle>
          個人量測紀錄
          <button
            className="info"
            onClick={toggleLinkBanner}
            aria-label="單元說明"
            style={{ background:"none", border:0, padding:4, cursor:"pointer", color: !linkBannerHidden ? "var(--brand-700)" : "var(--text-tertiary)" }}
          >
            <Icon name="info" size={18} />
          </button>
        </PageTitle>

        {/* 健康管理連結說明 */}
        {!linkBannerHidden && (
        <div className="hm-link-banner">
          <div className="hm-link-banner-main">
            <p className="hm-link-banner-text">健康存摺提供個人身體量測、飲食、運動、生理期各種資料紀錄管理，未來可提供醫師診療追蹤用。<br/>同時提供與既有健康APP資料同步功能，詳細可參照同步說明。</p>
            <div className="hm-link-banner-actions">
              <button className="hm-link-banner-dismiss" onClick={hideLinkBanner}>不再顯示此訊息</button>
              <button className="hm-link-banner-btn" onClick={() => openSheet("healthLinkGuide")}>
                <Icon name="info" size={14} /> 同步說明
              </button>
            </div>
          </div>
        </div>
        )}

        {/* 分類切換列 */}
        <div className="pill-tabs-row hm-tabs-row">
          <div className="pill-tabs pill-tabs-scroll">
            {categories.map((c) => (
              <button key={c} className={`pill-tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <button
            className={`pill-tab pill-more-btn ${showAll ? "active" : ""}`}
            onClick={() => setShowAll((s) => !s)}
            aria-label="顯示全部分類"
          >
            更多
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showAll ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>

        {showAll && (
          <div className="pill-more-panel">
            <div className="pill-more-panel-title">全部分類</div>
            <div className="pill-more-panel-grid">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`pill-tab ${cat === c ? "active" : ""}`}
                  onClick={() => { setCat(c); setShowAll(false); }}
                >{c}</button>
              ))}
            </div>
          </div>
        )}

        <div className="report-sec-head">
          <div className="report-sec-head-main">
            <h2 className="report-sec-title">
              <Icon name={catIcon[cat] || "pulse"} size={16} className="ico" /> {cat}
              <button
                className="sec-fav-btn"
                onClick={() => toggleFavCat(cat)}
                aria-label={favCats.includes(cat) ? "從常用功能移除" : "加入常用功能"}
                style={{ color: favCats.includes(cat) ? "var(--accent-orange, #f89808)" : "var(--text-tertiary)" }}
              >
                <Icon name={favCats.includes(cat) ? "star-fill" : "star"} size={18}/>
              </button>
            </h2>
          </div>
        </div>

        {cat === "生理量測" && (
          <div className="hm-section">
            {[
              ...physio.filter((m) => pins.includes(m.id)).sort((a, b) => pins.indexOf(a.id) - pins.indexOf(b.id)),
              ...physio.filter((m) => !pins.includes(m.id)),
            ].map((m) => (
              <MetricRow
                key={m.id}
                metric={m}
                empty={empty}
                pinned={pins.includes(m.id)}
                onOpen={() => navigate("healthDetail", { id: m.id })}
                onTogglePin={() => togglePin(m.id)}
              />
            ))}
          </div>
        )}
        {cat === "飲食記錄" && <DietSkeleton />}
        {cat === "運動紀錄" && <ExerciseSkeleton />}
        {cat === "生理期紀錄" && <MenstrualSkeleton />}

        <div className="h-16" />
        <div className="h-16" />
      </div>
    </>
  );
}

window.HealthRecordsScreen = HealthRecordsScreen;
