// 各檢驗報告分頁共用的標題 + 說明文字
function ReportSectionHead({ filter, openSheet, hasFilter, isFav, onToggleFav }) {
  const iconMap = {
    "全部": "report",
    "癌症篩檢結果": "shield",
    "血糖檢驗報告": "tube",
    "血脂檢驗報告": "flask",
    "影像或病理檢查報告": "image",
    "其他檢驗資料": "report",
  };
  const title = filter === "全部" ? "全部檢驗報告" : filter;
  const showFav = onToggleFav && filter !== "全部";
  return (
    <div className="report-sec-head">
      <div className="report-sec-head-main">
        <h2 className="report-sec-title">
          <Icon name={iconMap[filter] || "report"} size={16} className="ico" /> {title}
          {showFav && (
            <button
              className="sec-fav-btn"
              onClick={onToggleFav}
              aria-label={isFav ? "從常用功能移除" : "加入常用功能"}
              style={{ color: isFav ? "var(--accent-orange, #f89808)" : "var(--text-tertiary)" }}
            >
              <Icon name={isFav ? "heart-fill" : "heart"} size={18}/>
            </button>
          )}
        </h2>
        {filter === "血脂檢驗報告" && (
          <p className="report-sec-sub">顯示最近一次檢查結果</p>
        )}
        {filter === "影像或病理檢查報告" && (
          <p className="report-sec-sub">顯示112/06/01起的紀錄</p>
        )}
      </div>
      {hasFilter && (
        <button className="filter-btn" onClick={() => openSheet("reportFilter", { scope: filter })}>
          <Icon name="sliders" size={14}/> 篩選
        </button>
      )}
    </div>
  );
}

// 全部清單中的「血糖檢驗報告」總覽卡（近三次檢驗結果）
function GlucoseSummaryCard({ onClick }) {
  const { glucoseReadings, glucoseMeta } = window.Data;
  const pad = (n) => String(n).padStart(2, "0");
  const parse = (s) => { const m = (s || "").match(/(\d+)年(\d+)月(\d+)日/); return m ? { y: +m[1], m: +m[2], d: +m[3] } : { y: 0, m: 0, d: 0 }; };
  const keyOf = (o) => o.y * 10000 + o.m * 100 + o.d;
  const all = glucoseReadings.map((r) => { const o = parse(r.date); return { ...r, o, key: keyOf(o) }; });
  const recent3 = [...all].sort((a, b) => b.key - a.key).slice(0, 3);
  const fmt = (o) => `${o.y}/${pad(o.m)}/${pad(o.d)}`;
  return (
    <div className="list-card overview-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="overview-card-title">血糖檢驗報告</div>
        <div className="glu-table-head" style={{ marginTop: 0 }}>最近三次檢驗結果</div>
        <div className="glu-table">
          <div className="glu-trow glu-thead">
            <span>檢驗日期</span><span>{glucoseMeta.metric}</span><span>判讀</span>
          </div>
          {recent3.map((r, i) => {
            const high = r.value > glucoseMeta.refHigh;
            return (
              <div className="glu-trow" key={i}>
                <span className="glu-td-date">{fmt(r.o)}</span>
                <span className="glu-td-val">{r.value.toFixed(1)} <em>{glucoseMeta.unit}</em></span>
                <span className={`glu-badge ${high ? "high" : "ok"}`}>{high ? "異常" : "正常"}</span>
              </div>
            );
          })}
        </div>
        <div className="glu-ref">參考值：<span className="glu-ref-val">{glucoseMeta.refText}</span></div>
      </div>
      <Icon name="chev-right" size={16} className="chev"/>
    </div>
  );
}

