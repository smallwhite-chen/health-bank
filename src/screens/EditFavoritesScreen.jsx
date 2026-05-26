// 編輯常用功能（捷徑清單）— full page
function EditFavoritesScreen({ navigate }) {
  const defaults = window.Data.favorites.filter(Boolean).slice(0, 8);
  const [slots, setSlots] = React.useState(defaults);
  const [query, setQuery] = React.useState("");

  const filled = slots.length;
  const total = 12;

  const remove = (i) => setSlots(slots.filter((_, idx) => idx !== i));
  const add = (item) => {
    if (slots.length >= total) return;
    if (slots.find(s => s.label === item.label)) return;
    setSlots([...slots, item]);
  };
  const has = (label) => slots.some(s => s.label === label);

  // Flat all-services list for search
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
    <>
      <div className="edit-header">
        <button className="cancel" onClick={() => navigate(-1)}>取消</button>
        <div className="title">捷徑清單</div>
        <button className="save" onClick={() => navigate(-1)}>儲存</button>
      </div>

      <div className="app-scroll">
        <div className="edit-slot-panel">
          <div className="head">
            <span className="h">自訂常用功能</span>
            <span className="count">{filled} / {total}</span>
          </div>
          <div className="hint">點選拖拉可調整排序位置</div>
          <div className="edit-grid">
            {Array.from({ length: total }).map((_, i) => {
              const f = slots[i];
              if (!f) return <div key={i} className="edit-tile empty"/>;
              return (
                <div key={i} className="edit-tile filled">
                  <button className="rm" onClick={() => remove(i)}>✕</button>
                  <Icon name={f.icon} size={22} style={{ color:"var(--text-secondary)" }}/>
                  <span style={{ fontSize:11 }}>{f.label}</span>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setSlots(defaults)}
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

        <div style={{ padding:"16px 16px 0", position:"relative" }}>
          <span style={{ position:"absolute", top:"50%", left:30, transform:"translateY(-50%)", color:"var(--text-tertiary)" }}>
            <Icon name="search" size={16}/>
          </span>
          <input
            className="search-input"
            placeholder="搜尋功能名稱或說明..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {Object.entries(groups).map(([cat, items]) => (
          <React.Fragment key={cat}>
            <div className="cat-group-title" style={{ marginTop: 8 }}>{cat}</div>
            <div style={{ padding: "0 16px" }}>
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
        <div className="h-16"/>
      </div>
    </>
  );
}

window.EditFavoritesScreen = EditFavoritesScreen;
