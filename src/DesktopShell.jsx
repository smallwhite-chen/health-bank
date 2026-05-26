// Desktop shell — horizontal top nav + centered content
// (Refactored from the sidebar shell to match the new design that
// places primary nav along the top bar.)

function DesktopShell({
  current,
  activeTab,
  navigate,
  openSheet,
  children,
}) {
  const navItems = [
    { id: "home",      label: "首頁" },
    { id: "visits",    label: "就醫紀錄" },
    { id: "reports",   label: "檢驗報告" },
    { id: "favorites", label: "常用功能" },
    { id: "services",  label: "全部服務" },
  ];

  return (
    <div className="desktop-stage" data-screen-label={current.screen}>
      <div className="desktop-shell">
        <header className="dt-topnav">
          <button className="dt-logo" onClick={() => navigate("home")}>
            <span className="dt-logo-mark">H</span>
            <span className="dt-logo-text">健康存摺</span>
          </button>

          <nav className="dt-nav">
            {navItems.map(it => (
              <button
                key={it.id}
                className={`dt-nav-item ${activeTab === it.id ? "active" : ""}`}
                onClick={() => navigate(it.id)}
              >
                {it.label}
              </button>
            ))}
          </nav>

          <div className="dt-actions">
            <button className="dt-pill" onClick={() => openSheet("a11y")}>
              <Icon name="accessibility" size={15}/>
              <span>無障礙設定</span>
            </button>
            <button className="dt-pill" onClick={() => navigate("reminders")}>
              <Icon name="bell" size={15}/>
              <span>提醒</span>
            </button>
          </div>
        </header>

        <main className="dt-main">
          {children}
        </main>

        <footer className="dt-footer">
          <nav className="dt-footer-links">
            <a href="#" onClick={(e) => e.preventDefault()}>隱私權政策</a>
            <span className="dt-footer-sep">｜</span>
            <a href="#" onClick={(e) => e.preventDefault()}>資訊安全政策</a>
            <span className="dt-footer-sep">｜</span>
            <a href="#" onClick={(e) => e.preventDefault()}>政府網站資料開放宣言</a>
          </nav>
          <span className="dt-footer-sep">｜</span>
          <div className="dt-footer-stat">
            自 103/12/25 起，參訪累計：285,325,744 人次
          </div>
        </footer>
      </div>
    </div>
  );
}

window.DesktopShell = DesktopShell;
