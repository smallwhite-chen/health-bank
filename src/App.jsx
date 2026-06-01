// App root — route/stack state + phone frame
const { useState: useSt, useEffect: useEf } = React;

// Multi-page mode: when an HTML page sets window.__INITIAL_SCREEN__ before
// loading App.jsx, we treat each top-level screen as its own URL and
// share state across pages via localStorage.
const MP_MODE = typeof window !== "undefined" && typeof window.__INITIAL_SCREEN__ === "string";
const MP_PAGES = {
  home: "index.html",
  visits: "visits.html",
  visitDetail: "visit-detail.html",
  reports: "reports.html",
  reportDetail: "report-detail.html",
  favorites: "favorites.html",
  services: "services.html",
  reminders: "reminders.html",
  calendar: "calendar.html",
  editFavorites: "edit-favorites.html",
};

function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (v == null) return fallback;
    return JSON.parse(v);
  } catch (e) { return fallback; }
}
function writeLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "mode": "default",
    "viewport": "auto"
  }/*EDITMODE-END*/;
  const [tweaks, setTweaks] = useSt(() => readLS("hb_tweaks", TWEAK_DEFAULTS));
  const [editMode, setEditMode] = useSt(false);
  const [tweaksCollapsed, setTweaksCollapsed] = useSt(false);
  const [publicOpen, setPublicOpen] = useSt(false);
  const [winWidth, setWinWidth] = useSt(typeof window !== "undefined" ? window.innerWidth : 1200);

  // Track viewport width for the "auto" RWD mode
  useEf(() => {
    const onResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Resolve effective viewport (auto → mobile/desktop based on width)
  const RWD_BREAKPOINT = 900;
  const effectiveViewport =
    tweaks.viewport === "auto"
      ? (winWidth >= RWD_BREAKPOINT ? "desktop" : "mobile")
      : tweaks.viewport;

  useEf(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") setEditMode(true);
      if (d.type === "__deactivate_edit_mode") setEditMode(false);
    };
    window.addEventListener("message", onMsg);
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
    return () => window.removeEventListener("message", onMsg);
  }, []);
  const setTweak = (k, v) => {
    setTweaks(t => {
      const next = { ...t, [k]: v };
      writeLS("hb_tweaks", next);
      return next;
    });
    try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*"); } catch (e) {}
  };

  const initial = (() => {
    if (MP_MODE) {
      const params = {};
      try {
        const q = new URLSearchParams(window.location.search);
        if (q.get("id")) params.id = q.get("id");
      } catch (e) {}
      return [{ screen: window.__INITIAL_SCREEN__, params }];
    }
    try {
      const saved = JSON.parse(localStorage.getItem("hb_stack") || "null");
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (e) {}
    return [{ screen: "home", params: {} }];
  })();
  const [stack, setStack] = useSt(initial);
  const [sheet, setSheet] = useSt(null); // 'family' | 'a11y' | 'visitFilter' | 'reportFilter'
  const [toast, setToast] = useSt(null);
  const [visitFilter, setVisitFilter] = useSt({ time: "全部", cats: [], meds: [] });
  const [reportFilter, setReportFilter] = useSt({ time: "全部", cats: [] });
  const [a11y, setA11y] = useSt(() => readLS("hb_a11y", { theme: "day", size: "中", lineHeight: "預設", letterSpacing: "預設" }));
  const [currentMember, setCurrentMember] = useSt(() => readLS("hb_member", "陳小白"));
  useEf(() => { writeLS("hb_a11y", a11y); }, [a11y]);
  useEf(() => { writeLS("hb_member", currentMember); }, [currentMember]);
  const [favScreens, setFavScreens] = useSt(() => {
    try { return JSON.parse(localStorage.getItem("hb_fav_screens") || "[]"); } catch (e) { return []; }
  });
  const toggleFavScreen = (key, label) => {
    setFavScreens(prev => {
      const exists = prev.includes(key);
      const next = exists ? prev.filter(k => k !== key) : [...prev, key];
      try { localStorage.setItem("hb_fav_screens", JSON.stringify(next)); } catch (e) {}
      showToast(exists ? `已從常用功能移除「${label}」` : `已加入常用功能「${label}」`);
      return next;
    });
  };
  const [coach, setCoach] = useSt(false);
  const closeCoach = () => setCoach(false);

  useEf(() => {
    if (MP_MODE) return;
    try { localStorage.setItem("hb_stack", JSON.stringify(stack)); } catch (e) {}
  }, [stack]);

  // Apply desktop-mode / fluid-mobile classes on <body>
  useEf(() => {
    const b = document.body;
    if (effectiveViewport === "desktop") {
      b.classList.add("desktop-mode");
      b.classList.remove("fluid-mobile");
    } else {
      b.classList.remove("desktop-mode");
      // fluid-mobile = mobile UI that fills the viewport (no phone bezel chrome).
      // Active when "auto" mode resolves to mobile on a real browser window.
      if (tweaks.viewport === "auto") b.classList.add("fluid-mobile");
      else b.classList.remove("fluid-mobile");
    }
  }, [effectiveViewport, tweaks.viewport]);

  // Apply a11y globally
  useEf(() => {
    const root = document.documentElement;
    const sizeMap = { "最小": "13px", "小": "14px", "中": "16px", "大": "18px", "最大": "20px" };
    const lhMap = { "預設": "1.5", "1.5倍": "1.75", "2倍": "2" };
    const lsMap = { "預設": "normal", "0.14倍": "0.14em", "0.12倍": "0.12em" };
    root.style.fontSize = sizeMap[a11y.size] || "16px";
    root.style.lineHeight = lhMap[a11y.lineHeight] || "1.5";
    root.style.letterSpacing = lsMap[a11y.letterSpacing] || "normal";
    if (a11y.theme === "night") document.body.classList.add("night-mode");
    else document.body.classList.remove("night-mode");
  }, [a11y]);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2000); };

  const current = stack[stack.length - 1];

  // Re-trigger coach marks whenever entering home in guided mode
  useEf(() => {
    if (current.screen === "home" && tweaks.mode === "guided") setCoach(true);
    else setCoach(false);
  }, [current.screen, tweaks.mode]);

  const navigate = (target, params = {}) => {
    if (MP_MODE) {
      if (target === -1) {
        // Use history if we have one in this tab; else go to a parent page.
        if (window.history.length > 1) {
          window.history.back();
        } else {
          const parentMap = {
            visitDetail: "visits.html",
            reportDetail: "reports.html",
            editFavorites: "favorites.html",
            reminders: "index.html",
            calendar: "index.html",
          };
          window.location.href = parentMap[window.__INITIAL_SCREEN__] || "index.html";
        }
        return;
      }
      if (MP_PAGES[target]) {
        const q = params && params.id ? "?id=" + encodeURIComponent(params.id) : "";
        window.location.href = MP_PAGES[target] + q;
        return;
      }
      // fallback to in-page stack push for unknown targets
      setStack(s => [...s, { screen: target, params }]);
      return;
    }
    if (target === -1) {
      // back
      setStack(s => {
        if (s.length > 1) return s.slice(0, -1);
        // Edit screens always have a parent; fall back to it so the
        // back action is never a no-op (e.g. after a direct deep link).
        const fallbackMap = {
          editFavorites: "favorites",
          visitDetail: "visits",
          reportDetail: "reports",
          reminders: "home",
          calendar: "home",
        };
        const curr = s[s.length - 1]?.screen;
        const fallback = fallbackMap[curr] || "home";
        return [{ screen: fallback, params: {} }];
      });
      return;
    }
    // tab switch: clear stack
    const tabs = ["home", "visits", "reports", "favorites", "services"];
    if (tabs.includes(target)) {
      setStack([{ screen: target, params: {} }]);
      return;
    }
    // push
    setStack(s => [...s, { screen: target, params }]);
  };

  const tabFor = (screen) => {
    if (screen === "visitDetail") return "visits";
    if (screen === "reportDetail") return "reports";
    if (screen === "editFavorites") return "favorites";
    if (screen === "reminders") return null;
    return screen;
  };
  const activeTab = tabFor(current.screen);
  const hideTabBar = current.screen === "reminders" || current.screen === "editFavorites" || current.screen === "calendar";

  const openSheet = (name) => setSheet(name);
  const closeSheet = () => setSheet(null);

  const isDesktop = effectiveViewport === "desktop";
  let body;
  switch (current.screen) {
    case "home":
      body = isDesktop
        ? <HomeScreenDesktop navigate={navigate} openSheet={openSheet} currentMember={currentMember}/>
        : <HomeScreen navigate={navigate} openSheet={openSheet} currentMember={currentMember}/>;
      break;
    case "visits":        body = <VisitsScreen navigate={navigate} openSheet={openSheet} filter={visitFilter} isFav={favScreens.includes("visits")} onToggleFav={() => toggleFavScreen("visits","就醫紀錄")}/>; break;
    case "visitDetail":   body = <VisitDetailScreen navigate={navigate} params={current.params}/>; break;
    case "reports":       body = <ReportsScreen navigate={navigate} openSheet={openSheet} filter={reportFilter} isFav={favScreens.includes("reports")} onToggleFav={() => toggleFavScreen("reports","檢驗報告")}/>; break;
    case "reportDetail":  body = <ReportDetailScreen navigate={navigate} params={current.params}/>; break;
    case "favorites":     body = <FavoritesScreen navigate={navigate} openSheet={openSheet}/>; break;
    case "services":      body = <AllServicesScreen navigate={navigate} openSheet={openSheet}/>; break;
    case "reminders":     body = <RemindersScreen navigate={navigate}/>; break;
    case "calendar":      body = isDesktop
                            ? <CalendarScreenDesktop navigate={navigate}/>
                            : <CalendarScreen navigate={navigate}/>; break;
    case "editFavorites": body = isDesktop
                            ? <EditFavoritesScreenDesktop navigate={navigate}/>
                            : <EditFavoritesScreen navigate={navigate}/>; break;
    default:              body = <HomeScreen navigate={navigate} openSheet={openSheet}/>;
  }

  const sheets = (
    <>
      {sheet === "family" && <FamilySwitchSheet onClose={closeSheet} onPick={(m) => { setCurrentMember(m); closeSheet(); showToast(`已切換至 ${m}`); }}/>}
      {sheet === "a11y"   && <A11ySheet onClose={closeSheet} state={a11y} setState={setA11y}/>}
      {sheet === "visitFilter"  && <VisitFilterSheet  onClose={closeSheet} value={visitFilter}  onApply={setVisitFilter}/>}
      {sheet === "reportFilter" && <ReportFilterSheet onClose={closeSheet} value={reportFilter} onApply={setReportFilter}/>}
    </>
  );

  const shell = isDesktop ? (
    <DesktopShell
      current={current}
      activeTab={activeTab}
      stack={stack}
      navigate={navigate}
      openSheet={openSheet}
      currentMember={currentMember}
    >
      {body}
      {sheets}
      {toast && <div className="toast">{toast}</div>}
      <BackToTop/>
    </DesktopShell>
  ) : (
    <div className="stage">
      <div className="phone" data-screen-label={current.screen} data-tabbar="floating">
        <div className="notch"/>
        <StatusBar/>
        <div className="app-shell">
          {body}
          {!hideTabBar && <BottomTabBar tab={activeTab} onChange={(t) => navigate(t)}/>}
        </div>

        {sheets}

        {toast && <div className="toast">{toast}</div>}
        {coach && current.screen === "home" && <CoachMarks onClose={closeCoach}/>}
        <BackToTop/>
      </div>
    </div>
  );

  return (
    <>
      {shell}

      {publicOpen ? (
          <div className="public-tweaks-panel">
            <div className="ptw-head">
              <div className="ptw-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 7h10"/><circle cx="17" cy="7" r="2"/>
                  <path d="M4 17h4"/><circle cx="11" cy="17" r="2"/><path d="M13 17h7"/>
                </svg>
                <span>原型設定</span>
              </div>
              <button
                className="ptw-close"
                onClick={() => setPublicOpen(false)}
                aria-label="關閉設定">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12M18 6 6 18"/>
                </svg>
              </button>
            </div>
            <div className="ptw-version">W3就醫紀錄 v2.1</div>

            <div className="ptw-section-label">裝置版型</div>
            <div className="ptw-grid ptw-grid-3">
              {[
                { k:"auto",    label:"自動",   hint:"依視窗" },
                { k:"mobile",  label:"手機版", hint:"390px" },
                { k:"desktop", label:"桌機版", hint:"≥1100px" },
              ].map(o => (
                <button key={o.k}
                  className={"ptw-opt" + (tweaks.viewport === o.k ? " is-active" : "")}
                  onClick={() => setTweak("viewport", o.k)}>
                  <span className="ptw-opt-label">{o.label}</span>
                  <span className="ptw-opt-hint">{o.hint}</span>
                </button>
              ))}
            </div>

            <div className="ptw-section-label">首頁引導</div>
            <div className="ptw-grid ptw-grid-2">
              {[
                { k:"default", label:"預設模式", hint:"不顯示引導" },
                { k:"guided",  label:"引導模式", hint:"進入首頁顯示" },
              ].map(o => (
                <button key={o.k}
                  className={"ptw-opt" + (tweaks.mode === o.k ? " is-active" : "")}
                  onClick={() => setTweak("mode", o.k)}>
                  <span className="ptw-opt-label">{o.label}</span>
                  <span className="ptw-opt-hint">{o.hint}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            className="public-tweaks-fab"
            onClick={() => setPublicOpen(true)}
            aria-label="打開原型設定">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 7h10"/><circle cx="17" cy="7" r="2"/>
              <path d="M4 17h4"/><circle cx="11" cy="17" r="2"/><path d="M13 17h7"/>
            </svg>
            <span>原型設定</span>
            <span className="ptw-fab-version">W3就醫紀錄 v2.1</span>
          </button>
        )}

      {editMode && (
        tweaksCollapsed ? (
          <button
            onClick={() => setTweaksCollapsed(false)}
            aria-label="展開 Tweaks"
            style={{
              position:"fixed", right:20, bottom:20,
              width:44, height:44, borderRadius:999,
              background:"#fff",
              border:"1px solid var(--border-soft)",
              boxShadow:"0 8px 22px rgba(0,0,0,0.18)",
              display:"grid", placeItems:"center",
              cursor:"pointer", zIndex:9999, fontFamily:"var(--font-sans)",
              color:"var(--text-secondary)"
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h10"/><circle cx="17" cy="7" r="2"/>
              <path d="M4 17h4"/><circle cx="11" cy="17" r="2"/><path d="M13 17h7"/>
            </svg>
          </button>
        ) : (
        <div style={{ position:"fixed", right:20, bottom:20, width:240, background:"#fff", border:"1px solid var(--border-soft)", borderRadius:12, boxShadow:"0 12px 30px rgba(0,0,0,0.18)", padding:14, zIndex:9999, fontFamily:"var(--font-sans)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ fontSize:14, fontWeight:700 }}>Tweaks</div>
            <button
              onClick={() => setTweaksCollapsed(true)}
              aria-label="收起 Tweaks"
              title="收起"
              style={{
                background:"transparent", border:0, padding:4, cursor:"pointer",
                color:"var(--text-tertiary)", display:"inline-grid", placeItems:"center",
                borderRadius:6
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>



          <div style={{ fontSize:12, color:"var(--text-secondary)", marginBottom:6 }}>裝置版型</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:6, marginBottom:14 }}>
            {[
              { k:"auto",    label:"自動",   hint:"依視窗" },
              { k:"mobile",  label:"手機版", hint:"390px" },
              { k:"desktop", label:"桌機版", hint:"≥1100px" },
            ].map(o => (
              <button key={o.k}
                onClick={() => setTweak("viewport", o.k)}
                style={{
                  padding:"10px 4px", borderRadius:10,
                  border:"1px solid " + (tweaks.viewport === o.k ? "var(--brand-700)" : "var(--border-soft)"),
                  background: tweaks.viewport === o.k ? "var(--brand-900)" : "#fff",
                  color: tweaks.viewport === o.k ? "#fff" : "var(--text-secondary)",
                  fontSize:12, cursor:"pointer", fontFamily:"inherit",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:2, lineHeight:1.4
                }}>
                <span style={{ fontWeight:600 }}>{o.label}</span>
                <span style={{ fontSize:10, opacity: tweaks.viewport === o.k ? 0.85 : 0.7 }}>{o.hint}</span>
              </button>
            ))}
          </div>

          <div style={{ fontSize:12, color:"var(--text-secondary)", marginBottom:6 }}>首頁引導</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {[
              { k:"default", label:"預設模式", hint:"不顯示引導" },
              { k:"guided",  label:"引導模式", hint:"進入首頁顯示" },
            ].map(o => (
              <button key={o.k}
                onClick={() => setTweak("mode", o.k)}
                style={{
                  padding:"10px 8px", borderRadius:10,
                  border:"1px solid " + (tweaks.mode === o.k ? "var(--brand-700)" : "var(--border-soft)"),
                  background: tweaks.mode === o.k ? "var(--brand-900)" : "#fff",
                  color: tweaks.mode === o.k ? "#fff" : "var(--text-secondary)",
                  fontSize:13, cursor:"pointer", fontFamily:"inherit",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:2, lineHeight:1.4
                }}>
                <span style={{ fontWeight:600 }}>{o.label}</span>
                <span style={{ fontSize:10, opacity: tweaks.mode === o.k ? 0.85 : 0.7 }}>{o.hint}</span>
              </button>
            ))}
          </div>
        </div>
        )
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
