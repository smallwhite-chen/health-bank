// Modals + sheets — used across the app
const { useState: useMS } = React;

// Generic bottom sheet wrapper
function Sheet({ title, onClose, children, footer }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="grabber"/>
        <div className="sheet-head">
          <div className="sheet-title">{title}</div>
          <button className="close" onClick={onClose}><Icon name="plus" size={18} style={{ transform:"rotate(45deg)" }}/></button>
        </div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </div>
    </div>
  );
}

// Family switch sheet
function FamilySwitchSheet({ onClose, onPick }) {
  const members = ["陳小黑", "李天白", "王智仙"];
  return (
    <Sheet title="檢視家人健康資訊" onClose={onClose}>
      <div style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.7 }}>
        您可以切換檢視家人的健康存摺資料，方便即時關心家人健康狀態！
      </div>
      <div style={{ marginTop:18, fontSize:14, color:"var(--text-primary)", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
        <Icon name="switch" size={14}/> 前往眷屬設定
      </div>
      <div style={{ fontSize:12, color:"var(--text-tertiary)", marginTop:4 }}>
        請點選您可查看的人員姓名，進行檢視資料切換
      </div>
      <div className="family-list">
        {members.map(m => (
          <div key={m} className="family-row" onClick={() => onPick && onPick(m)} style={{ cursor:"pointer" }}>
            <span>{m}</span>
            <span className="go">點選切換 <Icon name="chev-right" size={12}/></span>
          </div>
        ))}
      </div>
      <div style={{ fontSize:13, color:"var(--text-secondary)", fontWeight:600, marginTop:18 }}>注意事項：</div>
      <div className="note-text">
        感謝您使用衛生福利部中央健康保險署（下稱本署）所提供之健康存摺。為了保障使用者的權益，請務必詳讀本注意事項。日後本署若有修改或變更本注意事項之內容，修改後之內容將公布於健康存摺畫面上（含全民健保行動快易通[健康存摺App及網頁版]）。若您於本注意事項修改後仍繼續使用健康存摺之眷屬授權功能，即視為您已閱讀、瞭解並同意接受本注意事項。如您對本注意事項的內容有任何疑慮或異議時，請停止使用授權服務。
      </div>
    </Sheet>
  );
}

// Accessibility
function A11ySheet({ onClose, state, setState }) {
  const set = (k, v) => setState({ ...state, [k]: v });
  const reset = () => setState({ theme: "day", size: "中", lineHeight: "預設", letterSpacing: "預設" });
  const themes  = [{ k: "day", label: "日間模式" }, { k: "night", label: "夜間模式" }];
  const sizes   = [
    { k: "小",   a: 15 },
    { k: "中",   a: 18 },
    { k: "大",   a: 22 },
  ];
  const heights  = ["預設", "1.5倍", "2倍"];
  const spacings = ["預設", "0.14倍", "0.12倍"];
  return (
    <Sheet
      title="無障礙設定"
      onClose={onClose}
      footer={<button className="a11y-reset" onClick={reset}>重置設定</button>}
    >
      <div className="chip-group-label" style={{ marginTop: 4 }}>日夜模式</div>
      <div className="a11y-group a11y-group-2">
        {themes.map(t => (
          <button
            key={t.k}
            className={state.theme === t.k ? "active" : ""}
            onClick={() => set("theme", t.k)}
          >{t.label}</button>
        ))}
      </div>

      <div className="chip-group-label">字體大小</div>
      <div className="a11y-group a11y-group-3">
        {sizes.map(s => (
          <button
            key={s.k}
            className={state.size === s.k ? "active" : ""}
            onClick={() => set("size", s.k)}
          >
            <span className="a11y-a" style={{ fontSize: s.a }}>A</span>
            <span className="a11y-a-label">{s.k}</span>
          </button>
        ))}
      </div>

      <div className="chip-group-label">行高</div>
      <div className="a11y-group">
        {heights.map(s => (
          <button
            key={s}
            className={state.lineHeight === s ? "active" : ""}
            onClick={() => set("lineHeight", s)}
          >{s}</button>
        ))}
      </div>

      <div className="chip-group-label">字距</div>
      <div className="a11y-group">
        {spacings.map(s => (
          <button
            key={s}
            className={state.letterSpacing === s ? "active" : ""}
            onClick={() => set("letterSpacing", s)}
          >{s}</button>
        ))}
      </div>
      <div style={{ height: 4 }}/>
    </Sheet>
  );
}

