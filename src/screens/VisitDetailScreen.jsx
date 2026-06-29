function VisitDetailScreen({ navigate, params }) {
  const d = window.Data.visitDetail;
  const [medTab, setMedTab] = React.useState("drug");
  const list = medTab === "drug" ? d.meds.drug : medTab === "nondrug" ? d.meds.nondrug : d.meds.lab;

  const [openRows, setOpenRows] = React.useState({});
  const toggleRow = (k) => setOpenRows(o => ({ ...o, [k]: !o[k] }));
  const copayItems = [
    { label: "基本", value: 50 },
    { label: "藥品", value: 0 },
    { label: "檢驗檢查", value: 0 },
  ];
  const medItems = [
    { label: "藥費點數", value: 120 },
    { label: "藥事服務費點數", value: 33 },
    { label: "診察費點數", value: 228 },
    { label: "特殊材料費點數", value: 0 },
    { label: "診療費點數（含檢查費點數）", value: 102 },
  ];
  const Breakdown = ({ items }) => (
    <div style={{ background:"var(--bg-soft)", borderRadius: 8, padding:"4px 12px", margin:"2px 0 8px" }}>
      {items.map((it, i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline",
          fontSize: 13, padding:"7px 0", borderBottom: i < items.length - 1 ? "1px solid var(--border-soft)" : 0 }}>
          <span style={{ color:"var(--text-secondary)" }}>{it.label}</span>
          <span style={{ color:"var(--text-primary)", fontWeight: 500 }}>{it.value}</span>
        </div>
      ))}
    </div>
  );

  const noteKey = `hb_note_${params?.id || "default"}`;
  const [note, setNote] = React.useState(() => {
    try { return localStorage.getItem(noteKey) || ""; } catch { return ""; }
  });
  const [savedNote, setSavedNote] = React.useState(note);
  const [saved, setSaved] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const dirty = note !== savedNote;
  const onSave = () => {
    try { localStorage.setItem(noteKey, note); } catch {}
    setSavedNote(note);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 1600);
  };
  const onClear = () => setNote("");

  return (
    <>
      <DetailHeader title="就醫紀錄詳細資料" onBack={() => navigate(-1)}/>
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
        </div>

        <div className="detail-section">
          <div className="sec-head"><Icon name="stetho" size={16} className="ico"/> 疾病次診斷 / 次處置資料</div>
          {d.subdx.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, color:"var(--text-tertiary)", padding:"4px 0" }}>項目：{s.idx}</div>
              <div style={{ display:"flex", alignItems:"baseline", gap: 6, paddingBottom: 8 }}>
                <span style={{ fontSize: 12, color:"var(--text-tertiary)", flexShrink: 0 }}>疾病分類：</span>
                <span style={{ fontSize: 14, color:"var(--text-primary)", fontWeight: 500 }}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="detail-section">
          <div className="sec-head"><Icon name="report" size={16} className="ico"/> 醫囑資料</div>
          <div className="segmented" style={{ marginBottom: 12 }}>
            <button className={medTab === "drug" ? "active" : ""} onClick={() => setMedTab("drug")}>藥品</button>
            <button className={medTab === "nondrug" ? "active" : ""} onClick={() => setMedTab("nondrug")}>非藥品</button>
            <button className={medTab === "lab" ? "active" : ""} onClick={() => setMedTab("lab")}>檢驗(查)</button>
          </div>
          {medTab === "drug" && list.map((m, i) => (
            <div key={i} style={{ padding:"12px 0", borderBottom: i < list.length - 1 ? "1px solid var(--border-soft)" : 0 }}>
              <div className="drug-top">
                {m.img && window.DrugImages?.[m.img] ? (
                  <img className="drug-img" src={window.DrugImages[m.img]} alt={m.name} style={{ width:48, height:48, borderRadius:8, objectFit:"cover", border:"1px solid var(--border-soft)" }}/>
                ) : (
                  <div className="placeholder-img drug-img"><Icon name="image" size={18}/></div>
                )}
                <button className="filter-btn drug-query">查詢藥品 <Icon name="external" size={12}/></button>
                <div className="drug-main">
                  <div className="drug-name-line">
                    <span className="drug-label">藥品名稱：</span>
                    <span className="drug-cn" style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</span>
                    <span className="drug-sep">/</span>
                    <span className="drug-en" style={{ fontSize: 12, color:"var(--text-tertiary)" }}>{m.en}</span>
                  </div>
                  {m.days != null && (
                    <div className="drug-days">
                      <span className="drug-days-label" style={{ fontSize: 12, color:"var(--text-tertiary)" }}>給藥日數</span>
                      <span className="drug-days-colon">：</span>
                      <span className="drug-days-val" style={{ fontSize: 13, color:"var(--text-primary)", lineHeight: 1.7 }}>{m.days} 天</span>
                    </div>
                  )}
                </div>
              </div>
              {m.indication && (
                <div style={{ marginTop: 10, background:"var(--bg-soft)", padding:"10px 12px", borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color:"var(--text-tertiary)", marginBottom: 2 }}>適應症</div>
                  <div style={{ fontSize: 13, color:"var(--text-primary)", lineHeight: 1.7 }}>{m.indication}</div>
                </div>
              )}
            </div>
          ))}
          {(medTab === "nondrug" || medTab === "lab") && list.map((m, i) => (
            <div key={i} style={{ display:"flex", gap:12, alignItems:"center", padding:"14px 0", borderBottom: i < list.length - 1 ? "1px solid var(--border-soft)" : 0 }}>
              <div style={{ flex:1, minWidth:0, display:"grid", gridTemplateColumns:"auto 1fr", columnGap: 16, rowGap: 6 }}>
                <span style={{ fontSize: 12, color:"var(--text-tertiary)" }}>醫囑代碼</span>
                <span style={{ fontSize: 14, color:"var(--text-primary)" }}>{m.code}</span>
                <span style={{ fontSize: 12, color:"var(--text-tertiary)" }}>醫囑名稱</span>
                <span style={{ fontSize: 14, color:"var(--text-primary)", fontWeight: 500 }}>{m.name}</span>
                <span style={{ fontSize: 12, color:"var(--text-tertiary)" }}>醫囑總量</span>
                <span style={{ fontSize: 14, color:"var(--text-primary)" }}>{m.qty}</span>
              </div>
              {medTab === "lab" && !m.noReport && (
                <button className="filter-btn" style={{ flexShrink:0 }} onClick={() => navigate("reportDetail", { id: m.reportId })}>查看報告 <Icon name="external" size={12}/></button>
              )}
            </div>
          ))}
        </div>

        <div className="detail-section">
          <div className="sec-head" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ display:"inline-flex", alignItems:"center" }}><Icon name="edit" size={16} className="ico"/> 個人就醫筆記</span>
            {!editing && (
              <button onClick={() => setEditing(true)}
                style={{
                  padding:"6px 14px", borderRadius: 8, fontFamily:"inherit", fontSize: 13, fontWeight: 600,
                  border:"1px solid var(--border-med)", background:"var(--bg-surface)",
                  color:"var(--brand-900)", display:"inline-flex", alignItems:"center", gap: 5, cursor:"pointer"
                }}>
                <Icon name="edit" size={13}/> 編輯
              </button>
            )}
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            readOnly={!editing}
            placeholder="輸入就醫備註，例如：醫師建議兩週後回診、需追蹤血壓變化…"
            style={{
              width:"100%", minHeight: 140, resize:"vertical",
              border:"1px solid var(--border-soft)", borderRadius: 10,
              padding:"12px 14px", fontFamily:"inherit", fontSize: 14, lineHeight: 1.7,
              color:"var(--text-primary)", background:"var(--bg-soft)", outline:"none",
              boxSizing:"border-box"
            }}
          />
          {editing && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap: 10, marginTop: 12 }}>
            <button onClick={() => { setNote(savedNote); setEditing(false); }}
              style={{
                padding:"12px", borderRadius: 10, fontFamily:"inherit", fontSize: 14,
                border:"1px solid var(--border-soft)", background:"var(--bg-surface)",
                color:"var(--text-secondary)",
                display:"inline-flex", alignItems:"center", justifyContent:"center", gap: 6,
                cursor:"pointer"
              }}>
              取消
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
          )}
        </div>

        <div className="detail-section kpoints">
          <div className="sec-head"><Icon name="report" size={16} className="ico"/> 健保點數</div>
          <div className="detail-row right kpoint-toggle" onClick={() => toggleRow("copay")}><span className="k" style={{ fontWeight: 600, color:"var(--text-primary)" }}>部分負擔</span>
            <span className="v" style={{ display:"inline-flex", alignItems:"center", gap:4, justifyContent:"flex-end" }}>50 <Icon name="chev-right" size={12} style={{ transform: openRows.copay ? "rotate(270deg)" : "rotate(90deg)", transition:"transform .15s" }}/></span>
          </div>
          {openRows.copay && <Breakdown items={copayItems}/>}
          <div className="detail-row right"><span className="k" style={{ fontWeight: 600, color:"var(--text-primary)" }}>申請點數</span><span className="v">433</span></div>
          <div className="detail-row right kpoint-toggle" onClick={() => toggleRow("med")}><span className="k" style={{ fontWeight: 600, color:"var(--text-primary)" }}>醫療費用點數</span>
            <span className="v" style={{ display:"inline-flex", alignItems:"center", gap:4, justifyContent:"flex-end" }}>483 <Icon name="chev-right" size={12} style={{ transform: openRows.med ? "rotate(270deg)" : "rotate(90deg)", transition:"transform .15s" }}/></span>
          </div>
          {openRows.med && <Breakdown items={medItems}/>}
          <div className="detail-row right"><span className="k">健保卡就醫序號</span><span className="v">0003</span></div>
          <div className="detail-row right"><span className="k">資料來源</span><span className="v">IC卡資料</span></div>
          <p className="kpoint-note">註：醫療點數是各分項費用之合計，含部分負擔，因部分案件採論件計酬、Tw-DRGs定額支付及分項論量之申報而與「申請點數＋部分負擔」有所差異。</p>
        </div>

        <div className="h-16"/>
      </div>
    </>
  );
}

window.VisitDetailScreen = VisitDetailScreen;
