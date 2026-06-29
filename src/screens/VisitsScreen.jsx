function VisitsScreen({ navigate, openSheet, isFav, onToggleFav, currentMember, onBackToSelf }) {
  const { visits } = window.Data;
  const empty = useEmptyState();
  const [filter, setFilter] = React.useState("全部");
  const [sortDesc, setSortDesc] = React.useState(true);
  const [bannerHidden, setBannerHidden] = React.useState(() => {
    try { return localStorage.getItem("hb_visits_banner_hidden") === "1"; } catch (e) { return false; }
  });
  const hideBanner = () => { try { localStorage.setItem("hb_visits_banner_hidden", "1"); } catch (e) {} setBannerHidden(true); };
  const toggleBanner = () => setBannerHidden((h) => {
    const next = !h;
    try { localStorage.setItem("hb_visits_banner_hidden", next ? "1" : "0"); } catch (e) {}
    return next;
  });
  const tabs = ["全部", "西醫", "中醫", "牙醫"];
  const baseRows = empty ? [] : (filter === "全部" ? visits : visits.filter(v => v.category === filter));
  const rows = sortDesc ? baseRows : [...baseRows].reverse();

  return (
    <>
      <TopBar onA11y={() => openSheet("a11y")} onReminders={() => navigate("reminders")} onLogo={() => navigate("home")}/>
      <div className="app-scroll">
        <ViewingOtherBanner member={currentMember} onBackToSelf={onBackToSelf}/>
        <PageTitle favoriteKey="visits" isFav={isFav} onToggleFav={onToggleFav}>
          就醫紀錄
          <button
            className="info"
            onClick={toggleBanner}
            aria-label="單元說明"
            style={{ background:"none", border:0, padding:4, cursor:"pointer", color: !bannerHidden ? "var(--brand-700)" : "var(--text-tertiary)" }}
          >
            <Icon name="info" size={18} />
          </button>
        </PageTitle>

        {!bannerHidden && (
        <div className="info-banner">
          健康存摺提供最近三年的就醫紀錄，可查詢就醫時間、機構、用藥、醫囑等資訊
          <div>
            <button className="dismiss" onClick={hideBanner}>不再顯示此訊息</button>
          </div>
        </div>
        )}

        <div className="pill-tabs">
          {tabs.map(t => (
            <button
              key={t}
              className={`pill-tab ${filter === t ? "active" : ""}`}
              onClick={() => setFilter(t)}
            >{t}</button>
          ))}
        </div>

        <div className="report-sec-head visits-sec-head">
          <div className="report-sec-head-main">
            <h2 className="report-sec-title">
              <Icon name="stetho" size={16} className="ico" /> {filter === "全部" ? "全部就醫紀錄" : filter + "就醫紀錄"}
            </h2>
          </div>
          <button className="filter-btn" onClick={() => openSheet("visitFilter")}>
            <Icon name="sliders" size={14}/> 篩選
          </button>
        </div>

        <div className="count-bar">
          <span>共 {rows.length} 筆就醫紀錄</span>
          <button
            className="sort-toggle"
            onClick={() => setSortDesc(d => !d)}
            aria-label="切換排序方向"
          >
            <Icon name="sort" size={12}/> 就醫日期{sortDesc ? "近到遠" : "遠到近"}
          </button>
        </div>

        <div style={{ padding:"0 16px" }}>
          {rows.map(v => (
            <VisitRow key={v.id} v={v} onClick={() => navigate("visitDetail", { id: v.id })}/>
          ))}
          {rows.length === 0 && (empty
            ? <EmptyState label="尚無就醫紀錄" hint="最近三年內查無就醫資料" />
            : (
            <div style={{ textAlign:"center", padding: 40, color:"var(--text-muted)", fontSize:14 }}>
              沒有符合條件的紀錄
            </div>
            )
          )}
        </div>

        <div className="h-16"/>
      </div>
    </>
  );
}

window.VisitsScreen = VisitsScreen;
