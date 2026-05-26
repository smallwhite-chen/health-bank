function AllServicesScreen({ navigate, openSheet }) {
  const { serviceCategories, services } = window.Data;
  const [cat, setCat] = React.useState(serviceCategories[0]);
  const [showAll, setShowAll] = React.useState(false);
  const items = services[cat] || [];
  const pickCat = (c) => { setCat(c); setShowAll(false); };

  return (
    <>
      <TopBar onA11y={() => openSheet && openSheet("a11y")} onReminders={() => navigate("reminders")} onLogo={() => navigate("home")}/>
      <div className="app-scroll">
        <div className="info-banner">
          您可以瀏覽健康存摺的所有單元，也可透過關鍵字搜尋快速找到所要功能
        </div>

        <PageTitle>全部服務</PageTitle>

        <div className="search-wrap" style={{ padding: "0 16px 10px" }}>
          <div style={{ position:"relative" }}>
            <span className="ico-search" style={{ left: 14 }}><Icon name="search" size={16}/></span>
            <input className="search-input" placeholder="搜尋服務項目" />
          </div>
        </div>

        <div className="pill-tabs-row">
          <div className="pill-tabs pill-tabs-scroll">
            {serviceCategories.map(c => (
              <button key={c} className={`pill-tab ${cat === c ? "active" : ""}`} onClick={() => pickCat(c)}>{c}</button>
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
              {serviceCategories.map(c => (
                <button
                  key={c}
                  className={`pill-tab ${cat === c ? "active" : ""}`}
                  onClick={() => pickCat(c)}
                >{c}</button>
              ))}
            </div>
          </div>
        )}

        <div className="cat-group-title">{cat}</div>
        <div className="service-list">
          {items.map((it, i) => (
            <div key={i} className="service-item">
              <span className="ico"><Icon name={it.icon} size={20}/></span>
              <span className="name">{it.label}</span>
              <Icon name="chev-right" size={16} className="chev"/>
            </div>
          ))}
        </div>

        <div className="h-16"/>
      </div>
    </>
  );
}

window.AllServicesScreen = AllServicesScreen;
