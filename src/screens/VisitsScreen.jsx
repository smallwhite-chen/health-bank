function VisitsScreen({ navigate, openSheet, isFav, onToggleFav }) {
  const { visits } = window.Data;
  const [filter, setFilter] = React.useState("全部");
  const tabs = ["全部", "西醫", "中醫", "牙醫"];
  const rows = filter === "全部" ? visits : visits.filter(v => v.category === filter);

  return (
    <>
      <TopBar onA11y={() => openSheet("a11y")} onReminders={() => navigate("reminders")} onLogo={() => navigate("home")}/>
      <div className="app-scroll">
        <div className="info-banner">
          提供最近三年的就醫紀錄，可查詢就醫時間、機構、用藥、醫囑等資訊
        </div>

        <PageTitle favoriteKey="visits" isFav={isFav} onToggleFav={onToggleFav} right={<button className="filter-btn" onClick={() => openSheet("visitFilter")}><Icon name="sliders" size={14}/> 進階篩選</button>}>
          就醫紀錄
        </PageTitle>

        <div className="pill-tabs">
          {tabs.map(t => (
            <button
              key={t}
              className={`pill-tab ${filter === t ? "active" : ""}`}
              onClick={() => setFilter(t)}
            >{t}</button>
          ))}
        </div>

        <div style={{ padding:"0 16px" }}>
          {rows.map(v => (
            <VisitRow key={v.id} v={v} onClick={() => navigate("visitDetail", { id: v.id })}/>
          ))}
          {rows.length === 0 && (
            <div style={{ textAlign:"center", padding: 40, color:"var(--text-muted)", fontSize:14 }}>
              沒有符合條件的紀錄
            </div>
          )}
        </div>

        <div className="h-16"/>
      </div>
    </>
  );
}

window.VisitsScreen = VisitsScreen;
