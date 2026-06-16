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

function PinnedCard({ metric, onOpen, onUnpin }) {
  const latest = window.HealthUtil.latestOf(metric.id);
  const spark = window.HealthUtil.sparkValues(metric.id);
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
        <Sparkline values={spark} w={132} h={46} />
      </div>
    </div>
  );
}

function MetricRow({ metric, pinned, onOpen, onTogglePin }) {
  const latest = window.HealthUtil.latestOf(metric.id);
  const spark = window.HealthUtil.sparkValues(metric.id);
  const time = metric.id === "bp" ? "115/6/15 08:12" : "115/6/15 07:30";
  return (
    <div className="hm-row" onClick={onOpen}>
      <div className="hm-pin-left">
        <div className="hm-pin-top">
          <button
            className={`hm-pin-btn hm-row-pin ${pinned ? "is-on" : ""}`}
            onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
            aria-label={pinned ? "取消釘選" : "加入常用"}
          ><Icon name={pinned ? "pin-fill" : "pin"} size={16} /></button>
          <span className="hm-ico"><Icon name={metric.icon} size={16} /></span>
          <span className="hm-pin-name">{metric.id === "bp" ? "血壓 / 心率" : metric.name}</span>
        </div>
        <div className="hm-pin-val">{latest.text}<em>{latest.unit}</em></div>
        {metric.id === "bp" && <div className="hm-pin-sub">心率 71 <em>bpm</em></div>}
        <div className="hm-pin-time">{time}</div>
      </div>
      <div className="hm-pin-right">
        <button
          className="hm-pin-btn hm-pin-go"
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          aria-label="進入詳細紀錄"
        ><Icon name="chev-right" size={18} /></button>
        <Sparkline values={spark} w={132} h={46} />
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
  const [cat, setCat] = useHState("總覽");
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

  const pinnedMetrics = pins.map((id) => window.Data.healthById[id]).filter(Boolean);

  const [linkBannerHidden, setLinkBannerHidden] = useHState(() => {
    try { return localStorage.getItem("hb_health_link_banner_hidden") === "1"; } catch (e) { return false; }
  });
  const hideLinkBanner = () => {
    try { localStorage.setItem("hb_health_link_banner_hidden", "1"); } catch (e) {}
    setLinkBannerHidden(true);
  };

  return (
    <>
      <DetailHeader title="個人量測紀錄" onBack={() => navigate(-1)} />
      <div className="app-scroll hm-scroll">
        {/* 健康管理連結說明 */}
        {!linkBannerHidden && (
        <div className="hm-link-banner">
          <span className="hm-link-banner-ico"><Icon name="refresh" size={18} /></span>
          <div className="hm-link-banner-main">
            <p className="hm-link-banner-text">透過健康管理連結，可透過您現有的健康APP同步資料至健康存摺個人量測紀錄中。</p>
            <div className="hm-link-banner-actions">
              <button className="hm-link-banner-dismiss" onClick={hideLinkBanner}>不再顯示此訊息</button>
              <button className="hm-link-banner-btn" onClick={() => openSheet("healthLinkGuide")}>
                <Icon name="info" size={14} /> 操作說明
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
        </div>

        {cat === "總覽" && (
          <div className="hm-section">
            <div className="hm-overview-head">
              <h2>已釘選</h2>
              <button className="hm-edit-link" onClick={() => navigate("healthEditPins")}>
                <Icon name="edit" size={13} /> 編輯釘選紀錄項目
              </button>
            </div>
            {pinnedMetrics.length === 0 ? (
              <div className="hm-empty">
                <Icon name="pin" size={22} />
                <p>尚未釘選任何項目</p>
                <span>切換到「生理量測」等分類，點選項目右側的釘選圖示，即可顯示在這裡。</span>
              </div>
            ) : (
              <div className="hm-pin-grid">
                {pinnedMetrics.map((m) => (
                  <PinnedCard key={m.id} metric={m} onOpen={() => navigate("healthDetail", { id: m.id })} onUnpin={() => togglePin(m.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {cat === "生理量測" && (
          <div className="hm-section">
            {[
              ...physio.filter((m) => pins.includes(m.id)).sort((a, b) => pins.indexOf(a.id) - pins.indexOf(b.id)),
              ...physio.filter((m) => !pins.includes(m.id)),
            ].map((m) => (
              <MetricRow
                key={m.id}
                metric={m}
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
