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
        {favoriteKey ? (
          <button
            className="info"
            onClick={onToggleFav}
            aria-label={isFav ? "從常用功能移除" : "加入常用功能"}
            style={{ background:"none", border:0, padding:4, cursor:"pointer", color: isFav ? "var(--accent-orange, #f89808)" : "var(--text-tertiary)" }}
          >
            <Icon name={isFav ? "heart-fill" : "heart"} size={18}/>
          </button>
        ) : (
          <span className="info"><Icon name="info" size={16}/></span>
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
      <Icon name="chev-right" size={16} className="chev"/>
    </div>
  );
}

Object.assign(window, { StatusBar, TopBar, DetailHeader, BottomTabBar, PageTitle, VisitRow });
