// 行事曆畫面 — 由首頁「檢視完整行事曆」按鈕進入
// 此檔案輸出 CalendarScreen（手機版）與 CalendarScreenDesktop（桌機版）

// 民國 -> 西元
const _gy = (rocY) => rocY + 1911;
// 該月天數
const _dim = (rocY, m) => new Date(_gy(rocY), m, 0).getDate();
// 該月 1 號是星期幾 (0=日 ... 6=六)
const _firstDow = (rocY, m) => new Date(_gy(rocY), m - 1, 1).getDay();

// 將月份 1..12 轉成 cell 陣列（空白填補完整 6 列 × 7 欄）
function _buildMonthCells(rocY, m) {
  const fw = _firstDow(rocY, m);
  const dim = _dim(rocY, m);
  const out = [];
  for (let i = 0; i < fw; i++) out.push(null);
  for (let d = 1; d <= dim; d++) out.push(d);
  while (out.length % 7 !== 0) out.push(null);
  // 永遠保留 6 列：避免高度跳動
  while (out.length < 42) out.push(null);
  return out;
}

// 假資料：本範例設定「今天 = 115 年 5 月 27 日」
const CAL_TODAY = { y: 115, m: 5, d: 27 };

// 行程資料：以 民國YYY/MM/DD 為 key
const CAL_EVENTS = [
  { key: "115/05/10", time: "08:00",  title: "服藥提醒：Metformin 500mg",  org: "—",            cat: "用藥" },
  { key: "115/05/15", time: "09:00",  title: "居家量血壓（晨）",            org: "在家自行記錄", cat: "個人化" },
  { key: "115/05/20", time: "14:00",  title: "慢性處方箋領藥",              org: "亞東醫院 藥局", cat: "用藥" },
  { key: "115/05/27", time: "10:30",  title: "視訊衛教：糖尿病飲食",        org: "樂澄診所",     cat: "回診" },
  { key: "115/05/27", time: "20:00",  title: "晚間服藥：Amlodipine 5mg",   org: "—",            cat: "用藥" },
  { key: "115/05/28", time: "09:30",  title: "回診：家庭醫學科",            org: "臺大醫院",     cat: "回診" },
  { key: "115/06/03", time: "08:00",  title: "大腸癌篩檢",                  org: "新光醫院",     cat: "篩檢" },
  { key: "115/06/10", time: "15:00",  title: "驗血報告領取",                org: "亞東醫院",     cat: "回診" },
  { key: "115/06/15", time: "09:00",  title: "洗牙",                        org: "康美牙醫診所", cat: "回診" },
  { key: "115/06/22", time: "10:00",  title: "成人預防保健",                org: "臺大醫院",     cat: "篩檢" },
];

const _CAT_COLOR = {
  "回診":   { bg: "var(--brand-100)",  fg: "var(--brand-900)",  dot: "var(--brand-700)" },
  "用藥":   { bg: "var(--tag-amber-bg)", fg: "var(--tag-amber-fg)", dot: "var(--accent-amber)" },
  "篩檢":   { bg: "var(--tag-blue-bg)",  fg: "var(--tag-blue-fg)",  dot: "var(--accent-blue)" },
  "個人化": { bg: "var(--bg-chip)",      fg: "var(--text-secondary)", dot: "var(--text-tertiary)" },
};

// 第一個固定類別 + 三個可自訂類別
const CAT_FIXED = "回診";
const FIXED_LABEL = "健康記事";
const EDITABLE_CATS = ["用藥", "篩檢", "個人化"];
const EDITABLE_DEFAULT_LABELS = {
  "用藥":  "自訂類別1",
  "篩檢":  "自訂類別2",
  "個人化": "自訂類別3",
};

// 自訂類別名稱存儲（localStorage 持久化）
const _CAT_LABEL_STORE = (() => {
  try {
    const s = JSON.parse(localStorage.getItem("hb_cat_labels") || "null");
    return s && typeof s === "object" ? s : {};
  } catch (e) { return {}; }
})();
function _labelOf(cat) {
  if (cat === CAT_FIXED) return FIXED_LABEL;
  if (_CAT_LABEL_STORE[cat]) return _CAT_LABEL_STORE[cat];
  return EDITABLE_DEFAULT_LABELS[cat] || cat;
}
function _saveLabels(updates) {
  Object.keys(_CAT_LABEL_STORE).forEach(k => delete _CAT_LABEL_STORE[k]);
  Object.assign(_CAT_LABEL_STORE, updates);
  try { localStorage.setItem("hb_cat_labels", JSON.stringify(_CAT_LABEL_STORE)); } catch (e) {}
}

// 使用者新增的事件（記憶體存儲；本 prototype 不寫入 localStorage）
const _USER_EVENTS = [];

// 抓出某月所有行程
function _eventsForMonth(rocY, m) {
  const key = `${rocY}/${String(m).padStart(2, "0")}/`;
  return [...CAL_EVENTS, ..._USER_EVENTS].filter(e => e.key.startsWith(key));
}
function _eventsForDay(rocY, m, d) {
  const k = `${rocY}/${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}`;
  return [...CAL_EVENTS, ..._USER_EVENTS].filter(e => e.key === k);
}
function _dayHasEvent(rocY, m, d) {
  return _eventsForDay(rocY, m, d).length > 0;
}

