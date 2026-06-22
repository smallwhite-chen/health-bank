// 全部服務 — 所有分類展開於同一頁面，支援捷徑捲動 + 捲動偵測
function AllServicesScreen({ navigate, openSheet }) {
  const { serviceCategories, services } = window.Data;
  const [bannerHidden, setBannerHidden] = React.useState(() => {
    try { return localStorage.getItem("hb_services_banner_hidden") === "1"; } catch (e) { return false; }
  });
  const hideBanner = () => { try { localStorage.setItem("hb_services_banner_hidden", "1"); } catch (e) {} setBannerHidden(true); };
  const toggleBanner = () => setBannerHidden((h) => {
    const next = !h;
    try { localStorage.setItem("hb_services_banner_hidden", next ? "1" : "0"); } catch (e) {}
    return next;
  });
  const [activeCat, setActiveCat] = React.useState(serviceCategories[0]);
  const [query, setQuery] = React.useState("");
  const [showAll, setShowAll] = React.useState(false);
  const scrollRef = React.useRef(null);
  const sectionRefs = React.useRef({});
  const tabsRef = React.useRef(null);
  const isClickScrolling = React.useRef(false);

  // --- Click tab → scroll to section ---
  const goToCat = (c) => {
    setActiveCat(c);
    const sectionEl = sectionRefs.current[c];
    if (!sectionEl) return;
    isClickScrolling.current = true;

    const scrollEl = scrollRef.current;
    const topnav = document.querySelector(".dt-topnav");
    const stickyEl = document.querySelector(".services-sticky-top");
    const stickyH = stickyEl ? stickyEl.offsetHeight : 0;

    // Mobile: .app-scroll has overflow-y scroll
    if (scrollEl && scrollEl.scrollHeight > scrollEl.clientHeight) {
      const containerTop = scrollEl.getBoundingClientRect().top;
      const sectionTop = sectionEl.getBoundingClientRect().top;
      const offset = scrollEl.scrollTop + (sectionTop - containerTop) - stickyH - 8;
      scrollEl.scrollTop = Math.max(0, offset);
    } else {
      // Desktop: window scrolls
      const topnavBottom = topnav ? topnav.getBoundingClientRect().bottom : 0;
      const sectionTop = sectionEl.getBoundingClientRect().top + window.scrollY;
      const target = sectionTop - topnavBottom - stickyH - 16;
      window.scrollTo({ top: Math.max(0, target) });
    }

    setTimeout(() => { isClickScrolling.current = false; }, 600);
  };

  // --- Scroll spy: listen on both window + container (works for mobile & desktop) ---
  React.useEffect(() => {
    if (query) return;

    const getThreshold = () => {
      const topnav = document.querySelector(".dt-topnav");
      const sticky = document.querySelector(".services-sticky-top");
      const scrollEl = scrollRef.current;
      const containerTop = scrollEl ? scrollEl.getBoundingClientRect().top : 0;
      const topnavBottom = topnav ? topnav.getBoundingClientRect().bottom : containerTop;
      const stickyH = sticky ? sticky.offsetHeight : 0;
      return Math.max(topnavBottom, containerTop) + stickyH + 20;
    };

    const onScroll = () => {
      if (isClickScrolling.current) return;
      const threshold = getThreshold();
      let current = serviceCategories[0];
      for (const c of serviceCategories) {
        const el = sectionRefs.current[c];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) current = c;
      }
      setActiveCat(current);
    };

    const scrollEl = scrollRef.current;
    window.addEventListener("scroll", onScroll, { passive: true });
    if (scrollEl) scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollEl) scrollEl.removeEventListener("scroll", onScroll);
    };
  }, [query]);

  // --- Auto-scroll active tab into view in the tabs strip ---
  React.useEffect(() => {
    const tabsEl = tabsRef.current;
    if (!tabsEl) return;
    const activeBtn = tabsEl.querySelector(".pill-tab.active");
    if (!activeBtn) return;
    const btnLeft = activeBtn.offsetLeft;
    const btnW = activeBtn.offsetWidth;
    const containerW = tabsEl.offsetWidth;
    const target = btnLeft - containerW / 2 + btnW / 2;
    tabsEl.scrollLeft = Math.max(0, target);
  }, [activeCat]);

  // --- Filtered items for search ---
  const allItems = serviceCategories.flatMap(c =>
    (services[c] || []).map(it => ({ ...it, category: c }))
  );
  const filtered = query
    ? allItems.filter(it => it.label.includes(query) || it.category.includes(query))
    : null;

  return (
    <>
      <TopBar onA11y={() => openSheet && openSheet("a11y")} onReminders={() => navigate("reminders")} onLogo={() => navigate("home")}/>
      <div className="app-scroll" ref={scrollRef}>
        {!bannerHidden && (
        <div className="info-banner">
          您可以瀏覽健康存摺的所有單元，也可透過關鍵字搜尋快速找到所要功能
          <div>
            <button className="dismiss" onClick={hideBanner}>不再顯示此訊息</button>
          </div>
        </div>
        )}

        <PageTitle>
          全部服務
          <button
            className="info"
            onClick={toggleBanner}
            aria-label="單元說明"
            style={{ background:"none", border:0, padding:4, cursor:"pointer", color: !bannerHidden ? "var(--brand-700)" : "var(--text-tertiary)" }}
          >
            <Icon name="info" size={18} />
          </button>
        </PageTitle>

        {/* Sticky search + tabs */}
        <div className="services-sticky-top">
          <div className="search-wrap" style={{ padding: "0 16px 10px" }}>
            <div style={{ position:"relative" }}>
              <span className="ico-search" style={{ left: 14 }}><Icon name="search" size={16}/></span>
              <input
                className="search-input"
                placeholder="搜尋服務項目"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{
                    position:"absolute", top:"50%", right:12,
                    transform:"translateY(-50%)",
                    width:22, height:22, borderRadius:999,
                    border:0, background:"var(--bg-chip)",
                    color:"var(--text-secondary)", display:"inline-grid",
                    placeItems:"center", cursor:"pointer"
                  }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
                </button>
              )}
            </div>
          </div>

          {!query && (
            <div className="pill-tabs-row" style={{ paddingBottom: 0 }}>
              <div className="pill-tabs pill-tabs-scroll" ref={tabsRef}>
                {serviceCategories.map(c => (
                  <button
                    key={c}
                    className={`pill-tab${activeCat === c ? " active" : ""}`}
                    onClick={() => goToCat(c)}>
                    {c}
                  </button>
                ))}
              </div>
              <button
                className={`pill-tab pill-more-btn${showAll ? " active" : ""}`}
                onClick={() => setShowAll(s => !s)}
                aria-label="顯示全部分類">
                更多
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showAll ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }}>
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Expanded all-cats panel */}
        {!query && showAll && (
          <div className="pill-more-panel">
            <div className="pill-more-panel-title">全部分類</div>
            <div className="pill-more-panel-grid">
              {serviceCategories.map(c => (
                <button
                  key={c}
                  className={`pill-tab${activeCat === c ? " active" : ""}`}
                  onClick={() => { goToCat(c); setShowAll(false); }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search results */}
        {query ? (
          <>
            {filtered.length === 0 ? (
              <div style={{ padding:"40px 16px", textAlign:"center", color:"var(--text-tertiary)", fontSize:14 }}>
                找不到「{query}」相符的功能
              </div>
            ) : (
              <>
                <div className="cat-group-title" style={{ marginTop:8 }}>搜尋結果 {filtered.length} 項</div>
                <div className="service-list">
                  {filtered.map((it, i) => (
                    <div key={i} className="service-item">
                      <span className="ico"><Icon name={it.icon} size={20}/></span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <span className="name">{it.label}</span>
                        <div style={{ fontSize:11, color:"var(--text-tertiary)", marginTop:2 }}>{it.category}</div>
                      </div>
                      <Icon name="chev-right" size={16} className="chev"/>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          /* All categories expanded */
          <>
            {serviceCategories.map(c => (
              <React.Fragment key={c}>
                <div
                  className="cat-group-title"
                  data-cat={c}
                  ref={el => { if (el) sectionRefs.current[c] = el; }}
                  style={{ marginTop: 8 }}>
                  {c}
                </div>
                <div className="service-list">
                  {(services[c] || []).map((it, i) => (
                    <div key={i} className="service-item">
                      <span className="ico"><Icon name={it.icon} size={20}/></span>
                      <span className="name">{it.label}</span>
                      <Icon name="chev-right" size={16} className="chev"/>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </>
        )}

        <div className="h-16"/>
      </div>
    </>
  );
}

window.AllServicesScreen = AllServicesScreen;
