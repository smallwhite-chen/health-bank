function ReportDetailScreen({ navigate, params }) {
  const d = window.Data.reportDetail;
  const [range, setRange] = React.useState("近3年");

  // Chart (simple inline SVG line chart)
  const data = d.history.slice().reverse(); // oldest -> newest
  const W = 320, H = 160, PX = 40, PY = 20;
  const vals = data.map(p => p.value);
  const maxV = Math.max(...vals), minV = Math.min(...vals);
  const span = (maxV - minV) || 1;
  const pts = data.map((p, i) => {
    const x = PX + (i / (data.length - 1)) * (W - PX - 20);
    const y = PY + (1 - (p.value - minV) / span) * (H - PY - 30);
    return { x, y, ...p };
  });
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // y-axis ticks
  const yTicks = [minV, minV + span * 0.33, minV + span * 0.66, maxV].map(v => Math.round(v*10)/10);

  return (
    <>
      <DetailHeader title={d.title} onBack={() => navigate(-1)}/>
      <div className="app-scroll">

        <div className="detail-section">
          <div className="sec-head"><Icon name="edit" size={16} className="ico"/> {d.name}</div>
          <div style={{ fontSize: 12, color:"var(--text-tertiary)" }}>系統顯示最近一次檢查結果</div>
          <div style={{ fontSize: 12, color:"var(--text-tertiary)", marginTop: 2 }}>參考值：{d.range}</div>
        </div>

        <div className="detail-section">
          <div className="detail-row right"><span className="k">檢查日期</span><span className="v">{d.info.date}</span></div>
          <div className="detail-row right"><span className="k">醫事機構</span>
            <span className="v" style={{ color:"var(--brand-900)", textDecoration:"underline" }}>{d.info.org} →</span>
          </div>
          <div className="detail-row right"><span className="k">檢驗名稱</span><span className="v">{d.info.itemName}</span></div>
          <div className="detail-row right"><span className="k">醫令代碼</span><span className="v">{d.info.code}</span></div>
          <div className="detail-row right"><span className="k">就醫日期</span><span className="v">{d.info.visitDate}</span></div>
          <div className="detail-row right"><span className="k">資料來源</span><span className="v" style={{ fontWeight: 400 }}>{d.info.source}</span></div>
        </div>

        <div className="detail-section">
          <table className="result-table">
            <thead>
              <tr><th>檢查日期</th><th className="num">檢查結果</th><th className="src">資料來源</th></tr>
            </thead>
            <tbody>
              {d.history.map((h, i) => (
                <tr key={i}>
                  <td>{h.date}</td>
                  <td className="num">{h.value.toFixed(1)}</td>
                  <td className="src">{h.src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="range-pills">
          {["近1年","近3年","近5年","全部"].map(r => (
            <button key={r} className={range === r ? "active" : ""} onClick={() => setRange(r)}>{r}</button>
          ))}
        </div>

        <div className="chart-wrap">
          <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
            {/* y grid */}
            {yTicks.map((t, i) => {
              const y = PY + (1 - (t - minV) / span) * (H - PY - 30);
              return (
                <g key={i}>
                  <line x1={PX} y1={y} x2={W-10} y2={y} stroke="#eef1f5" strokeWidth="1"/>
                  <text x={PX - 6} y={y + 3} fontSize="10" fill="#8b95a6" textAnchor="end">{t.toFixed(1)}</text>
                </g>
              );
            })}
            {/* x labels */}
            {pts.map((p, i) => (
              <text key={i} x={p.x} y={H - 8} fontSize="10" fill="#8b95a6" textAnchor="middle">{p.date}</text>
            ))}
            {/* line */}
            <path d={pathD} fill="none" stroke="#26344a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* points */}
            {pts.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="3.5" fill="#26344a"/>
                <text x={p.x} y={p.y - 8} fontSize="10" fill="#4b5565" textAnchor="middle">{p.value.toFixed(1)}</text>
              </g>
            ))}
          </svg>
          <div className="legend"><span className="dot"/> 醣化血紅素（%）</div>
        </div>

        <div className="h-16"/>
      </div>
    </>
  );
}

window.ReportDetailScreen = ReportDetailScreen;