// Visits advanced filter
function VisitFilterSheet({ onClose, value, onApply }) {
  const [v, setV] = React.useState({ keyword: "", customStart: "", customEnd: "", ...value });
  const times = ["近 1 個月", "近 3 個月", "近 6 個月", "近 1 年", "全部", "自訂"];
  const cats  = ["西醫", "中醫", "牙醫"];
  const meds  = ["藥品", "非藥品", "檢驗(查)"];
  const toggle = (arr, x) => arr.includes(x) ? arr.filter(y => y !== x) : [...arr, x];
  return (
    <Sheet title="進階篩選" onClose={onClose} footer={
      <>
        <button onClick={() => setV({ keyword: "", time: "全部", customStart: "", customEnd: "", cats: [], meds: [] })}>重置條件</button>
        <button className="primary" onClick={() => { onApply(v); onClose(); }}>查看篩選結果(40筆)</button>
      </>
    }>
      <div className="chip-group-label" style={{ marginTop: 4 }}>關鍵字搜尋</div>
      <div style={{ position:"relative", marginTop: 8 }}>
        <span style={{ position:"absolute", top:"50%", left:14, transform:"translateY(-50%)", color:"var(--text-tertiary)", display:"inline-flex" }}>
          <Icon name="search" size={16}/>
        </span>
        <input
          type="text"
          placeholder="搜尋醫事機構、科別、用藥、醫囑..."
          value={v.keyword}
          onChange={e => setV({ ...v, keyword: e.target.value })}
          style={{
            width:"100%", padding:"12px 14px 12px 40px",
            border:"1px solid var(--border-soft)", borderRadius:"var(--r-md)",
            fontSize:14, fontFamily:"inherit", color:"var(--text-primary)",
            background:"var(--bg-surface)", boxSizing:"border-box"
          }}
        />
      </div>
      <div style={{ fontSize:11, color:"var(--text-tertiary)", marginTop:4 }}>
        搜尋範圍：就醫日期、機構、科別、醫師、用藥、醫囑等資料欄位
      </div>

      <div className="chip-group-label">時間區間</div>
      <div className="chip-group">
        {times.map(t => <button key={t} className={`chip-btn ${v.time === t ? "active" : ""}`} onClick={() => setV({ ...v, time: t })}>{t}</button>)}
      </div>
      {v.time === "自訂" && (
        <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:10 }}>
          <input type="date" value={v.customStart} onChange={e => setV({ ...v, customStart: e.target.value })}
            style={{ flex:1, padding:"10px 12px", border:"1px solid var(--border-soft)", borderRadius:"var(--r-md)", fontSize:13, fontFamily:"inherit", background:"var(--bg-surface)", color:"var(--text-primary)" }}/>
          <span style={{ color:"var(--text-tertiary)", fontSize:13 }}>至</span>
          <input type="date" value={v.customEnd} onChange={e => setV({ ...v, customEnd: e.target.value })}
            style={{ flex:1, padding:"10px 12px", border:"1px solid var(--border-soft)", borderRadius:"var(--r-md)", fontSize:13, fontFamily:"inherit", background:"var(--bg-surface)", color:"var(--text-primary)" }}/>
        </div>
      )}

      <div className="chip-group-label">科別</div>
      <div className="chip-group">
        {cats.map(c => <button key={c} className={`chip-btn ${v.cats.includes(c) ? "active" : ""}`} onClick={() => setV({ ...v, cats: toggle(v.cats, c) })}>{c}</button>)}
      </div>
      <div className="chip-group-label">醫囑資料</div>
      <div className="chip-group" style={{ marginBottom: 10 }}>
        {meds.map(c => <button key={c} className={`chip-btn ${v.meds.includes(c) ? "active" : ""}`} onClick={() => setV({ ...v, meds: toggle(v.meds, c) })}>{c}</button>)}
      </div>
    </Sheet>
  );
}

// Reports filter
function ReportFilterSheet({ onClose, value, onApply, scope }) {
  const [v, setV] = React.useState(value);
  const times = ["近 1 個月", "近 3 個月", "近 6 個月", "近 1 年", "全部"];
  const cats = ["癌症篩檢結果", "血糖檢驗報告", "血脂檢驗報告", "影像或病理檢查報告", "其他檢驗資料"];
  const otherCats = ["全部", "尿液檢查", "糞便檢查", "血液學檢查", "一般生化學檢查", "輸血前檢查", "免疫學檢查", "細菌學與黴菌檢查", "病毒學檢查", "過敏免疫檢查 / 其他檢查"];
  const toggle = (arr, x) => arr.includes(x) ? arr.filter(y => y !== x) : [...arr, x];
  // 範圍 = 當前分類；「全部」才提供「檢驗類別」多選
  const isAll = !scope || scope === "全部";
  const isOther = scope === "其他檢驗資料";
  return (
    <Sheet title="進階篩選" onClose={onClose} footer={
      <>
        <button onClick={() => setV({ time: "全部", cats: [], examCat: "全部" })}>重置條件</button>
        <button className="primary" onClick={() => { onApply(v); onClose(); }}>查看篩選結果</button>
      </>
    }>
      {!isAll && (
        <div className="filter-scope-hint">篩選範圍：<b>{scope}</b></div>
      )}
      <div className="chip-group-label" style={{ marginTop: 4 }}>時間區間</div>
      <div className="chip-group">
        {times.map(t => <button key={t} className={`chip-btn ${v.time === t ? "active" : ""}`} onClick={() => setV({ ...v, time: t })}>{t}</button>)}
      </div>
      {isAll && (
        <>
          <div className="chip-group-label">檢驗類別</div>
          <div className="chip-group" style={{ marginBottom: 10 }}>
            {cats.map(c => <button key={c} className={`chip-btn ${v.cats.includes(c) ? "active" : ""}`} onClick={() => setV({ ...v, cats: toggle(v.cats, c) })}>{c}</button>)}
          </div>
        </>
      )}
      {isOther && (
        <>
          <div className="chip-group-label">檢查類別</div>
          <div className="filter-select-wrap">
            <select
              className="filter-select"
              value={v.examCat || "全部"}
              onChange={(e) => setV({ ...v, examCat: e.target.value })}
            >
              {otherCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <svg className="filter-select-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </>
      )}
    </Sheet>
  );
}

Object.assign(window, { Sheet, FamilySwitchSheet, A11ySheet, VisitFilterSheet, ReportFilterSheet });
