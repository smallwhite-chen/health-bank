function ReportsScreen({ navigate, openSheet, isFav, onToggleFav }) {
  const { reports, reportCategories, reportSubCategories } = window.Data;
  const [filter, setFilter] = React.useState("全部");
  const [subFilter, setSubFilter] = React.useState("全部");
  const [showAll, setShowAll] = React.useState(false);
  const [sortDesc, setSortDesc] = React.useState(true); // true = 近到遠
  const subCats = (reportSubCategories && reportSubCategories[filter]) || null;
  React.useEffect(() => { setSubFilter("全部"); }, [filter]);

  const pickFilter = (t) => { setFilter(t); setShowAll(false); };

  const parseRocDate = (s) => {
    const m = (s || "").match(/(\d+)年(\d+)月(\d+)日/);
    if (!m) return 0;
    return (parseInt(m[1], 10) + 1911) * 10000 + parseInt(m[2], 10) * 100 + parseInt(m[3], 10);
  };

  const rows = (() => {
    let r = filter === "全部" ? reports : reports.filter(r => r.type === filter);
    if (subCats && subFilter !== "全部") r = r.filter(x => x.subcat === subFilter);
    r = [...r].sort((a, b) => {
      const av = parseRocDate(a.date), bv = parseRocDate(b.date);
      return sortDesc ? bv - av : av - bv;
    });
    return r;
  })();

  return (
    <>
      <TopBar onA11y={() => openSheet("a11y")} onReminders={() => navigate("reminders")} onLogo={() => navigate("home")}/>
      <div className="app-scroll">
        <div className="info-banner">
          提供最近三年的健檢及檢驗報告，包含成人健檢、癌症篩檢、血糖血脂追蹤、影像與病理等各類檢查結果
        </div>

        <PageTitle favoriteKey="reports" isFav={isFav} onToggleFav={onToggleFav} right={<button className="filter-btn" onClick={() => openSheet("reportFilter")}><Icon name="sliders" size={14}/> 進階篩選</button>}>
          檢驗報告
        </PageTitle>

        <div className="pill-tabs-row">
          <div className="pill-tabs pill-tabs-scroll">
            {reportCategories.map(t => (
              <button key={t} className={`pill-tab ${filter === t ? "active" : ""}`} onClick={() => pickFilter(t)}>{t}</button>
            ))}
          </div>
          <button
            className={`pill-tab pill-more-btn ${showAll ? "active" : ""}`}
            onClick={() => setShowAll(s => !s)}
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
              {reportCategories.map(t => (
                <button
                  key={t}
                  className={`pill-tab ${filter === t ? "active" : ""}`}
                  onClick={() => pickFilter(t)}
                >{t}</button>
              ))}
            </div>
          </div>
        )}

        {subCats && (
          <div className="pill-tabs sub-pill-tabs">
            {subCats.map(s => (
              <button
                key={s}
                className={`pill-tab pill-tab-sub ${subFilter === s ? "active" : ""}`}
                onClick={() => setSubFilter(s)}
              >{s}</button>
            ))}
          </div>
        )}

        <div className="count-bar">
          <span>共 {rows.length} 筆報告</span>
          <button
            className="sort-toggle"
            onClick={() => setSortDesc(d => !d)}
            aria-label="切換排序方向"
          >
            <Icon name="sort" size={12}/> 檢驗日期{sortDesc ? "近到遠" : "遠到近"}
          </button>
        </div>

        <div style={{ padding:"0 16px" }}>
          {rows.map(r => (
            <div key={r.id} className="list-card" onClick={() => navigate("reportDetail", { id: r.id })} style={{ cursor:"pointer" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="kv-row"><span className="k">檢驗日期</span><span className="v">{r.date} <span className="tag" style={{ marginLeft:6 }}>{r.type}</span></span></div>
                <div className="kv-row"><span className="k">檢驗項目</span><span className="v">{r.item}</span></div>
                <div className="kv-row"><span className="k">醫事機構</span><span className="v">{r.org}</span></div>
                <div className="kv-row"><span className="k">摘要結果</span><span className="v" style={{ fontWeight: 400, color: "var(--text-secondary)" }}>{r.summary}</span></div>
              </div>
              <Icon name="chev-right" size={16} className="chev"/>
            </div>
          ))}
        </div>

        <div className="h-16"/>
      </div>
    </>
  );
}

window.ReportsScreen = ReportsScreen;
