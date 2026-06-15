// 編輯常用紀錄 — 依分類列出所有項目，釘選加入常用紀錄區，可拖拉排序
function HealthEditPinsScreen({ navigate }) {
  const physio = window.Data.health.physio;
  const byId = window.Data.healthById;
  const readPins = () => {
    try {
      const s = JSON.parse(localStorage.getItem("hb_health_pins") || "null");
      return Array.isArray(s) ? s.filter((id) => byId[id]) : window.Data.health.pinnedDefault.slice();
    } catch (e) { return window.Data.health.pinnedDefault.slice(); }
  };
  const [pins, setPins] = React.useState(readPins);
  const [query, setQuery] = React.useState("");
  const [dragIdx, setDragIdx] = React.useState(null);
  const [overIdx, setOverIdx] = React.useState(null);

  const save = () => {
    try { localStorage.setItem("hb_health_pins", JSON.stringify(pins)); } catch (e) {}
    navigate(-1);
  };
  const cancel = () => navigate(-1);
  const resetDefault = () => setPins(window.Data.health.pinnedDefault.slice());

  const isPinned = (id) => pins.includes(id);
  const togglePin = (id) => setPins((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  // ---- 拖拉排序（常用紀錄區）----
  const onDragStart = (e, idx) => {
    setDragIdx(idx);
    try { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(idx)); } catch (err) {}
  };
  const onDragOver = (e, idx) => {
    e.preventDefault();
    try { e.dataTransfer.dropEffect = "move"; } catch (err) {}
    if (overIdx !== idx) setOverIdx(idx);
  };
  const onDrop = (e, idx) => {
    e.preventDefault();
    const from = dragIdx, to = idx;
    setDragIdx(null); setOverIdx(null);
    if (from == null || to == null || from === to) return;
    setPins((prev) => {
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };
  const onDragEnd = () => { setDragIdx(null); setOverIdx(null); };

  // ---- 全部項目（依分類）----
  const sections = [{ cat: "生理量測", items: physio }];
  const matchSection = (items) => items.filter((m) => query ? (m.name.includes(query) || m.short.includes(query)) : true);

  return (
    <>
      <div className="edit-header">
        <button className="cancel" onClick={cancel}>取消</button>
        <div className="title">編輯常用紀錄項目</div>
        <button className="save" onClick={save}>完成</button>
      </div>

      <div className="app-scroll">
        {/* 常用紀錄區（可拖拉排序） */}
        <div className="edit-slot-panel">
          <div className="head">
            <span className="h">常用紀錄項目</span>
            <span className="count">{pins.length} 項</span>
          </div>
          <div className="hint">拖拉 <Icon name="grip" size={13} /> 可調整排序；點選 <Icon name="pin-fill" size={13} /> 可移除。</div>
          {pins.length === 0 ? (
            <div className="hm-edit-empty">尚未加入任何常用紀錄，請於下方列表點選「加入常用」。</div>
          ) : (
            <div className="hm-edit-pin-list">
              {pins.map((id, i) => {
                const m = byId[id];
                if (!m) return null;
                const latest = window.HealthUtil.latestOf(id);
                const dragging = dragIdx === i;
                const over = overIdx === i && dragIdx != null && dragIdx !== i;
                return (
                  <div
                    key={id}
                    className={`hm-edit-pin-row${dragging ? " is-dragging" : ""}${over ? " is-over" : ""}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, i)}
                    onDragOver={(e) => onDragOver(e, i)}
                    onDrop={(e) => onDrop(e, i)}
                    onDragEnd={onDragEnd}
                  >
                    <span className="hm-edit-handle"><Icon name="grip" size={18} /></span>
                    <span className="hm-ico"><Icon name={m.icon} size={16} /></span>
                    <div className="hm-edit-pin-name">{m.name}</div>
                    <button className="hm-edit-pin-rm" onClick={() => togglePin(id)} aria-label="移除"><Icon name="pin-fill" size={16} /></button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 搜尋 */}
        <div className="edit-search-sticky">
          <span className="ico"><Icon name="search" size={16} /></span>
          <input
            className="search-input"
            placeholder="搜尋紀錄項目名稱..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* 重置為預設項目 */}
        <div style={{ padding: "0 16px", marginBottom: 4 }}>
          <button className="hm-edit-reset" onClick={resetDefault}>
            <Icon name="refresh" size={14} /> 重置為預設項目
          </button>
        </div>

        {/* 分類段落：全部項目 */}
        {sections.map(({ cat, items }) => {
          const list = matchSection(items);
          if (list.length === 0) return null;
          return (
            <React.Fragment key={cat}>
              <div className="cat-group-title" style={{ marginTop: 8 }}>{cat}</div>
              <div style={{ padding: "0 16px" }}>
                {list.map((m) => (
                  <div key={m.id} className="service-row-big">
                    <div className="ico"><Icon name={m.icon} size={20} /></div>
                    <div className="body">
                      <div className="name">{m.name}</div>
                    </div>
                    {isPinned(m.id) ? (
                      <button className="tog on" onClick={() => togglePin(m.id)}>
                        <Icon name="pin-fill" size={12} /> 已加入
                      </button>
                    ) : (
                      <button className="tog" onClick={() => togglePin(m.id)}>
                        <Icon name="pin" size={12} /> 加入常用
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </React.Fragment>
          );
        })}
        <div className="h-16" />
      </div>
    </>
  );
}

window.HealthEditPinsScreen = HealthEditPinsScreen;