// 全部清單中的「血脂檢驗報告」總覽卡（四項脂質）
function LipidSummaryCard({ onClick }) {
  const { lipidItems } = window.Data;
  const stat = (it) => {
    if (it.refType === "max") return it.value > it.ref ? "異常" : "正常";
    return it.value < it.ref ? "異常" : "正常";
  };
  return (
    <div className="list-card overview-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="overview-card-title">血脂檢驗報告</div>
        <div className="overview-card-sub">最近一次檢驗結果</div>
        <div className="lipid-ov-table">
          <div className="lipid-ov-row lipid-ov-head">
            <span>檢查項目</span><span className="num">檢查結果</span><span className="num">參考值</span><span className="res">結果</span>
          </div>
          {lipidItems.map((it) => {
            const abnormal = stat(it) === "異常";
            return (
              <div className="lipid-ov-row" key={it.id}>
                <span className="lipid-ov-name">{it.name}</span>
                <span className="num"><b>{it.value}</b> <em>{it.unit}</em></span>
                <span className="num ref">{it.refText}</span>
                <span className="res"><span className={`lipid-badge ${abnormal ? "high" : "ok"}`}>{abnormal ? "異常" : "正常"}</span></span>
              </div>
            );
          })}
        </div>
      </div>
      <Icon name="chev-right" size={16} className="chev"/>
    </div>
  );
}

