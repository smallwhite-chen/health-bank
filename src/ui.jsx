// Shared UI primitives
const { useState } = React;

function StatusBar() {
  return (
    <div className="phone-statusbar">
      <span>9:41</span>
      <span className="right">
        <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="6" width="3" height="4" rx="0.5"/><rect x="4.5" y="4" width="3" height="6" rx="0.5"/><rect x="9" y="2" width="3" height="8" rx="0.5"/><rect x="13.5" y="0" width="3" height="10" rx="0.5"/></svg>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 4a9 9 0 0 1 12 0"/><path d="M3 6a6 6 0 0 1 8 0"/><circle cx="7" cy="8.5" r="0.8" fill="currentColor"/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="20" height="10" rx="2"/><rect x="2" y="2" width="16" height="7" rx="1" fill="currentColor"/><rect x="21.5" y="3.5" width="1.5" height="4" rx="0.5" fill="currentColor"/></svg>
      </span>
    </div>
  );
}

function TopBar({ onA11y, onReminders, onLogo }) {
  return (
    <div className="topbar">
      <div className="topbar-logo" onClick={onLogo} style={{ cursor: "pointer" }}>
        <span className="mark">H</span>
        <span>健康存摺</span>
      </div>
      <div className="topbar-actions">
        <button className="topbar-btn" onClick={onA11y}><Icon name="accessibility" size={16}/>無障礙設定</button>
        <button className="topbar-btn" onClick={onReminders}><Icon name="bell" size={16}/>提醒<span className="dot"/></button>
      </div>
    </div>
  );
}

function DetailHeader({ title, onBack }) {
  return (
    <div className="detail-header">
      <button className="back" onClick={onBack}>
        <Icon name="chev-left" size={18}/> 返回
      </button>
      <div className="title">{title}</div>
    </div>
  );
}

function BottomTabBar({ tab, onChange }) {
  const items = [
    { id: "home",      label: "首頁",     icon: "home" },
    { id: "visits",    label: "就醫紀錄", icon: "stetho" },
    { id: "reports",   label: "檢驗報告", icon: "report" },
    { id: "favorites", label: "常用功能", icon: "star" },
    { id: "services",  label: "全部服務", icon: "grid" },
  ];
  return (
    <nav className="tabbar" data-coach="tabbar" style={{ padding: '8px', height: '74px' }}>
      {items.map(it => (
        <button
          key={it.id}
          className={`tabbar-item ${tab === it.id ? "active" : ""}`}
          onClick={() => onChange(it.id)}
        >
          <span className="ico-wrap"><Icon name={it.icon} size={20}/></span>
          <span className="label">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

function PageTitle({ children, right, favoriteKey, isFav, onToggleFav }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 16px" }}>
      <h1 className="page-title">
        {children}
        {favoriteKey && (
          <button
            className="info"
            onClick={onToggleFav}
            aria-label={isFav ? "從常用功能移除" : "加入常用功能"}
            style={{ background:"none", border:0, padding:4, cursor:"pointer", color: isFav ? "var(--accent-orange, #f89808)" : "var(--text-tertiary)" }}
          >
            <Icon name={isFav ? "heart-fill" : "heart"} size={18}/>
          </button>
        )}
      </h1>
      {right}
    </div>
  );
}

function VisitRow({ v, onClick }) {
  return (
    <div className="list-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div className="kv-row"><span className="k">就醫日期</span><span className="v">{v.date} {v.category && <span className="tag" style={{ marginLeft:6 }}>{v.category}</span>}</span></div>
        <div className="kv-row"><span className="k">疾病分類</span><span className="v">{v.diagnosis}</span></div>
        <div className="kv-row"><span className="k">醫事機構</span><span className="v">{v.org}</span></div>
      </div>
      <span className="list-card-more">詳細記錄</span>
      <Icon name="chev-right" size={16} className="chev"/>
    </div>
  );
}

Object.assign(window, { StatusBar, TopBar, DetailHeader, BottomTabBar, PageTitle, VisitRow });

// ============================================================
// Back to Top button
// Shows after scrolling > 1 viewport height, auto-hides in 5s,
// reappears on next scroll. Works on both mobile (.app-scroll)
// and desktop (window scroll).
// ============================================================
function BackToTop() {
  const [visible, setVisible] = React.useState(false);
  const timerRef = React.useRef(null);
  const lastAppScrollRef = React.useRef(null);

  React.useEffect(() => {
    const resetTimer = (show) => {
      clearTimeout(timerRef.current);
      if (show) {
        setVisible(true);
        timerRef.current = setTimeout(() => setVisible(false), 5000);
      } else {
        setVisible(false);
      }
    };

    const onScroll = (e) => {
      const el = e.target;
      let scrollTop = 0, viewH = 0;

      if (!el || el === document || el === document.documentElement || el === document.body) {
        scrollTop = window.scrollY;
        viewH = window.innerHeight;
      } else if (el.scrollTop !== undefined) {
        scrollTop = el.scrollTop;
        viewH = el.clientHeight;
      } else {
        scrollTop = window.scrollY;
        viewH = window.innerHeight;
      }

      if (scrollTop > viewH) {
        resetTimer(true);
      } else {
        resetTimer(false);
      }
    };

    // Window scroll (desktop)
    window.addEventListener("scroll", onScroll, { passive: true });
    // Document capture (catches non-bubbling element scroll events)
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });

    // Directly attach to .app-scroll (most reliable for mobile container)
    const attachToAppScroll = () => {
      const el = document.querySelector(".app-scroll");
      if (el && el !== lastAppScrollRef.current) {
        if (lastAppScrollRef.current) {
          lastAppScrollRef.current.removeEventListener("scroll", onScroll);
        }
        el.addEventListener("scroll", onScroll, { passive: true });
        lastAppScrollRef.current = el;
      }
    };
    attachToAppScroll();

    // Re-attach when navigation swaps the .app-scroll element
    const mo = new MutationObserver(attachToAppScroll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      if (lastAppScrollRef.current) {
        lastAppScrollRef.current.removeEventListener("scroll", onScroll);
      }
      mo.disconnect();
    };
  }, []);

  const handleClick = () => {
    setVisible(false);
    clearTimeout(timerRef.current);
    const appScroll = document.querySelector(".app-scroll");
    // Mobile: scroll the container; Desktop: scroll window
    if (appScroll && appScroll.scrollTop > 0) {
      appScroll.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      className={`back-to-top${visible ? " is-visible" : ""}`}
      onClick={handleClick}
      aria-label="回到頂端">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5"/>
        <path d="m5 12 7-7 7 7"/>
      </svg>
      <span>Top</span>
    </button>
  );
}

Object.assign(window, { StatusBar, TopBar, DetailHeader, BottomTabBar, PageTitle, VisitRow, BackToTop });
