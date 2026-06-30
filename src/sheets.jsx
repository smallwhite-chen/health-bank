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
function FamilySwitchSheet({ onClose, onPick, onGoSettings, currentMember, onBackToSelf }) {
  const members = ["陳小黑", "李天白", "王智仙"];
  const viewingOther = currentMember && currentMember !== "陳小白";
  return (
    <Sheet title="檢視家人健康資訊" onClose={onClose}>
      <div style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.7 }}>
        您可以切換檢視家人的健康存摺資料，方便即時關心家人健康狀態！
      </div>
      {viewingOther && (
        <button
          onClick={onBackToSelf}
          style={{ marginTop:14, width:"100%", display:"flex", alignItems:"center", gap:8, padding:"12px 14px", borderRadius:"var(--r-md)", border:"1px solid var(--brand-700)", background:"var(--brand-700)", color:"#fff", fontFamily:"inherit", fontSize:14, fontWeight:600, cursor:"pointer" }}>
          <Icon name="refresh" size={16}/>
          <span style={{ flex:1, textAlign:"left" }}>切換回本人健康資料</span>
          <Icon name="chev-right" size={16}/>
        </button>
      )}
      <button
        onClick={onGoSettings}
        style={{ marginTop:8, width:"100%", display:"flex", alignItems:"center", gap:8, padding:"12px 14px", borderRadius:"var(--r-md)", border:"1px solid var(--brand-100)", background:"var(--brand-50)", color:"var(--brand-900)", fontFamily:"inherit", fontSize:14, fontWeight:600, cursor:"pointer" }}>
        <Icon name="switch" size={16}/>
        <span style={{ flex:1, textAlign:"left" }}>前往眷屬管理設定</span>
        <Icon name="chev-right" size={16}/>
      </button>
      <div style={{ fontSize:12, color:"var(--text-tertiary)", marginTop:10 }}>
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
      footer={<>
        <button className="a11y-reset" onClick={reset}>恢復預設</button>
        <button className="primary" onClick={onClose}>確認</button>
      </>}
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
  const times = ["全部", "近 1 個月", "近 3 個月", "近 6 個月", "近 1 年", "自訂區間"];
  const meds  = ["藥品", "非藥品", "檢驗(查)"];
  const toggle = (arr, x) => arr.includes(x) ? arr.filter(y => y !== x) : [...arr, x];
  return (
    <Sheet title="進階篩選" onClose={onClose} footer={
      <>
        <button onClick={() => setV({ keyword: "", time: "全部", customStart: "", customEnd: "", meds: [] })}>清除條件</button>
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
      {v.time === "自訂區間" && (
        <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:10 }}>
          <input type="date" value={v.customStart} onChange={e => setV({ ...v, customStart: e.target.value })}
            style={{ flex:1, padding:"10px 12px", border:"1px solid var(--border-soft)", borderRadius:"var(--r-md)", fontSize:13, fontFamily:"inherit", background:"var(--bg-surface)", color:"var(--text-primary)" }}/>
          <span style={{ color:"var(--text-tertiary)", fontSize:13 }}>至</span>
          <input type="date" value={v.customEnd} onChange={e => setV({ ...v, customEnd: e.target.value })}
            style={{ flex:1, padding:"10px 12px", border:"1px solid var(--border-soft)", borderRadius:"var(--r-md)", fontSize:13, fontFamily:"inherit", background:"var(--bg-surface)", color:"var(--text-primary)" }}/>
        </div>
      )}

      <div className="chip-group-label">醫囑資料</div>
      <div className="chip-group" style={{ marginBottom: 10 }}>
        {meds.map(c => <button key={c} className={`chip-btn ${v.meds.includes(c) ? "active" : ""}`} onClick={() => setV({ ...v, meds: toggle(v.meds, c) })}>{c}</button>)}
      </div>
    </Sheet>
  );
}

