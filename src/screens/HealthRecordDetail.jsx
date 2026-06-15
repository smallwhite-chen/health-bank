// 個人量測紀錄 — 單項詳細頁：區間切換 + 平均 + 趨勢圖 + 衛教
function MetricLineChart({ points, metric }) {
  const W = 340, H = 220, mL = 38, mR = 14, mT = 14, mB = 38;
  const pw = W - mL - mR, ph = H - mT - mB;
  const vals = points.map((p) => p.value);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (lo === hi) { lo -= 1; hi += 1; }
  const padY = (hi - lo) * 0.3 || 1;
  const ymin = lo - padY, ymax = hi + padY;
  const ticks = [];
  for (let i = 0; i <= 4; i++) ticks.push(ymin + (ymax - ymin) * (i / 4));
  const n = points.length;
  const x = (i) => n === 1 ? mL + pw / 2 : mL + (i / (n - 1)) * pw;
  const y = (v) => mT + (1 - (v - ymin) / (ymax - ymin)) * ph;
  const rotate = n > 8;
  const color = "var(--brand-700)";
  const fmtTick = (v) => metric.decimals > 0 ? v.toFixed(1) : String(Math.round(v));
  return (
    <svg className="hm-chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${metric.name}趨勢圖`}>
      {ticks.map((tk, i) => (
        <g key={i}>
          <line x1={mL} y1={y(tk)} x2={W - mR} y2={y(tk)} stroke="#E6E9ED" strokeWidth="1" />
          <text x={mL - 8} y={y(tk) + 3.5} textAnchor="end" fontSize="10" fill="#9AA3AD">{fmtTick(tk)}</text>
        </g>
      ))}
      {n > 1 && (
        <polyline fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round"
          points={points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ")} />
      )}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.value)} r="3.6" fill={color} stroke="#fff" strokeWidth="1.8" />
          <text x={x(i)} y={H - mB + 16} textAnchor={rotate ? "end" : "middle"} fontSize="9.5" fill="#7A828C"
            transform={rotate ? `rotate(-30 ${x(i)} ${H - mB + 16})` : undefined}>{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

function MetricRangeChart({ points, metric }) {
  const W = 340, H = 220, mL = 38, mR = 14, mT = 14, mB = 38;
  const pw = W - mL - mR, ph = H - mT - mB;
  const allv = points.flatMap((p) => [p.sys, p.dia]);
  let lo = Math.min(...allv), hi = Math.max(...allv);
  const padY = (hi - lo) * 0.25 || 6;
  const ymin = lo - padY, ymax = hi + padY;
  const ticks = [];
  for (let i = 0; i <= 4; i++) ticks.push(ymin + (ymax - ymin) * (i / 4));
  const n = points.length;
  const x = (i) => n === 1 ? mL + pw / 2 : mL + (i / (n - 1)) * pw;
  const y = (v) => mT + (1 - (v - ymin) / (ymax - ymin)) * ph;
  const barW = 8;
  const sysColor = "var(--brand-700)";
  const diaColor = "#7FB5AE";
  const hrColor = "#8A6FE8";
  const hr = points.map((p, i) => 68 + ((i * 7 + 3) % 10));
  const refs = [
    { v: metric.normal.sysHigh, label: "收縮壓上限" },
    { v: metric.normal.diaHigh, label: "舒張壓上限" },
  ].filter((r) => r.v >= ymin && r.v <= ymax);
  return (
    <svg className="hm-chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="血壓趨勢圖">
      {ticks.map((tk, i) => (
        <g key={i}>
          <line x1={mL} y1={y(tk)} x2={W - mR} y2={y(tk)} stroke="#E6E9ED" strokeWidth="1" />
          <text x={mL - 8} y={y(tk) + 3.5} textAnchor="end" fontSize="10" fill="#9AA3AD">{Math.round(tk)}</text>
        </g>
      ))}
      {refs.map((r, i) => (
        <line key={i} x1={mL} y1={y(r.v)} x2={W - mR} y2={y(r.v)} stroke="#E0A94B" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      {points.map((p, i) => (
        <g key={i}>
          <rect x={x(i) - barW / 2} y={y(p.sys)} width={barW} height={Math.max(2, y(p.dia) - y(p.sys))} rx={barW / 2} fill="url(#bpgrad)" />
          <circle cx={x(i)} cy={y(p.sys)} r="3.4" fill={sysColor} stroke="#fff" strokeWidth="1.6" />
          <circle cx={x(i)} cy={y(p.dia)} r="3.4" fill={diaColor} stroke="#fff" strokeWidth="1.6" />
          <text x={x(i)} y={H - mB + 16} textAnchor="middle" fontSize="9.5" fill="#7A828C">{p.label}</text>
        </g>
      ))}
      {/* 心率折線 */}
      {n > 1 && (
        <polyline fill="none" stroke={hrColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
          points={hr.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
      )}
      {hr.map((v, i) => (
        <circle key={`hr${i}`} cx={x(i)} cy={y(v)} r="3" fill={hrColor} stroke="#fff" strokeWidth="1.4" />
      ))}
      <defs>
        <linearGradient id="bpgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-700)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#7FB5AE" stopOpacity="0.85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HealthRecordDetailScreen({ navigate, openSheet, params }) {
  const metric = window.Data.healthById[(params && params.id) || "bp"];
  const RANGE_LABELS = ["天", "週", "月", "6個月", "年"];
  const [range, setRange] = React.useState("週");
  if (!metric) return <DetailHeader title="量測紀錄" onBack={() => navigate(-1)} />;

  const points = window.HealthUtil.genSeries(metric.id, range);
  const avg = window.HealthUtil.averageOf(metric.id, range);
  const isBp = metric.kind === "bp";

  // 詳細紀錄列表（依 metric 確定性生成近幾筆）
  const records = React.useMemo(() => {
    const series = window.HealthUtil.genSeries(metric.id, "月").slice().reverse();
    const dates = [
      "115/6/15 08:12", "115/6/14 07:48", "115/6/13 08:05",
      "115/6/12 22:30", "115/6/11 07:20", "115/6/10 08:40",
    ];
    return dates.map((d, i) => {
      const p = series[i] || series[series.length - 1];
      if (isBp) return { date: d, main: `${p.sys}/${p.dia}`, extra: String(68 + ((i * 7 + 3) % 10)), unit: "mmHg" };
      return { date: d, main: String(p.value), extra: null, unit: metric.unit };
    });
  }, [metric.id, isBp]);

  return (
    <>
      <DetailHeader title={metric.name} onBack={() => navigate(-1)} />
      <div className="app-scroll hm-scroll">
        {/* 區間切換 */}
        <div className="hm-detail-pad">
          <div className="glu-range-row hm-range-row">
            {RANGE_LABELS.map((r) => (
              <button key={r} className={`glu-range-btn ${range === r ? "active" : ""}`} onClick={() => setRange(r)}>{r}</button>
            ))}
          </div>

          {/* 平均值 */}
          <div className="hm-avg-card">
            <div className="hm-avg-label">本{range === "6個月" ? "半年" : range === "天" ? "日" : range}平均</div>
            <div className="hm-avg-val">
              {avg.text}{metric.unit && <em>{metric.unit}</em>}
              {isBp && <span className="hm-avg-hr"><span className="hm-avg-divider" />71<em>bpm</em></span>}
            </div>
            <div className="hm-avg-ref">參考範圍：{metric.refText}</div>
          </div>

          {/* 趨勢圖 */}
          <div className="hm-chart-card">
            <div className="hm-chart-title">{isBp ? "血壓/心率" : metric.name}趨勢（{range}）</div>
            {isBp ? <MetricRangeChart points={points} metric={metric} /> : <MetricLineChart points={points} metric={metric} />}
            {isBp && (
              <div className="hm-chart-legend">
                <span><i className="dot sys" />收縮壓</span>
                <span><i className="dot dia" />舒張壓</span>
                <span><i className="dot hr" />心率</span>
                <span><i className="dot ref" />參考上限</span>
              </div>
            )}
          </div>

          {/* 衛教資訊 */}
          <div className="hm-edu-card">
            <div className="hm-edu-title"><Icon name="info-circle" size={16} />{metric.edu.title}</div>
            <ol className="hm-edu-list">
              {metric.edu.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
            {metric.edu.note && <div className="hm-edu-note">{metric.edu.note}</div>}
          </div>

          {/* 詳細紀錄 */}
          <div className="hm-rec-head">
            <h3>全部詳細紀錄</h3>
            <button className="filter-btn" onClick={() => openSheet("healthFilter")}>
              <Icon name="sliders" size={14} /> 進階篩選
            </button>
          </div>
          <div className="hm-rec-list">
            {records.map((r, i) => (
              <div className="hm-rec-row" key={i}>
                <div className="hm-rec-val">
                  {r.main}<em>{r.unit}</em>{r.extra && <span className="hm-rec-hr">{r.extra}<em>bpm</em></span>}
                </div>
                <div className="hm-rec-date">{r.date}</div>
                <button className="hm-rec-edit" onClick={() => openSheet("addRecord", { id: metric.id, mode: "edit" })} aria-label="編輯">
                  <Icon name="edit" size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="h-16" />
        <div className="h-16" />
      </div>

      <button className="hm-fab" onClick={() => openSheet("addRecord", { id: metric.id })}>
        <Icon name="plus" size={18} />
        <span>新增紀錄</span>
      </button>
    </>
  );
}

window.HealthRecordDetailScreen = HealthRecordDetailScreen;