function ReportsScreen({ navigate, openSheet, isFav, onToggleFav }) {
  const { reports, reportCategories, reportSubCategories, reportSubCatNotes } = window.Data;
  const empty = useEmptyState();
  const [bannerHidden, setBannerHidden] = React.useState(() => {
    try { return localStorage.getItem("hb_reports_banner_hidden") === "1"; } catch (e) { return false; }
  });
  const hideBanner = () => { try { localStorage.setItem("hb_reports_banner_hidden", "1"); } catch (e) {} setBannerHidden(true); };
  const toggleBanner = () => setBannerHidden((h) => {
    const next = !h;
    try { localStorage.setItem("hb_reports_banner_hidden", next ? "1" : "0"); } catch (e) {}
    return next;
  });
  const [filter, setFilter] = React.useState("全部");
  const [subFilter, setSubFilter] = React.useState("全部");
  const [showAll, setShowAll] = React.useState(false);
  const [subShowAll, setSubShowAll] = React.useState(false);
  const [sortDesc, setSortDesc] = React.useState(true); // true = 近到遠
  const subCats = (reportSubCategories && reportSubCategories[filter]) || null;
  const pillScrollRef = React.useRef(null);
  const pillDrag = React.useRef({ down: false, moved: false, startX: 0, startScroll: 0 });
  const subPillScrollRef = React.useRef(null);
  const subPillDrag = React.useRef({ down: false, moved: false, startX: 0, startScroll: 0 });
  React.useEffect(() => {
    const sc = (reportSubCategories && reportSubCategories[filter]) || null;
    setSubFilter(sc ? sc[0] : "全部");
    setSubShowAll(false);
  }, [filter]);
  React.useEffect(() => {
    const sc = pillScrollRef.current;
    if (!sc) return;
    requestAnimationFrame(() => {
      const active = sc.querySelector(".pill-tab.active");
      if (!active) return;
      const delta = active.getBoundingClientRect().left - sc.getBoundingClientRect().left;
      sc.scrollLeft = Math.max(0, sc.scrollLeft + delta - 4);
    });
  }, [filter]);

  // 拖拉滑動（可重複用於主分類與次分類列）
  const makeDragHandlers = (scrollRef, dragRef) => ({
    onPointerDown: (e) => {
      const sc = scrollRef.current;
      dragRef.current = { down: true, moved: false, startX: e.clientX, startScroll: sc.scrollLeft };
    },
    onPointerMove: (e) => {
      if (!dragRef.current.down) return;
      const dx = e.clientX - dragRef.current.startX;
      if (Math.abs(dx) > 4) dragRef.current.moved = true;
      scrollRef.current.scrollLeft = dragRef.current.startScroll - dx;
    },
    onPointerUp: () => { dragRef.current.down = false; },
    onPointerLeave: () => { dragRef.current.down = false; },
    onPointerCancel: () => { dragRef.current.down = false; },
    onClickCapture: (e) => {
      if (dragRef.current.moved) { e.preventDefault(); e.stopPropagation(); dragRef.current.moved = false; }
    },
  });
  const pillDragHandlers = makeDragHandlers(pillScrollRef, pillDrag);
  const subPillDragHandlers = makeDragHandlers(subPillScrollRef, subPillDrag);

  const pickFilter = (t) => { setFilter(t); setShowAll(false); };
  const pickSubFilter = (s) => { setSubFilter(s); setSubShowAll(false); };

  const parseRocDate = (s) => {
    const m = (s || "").match(/(\d+)年(\d+)月(\d+)日/);
    if (!m) return 0;
    return (parseInt(m[1], 10) + 1911) * 10000 + parseInt(m[2], 10) * 100 + parseInt(m[3], 10);
  };

  const rows = (() => {
    if (empty) return [];
    let r = filter === "全部" ? reports : reports.filter(r => r.type === filter);
    if (subCats) r = r.filter(x => x.subcat === subFilter);
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
        {!bannerHidden && (
        <div className="info-banner">
          健康存摺提供最近檢查檢驗報告，包含癌症篩檢、血糖血脂追蹤、影像與病理等各類檢查結果。
          <div>
            <button className="dismiss" onClick={hideBanner}>不再顯示此訊息</button>
          </div>
        </div>
        )}

        <PageTitle favoriteKey="reports" isFav={isFav} onToggleFav={onToggleFav}>
          檢驗報告
          <button
            className="info"
            onClick={toggleBanner}
            aria-label="單元說明"
            style={{ background:"none", border:0, padding:4, cursor:"pointer", color: !bannerHidden ? "var(--brand-700)" : "var(--text-tertiary)" }}
          >
            <Icon name="info" size={18} />
          </button>
        </PageTitle>

        <div className="pill-tabs-row">
          <div
            className="pill-tabs pill-tabs-scroll pill-tabs-drag"
            ref={pillScrollRef}
            {...pillDragHandlers}
          >
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

        <ReportSectionHead filter={filter} openSheet={openSheet} hasFilter={filter !== "血糖檢驗報告" && filter !== "血脂檢驗報告" && filter !== "癌症篩檢結果"} />

        {subCats && (
          <div className="pill-tabs-row sub-pill-tabs-row">
            <div className="pill-tabs pill-tabs-scroll sub-pill-tabs pill-tabs-drag" ref={subPillScrollRef} {...subPillDragHandlers}>
              {subCats.map(s => (
                <button
                  key={s}
                  className={`pill-tab pill-tab-sub ${subFilter === s ? "active" : ""}`}
                  onClick={() => pickSubFilter(s)}
                >{s}</button>
              ))}
            </div>
            <button
              className={`pill-tab pill-tab-sub pill-more-btn ${subShowAll ? "active" : ""}`}
              onClick={() => setSubShowAll(s => !s)}
              aria-label="顯示全部癌症篩檢類別"
            >
              更多
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: subShowAll ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }}>
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>
        )}

        {subCats && subShowAll && (
          <div className="pill-more-panel">
            <div className="pill-more-panel-title">{filter}分類</div>
            <div className="pill-more-panel-grid">
              {subCats.map(s => (
                <button
                  key={s}
                  className={`pill-tab pill-tab-sub ${subFilter === s ? "active" : ""}`}
                  onClick={() => pickSubFilter(s)}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {filter === "血糖檢驗報告" ? (empty ? <EmptyState label="尚無血糖檢驗報告" hint="查無此類別的檢驗資料" /> : <GlucoseReport/>) : filter === "血脂檢驗報告" ? (empty ? <EmptyState label="尚無血脂檢驗報告" hint="查無此類別的檢驗資料" /> : <LipidReport/>) : (<>
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

        {subCats && reportSubCatNotes && reportSubCatNotes[subFilter] && (
          <div className="screen-note">
            <div className="screen-note-block">
              <div className="screen-note-label">檢查項目</div>
              <p className="screen-note-text">{reportSubCatNotes[subFilter].item}</p>
            </div>
            <div className="screen-note-block">
              <div className="screen-note-label">建議事項</div>
              <ul className="screen-note-list">
                {reportSubCatNotes[subFilter].advice.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
        )}

        <div style={{ padding:"0 16px" }}>
          {rows.length === 0 && empty && (
            <EmptyState label="尚無檢驗報告" hint="查無符合條件的檢驗資料" />
          )}
          {rows.map(r => r.type === "血糖檢驗報告" ? (
            <GlucoseSummaryCard key={r.id} onClick={() => pickFilter("血糖檢驗報告")} />
          ) : r.type === "血脂檢驗報告" ? (
            <LipidSummaryCard key={r.id} onClick={() => pickFilter("血脂檢驗報告")} />
          ) : r.type === "癌症篩檢結果" ? (
            <div key={r.id} className="list-card cancer-card">
              <div style={{ flex:1, minWidth:0 }} className="cancer-card-cols">
                <div className="cancer-col">
                  <div className="kv-row kv-row-wide"><span className="k">檢驗日期</span><span className="v">{r.date} <span className="tag" style={{ marginLeft:6 }}>{r.subcat || r.type}</span></span></div>
                  <div className="kv-row kv-row-wide"><span className="k">醫事機構</span><span className="v">{r.org}</span></div>
                </div>
                <div className="cancer-col">
                  <div className="kv-row kv-row-wide"><span className="k">檢驗結果</span><span className="v">{r.result || r.summary}</span></div>
                  <div className="kv-row kv-row-wide"><span className="k">報告判讀</span>
                    {r.readings ? (
                      <ClampBox lines={3}>
                        <ul className="reading-list">
                          {r.readings.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </ClampBox>
                    ) : (
                      <ClampBox lines={3}>
                        <span className="v" style={{ fontWeight: 400, color: "var(--text-secondary)" }}>{r.summary}</span>
                      </ClampBox>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key={r.id} className={`list-card${r.result ? " lab-card" : ""}`} onClick={() => navigate(r.type === "影像或病理檢查報告" ? "imageReportDetail" : r.type === "其他檢驗資料" ? "otherReportDetail" : "reportDetail", { id: r.id })} style={{ cursor:"pointer" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="kv-row"><span className="k">檢驗日期</span><span className="v">{r.date} <span className="tag">{r.type}</span></span></div>
                {r.result ? (
                  <>
                    {r.examName && <div className="kv-row"><span className="k">檢驗名稱</span><span className="v">{r.examName}</span></div>}
                    <div className="kv-row"><span className="k">檢驗項目</span><span className="v">{r.item}</span></div>
                    <div className="kv-row"><span className="k">檢查結果</span><span className="v">{r.result}</span></div>
                    {r.refVal && <div className="kv-row"><span className="k">參考值</span><span className="v">{r.refVal}</span></div>}
                    {r.judge && <div className="kv-row"><span className="k">判讀</span><span className={`v report-judge ${r.judge === "正常" ? "ok" : "abn"}`}>{r.judge}</span></div>}
                  </>
                ) : (
                  <>
                    <div className="kv-row"><span className="k">檢驗項目</span><span className="v">{r.item}</span></div>
                    <div className="kv-row"><span className="k">醫事機構</span><span className="v">{r.org}</span></div>
                  </>
                )}
              </div>
              <Icon name="chev-right" size={16} className="chev"/>
            </div>
          ))}
        </div>
        </>)}

        <div className="h-16"/>
      </div>
    </>
  );
}

window.ReportsScreen = ReportsScreen;