const _WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const _MONTH_LABEL = (rocY, m) => `${rocY} 年 ${m} 月`;

// =========================================================================
// 共用：標題列右上的齒輪設定按鈕（行事曆設定）
// =========================================================================
function _CalSettingsBtn({ onClick, label }) {
  return (
    <button className={`cal-settings-btn ${label ? "with-label" : ""}`} onClick={onClick} aria-label={label || "類別設定"}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
      </svg>
      {label && <span className="cal-settings-btn-label">{label}</span>}
    </button>
  );
}

// =========================================================================
// 類別下拉選單（自訂下拉，可擴充項目）
// =========================================================================
function _CategoryDropdown({ value, options, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const c = _CAT_COLOR[value];
  return (
    <div className={`cal-cat-dd ${open ? "open" : ""}`} ref={ref}>
      <button
        type="button"
        className="cal-cat-dd-trigger"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {c && <span className="cal-cat-dd-dot" style={{ background: c.dot }}/>}
        <span className="cal-cat-dd-val">{_labelOf(value)}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cal-cat-dd-chev">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div className="cal-cat-dd-menu" role="listbox">
          {options.map(opt => {
            const cc = _CAT_COLOR[opt];
            const active = opt === value;
            return (
              <button
                key={opt}
                type="button"
                className={`cal-cat-dd-item ${active ? "active" : ""}`}
                onClick={() => { onChange(opt); setOpen(false); }}
                role="option"
                aria-selected={active}
              >
                {cc
                  ? <span className="cal-cat-dd-dot" style={{ background: cc.dot }}/>
                  : <span className="cal-cat-dd-dot" style={{ background: "var(--border-med)" }}/>}
                <span className="cal-cat-dd-item-label">{_labelOf(opt)}</span>
                {active && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="cal-cat-dd-tick">
                    <path d="m5 12 5 5L20 7"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 篩選列（兩版共用）
// =========================================================================
function _FilterCard({ category, keyword, onCategory, onKeyword, categories }) {
  return (
    <div className="cal-filter">
      <div className="cal-filter-head">
        <span className="cal-filter-ico" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18l-7 9v5l-4 2v-7L3 5z"/></svg>
        </span>
        <span>篩選</span>
      </div>
      <div className="cal-filter-row">
        <span className="cal-filter-k">類別</span>
        <_CategoryDropdown
          value={category}
          options={categories}
          onChange={onCategory}
        />
      </div>
      <div className="cal-filter-row">
        <span className="cal-filter-k">關鍵字</span>
        <input
          type="text"
          className="cal-filter-input"
          placeholder="輸入關鍵字搜尋"
          value={keyword}
          onChange={(e) => onKeyword(e.target.value)}
        />
      </div>
    </div>
  );
}

// =========================================================================
// 月份切換列
// =========================================================================
function _MonthNav({ rocY, m, onPrev, onNext, onToday, compact }) {
  return (
    <div className={`cal-month-nav ${compact ? "compact" : ""}`}>
      <button className="cal-nav-btn" onClick={onPrev} aria-label="上一月">
        <Icon name="chev-left" size={16}/>
      </button>
      <div className="cal-month-title">{_MONTH_LABEL(rocY, m)}</div>
      <div className="cal-nav-right">
        {!compact && <button className="cal-today-btn" onClick={onToday}>今日</button>}
        <button className="cal-nav-btn" onClick={onNext} aria-label="下一月">
          <Icon name="chev-right" size={16}/>
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// 圖例
// =========================================================================
function _Legend() {
  return (
    <div className="cal-legend">
      <div className="cal-legend-title">註：</div>
      <ol className="cal-legend-list">
        <li>
          <span className="cal-dot today-dot" aria-hidden/>
          <span>表示該日期為今日日期。</span>
        </li>
        <li>
          <span className="cal-dot event-dot" aria-hidden/>
          <span>表示當日有行程。</span>
        </li>
        <li>
          <span className="cal-dot blank" aria-hidden/>
          <span>點選日曆上任一日期可鍵入資料進行記錄。</span>
        </li>
      </ol>
    </div>
  );
}

// =========================================================================
// 事件 chip
// =========================================================================
function _EventChip({ ev, compact, onClick }) {
  const c = _CAT_COLOR[ev.cat] || _CAT_COLOR["個人化"];
  const handle = (e) => { if (onClick) { e.stopPropagation(); onClick(ev); } };
  if (compact) {
    return (
      <div className={`cal-evchip ${onClick ? "clickable" : ""}`} style={{ background: c.bg, color: c.fg }} onClick={handle}>
        <span className="cal-evchip-dot" style={{ background: c.dot }}/>
        <span className="cal-evchip-txt">{ev.title}</span>
      </div>
    );
  }
  return (
    <div className={`cal-evrow ${onClick ? "clickable" : ""}`} onClick={handle}>
      <div className="cal-evrow-body">
        <span className="cal-evrow-tag" style={{ background: c.bg, color: c.fg }}>{_labelOf(ev.cat)}</span>
        <span className="cal-evrow-title">{ev.title}</span>
      </div>
    </div>
  );
}

// =========================================================================
// 事件詳情 Modal — 自動進入編輯狀態（日期唯讀；類別、內容可改）
// =========================================================================
function _EventDetailModal({ event, onClose, onSave, onDelete }) {
  const allCats = [CAT_FIXED, ...EDITABLE_CATS];
  const [cat, setCat] = React.useState(allCats[0]);
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    if (!event) return;
    setCat(event.cat || allCats[0]);
    setContent(event.title || "");
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [event]);

  if (!event) return null;
  const [yy, mm, dd] = event.key.split("/").map(n => parseInt(n, 10));
  const dow = _WEEKDAYS[new Date(_gy(yy), mm - 1, dd).getDay()];
  const canSave = content.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    onSave && onSave({ cat, title: content.trim().slice(0, 100) });
    onClose();
  };

  return (
    <div className="cal-modal-backdrop" onClick={onClose}>
      <div className="cal-modal cal-editor-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="cal-modal-toolbar">
          {onDelete && (
            <button className="cal-modal-tb-btn" title="刪除" onClick={() => { onDelete(); onClose(); }}>
              <Icon name="trash" size={16}/>
            </button>
          )}
          <button className="cal-modal-tb-btn cal-modal-tb-close" title="關閉" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>

        <div className="cal-modal-body cal-modal-form">
          <h3 className="cal-settings-title">編輯行程</h3>

          <div className="cal-modal-field">
            <div className="cal-modal-field-k">日期</div>
            <div className="cal-modal-field-v">
              {yy} 年 {mm} 月 {dd} 日（星期{dow}）
            </div>
          </div>

          <div className="cal-modal-field">
            <div className="cal-modal-field-k">類別</div>
            <div className="cal-modal-field-v">
              <_CategoryDropdown value={cat} options={allCats} onChange={setCat}/>
            </div>
          </div>

          <div className="cal-modal-field cal-modal-field-content">
            <div className="cal-modal-field-k">
              內容
              <span className="cal-modal-field-hint">最多 100 個字</span>
            </div>
            <div className="cal-modal-field-v">
              <textarea
                className="cal-editor-textarea"
                value={content}
                placeholder="輸入行程內容…"
                maxLength={100}
                rows={4}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="cal-editor-count">{content.length} / 100</div>
            </div>
          </div>
        </div>
        <div className="cal-settings-footer">
          <button className="cal-modal-rsvp" onClick={onClose}>取消</button>
          <button
            className={`cal-modal-rsvp ${canSave ? "active" : ""}`}
            onClick={save}
            disabled={!canSave}
          >儲存</button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 行程編輯 Modal — 新增行程（日期、類別、內容）
// =========================================================================
function _EventEditorModal({ open, date, onClose, onSave }) {
  const allCats = [CAT_FIXED, ...EDITABLE_CATS];
  const [cat, setCat] = React.useState(allCats[0]);
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setCat(allCats[0]);
    setContent("");
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || !date) return null;

  const dow = _WEEKDAYS[new Date(_gy(date.y), date.m - 1, date.d).getDay()];
  const c = _CAT_COLOR[cat] || _CAT_COLOR["個人化"];
  const canSave = content.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    const key = `${date.y}/${String(date.m).padStart(2, "0")}/${String(date.d).padStart(2, "0")}`;
    onSave({
      key,
      time: "",
      cat,
      title: content.trim().slice(0, 100),
      org: "—",
    });
    onClose();
  };

  return (
    <div className="cal-modal-backdrop" onClick={onClose}>
      <div className="cal-modal cal-editor-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="cal-modal-toolbar">
          <button className="cal-modal-tb-btn cal-modal-tb-close" title="關閉" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="cal-modal-body cal-modal-form">
          <h3 className="cal-settings-title">新增行程</h3>

          <div className="cal-modal-field">
            <div className="cal-modal-field-k">日期</div>
            <div className="cal-modal-field-v">
              {date.y} 年 {date.m} 月 {date.d} 日（星期{dow}）
            </div>
          </div>

          <div className="cal-modal-field">
            <div className="cal-modal-field-k">類別</div>
            <div className="cal-modal-field-v">
              <_CategoryDropdown
                value={cat}
                options={allCats}
                onChange={setCat}
              />
            </div>
          </div>

          <div className="cal-modal-field cal-modal-field-content">
            <div className="cal-modal-field-k">
              內容
              <span className="cal-modal-field-hint">最多 100 個字</span>
            </div>
            <div className="cal-modal-field-v">
              <textarea
                className="cal-editor-textarea"
                value={content}
                placeholder={`輸入${_labelOf(cat)}的內容…`}
                maxLength={100}
                rows={4}
                onChange={(e) => setContent(e.target.value)}
                autoFocus
              />
              <div className="cal-editor-count">{content.length} / 100</div>
            </div>
          </div>
        </div>
        <div className="cal-settings-footer">
          <button className="cal-modal-rsvp" onClick={onClose}>取消</button>
          <button
            className={`cal-modal-rsvp ${canSave ? "active" : ""}`}
            onClick={save}
            disabled={!canSave}
          >儲存</button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 桌機 — 工具列彈出面板
// =========================================================================
function _DtToolPopover({ open, anchorRef, onClose, children, className }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target) &&
          anchorRef.current && !anchorRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  if (!open) return null;
  return <div ref={ref} className={`dt-cal-popover ${className || ""}`}>{children}</div>;
}

// =========================================================================
// 類別設定 Modal — 可重新命名 3 個類別
// =========================================================================
function _CategorySettingsModal({ open, onClose, onChanged }) {
  const [draft, setDraft] = React.useState(() => {
    const obj = {};
    EDITABLE_CATS.forEach(k => { obj[k] = _labelOf(k); });
    return obj;
  });
  React.useEffect(() => {
    if (!open) return;
    const obj = {};
    EDITABLE_CATS.forEach(k => { obj[k] = _labelOf(k); });
    setDraft(obj);
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;

  const save = () => {
    const next = {};
    EDITABLE_CATS.forEach(k => {
      const v = (draft[k] || "").trim();
      if (v && v !== k) next[k] = v;
    });
    _saveLabels(next);
    onChanged && onChanged();
    onClose();
  };
  const reset = () => {
    const obj = {};
    EDITABLE_CATS.forEach(k => { obj[k] = k; });
    setDraft(obj);
  };

  return (
    <div className="cal-modal-backdrop" onClick={onClose}>
      <div className="cal-modal cal-settings-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="cal-modal-toolbar">
          <button className="cal-modal-tb-btn cal-modal-tb-close" title="關閉" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="cal-modal-body cal-modal-form">
          <h3 className="cal-settings-title">編輯類別名稱</h3>
          <div className="cal-settings-note">
            <ol className="cal-settings-note-list">
              <li>最多可編輯三種類別。</li>
              <li>每一類別至多可輸入 10 個中文字。</li>
              <li>每一類別各有一色塊代表顯示。</li>
            </ol>
          </div>

          {/* 固定類別（不可編輯）*/}
          <div className="cal-settings-row cal-settings-row-fixed">
            <span className="cal-settings-swatch" style={{ background: _CAT_COLOR[CAT_FIXED].dot }} aria-hidden/>
            <div className="cal-settings-input-wrap">
              <div className="cal-settings-orig">預設類別</div>
              <div className="cal-settings-fixed-value">{FIXED_LABEL}</div>
            </div>
          </div>

          {EDITABLE_CATS.map((key, idx) => {
            const c = _CAT_COLOR[key] || _CAT_COLOR["個人化"];
            const rowLabel = `自訂類別${idx + 1}`;
            return (
              <div key={key} className="cal-settings-row">
                <span className="cal-settings-swatch" style={{ background: c.dot }} aria-hidden/>
                <div className="cal-settings-input-wrap">
                  <div className="cal-settings-orig">{rowLabel}</div>
                  <input
                    type="text"
                    className="cal-settings-input"
                    value={draft[key] || ""}
                    placeholder={EDITABLE_DEFAULT_LABELS[key] || key}
                    maxLength={10}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="cal-settings-footer">
          <button className="cal-modal-rsvp active" onClick={save}>儲存</button>
        </div>
      </div>
    </div>
  );
}
function _useCalendarState() {
  const [view, setView]     = React.useState("month"); // month | week | list
  const [rocY, setRocY]     = React.useState(CAL_TODAY.y);
  const [m, setM]           = React.useState(CAL_TODAY.m);
  const [selected, setSel]  = React.useState({ y: CAL_TODAY.y, m: CAL_TODAY.m, d: CAL_TODAY.d });
  const [cat, setCat]       = React.useState("全部");
  const [kw, setKw]         = React.useState("");

  const goPrev = () => {
    if (m === 1) { setRocY(rocY - 1); setM(12); }
    else setM(m - 1);
  };
  const goNext = () => {
    if (m === 12) { setRocY(rocY + 1); setM(1); }
    else setM(m + 1);
  };
  const goToday = () => {
    setRocY(CAL_TODAY.y); setM(CAL_TODAY.m);
    setSel({ y: CAL_TODAY.y, m: CAL_TODAY.m, d: CAL_TODAY.d });
  };

  const monthEvents = _eventsForMonth(rocY, m);
  const categories  = ["全部", "回診", "用藥", "篩檢", "個人化"];
  const filterEv    = (ev) => (cat === "全部" || ev.cat === cat) && (kw === "" || ev.title.includes(kw) || (ev.org || "").includes(kw));

  return {
    view, setView, rocY, m, selected, setSel, cat, setCat, kw, setKw,
    goPrev, goNext, goToday, monthEvents, categories, filterEv,
  };
}

// =========================================================================
// 月曆主格 — 共用 builder
// 桌機 (withinCellChips=true)：保留單一 grid，每格內顯示 chips
// 手機 (withinCellChips=false)：以「列」為單位渲染，並可在所選日期的列下方插入展開內容
// =========================================================================
function _MonthGrid({ rocY, m, selected, onSelect, filterEv, withinCellChips, expandedContent, onEventClick }) {
  const cells = _buildMonthCells(rocY, m);
  const isToday = (d) => d === CAL_TODAY.d && m === CAL_TODAY.m && rocY === CAL_TODAY.y;
  const isSelected = (d) => d === selected.d && m === selected.m && rocY === selected.y;

  // ---- 桌機版：單一 grid（保留原本行為）----
  if (withinCellChips) {
    return (
      <div className="cal-grid with-chips">
        {_WEEKDAYS.map((w, i) => (
          <div key={w} className={`cal-hd ${i === 0 ? "sun" : ""} ${i === 6 ? "sat" : ""}`}>{w}</div>
        ))}
        {cells.map((d, idx) => {
          const col = idx % 7;
          if (d === null) return <div key={idx} className="cal-cell empty"/>;
          const evs = _eventsForDay(rocY, m, d).filter(filterEv);
          const today = isToday(d);
          const sel = isSelected(d);
          return (
            <button
              key={idx}
              type="button"
              className={`cal-cell ${today ? "today" : ""} ${sel ? "sel" : ""} ${col === 0 ? "sun" : ""} ${col === 6 ? "sat" : ""}`}
              onClick={() => onSelect({ y: rocY, m, d })}
            >
              <span className="cal-d-num">{d}</span>
              <span className="cal-cell-chips">
                {evs.slice(0, 3).map((e, i) => {
                  const c = _CAT_COLOR[e.cat] || _CAT_COLOR["個人化"];
                  return (
                    <span
                      key={i}
                      className="cal-cell-chip clickable"
                      style={{ background: c.bg, color: c.fg }}
                      title={`${e.cat}：${e.title}`}
                      onClick={(ev) => { ev.stopPropagation(); onEventClick && onEventClick(e); }}
                    >
                      <span className="cal-cell-chip-dot" style={{ background: c.dot }}/>
                      <span className="cal-cell-chip-txt">
                        <span className="cal-cell-chip-cat">{_labelOf(e.cat)}：</span>
                        <span className="cal-cell-chip-title">{e.title}</span>
                      </span>
                    </span>
                  );
                })}
                {evs.length > 3 && <span className="cal-cell-chip more">+{evs.length - 3} 項</span>}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // ---- 手機版：以「列」為單位，所選列下方延伸 expanded content ----
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  const selectedRowIdx = rows.findIndex(r => r.some(d => d !== null && isSelected(d)));

  return (
    <div className="cal-grid-rows">
      <div className="cal-grid-row cal-grid-row-hd">
        {_WEEKDAYS.map((w, i) => (
          <div key={w} className={`cal-hd ${i === 0 ? "sun" : ""} ${i === 6 ? "sat" : ""}`}>{w}</div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <React.Fragment key={ri}>
          <div className="cal-grid-row">
            {row.map((d, ci) => {
              if (d === null) return <div key={ci} className="cal-cell empty"/>;
              const evs = _eventsForDay(rocY, m, d).filter(filterEv);
              const has = evs.length > 0;
              const today = isToday(d);
              const sel = isSelected(d);
              return (
                <button
                  key={ci}
                  type="button"
                  className={`cal-cell ${today ? "today" : ""} ${sel ? "sel" : ""} ${ci === 0 ? "sun" : ""} ${ci === 6 ? "sat" : ""}`}
                  onClick={() => onSelect({ y: rocY, m, d })}
                >
                  <span className="cal-d-num">{d}</span>
                  {has && <span className="cal-event-dot" aria-hidden/>}
                </button>
              );
            })}
          </div>
          {expandedContent && ri === selectedRowIdx && (
            <div className="cal-grid-expanded">{expandedContent}</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// =========================================================================
// 列表檢視（兩版共用）
// =========================================================================
function _ListView({ rocY, m, filterEv, onEventClick }) {
  const rows = _eventsForMonth(rocY, m).filter(filterEv);
  if (rows.length === 0) {
    return <div className="cal-empty">本月此分類無行程</div>;
  }
  // 依日期分組
  const grouped = {};
  rows.forEach(r => {
    const dd = r.key.split("/")[2];
    grouped[dd] = grouped[dd] || [];
    grouped[dd].push(r);
  });
  return (
    <div className="cal-listview">
      {Object.keys(grouped).sort().map(dd => {
        const d = parseInt(dd, 10);
        const dow = _WEEKDAYS[new Date(_gy(rocY), m - 1, d).getDay()];
        const isToday = d === CAL_TODAY.d && m === CAL_TODAY.m && rocY === CAL_TODAY.y;
        return (
          <div key={dd} className="cal-listview-group">
            <div className={`cal-listview-date ${isToday ? "is-today" : ""}`}>
              <span className="dnum">{d}</span>
              <span className="dow">星期{dow}</span>
              {isToday && <span className="today-tag">今日</span>}
            </div>
            <div className="cal-listview-rows">
              {grouped[dd].map((e, i) => <_EventChip key={i} ev={e} compact={false} onClick={onEventClick}/>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =========================================================================
// 週檢視（簡化）
// =========================================================================
function _WeekView({ rocY, m, selected, onSelect, filterEv, onEventClick }) {
  // 找出 selected 所在週的星期日
  const sel = new Date(_gy(rocY), m - 1, selected.d);
  const dow = sel.getDay();
  const sun = new Date(sel); sun.setDate(sel.getDate() - dow);
  const days = Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(sun); dt.setDate(sun.getDate() + i);
    return dt;
  });
  return (
    <div className="cal-weekview">
      <div className="cal-weekview-head">
        {days.map((dt, i) => {
          const isT = dt.getFullYear() === _gy(CAL_TODAY.y) && (dt.getMonth() + 1) === CAL_TODAY.m && dt.getDate() === CAL_TODAY.d;
          return (
            <div key={i} className={`cal-weekview-hd ${i === 0 ? "sun" : ""} ${i === 6 ? "sat" : ""} ${isT ? "today" : ""}`}>
              <div className="dow">{_WEEKDAYS[i]}</div>
              <div className="dnum">{dt.getDate()}</div>
            </div>
          );
        })}
      </div>
      <div className="cal-weekview-body">
        {days.map((dt, i) => {
          const ry = dt.getFullYear() - 1911;
          const mm = dt.getMonth() + 1;
          const dd = dt.getDate();
          const evs = _eventsForDay(ry, mm, dd).filter(filterEv);
          return (
            <div key={i} className={`cal-weekview-col ${i === 0 ? "sun" : ""} ${i === 6 ? "sat" : ""}`}>
              {evs.length === 0
                ? <div className="cal-weekview-empty">—</div>
                : evs.map((e, j) => <_EventChip key={j} ev={e} compact onClick={onEventClick}/>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================================
// 手機版
// =========================================================================
function CalendarScreen({ navigate }) {
  const st = _useCalendarState();
  const todayEvs = _eventsForDay(st.selected.y, st.selected.m, st.selected.d).filter(st.filterEv);
  const selectedLabel = `${st.selected.m} 月 ${st.selected.d} 日 (星期${_WEEKDAYS[new Date(_gy(st.selected.y), st.selected.m - 1, st.selected.d).getDay()]})`;

  const [filterOpen, setFilterOpen] = React.useState(false);
  const [activeEvent, setActiveEvent] = React.useState(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [, setLabelsVer] = React.useState(0);
  const [, setEventsVer] = React.useState(0);
  const filterBtnRef = React.useRef(null);
  const openEvent = (ev) => setActiveEvent(ev);
  const closeEvent = () => setActiveEvent(null);
  const hasFilter = st.cat !== "全部" || !!st.kw;

  return (
    <>
      <div className="detail-header cal-detail-header">
        <button className="back" onClick={() => navigate(-1)}>
          <Icon name="chev-left" size={18}/> 返回
        </button>
        <div className="title">我的行事曆</div>

        {/* 篩選 icon + popover */}
        <div className="cal-tool-wrap">
          <button
            ref={filterBtnRef}
            className={`cal-settings-btn cal-tool-btn with-label ${filterOpen ? "active" : ""} ${hasFilter ? "has-value" : ""}`}
            aria-label="篩選"
            onClick={() => setFilterOpen(o => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18l-7 9v5l-4 2v-7L3 5z"/></svg>
            <span className="cal-settings-btn-label">篩選</span>
            {hasFilter && <span className="cal-tool-badge"/>}
          </button>
          <_DtToolPopover open={filterOpen} anchorRef={filterBtnRef} onClose={() => setFilterOpen(false)} className="m-filter">
            <div className="dt-cal-popover-title">篩選</div>
            <div className="dt-cal-popover-row">
              <span className="dt-cal-popover-k">類別</span>
              <_CategoryDropdown
                value={st.cat}
                options={st.categories}
                onChange={st.setCat}
              />
            </div>
            <div className="dt-cal-popover-row">
              <span className="dt-cal-popover-k">關鍵字</span>
              <input
                type="text"
                className="dt-cal-popover-input plain"
                placeholder="輸入關鍵字搜尋"
                value={st.kw}
                onChange={(e) => st.setKw(e.target.value)}
              />
            </div>
            <div className="dt-cal-popover-actions">
              <button className="dt-cal-popover-reset" onClick={() => { st.setCat("全部"); st.setKw(""); }}>清除條件</button>
              <button className="dt-cal-popover-done" onClick={() => setFilterOpen(false)}>完成</button>
            </div>
          </_DtToolPopover>
        </div>

        <_CalSettingsBtn onClick={() => setSettingsOpen(true)} label="類別設定"/>
      </div>

      <div className="cal-view-tabs">
        {[["month","月"],["week","週"],["list","列表"]].map(([k, l]) => (
          <button key={k} className={st.view === k ? "active" : ""} onClick={() => st.setView(k)}>{l}</button>
        ))}
      </div>

      <div className="app-scroll">
        {hasFilter && (
          <div className="cal-active-filters-m">
            <span className="cal-active-label">已套用：</span>
            {st.cat !== "全部" && (
              <span className="dt-cal-active-chip">
                類別：{_labelOf(st.cat)}
                <button onClick={() => st.setCat("全部")} aria-label="移除類別篩選">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M18 6 6 18"/></svg>
                </button>
              </span>
            )}
            {st.kw && (
              <span className="dt-cal-active-chip">
                關鍵字：{st.kw}
                <button onClick={() => st.setKw("")} aria-label="移除關鍵字篩選">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M18 6 6 18"/></svg>
                </button>
              </span>
            )}
          </div>
        )}

        {st.view === "month" && (
          <>
            <div className="cal-card">
              <_MonthNav rocY={st.rocY} m={st.m} onPrev={st.goPrev} onNext={st.goNext} onToday={st.goToday} compact/>
              <_MonthGrid
                rocY={st.rocY} m={st.m}
                selected={st.selected}
                onSelect={st.setSel}
                filterEv={st.filterEv}
                withinCellChips={false}
              />
            </div>

            <div className="cal-day-section">
              <div className="cal-day-section-head">
                <div className="cal-day-section-date">{selectedLabel}</div>
                {todayEvs.length > 0 && (
                  <div className="cal-day-inline-count">{todayEvs.length} 項行程</div>
                )}
              </div>
              <div className="cal-day-section-body">
                {todayEvs.length === 0 ? (
                  <div className="cal-day-empty-big">沒有行程</div>
                ) : (
                  todayEvs.map((e, i) => <_EventChip key={i} ev={e} compact={false} onClick={openEvent}/>)
                )}
              </div>
            </div>
          </>
        )}

        {st.view === "week" && (
          <div className="cal-card">
            <_MonthNav rocY={st.rocY} m={st.m} onPrev={st.goPrev} onNext={st.goNext} onToday={st.goToday} compact/>
            <_WeekView rocY={st.rocY} m={st.m} selected={st.selected} onSelect={st.setSel} filterEv={st.filterEv} onEventClick={openEvent}/>
          </div>
        )}

        {st.view === "list" && (
          <div className="cal-card">
            <_MonthNav rocY={st.rocY} m={st.m} onPrev={st.goPrev} onNext={st.goNext} onToday={st.goToday} compact/>
            <_ListView rocY={st.rocY} m={st.m} filterEv={st.filterEv} onEventClick={openEvent}/>
          </div>
        )}

        <div className="h-16"/>
      </div>

      <button className="cal-fab" aria-label="新增行程" type="button" onClick={() => setEditorOpen(true)}>
        <Icon name="plus" size={22}/>
        <span className="cal-fab-label">新增行程</span>
      </button>

      <_EventDetailModal
        event={activeEvent}
        onClose={closeEvent}
        onSave={(payload) => {
          if (!activeEvent) return;
          Object.assign(activeEvent, payload);
          setEventsVer(v => v + 1);
        }}
        onDelete={() => {
          if (!activeEvent) return;
          const arr = _USER_EVENTS.includes(activeEvent) ? _USER_EVENTS : CAL_EVENTS;
          const idx = arr.indexOf(activeEvent);
          if (idx >= 0) arr.splice(idx, 1);
          setEventsVer(v => v + 1);
        }}
      />
      <_CategorySettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onChanged={() => setLabelsVer(v => v + 1)}
      />
      <_EventEditorModal
        open={editorOpen}
        date={st.selected}
        onClose={() => setEditorOpen(false)}
        onSave={(ev) => { _USER_EVENTS.push(ev); setEventsVer(v => v + 1); }}
      />
    </>
  );
}

// =========================================================================
// 桌機版
// =========================================================================
function CalendarScreenDesktop({ navigate }) {
  const st = _useCalendarState();
  const todayEvs = _eventsForDay(st.selected.y, st.selected.m, st.selected.d).filter(st.filterEv);
  const monthEvs = st.monthEvents.filter(st.filterEv);
  const selectedLabel = `${st.selected.y} 年 ${st.selected.m} 月 ${st.selected.d} 日 · 星期${_WEEKDAYS[new Date(_gy(st.selected.y), st.selected.m - 1, st.selected.d).getDay()]}`;

  const [filterOpen, setFilterOpen] = React.useState(false);
  const [activeEvent, setActiveEvent] = React.useState(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [, setLabelsVer] = React.useState(0);
  const [, setEventsVer] = React.useState(0);
  const filterBtnRef = React.useRef(null);

  const openEvent = (ev) => setActiveEvent(ev);
  const closeEvent = () => setActiveEvent(null);

  return (
    <div className="dt-cal">
      {/* 頁首 */}
      <section className="dt-card dt-cal-head-card">
        <button className="dt-cal-back" onClick={() => navigate(-1)}>
          <Icon name="chev-left" size={16}/> 返回首頁
        </button>
        <div className="dt-cal-title">
          <span className="dt-cal-title-ico" aria-hidden>
            <Icon name="calendar" size={22}/>
          </span>
          <h1>我的行事曆</h1>
        </div>

        <div className="dt-cal-head-right">
          {/* 篩選 icon */}
          <div className="dt-cal-tool-wrap">
            <button
              ref={filterBtnRef}
              className={`dt-cal-tool-btn with-label ${filterOpen ? "active" : ""} ${(st.cat !== "全部" || st.kw) ? "has-value" : ""}`}
              aria-label="篩選"
              title="篩選"
              onClick={() => setFilterOpen(o => !o)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18l-7 9v5l-4 2v-7L3 5z"/></svg>
              <span className="dt-cal-tool-btn-label">篩選</span>
              {(st.cat !== "全部" || st.kw) && <span className="dt-cal-tool-badge"/>}
            </button>
            <_DtToolPopover open={filterOpen} anchorRef={filterBtnRef} onClose={() => setFilterOpen(false)} className="wide">
              <div className="dt-cal-popover-title">篩選</div>
              <div className="dt-cal-popover-row">
                <span className="dt-cal-popover-k">類別</span>
                <_CategoryDropdown
                  value={st.cat}
                  options={st.categories}
                  onChange={st.setCat}
                />
              </div>
              <div className="dt-cal-popover-row">
                <span className="dt-cal-popover-k">關鍵字</span>
                <input
                  type="text"
                  className="dt-cal-popover-input plain"
                  placeholder="輸入關鍵字搜尋"
                  value={st.kw}
                  onChange={(e) => st.setKw(e.target.value)}
                />
              </div>
              <div className="dt-cal-popover-actions">
                <button className="dt-cal-popover-reset" onClick={() => { st.setCat("全部"); st.setKw(""); }}>清除條件</button>
                <button className="dt-cal-popover-done" onClick={() => setFilterOpen(false)}>完成</button>
              </div>
            </_DtToolPopover>
          </div>

          <div className="dt-cal-tool-divider"/>

          <div className="dt-cal-view-tabs">
            {[["month","月"],["week","週"],["list","列表"]].map(([k, l]) => (
              <button key={k} className={st.view === k ? "active" : ""} onClick={() => st.setView(k)}>{l}</button>
            ))}
          </div>
          <_CalSettingsBtn onClick={() => setSettingsOpen(true)} label="類別設定"/>
        </div>
      </section>

      {/* 主區（全寬）*/}
      <section className="dt-card dt-cal-main">
        <div className="dt-cal-main-head">
          <_MonthNav rocY={st.rocY} m={st.m} onPrev={st.goPrev} onNext={st.goNext} onToday={st.goToday}/>
          {(st.cat !== "全部" || st.kw) && (
            <div className="dt-cal-active-filters">
              <span className="dt-cal-active-label">已套用篩選：</span>
              {st.cat !== "全部" && (
                <span className="dt-cal-active-chip">
                  類別：{_labelOf(st.cat)}
                  <button onClick={() => st.setCat("全部")} aria-label="移除類別篩選">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M18 6 6 18"/></svg>
                  </button>
                </span>
              )}
              {st.kw && (
                <span className="dt-cal-active-chip">
                  關鍵字：{st.kw}
                  <button onClick={() => st.setKw("")} aria-label="移除關鍵字篩選">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M18 6 6 18"/></svg>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {st.view === "month" && (
          <_MonthGrid
            rocY={st.rocY} m={st.m}
            selected={st.selected}
            onSelect={st.setSel}
            filterEv={st.filterEv}
            withinCellChips={true}
            onEventClick={openEvent}
          />
        )}
        {st.view === "week" && (
          <_WeekView rocY={st.rocY} m={st.m} selected={st.selected} onSelect={st.setSel} filterEv={st.filterEv} onEventClick={openEvent}/>
        )}
        {st.view === "list" && (
          <_ListView rocY={st.rocY} m={st.m} filterEv={st.filterEv} onEventClick={openEvent}/>
        )}
      </section>

      <button className="cal-fab cal-fab-desktop" aria-label="新增行程" type="button" onClick={() => setEditorOpen(true)}>
        <Icon name="plus" size={22}/>
        <span className="cal-fab-label">新增行程</span>
      </button>

      <_EventDetailModal
        event={activeEvent}
        onClose={closeEvent}
        onSave={(payload) => {
          if (!activeEvent) return;
          Object.assign(activeEvent, payload);
          setEventsVer(v => v + 1);
        }}
        onDelete={() => {
          if (!activeEvent) return;
          const arr = _USER_EVENTS.includes(activeEvent) ? _USER_EVENTS : CAL_EVENTS;
          const idx = arr.indexOf(activeEvent);
          if (idx >= 0) arr.splice(idx, 1);
          setEventsVer(v => v + 1);
        }}
      />
      <_CategorySettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onChanged={() => setLabelsVer(v => v + 1)}
      />
      <_EventEditorModal
        open={editorOpen}
        date={st.selected}
        onClose={() => setEditorOpen(false)}
        onSave={(ev) => { _USER_EVENTS.push(ev); setEventsVer(v => v + 1); }}
      />
    </div>
  );
}

window.CalendarScreen = CalendarScreen;
window.CalendarScreenDesktop = CalendarScreenDesktop;