// Reports filter
function ReportFilterSheet({ onClose, value, onApply, scope }) {
  const [v, setV] = React.useState({ customStart: "", customEnd: "", ...value });
  const times = ["全部", "近 1 個月", "近 3 個月", "近 6 個月", "近 1 年", "自訂區間"];
  const cats = ["癌症篩檢結果", "血糖檢驗報告", "血脂檢驗報告", "影像或病理檢查報告", "其他檢驗資料"];
  const otherCats = ["全部", "尿液檢查", "糞便檢查", "血液學檢查", "一般生化學檢查", "輸血前檢查", "免疫學檢查", "細菌學與黴菌檢查", "病毒學檢查", "過敏免疫檢查 / 其他檢查"];
  const toggle = (arr, x) => arr.includes(x) ? arr.filter(y => y !== x) : [...arr, x];
  // 範圍 = 當前分類；「全部」才提供「檢驗類別」多選
  const isAll = !scope || scope === "全部";
  const isOther = scope === "其他檢驗資料";
  const isImage = scope === "影像或病理檢查報告";
  const imageCats = ["全部", "細胞學檢查", "呼吸機能檢查", "循環機能檢查", "超音波檢查", "神經系統檢查", "耳鼻喉系統檢查", "眼部檢查", "負荷試驗", "核子醫學檢查 (造影 Scanning)", "內視鏡檢查", "放射線診療 (X光) 普通檢查", "特殊造影檢查"];
  return (
    <Sheet title="進階篩選" onClose={onClose} footer={
      <>
        <button onClick={() => setV({ time: "全部", cats: [], examCat: "全部", imageCat: "全部", customStart: "", customEnd: "" })}>清除條件</button>
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
      {v.time === "自訂區間" && (
        <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:10 }}>
          <input type="date" value={v.customStart} onChange={e => setV({ ...v, customStart: e.target.value })}
            style={{ flex:1, padding:"10px 12px", border:"1px solid var(--border-soft)", borderRadius:"var(--r-md)", fontSize:13, fontFamily:"inherit", background:"var(--bg-surface)", color:"var(--text-primary)" }}/>
          <span style={{ color:"var(--text-tertiary)", fontSize:13 }}>至</span>
          <input type="date" value={v.customEnd} onChange={e => setV({ ...v, customEnd: e.target.value })}
            style={{ flex:1, padding:"10px 12px", border:"1px solid var(--border-soft)", borderRadius:"var(--r-md)", fontSize:13, fontFamily:"inherit", background:"var(--bg-surface)", color:"var(--text-primary)" }}/>
        </div>
      )}
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
      {isImage && (
        <>
          <div className="chip-group-label">檢查類別</div>
          <div className="filter-select-wrap">
            <select
              className="filter-select"
              value={v.imageCat || "全部"}
              onChange={(e) => setV({ ...v, imageCat: e.target.value })}
            >
              {imageCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <svg className="filter-select-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </>
      )}
    </Sheet>
  );
}

Object.assign(window, { Sheet, FamilySwitchSheet, A11ySheet, VisitFilterSheet, ReportFilterSheet });

// 新增量測紀錄（視覺示意，不實際存資料）
function AddRecordSheet({ onClose, onSave, preset }) {
  const physio = (window.Data.health && window.Data.health.physio) || [];
  const initId = (preset && preset.id) || (physio[0] && physio[0].id) || "bp";
  const [mid, setMid] = React.useState(initId);
  const [sys, setSys] = React.useState("");
  const [dia, setDia] = React.useState("");
  const [val, setVal] = React.useState("");
  const [hr, setHr] = React.useState("");
  const today = "2026-06-15";
  const [date, setDate] = React.useState(today);
  const [time, setTime] = React.useState("08:00");
  const metric = window.Data.healthById[mid] || physio[0];
  const isBp = metric && metric.kind === "bp";
  const isEdit = preset && preset.mode === "edit";
  const inputStyle = {
    width: "100%", padding: "12px 14px", border: "1px solid var(--border-soft)",
    borderRadius: "var(--r-md)", fontSize: 15, fontFamily: "inherit",
    background: "var(--bg-surface)", color: "var(--text-primary)", boxSizing: "border-box",
  };
  return (
    <Sheet title={isEdit ? "編輯量測紀錄" : "新增量測紀錄"} onClose={onClose} footer={
      <>
        {isEdit
          ? <button className="danger" onClick={() => onSave("已刪除紀錄（示意）")}>刪除</button>
          : <button onClick={onClose}>取消</button>}
        <button className="primary" onClick={() => onSave(isEdit ? "已更新紀錄（示意）" : "已新增紀錄（示意）")}>儲存</button>
      </>
    }>
      {isBp ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div className="chip-group-label" style={{ marginTop: 4 }}>收縮壓</div>
            <input type="number" inputMode="numeric" placeholder="收縮壓" value={sys} onChange={(e) => setSys(e.target.value)} style={inputStyle} />
            <div className="hm-input-unit">mmHg</div>
          </div>
          <span style={{ color: "var(--text-tertiary)", fontSize: 20, marginTop: 8 }}>/</span>
          <div style={{ flex: 1 }}>
            <div className="chip-group-label" style={{ marginTop: 4 }}>舒張壓</div>
            <input type="number" inputMode="numeric" placeholder="舒張壓" value={dia} onChange={(e) => setDia(e.target.value)} style={inputStyle} />
            <div className="hm-input-unit">mmHg</div>
          </div>
        </div>
      ) : (
        <div>
          <div className="chip-group-label" style={{ marginTop: 4 }}>{metric ? metric.name : "量測數值"}</div>
          <input type="number" inputMode="decimal" placeholder={`輸入數值`} value={val} onChange={(e) => setVal(e.target.value)} style={inputStyle} />
          <div className="hm-input-unit">{metric ? `${metric.unit || "—"}` : ""}</div>
        </div>
      )}

      {isBp && (
        <>
          <div className="chip-group-label">心率</div>
          <div>
            <input type="number" inputMode="numeric" placeholder="輸入心率" value={hr} onChange={(e) => setHr(e.target.value)} style={inputStyle} />
            <div className="hm-input-unit">bpm</div>
          </div>
        </>
      )}

      <div className="chip-group-label">量測時間</div>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ ...inputStyle, flex: 1.4 }} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
      </div>
    </Sheet>
  );
}

Object.assign(window, { AddRecordSheet });

