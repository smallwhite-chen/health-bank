function VisitDetailScreen({ navigate, params }) {
  const d = window.Data.visitDetail;
  const [medTab, setMedTab] = React.useState("drug");
  const list = medTab === "drug" ? d.meds.drug : d.meds.nondrug;

  const noteKey = `hb_note_${params?.id || "default"}`;
  const [note, setNote] = React.useState(() => {
    try { return localStorage.getItem(noteKey) || ""; } catch { return ""; }
  });
  const [savedNote, setSavedNote] = React.useState(note);
  const [saved, setSaved] = React.useState(false);
  const dirty = note !== savedNote;
  const onSave = () => {
    try { localStorage.setItem(noteKey, note); } catch {}
    setSavedNote(note);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };
  const onClear = () => setNote("");

  return (
    <>
      <DetailHeader title="就醫紀錄詳情" onBack={() => navigate(-1)}/>
      <div className="app-scroll">

        <div className="detail-section">
          <div className="sec-head"><Icon name="report" size={16} className="ico"/> 就醫摘要</div>
          <div className="detail-row"><span className="k">就醫日期</span><span className="v">{d.summary.date}</span></div>
          <div className="detail-row"><span className="k">科別</span><span className="v">{d.summary.type}</span></div>
          <div className="detail-row"><span className="k">疾病分類</span><span className="v">{d.summary.diagnosis}</span></div>
          <div className="detail-row"><span className="k">處置名稱</span><span className="v">{d.summary.procedure}</span></div>
        </div>

        <div className="detail-section">
          <div className="sec-head"><Icon name="box" size={16} className="ico"/> 醫事機構</div>
          <div className="detail-row">
            <span className="k">機構名稱</span>
            <span className="v" style={{ display:"inline-flex", alignItems:"center", gap:4, color:"var(--brand-900)", textDecoration:"underline" }}>
              {d.org.name} <Icon name="external" size={12}/>
            </span>
          </div>
          <div className="detail-row"><span className="k">醫師姓名</span><span className="v">{d.org.doctor}</span></div>
          <div className="detail-row" style={{ alignItems:"flex-start" }}>
            <span className="k">服務時段</span>
            <div className="v" style={{ display:"grid", gridTemplateColumns:"auto 1fr", columnGap: 12, rowGap: 6, textAlign:"left" }}>
              <span style={{ color:"var(--text-tertiary)" }}>上午</span><span>09:00 - 11:30</span>
              <span style={{ color:"var(--text-tertiary)" }}>下午</span><span>14:00 - 16:30</span>
              <span style={{ color:"var(--text-tertiary)" }}>晚上</span><span style={{ color:"var(--text-muted)" }}>休診</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="sec-head"><Icon name="stetho" size={16} className="ico"/> 疾病次診斷 / 次處置資料</div>
          {d.subdx.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, color:"var(--text-tertiary)", padding:"4px 0" }}>項目：{s.idx}</div>
              <div style={{ fontSize: 14, color:"var(--text-primary)", fontWeight: 500, paddingBottom:8 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="detail-section">
          <div className="sec-head"><Icon name="report" size={16} className="ico"/> 醫囑資料</div>
          <div className="segmented" style={{ marginBottom: 12 }}>
            <button className={medTab === "drug" ? "active" : ""} onClick={() => setMedTab("drug")}>藥品</button>
            <button className={medTab === "nondrug" ? "active" : ""} onClick={() => setMedTab("nondrug")}>非藥品</button>
          </div>
          {medTab === "drug" && list.map((m, i) => (
            <div key={i} style={{ padding:"12px 0", borderBottom: i < list.length - 1 ? "1px solid var(--border-soft)" : 0 }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div className="placeholder-img" style={{ flexShrink:0 }}><Icon name="image" size={18}/></div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color:"var(--text-tertiary)" }}>{m.en}</div>
                  {m.days != null && <div style={{ fontSize: 12, color:"var(--text-tertiary)" }}>給藥日數：{m.days} 天</div>}
                </div>
                <button className="filter-btn" style={{ flexShrink:0 }}>查詢更多 <Icon name="external" size={12}/></button>
              </div>
              {m.indication && (
                <div style={{ marginTop: 10, background:"var(--bg-soft)", padding:"10px 12px", borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color:"var(--text-tertiary)", marginBottom: 2 }}>適應症</div>
                  <div style={{ fontSize: 13, color:"var(--text-primary)", lineHeight: 1.7 }}>{m.indication}</div>
                </div>
              )}
            </div>
          ))}
          {medTab === "nondrug" && list.map((m, i) => (
            <div key={i} style={{ display:"flex", gap:12, alignItems:"center", padding:"14px 0", borderBottom: i < list.length - 1 ? "1px solid var(--border-soft)" : 0 }}>
              <div style={{ flex:1, minWidth:0, display:"grid", gridTemplateColumns:"auto 1fr", columnGap: 16, rowGap: 6 }}>
                <span style={{ fontSize: 12, color:"var(--text-tertiary)" }}>醫囑代碼</span>
                <span style={{ fontSize: 14, color:"var(--text-primary)" }}>{m.code}</span>
                <span style={{ fontSize: 12, color:"var(--text-tertiary)" }}>醫囑名稱</span>
                <span style={{ fontSize: 14, color:"var(--text-primary)", fontWeight: 500 }}>{m.name}</span>
                <span style={{ fontSize: 12, color:"var(--text-tertiary)" }}>醫囑總量</span>
                <span style={{ fontSize: 14, color:"var(--text-primary)" }}>{m.qty}</span>
              </div>
              <button className="filter-btn" style={{ flexShrink:0 }} onClick={() => navigate("reportDetail", { id: m.reportId })}>查看報告 <Icon name="external" size={12}/></button>
            </div>
          ))}
        </div>

        <div className="detail-section">
          <div className="sec-head"><Icon name="edit" size={16} className="ico"/> 就醫備注</div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="輸入就醫備注，例如：醫師建議兩週後回診、需追蹤血壓變化…"
            style={{
              width:"100%", minHeight: 140, resize:"vertical",
              border:"1px solid var(--border-soft)", borderRadius: 10,
              padding:"12px 14px", fontFamily:"inherit", fontSize: 14, lineHeight: 1.7,
              color:"var(--text-primary)", background:"var(--bg-soft)", outline:"none",
              boxSizing:"border-box"
            }}
          />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap: 10, marginTop: 12 }}>
            <button onClick={onClear} disabled={!note}
              style={{
                padding:"12px", borderRadius: 10, fontFamily:"inherit", fontSize: 14,
                border:"1px solid var(--border-soft)", background:"var(--bg-surface)",
                color: note ? "var(--text-secondary)" : "var(--text-muted)",
                display:"inline-flex", alignItems:"center", justifyContent:"center", gap: 6,
                cursor: note ? "pointer" : "default"
              }}>
              <Icon name="trash" size={14}/> 清除
            </button>
            <button onClick={onSave} disabled={!dirty}
              style={{
                padding:"12px", borderRadius: 10, fontFamily:"inherit", fontSize: 14, fontWeight: 600,
                border:"1px solid " + (dirty ? "var(--brand-900)" : "var(--border-med)"),
                background: dirty ? "var(--brand-900)" : "var(--border-med)",
                color:"#fff",
                display:"inline-flex", alignItems:"center", justifyContent:"center", gap: 6,
                cursor: dirty ? "pointer" : "default"
              }}>
              <Icon name="save" size={14}/> {saved ? "已儲存" : "儲存"}
            </button>
          </div>
        </div>

        <div className="detail-section">
          <div className="sec-head"><Icon name="report" size={16} className="ico"/> 健保點數</div>
          <div className="detail-row right"><span className="k">健保卡就醫序號</span><span className="v">0003</span></div>
          <div className="detail-row right"><span className="k">資料來源</span><span className="v">IC卡資料</span></div>
          <div className="detail-row right"><span className="k" style={{ fontWeight: 600, color:"var(--text-primary)" }}>部分負擔</span>
            <span className="v" style={{ display:"inline-flex", alignItems:"center", gap:4, justifyContent:"flex-end" }}>50 <Icon name="chev-right" size={12} style={{ transform:"rotate(90deg)" }}/></span>
          </div>
          <div className="detail-row right"><span className="k" style={{ fontWeight: 600, color:"var(--text-primary)" }}>申請點數</span><span className="v">433</span></div>
          <div className="detail-row right"><span className="k" style={{ fontWeight: 600, color:"var(--text-primary)" }}>醫療費用點數</span>
            <span className="v" style={{ display:"inline-flex", alignItems:"center", gap:4, justifyContent:"flex-end" }}>483 <Icon name="chev-right" size={12} style={{ transform:"rotate(90deg)" }}/></span>
          </div>
        </div>

        <div className="h-16"/>
      </div>
    </>
  );
}

window.VisitDetailScreen = VisitDetailScreen;
