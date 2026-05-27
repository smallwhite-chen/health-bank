// 編輯常用功能 — 桌機版（兩欄式 RWD + 拖拉排序）
// 視覺元件、按鈕、文案均與手機版保持一致；僅版型依桌機尺寸調整。
function EditFavoritesScreenDesktop({ navigate }) {
  const initial = (window.Data.favorites || []).filter(Boolean).slice(0, 12);
  const [slots, setSlots] = React.useState(initial);
  const [query, setQuery] = React.useState("");
  const [dragIdx, setDragIdx] = React.useState(null);
  const [overIdx, setOverIdx] = React.useState(null);

  const total = 12;
  const filled = slots.length;

  const handleSave = () => {
    try {
      localStorage.setItem("hb_favorites", JSON.stringify(slots));
    } catch (e) {}
    window.Data.favorites = slots;
    navigate(-1);
  };
  const handleCancel = () => navigate(-1);

  const remove = (i) => setSlots(slots.filter((_, idx) => idx !== i));
  const add = (item) => {
    if (slots.length >= total) return;
    if (slots.find(s => s.label === item.label)) return;
    setSlots([...slots, item]);
  };
  const has = (label) => slots.some(s => s.label === label);

  // ---------- Drag handlers ----------
  const onDragStart = (e, idx) => {
    setDragIdx(idx);
    try {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(idx));
    } catch (err) {}
  };
  const onDragOver = (e, idx) => {
    e.preventDefault();
    try { e.dataTransfer.dropEffect = "move"; } catch (err) {}
    if (overIdx !== idx) setOverIdx(idx);
  };
  const onDragLeave = (idx) => {
    if (overIdx === idx) setOverIdx(null);
  };
  const onDrop = (e, idx) => {
    e.preventDefault();
    const from = dragIdx;
    const to = idx;
    setDragIdx(null);
    setOverIdx(null);
    if (from == null || to == null || from === to) return;
    if (from >= filled) return;
    const targetIdx = to >= filled ? filled - 1 : to;
    const next = slots.slice();
    const [moved] = next.splice(from, 1);
    next.splice(targetIdx, 0, moved);
    setSlots(next);
  };
  const onDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };

  // ---------- Service catalog ----------
  const all = Object.entries(window.Data.services).flatMap(([cat, items]) =>
    items.map(it => ({ ...it, category: cat }))
  );
  const matched = all.filter(it =>
    query ? it.label.includes(query) : true
  );
  const groups = {};
  matched.forEach(it => {
    if (!groups[it.category]) groups[it.category] = [];
    groups[it.category].push(it);
  });

  return (
    <div className="dt-edit-fav" data-screen-label="editFavorites">
      {/* Header — same labels as mobile: 取消 / 編輯常用功能 / 儲存 */}
      <div className="dt-edit-header dt-edit-header--simple">
        <button className="dt-edit-h-btn cancel" onClick={handleCancel}>取消</button>
        <div className="dt-edit-h-title">編輯常用功能</div>
        <button className="dt-edit-h-btn save" onClick={handleSave}>儲存</button>
      </div>

      {/* Two-column layout */}
      <div className="dt-edit-grid">
        {/* LEFT — current slots (mirrors mobile edit-slot-panel) */}
        <section className="dt-edit-col dt-edit-slots">
          <div className="edit-slot-panel dt-edit-slot-panel">
            <div className="head">
              <span className="h">我的常用功能</span>
              <span className="count">{filled} / {total}</span>
            </div>
            <div className="hint">點選拖拉可調整排序位置,最多可設定 12 個項目</div>
            <div className="edit-grid dt-edit-grid-tiles">
              {Array.from({ length: total }).map((_, i) => {
                const f = slots[i];
                const isDragging = dragIdx === i;
                const isOver = overIdx === i && dragIdx != null && dragIdx !== i;
                if (!f) {
                  return (
                    <div
                      key={i}
                      className={`edit-tile empty${isOver ? " is-over" : ""}`}
                      onDragOver={(e) => onDragOver(e, i)}
                      onDragLeave={() => onDragLeave(i)}
                      onDrop={(e) => onDrop(e, i)}
                    />
                  );
                }
                return (
                  <div
                    key={i}
                    className={`edit-tile filled${isDragging ? " is-dragging" : ""}${isOver ? " is-over" : ""}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, i)}
                    onDragOver={(e) => onDragOver(e, i)}
                    onDragLeave={() => onDragLeave(i)}
                    onDrop={(e) => onDrop(e, i)}
                    onDragEnd={onDragEnd}>
                    <button className="rm" onClick={(e) => { e.stopPropagation(); remove(i); }}>✕</button>
                    <Icon name={f.icon} size={22} style={{ color:"var(--text-secondary)" }}/>
                    <span style={{ fontSize:11 }}>{f.label}</span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setSlots((window.Data.defaultFavorites || []).slice())}
              style={{
                width:"100%", marginTop: 12, padding:"12px",
                border:"1px dashed var(--border-med)", borderRadius: 10,
                background:"transparent", color:"var(--text-secondary)",
                fontFamily:"inherit", fontSize: 14,
                display:"inline-flex", alignItems:"center", justifyContent:"center", gap: 6,
                cursor:"pointer"
              }}>
              <Icon name="refresh" size={14}/> 重設為預設功能項目
            </button>
          </div>
        </section>

        {/* RIGHT — search + categorized service rows (mirrors mobile UX) */}
        <section className="dt-edit-col dt-edit-catalog">
          <div className="dt-edit-search-wrap">
            <span className="ico"><Icon name="search" size={16}/></span>
            <input
              className="search-input"
              placeholder="搜尋功能名稱或說明..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          <div className="dt-edit-catalog-scroll">
            {Object.entries(groups).map(([cat, items]) => (
              <React.Fragment key={cat}>
                <div className="cat-group-title" style={{ marginTop: 8 }}>{cat}</div>
                <div style={{ padding: "0 4px" }}>
                  {items.map((it, i) => (
                    <div key={i} className="service-row-big">
                      <div className="ico"><Icon name={it.icon} size={20}/></div>
                      <div className="body">
                        <div className="name">{it.label}</div>
                        <div className="sub">查詢相關紀錄</div>
                      </div>
                      {has(it.label) ? (
                        <button className="tog on" onClick={() => remove(slots.findIndex(s => s.label === it.label))}>
                          <Icon name="shield" size={12}/> 已加入
                        </button>
                      ) : (
                        <button className="tog" onClick={() => add(it)} disabled={slots.length >= total}>
                          <Icon name="plus" size={12}/> 加入常用
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

window.EditFavoritesScreenDesktop = EditFavoritesScreenDesktop;