// 量測紀錄 — 進階篩選（時間區間）
function HealthFilterSheet({ onClose, value, onApply }) {
  const [v, setV] = React.useState({ time: "全部", customStart: "", customEnd: "", ...value });
  const times = ["全部", "近 1 個月", "近 3 個月", "近 6 個月", "近 1 年", "自訂區間"];
  const dateInput = {
    flex: 1, padding: "10px 12px", border: "1px solid var(--border-soft)",
    borderRadius: "var(--r-md)", fontSize: 13, fontFamily: "inherit",
    background: "var(--bg-surface)", color: "var(--text-primary)",
  };
  return (
    <Sheet title="進階篩選" onClose={onClose} footer={
      <>
        <button onClick={() => setV({ time: "全部", customStart: "", customEnd: "" })}>清除條件</button>
        <button className="primary" onClick={() => { onApply(v); onClose(); }}>查看篩選結果</button>
      </>
    }>
      <div className="chip-group-label" style={{ marginTop: 4 }}>時間區間</div>
      <div className="chip-group">
        {times.map(t => <button key={t} className={`chip-btn ${v.time === t ? "active" : ""}`} onClick={() => setV({ ...v, time: t })}>{t}</button>)}
      </div>
      {v.time === "自訂區間" && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
          <input type="date" value={v.customStart} onChange={e => setV({ ...v, customStart: e.target.value })} style={dateInput} />
          <span style={{ color: "var(--text-tertiary)", fontSize: 13 }}>至</span>
          <input type="date" value={v.customEnd} onChange={e => setV({ ...v, customEnd: e.target.value })} style={dateInput} />
        </div>
      )}
    </Sheet>
  );
}

Object.assign(window, { HealthFilterSheet });

// 健康管理連結 — 操作說明
function HealthLinkGuideSheet({ onClose, onGoSettings }) {
  const steps = [
    { t: "切換至「我的」單元", d: "於健保快易通中切換至「我的」單元。" },
    { t: "點選健康管理連結，選擇所要連結 App", d: "進入健康管理連結單元內，選擇您所要連結的 App，目前提供蘋果健康 App、Garmin Connect。" },
    { t: "進入連結服務，並開啟連線設定", d: "進入您所要連結的 App 選項中，開啟連線設定開關，依照指示完成設定。" },
    { t: "完成連結，將自動更新健康資料", d: "請詳讀蒐集資訊與說明內容，系統將依照所選 App 同步狀態，自動更新個人紀錄中相關量測紀錄。" },
  ];
  return (
    <Sheet title="健康管理連結 — 同步操作說明" onClose={onClose} footer={
      <>
        <button onClick={onClose}>關閉</button>
        <button className="primary" onClick={onGoSettings || onClose}>前往設定</button>
      </>
    }>
      <div className="hg-intro">
        透過健康管理連結，可將您現有健康 App 中的量測資料同步至健康存摺，集中管理個人健康數據，省去手動輸入的麻煩。
      </div>

      <div className="chip-group-label">操作步驟</div>
      <ol className="hg-steps">
        {steps.map((s, i) => (
          <li key={i} className="hg-step">
            <span className="hg-step-no">{i + 1}</span>
            <div className="hg-step-main">
              <div className="hg-step-title">{s.t}</div>
              <div className="hg-step-desc">{s.d}</div>
            </div>
          </li>
        ))}
      </ol>

      <div className="chip-group-label">支援的健康 App</div>
      <div className="hg-apps">
        <div className="hg-app-row">
          <span className="hg-appicon hg-appicon--apple">
            <svg viewBox="0 0 24 24" width="27" height="27" aria-hidden="true">
              <defs>
                <linearGradient id="hgHeartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FF6E8C" />
                  <stop offset="1" stopColor="#FF2350" />
                </linearGradient>
              </defs>
              <path d="M12 20.6C5.5 16.4 2.4 12.7 2.4 9.1 2.4 6.5 4.4 4.7 6.8 4.7c1.7 0 3.3 1 5.2 3 1.9-2 3.5-3 5.2-3 2.4 0 4.4 1.8 4.4 4.4 0 3.6-3.1 7.3-9.6 11.5z" fill="url(#hgHeartGrad)" />
            </svg>
          </span>
          <span className="hg-app-name">蘋果健康</span>
        </div>
        <div className="hg-app-row">
          <span className="hg-appicon hg-appicon--garmin">
            <span className="hg-garmin-word">GARMIN</span>
            <svg viewBox="0 0 32 32" width="23" height="23" aria-hidden="true">
              <circle cx="16" cy="16" r="10" fill="none" stroke="#19b4d6" strokeWidth="3.6" strokeLinecap="round" strokeDasharray="50 13" transform="rotate(-28 16 16)" />
            </svg>
          </span>
          <span className="hg-app-name">Garmin Connect</span>
        </div>
      </div>

      <div className="hg-note">
        <Icon name="info" size={14} />
        <span>同步頻率與可取得的資料項目依各健康 App 提供範圍而定。如需中止連結，可至「健康管理連結」頁面解除授權。</span>
      </div>
    </Sheet>
  );
}

Object.assign(window, { HealthLinkGuideSheet });
