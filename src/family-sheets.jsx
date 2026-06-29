// 眷屬管理相關 Sheets — 編輯 / 接受 / 同意 / 發起邀請(TBD)
const { useState: useFamS } = React;

function _ExpirySeg({ value, onChange }) {
  // value: "永久" | "自訂"；自訂時帶日期
  const isCustom = value && value.mode === "custom";
  return (
    <>
      <div className="fam-expiry-seg">
        <button className={"chip-btn" + (!isCustom ? " active" : "")} onClick={() => onChange({ mode: "forever" })}>永久</button>
        <button className={"chip-btn" + (isCustom ? " active" : "")} onClick={() => onChange({ mode: "custom", date: (value && value.date) || "" })}>自訂期限</button>
      </div>
      {isCustom && (
        <div style={{ marginTop: 10 }}>
          <div className="fam-field-label">到期日</div>
          <input type="date" className="fam-input" value={value.date || ""} onChange={e => onChange({ mode: "custom", date: e.target.value })}/>
          <div style={{ fontSize:11.5, color:"var(--text-tertiary)", marginTop:4 }}>到期後將自動解除授權，需重新邀請。</div>
        </div>
      )}
    </>
  );
}

function _PersonCard({ m }) {
  return (
    <div className="fam-person-kv">
      <div className="fam-kv"><span className="k">姓名</span><span className="v">{m.name}</span></div>
      <div className="fam-kv"><span className="k">關係</span><span className="v">{m.relation}</span></div>
      <div className="fam-kv"><span className="k">身分證號</span><span className="v">A1********9</span></div>
    </div>
  );
}

// 我可查看 — 編輯（檢視對方資料、期限、刪除）
function FamEditViewableSheet({ data, onClose, onToast }) {
  const m = data || {};
  const viewItems = (window.Data && window.Data.viewAllItems) || [];
  const [showItems, setShowItems] = useFamS(false);
  const [confirmDelete, setConfirmDelete] = useFamS(false);

  if (confirmDelete) {
    return (
      <Sheet title="刪除並停止查看" onClose={onClose} footer={
        <>
          <button onClick={() => setConfirmDelete(false)}>取消</button>
          <button className="danger" onClick={() => onToast(`已刪除與 ${m.name} 的綁定，停止查看（示意）`)}>
            <Icon name="trash" size={16}/> 確認刪除
          </button>
        </>
      }>
        <div className="fam-confirm">
          <span className="fam-confirm-ico"><Icon name="trash" size={26}/></span>
          <div className="fam-confirm-title">確認刪除並停止查看 {m.name}？</div>
          <div className="fam-confirm-sub">刪除並停止查看後將立即無法再查看對方的健康存摺資料，如需再次查看須重新發起邀請並經對方同意。</div>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet title="編輯查看授權" onClose={onClose} footer={
      <>
        <button onClick={onClose}>關閉</button>
        <button className="danger" onClick={() => setConfirmDelete(true)}>
          <Icon name="trash" size={16}/> 刪除並停止查看
        </button>
      </>
    }>
      <_PersonCard m={m}/>
      <div className="fam-kv" style={{ marginTop: 4 }}><span className="k">起始日期</span><span className="v">{m.since}</span></div>
      <div className="fam-kv"><span className="k">查看期限</span><span className="v">{m.expiry}</span></div>
      <div className="fam-kv">
        <span className="k">查看範圍</span>
        <span className="v" style={{ display:"flex", alignItems:"center", gap:10 }}>
          共{viewItems.length}項
          <button className="fam-scope-toggle" onClick={() => setShowItems(s => !s)} aria-expanded={showItems} aria-label={showItems ? "收起" : "展開"}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showItems ? "rotate(180deg)" : "none", transition:"transform 160ms ease" }}><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </span>
      </div>
      {showItems && (
        <div className="fam-scope-list">
          {viewItems.map((it, i) => (
            <div key={i} className="fam-scope-item">{it}</div>
          ))}
        </div>
      )}

      <div className="note-text" style={{ marginTop: 18 }}>
        提醒：刪除並停止查看後將立即無法再查看對方的健康存摺資料，如需再次查看須重新發起邀請並經對方同意。
      </div>
    </Sheet>
  );
}

// 同意他人查看 — 編輯（對方資料、期限、分享項目、編輯項目、刪除）
function FamEditSharerSheet({ data, onClose, onToast }) {
  const m = data || {};
  const shareItems = (window.Data && window.Data.shareItems) || [];
  const [sel, setSel] = useFamS(() => new Set(m.items || []));
  const [expiry, setExpiry] = useFamS(() => m.expiry === "永久" ? { mode: "forever" } : { mode: "custom", date: "" });
  const [editing, setEditing] = useFamS(false);
  const [showShare, setShowShare] = useFamS(false);
  const [confirmDelete, setConfirmDelete] = useFamS(false);
  const toggle = (k) => { const n = new Set(sel); n.has(k) ? n.delete(k) : n.add(k); setSel(n); };
  const allOn = sel.size === shareItems.length;

  if (confirmDelete) {
    return (
      <Sheet title="刪除並停止分享" onClose={onClose} footer={
        <>
          <button onClick={() => setConfirmDelete(false)}>取消</button>
          <button className="danger" onClick={() => onToast(`已刪除與 ${m.name} 的綁定，停止分享（示意）`)}>
            <Icon name="trash" size={16}/> 確認刪除
          </button>
        </>
      }>
        <div className="fam-confirm">
          <span className="fam-confirm-ico"><Icon name="trash" size={26}/></span>
          <div className="fam-confirm-title">確認刪除並停止分享給 {m.name}？</div>
          <div className="fam-confirm-sub">刪除並停止分享後將立即無法再讓對方查看您的健康存摺資料，如需再次分享須重新發起邀請並經對方同意。</div>
        </div>
      </Sheet>
    );
  }

  return (
    <>
      <Sheet title="編輯分享授權" onClose={onClose} footer={
        <>
          <button onClick={onClose}>關閉</button>
          <button className="danger" onClick={() => setConfirmDelete(true)}>
            <Icon name="trash" size={16}/> 刪除並停止分享
          </button>
        </>
      }>
        <_PersonCard m={m}/>
        <div className="chip-group-label" style={{ marginTop: 16 }}>授權資訊</div>
        <div className="fam-kv"><span className="k">綁定起始</span><span className="v">{m.since}</span></div>

        <div className="fam-share-allrow" style={{ marginTop: 18 }}>
          <div className="chip-group-label" style={{ margin: 0 }}>分享設定</div>
          <button className="fam-share-all-btn" onClick={() => setEditing(true)}>
            <Icon name="edit" size={14}/> 編輯
          </button>
        </div>
        <div className="fam-kv"><span className="k">到期日</span><span className="v">{m.expiry}</span></div>
        <div className="fam-kv">
          <span className="k">分享的健康項目</span>
          <span className="v" style={{ display:"flex", alignItems:"center", gap:10 }}>
            共{sel.size}項
            <button className="fam-scope-toggle" onClick={() => setShowShare(s => !s)} aria-expanded={showShare} aria-label={showShare ? "收起" : "展開"}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showShare ? "rotate(180deg)" : "none", transition:"transform 160ms ease" }}><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </span>
        </div>
        {showShare && (
          <div className="fam-scope-list">
            {[...sel].length === 0
              ? <div className="fam-scope-item">尚未選擇任何分享項目</div>
              : [...sel].map(k => { const it = shareItems.find(s => s.key === k); return <div key={k} className="fam-scope-item">{it ? it.label : k}</div>; })}
          </div>
        )}

        <div className="note-text" style={{ marginTop: 18 }}>
          提醒：對方僅能查看您勾選分享的項目。調整後立即生效；刪除分享後對方將無法再查看您的任何資料。
        </div>
      </Sheet>

      {editing && (
        <Sheet title="編輯分享設定" onClose={() => setEditing(false)} footer={
          <>
            <button onClick={() => setEditing(false)}>取消</button>
            <button className="primary" onClick={() => { setEditing(false); onToast("已更新分享設定（示意）"); }}>儲存</button>
          </>
        }>
          <div className="chip-group-label">查看期限</div>
          <_ExpirySeg value={expiry} onChange={setExpiry}/>

          <div className="fam-share-allrow" style={{ marginTop: 16 }}>
            <span className="cnt">分享項目　已選 {sel.size} / {shareItems.length} 項</span>
            <button className="fam-share-all-btn" onClick={() => setSel(allOn ? new Set() : new Set(shareItems.map(s => s.key)))}>
              {allOn ? "全部取消" : "全選"}
            </button>
          </div>
          <div className="fam-share-grid">
            {shareItems.map(it => (
              <div key={it.key} className="fam-share-row" onClick={() => toggle(it.key)}>
                <div className="fam-share-info">
                  <div className="fam-share-label">{it.label}</div>
                  {it.sub && <div className="fam-share-sub">{it.sub}</div>}
                </div>
                <span className={"fam-check" + (sel.has(it.key) ? " on" : "")}>
                  {sel.has(it.key) && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-11"/></svg>}
                </span>
              </div>
            ))}
          </div>
        </Sheet>
      )}
    </>
  );
}

// 待確認 A — 對方想開放資料給我（接受流程）
function FamAcceptSheet({ data, onClose, onToast }) {
  const m = data || {};
  const viewItems = (window.Data && window.Data.viewAllItems) || [];
  const [showScope, setShowScope] = useFamS(false);
  return (
    <Sheet title="接受查看授權" onClose={onClose} footer={
      <>
        <button onClick={() => onToast(`已婉拒 ${m.name} 的邀請（示意）`)}>婉拒</button>
        <button className="primary" onClick={() => onToast(`已接受，現在可查看 ${m.name} 的資料（示意）`)}>接受授權</button>
      </>
    }>
      <div style={{ fontSize:13.5, color:"var(--text-secondary)", lineHeight:1.7 }}>
        <b style={{ color:"var(--text-primary)" }}>{m.name}</b> 想開放其健康存摺資料給您查看，接受後您即可在「檢視家人健康資訊」中切換檢視。
      </div>
      <_PersonCard m={m}/>
      <div className="chip-group-label" style={{ marginTop: 16 }}>邀請資訊</div>
      <div className="fam-kv"><span className="k">提出日期</span><span className="v">{m.date}</span></div>
      <div className="fam-kv">
        <span className="k">開放範圍</span>
        <span className="v" style={{ display:"flex", alignItems:"center", gap:10 }}>
          共{viewItems.length}項
          <button className="fam-scope-toggle" onClick={() => setShowScope(s => !s)} aria-expanded={showScope} aria-label={showScope ? "收起" : "展開"}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showScope ? "rotate(180deg)" : "none", transition:"transform 160ms ease" }}><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </span>
      </div>
      {showScope && (
        <div className="fam-scope-list">
          {viewItems.map((it, i) => (
            <div key={i} className="fam-scope-item">{it}</div>
          ))}
        </div>
      )}
      <div className="note-text" style={{ marginTop: 18 }}>
        接受即表示您同意查看對方分享之健康資料，並遵守眷屬授權注意事項。您可隨時於「我可查看」中解除。
      </div>
    </Sheet>
  );
}

// 待確認 B — 對方想查看我的資料（驗證 → 設定範圍 → 同意）
function FamAgreeSheet({ data, onClose, onToast }) {
  const m = data || {};
  const shareItems = (window.Data && window.Data.shareItems) || [];
  const [step, setStep] = useFamS(1);
  const [pwd, setPwd] = useFamS("");
  const [showScope, setShowScope] = useFamS(false);
  const [showReq, setShowReq] = useFamS(false);
  const reqItems = m.reqItems || [];
  const reqExpiry = m.reqExpiry || { mode: "forever" };
  const reqExpLabel = reqExpiry.mode === "forever" ? "永久" : (reqExpiry.date || "未設定");
  const [sel, setSel] = useFamS(() => new Set(reqItems));
  const [expiry, setExpiry] = useFamS(() => ({ ...reqExpiry }));
  const toggle = (k) => { const n = new Set(sel); n.has(k) ? n.delete(k) : n.add(k); setSel(n); };
  const allOn = sel.size === shareItems.length;

  const StepBar = (
    <>
      <div className="fam-steps">
        <span className={"fam-step-dot " + (step > 1 ? "done" : "active")}>{step > 1 ? "✓" : "1"}</span>
        <span className={"fam-step-line" + (step > 1 ? " done" : "")}/>
        <span className={"fam-step-dot " + (step === 2 ? "active" : step > 2 ? "done" : "")}>{step > 2 ? "✓" : "2"}</span>
        <span className={"fam-step-line" + (step > 2 ? " done" : "")}/>
        <span className={"fam-step-dot " + (step === 3 ? "active" : "")}>3</span>
      </div>
      <div className="fam-step-label">
        {step === 1 ? "步驟 1／3　身分驗證" : step === 2 ? "步驟 2／3　檢視並調整查看範圍" : "步驟 3／3　確認並同意"}
      </div>
    </>
  );

  let footer, body;
  if (step === 1) {
    body = (
      <>
        <div style={{ fontSize:13.5, color:"var(--text-secondary)", lineHeight:1.7 }}>
          <b style={{ color:"var(--text-primary)" }}>{m.name}</b> 想查看您的健康存摺資料。
        </div>
        <_PersonCard m={m}/>
      </>
    );
    footer = (
      <>
        <button onClick={() => onToast(`已拒絕 ${m.name} 的查看請求（示意）`)}>拒絕</button>
        <button className="primary" onClick={() => setStep(2)}>確認並繼續</button>
      </>
    );
  } else if (step === 2) {
    body = (
      <>
        <div style={{ fontSize:13.5, color:"var(--text-secondary)", lineHeight:1.7 }}>
          以下為 <b style={{ color:"var(--text-primary)" }}>{m.name}</b> 希望查看的時間與項目，您可調整後再決定是否同意。
        </div>

        <div className="chip-group-label" style={{ marginTop: 16 }}>對方希望查看的範圍</div>
        <div className="fam-kv"><span className="k">查看期限</span><span className="v">{reqExpLabel}</span></div>
        <div className="fam-kv">
          <span className="k">查看項目</span>
          <span className="v" style={{ display:"flex", alignItems:"center", gap:10 }}>
            共{reqItems.length}項
            <button className="fam-scope-toggle" onClick={() => setShowReq(s => !s)} aria-expanded={showReq} aria-label={showReq ? "收起" : "展開"}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showReq ? "rotate(180deg)" : "none", transition:"transform 160ms ease" }}><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </span>
        </div>
        {showReq && (
          <div className="fam-scope-list">
            {reqItems.length === 0
              ? <div className="fam-scope-item">對方未指定項目</div>
              : reqItems.map(k => { const it = shareItems.find(s => s.key === k); return <div key={k} className="fam-scope-item">{it ? it.label : k}</div>; })}
          </div>
        )}

        <div className="chip-group-label" style={{ marginTop: 20 }}>您可調整實際開放的項目與期限</div>
        <_ExpirySeg value={expiry} onChange={setExpiry}/>
        <div className="fam-share-allrow" style={{ marginTop: 16 }}>
          <span className="cnt">已選 {sel.size} / {shareItems.length} 項</span>
          <button className="fam-share-all-btn" onClick={() => setSel(allOn ? new Set() : new Set(shareItems.map(s => s.key)))}>
            {allOn ? "全部取消" : "全選"}
          </button>
        </div>
        <div className="fam-share-grid">
          {shareItems.map(it => (
            <div key={it.key} className="fam-share-row" onClick={() => toggle(it.key)}>
              <div className="fam-share-info">
                <div className="fam-share-label">{it.label}</div>
                {it.sub && <div className="fam-share-sub">{it.sub}</div>}
              </div>
              <span className={"fam-check" + (sel.has(it.key) ? " on" : "")}>
                {sel.has(it.key) && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-11"/></svg>}
              </span>
            </div>
          ))}
        </div>
      </>
    );
    footer = (
      <>
        <button onClick={() => setStep(1)}>上一步</button>
        <button className="primary" disabled={sel.size === 0} style={sel.size === 0 ? { opacity:0.5 } : null} onClick={() => setStep(3)}>下一步</button>
      </>
    );
  } else {
    const expLabel = expiry.mode === "forever" ? "永久" : (expiry.date || "未設定");
    body = (
      <>
        <_PersonCard m={m}/>
        <div className="chip-group-label" style={{ marginTop: 16 }}>您將開放給對方</div>
        <div className="fam-kv"><span className="k">查看期限</span><span className="v">{expLabel}</span></div>
        <div className="fam-kv">
          <span className="k">開放項目</span>
          <span className="v" style={{ display:"flex", alignItems:"center", gap:10 }}>
            共{sel.size}項
            <button className="fam-scope-toggle" onClick={() => setShowScope(s => !s)} aria-expanded={showScope} aria-label={showScope ? "收起" : "展開"}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showScope ? "rotate(180deg)" : "none", transition:"transform 160ms ease" }}><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </span>
        </div>
        {showScope && (
          <div className="fam-scope-list">
            {[...sel].length === 0
              ? <div className="fam-scope-item">尚未選擇任何項目</div>
              : [...sel].map(k => { const it = shareItems.find(s => s.key === k); return <div key={k} className="fam-scope-item">{it ? it.label : k}</div>; })}
          </div>
        )}
        <div className="note-text" style={{ marginTop: 18 }}>
          同意即表示您授權 {m.name} 查看上述健康存摺資料，並遵守眷屬授權注意事項。您可隨時於「同意他人查看」中調整項目或解除綁定。
        </div>
      </>
    );
    footer = (
      <>
        <button onClick={() => setStep(2)}>上一步</button>
        <button className="primary" onClick={() => onToast(`已同意 ${m.name} 查看您的資料（示意）`)}>確認同意</button>
      </>
    );
  }

  return (
    <Sheet title="同意他人查看請求" onClose={onClose} footer={footer}>
      {StepBar}
      {body}
    </Sheet>
  );
}

// 發起邀請 — 流程 A（送出邀請查看他人健康資料）
const FAM_RELATIONS = ["配偶", "父母", "子女", "祖父母", "孫子女", "外祖父母", "外孫子女", "曾祖父母", "外曾祖父母", "兄弟姊妹", "監護人", "其他"];

function FamInviteViewSheet({ onClose, onToast }) {
  const shareItems = (window.Data && window.Data.shareItems) || [];
  const [step, setStep] = useFamS(1);
  const [name, setName] = useFamS("");
  const [pid, setPid] = useFamS("");
  const [birth, setBirth] = useFamS("");
  const [relation, setRelation] = useFamS("配偶");
  const [expiry, setExpiry] = useFamS({ mode: "forever" });
  const [sel, setSel] = useFamS(() => new Set(shareItems.map(s => s.key)));
  const toggle = (k) => { const n = new Set(sel); n.has(k) ? n.delete(k) : n.add(k); setSel(n); };
  const allOn = sel.size === shareItems.length;

  const infoValid = name.trim() && pid.trim() && birth;
  const sendValid = infoValid && (expiry.mode === "forever" || expiry.date);

  const StepBar = (
    <>
      <div className="fam-steps">
        <span className={"fam-step-dot " + (step > 1 ? "done" : "active")}>{step > 1 ? "✓" : "1"}</span>
        <span className={"fam-step-line" + (step > 1 ? " done" : "")}/>
        <span className={"fam-step-dot " + (step === 2 ? "active" : step > 2 ? "done" : "")}>{step > 2 ? "✓" : "2"}</span>
        <span className={"fam-step-line" + (step > 2 ? " done" : "")}/>
        <span className={"fam-step-dot " + (step === 3 ? "active" : "")}>3</span>
      </div>
      <div className="fam-step-label">
        {step === 1 ? "步驟 1／3　功能說明" : step === 2 ? "步驟 2／3　填寫查看對象資料" : "步驟 3／3　設定期望查看範圍"}
      </div>
    </>
  );

  if (step === 1) {
    return (
      <Sheet title="查看他人健康資料" onClose={onClose} footer={
        <>
          <button onClick={onClose}>取消</button>
          <button className="primary" onClick={() => setStep(2)}>同意，下一步</button>
        </>
      }>
        {StepBar}
        <div className="fam-consent">
          <div className="fam-consent-h2" style={{ marginTop: 0 }}>什麼是「查看家人健康資料」？</div>
          <p className="fam-consent-p">您可以向家人提出邀請，在對方同意後，查看他的健康存摺資料（例如就醫、用藥、檢驗報告等），方便您關心家人的健康狀況。</p>
          <div className="fam-consent-h2">重要：需要對方同意才能查看</div>
          <p className="fam-consent-p">送出邀請後，必須由對方本人登入健康存摺、確認同意，您才能看到他的資料。對方也可以自行決定要開放哪些項目給您。</p>
          <div className="fam-consent-h2">接下來的步驟</div>
          <ol className="fam-consent-steps">
            <li>填寫您要查看的家人資料</li>
            <li>送出邀請給對方</li>
            <li>等待對方同意後即可查看</li>
          </ol>
          <p className="fam-consent-note">註：對方同意後，仍可隨時取消授權。</p>
        </div>
      </Sheet>
    );
  }

  if (step === 2) {
    return (
      <Sheet title="查看他人健康資料" onClose={onClose} footer={
        <>
          <button onClick={() => setStep(1)}>上一步</button>
          <button className="primary" disabled={!infoValid} style={!infoValid ? { opacity:0.5 } : null} onClick={() => setStep(3)}>下一步</button>
        </>
      }>
        {StepBar}

        <div className="fam-field">
          <div className="fam-field-label">對象姓名</div>
          <input className="fam-input" placeholder="同意對象姓名" value={name} onChange={e => setName(e.target.value)}/>
        </div>

        <div className="fam-field">
          <div className="fam-field-label">對象身分證號碼</div>
          <input className="fam-input" placeholder="同意對象身分證號碼" maxLength={10} value={pid}
            onChange={e => setPid(e.target.value.toUpperCase())}/>
        </div>

        <div className="fam-field">
          <div className="fam-field-label">對象出生年月日</div>
          <input type="date" className="fam-input" value={birth} onChange={e => setBirth(e.target.value)}/>
        </div>

        <div className="fam-field">
          <div className="fam-field-label">與本人關係</div>
          <div className="fam-select-wrap">
            <select className="fam-input fam-select" value={relation} onChange={e => setRelation(e.target.value)}>
              {FAM_RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <svg className="fam-select-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet title="查看他人健康資料" onClose={onClose} footer={
      <>
        <button onClick={() => setStep(2)}>上一步</button>
        <button className="primary" disabled={!sendValid} style={!sendValid ? { opacity:0.5 } : null}
          onClick={() => onToast(`已送出查看 ${name.trim()} 健康存摺的邀請，待對方同意（示意）`)}>
          確認送出
        </button>
      </>
    }>
      {StepBar}

      <div className="fam-field">
        <div className="fam-field-label">查閱／下載期限自本意願書簽署日起算</div>
        <_ExpirySeg value={expiry} onChange={setExpiry}/>
      </div>

      <div className="fam-share-allrow" style={{ marginTop: 18 }}>
        <span className="cnt">期望查看項目（供對方參考）　已選 {sel.size} / {shareItems.length} 項</span>
        <button className="fam-share-all-btn" onClick={() => setSel(allOn ? new Set() : new Set(shareItems.map(s => s.key)))}>
          {allOn ? "全部取消" : "全選"}
        </button>
      </div>
      <div className="fam-share-grid">
        {shareItems.map(it => (
          <div key={it.key} className="fam-share-row" onClick={() => toggle(it.key)}>
            <div className="fam-share-info">
              <div className="fam-share-label">{it.label}</div>
              {it.sub && <div className="fam-share-sub">{it.sub}</div>}
            </div>
            <span className={"fam-check" + (sel.has(it.key) ? " on" : "")}>
              {sel.has(it.key) && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-11"/></svg>}
            </span>
          </div>
        ))}
      </div>

      <div className="note-text" style={{ marginTop: 16 }}>
        此為您期望查看的項目，最終實際開放項目仍由對方（資料擁有者）於同意時決定。送出後將通知對方確認，經對方同意後您即可於「我可查看」中檢視。
      </div>
    </Sheet>
  );
}

// 發起邀請 — 流程 B（發出邀請同意他人查看你的健康資料）
function FamInviteSharerSheet({ onClose, onToast }) {
  const shareItems = (window.Data && window.Data.shareItems) || [];
  const [step, setStep] = useFamS(1);
  const [name, setName] = useFamS("");
  const [pid, setPid] = useFamS("");
  const [birth, setBirth] = useFamS("");
  const [relation, setRelation] = useFamS("配偶");
  const [expiry, setExpiry] = useFamS({ mode: "custom", date: "" });
  const [sel, setSel] = useFamS(() => new Set());
  const toggle = (k) => { const n = new Set(sel); n.has(k) ? n.delete(k) : n.add(k); setSel(n); };
  const allOn = sel.size === shareItems.length;

  const infoValid = name.trim() && pid.trim() && birth;
  const sendValid = infoValid && sel.size > 0 && (expiry.mode === "forever" || expiry.date);

  const StepBar = (
    <>
      <div className="fam-steps">
        <span className={"fam-step-dot " + (step > 1 ? "done" : "active")}>{step > 1 ? "✓" : "1"}</span>
        <span className={"fam-step-line" + (step > 1 ? " done" : "")}/>
        <span className={"fam-step-dot " + (step === 2 ? "active" : step > 2 ? "done" : "")}>{step > 2 ? "✓" : "2"}</span>
        <span className={"fam-step-line" + (step > 2 ? " done" : "")}/>
        <span className={"fam-step-dot " + (step === 3 ? "active" : "")}>3</span>
      </div>
      <div className="fam-step-label">
        {step === 1 ? "步驟 1／3　功能說明" : step === 2 ? "步驟 2／3　填寫被授權對象資料" : "步驟 3／3　設定開放範圍與期限"}
      </div>
    </>
  );

  if (step === 1) {
    return (
      <Sheet title="同意他人查看健康資料" onClose={onClose} footer={
        <>
          <button onClick={onClose}>取消</button>
          <button className="primary" onClick={() => setStep(2)}>同意，下一步</button>
        </>
      }>
        {StepBar}
        <div className="fam-consent">
          <div className="fam-consent-h1">同意書</div>
          <div className="fam-consent-h2">開放本人健康存摺予他人查閱／下載意願書</div>
          <ul className="fam-consent-list">
            <li>本人同意開放本人「健康存摺」之就醫及健康資料，提供下列指定對象代為查閱／下載。</li>
            <li>本健康存摺存有本人至少三年之就醫及健康資料，包含：門診資料（西醫、中醫、牙醫）、住院資料、過敏藥物資料、器捐、安寧和緩醫療或醫療自主意願、用藥資料、預防接種資料、檢驗（查）結果資料、醫療影像、影像或病理檢驗（查）報告資料、成人預防保健、四癌篩檢結果等資料（資料種類會依實務規劃逐步擴增）。</li>
            <li>實際開放之項目與期限由本人於下一步自行勾選設定。</li>
          </ul>
          <p className="fam-consent-note">
            註：本人同意開放健康存摺予他人查閱／下載後，得於事後取消同意。
          </p>
        </div>
      </Sheet>
    );
  }

  if (step === 2) {
    return (
      <Sheet title="同意他人查看健康資料" onClose={onClose} footer={
        <>
          <button onClick={() => setStep(1)}>上一步</button>
          <button className="primary" disabled={!infoValid} style={!infoValid ? { opacity:0.5 } : null} onClick={() => setStep(3)}>下一步</button>
        </>
      }>
        {StepBar}

        <div className="fam-field">
          <div className="fam-field-label">被授權對象姓名</div>
          <input className="fam-input" placeholder="被授權對象姓名" value={name} onChange={e => setName(e.target.value)}/>
        </div>

        <div className="fam-field">
          <div className="fam-field-label">被授權對象身分證號碼</div>
          <input className="fam-input" placeholder="被授權對象身分證號碼" maxLength={10} value={pid}
            onChange={e => setPid(e.target.value.toUpperCase())}/>
        </div>

        <div className="fam-field">
          <div className="fam-field-label">被授權對象出生年月日</div>
          <input type="date" className="fam-input" value={birth} onChange={e => setBirth(e.target.value)}/>
        </div>

        <div className="fam-field">
          <div className="fam-field-label">與本人關係</div>
          <div className="fam-select-wrap">
            <select className="fam-input fam-select" value={relation} onChange={e => setRelation(e.target.value)}>
              {FAM_RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <svg className="fam-select-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet title="同意他人查看健康資料" onClose={onClose} footer={
      <>
        <button onClick={() => setStep(2)}>上一步</button>
        <button className="primary" disabled={!sendValid} style={!sendValid ? { opacity:0.5 } : null}
          onClick={() => onToast(`已發出邀請，開放您的健康存摺給 ${name.trim()} 查看，待對方同意（示意）`)}>
          確認送出
        </button>
      </>
    }>
      {StepBar}

      <div className="fam-field">
        <div className="fam-field-label">開放查閱／下載期限自本意願書簽署日起算</div>
        <_ExpirySeg value={expiry} onChange={setExpiry}/>
      </div>

      <div className="fam-share-allrow" style={{ marginTop: 18 }}>
        <span className="cnt">開放的健康項目　已選 {sel.size} / {shareItems.length} 項</span>
        <button className="fam-share-all-btn" onClick={() => setSel(allOn ? new Set() : new Set(shareItems.map(s => s.key)))}>
          {allOn ? "全部取消" : "全選"}
        </button>
      </div>
      <div className="fam-share-grid">
        {shareItems.map(it => (
          <div key={it.key} className="fam-share-row" onClick={() => toggle(it.key)}>
            <div className="fam-share-info">
              <div className="fam-share-label">{it.label}</div>
              {it.sub && <div className="fam-share-sub">{it.sub}</div>}
            </div>
            <span className={"fam-check" + (sel.has(it.key) ? " on" : "")}>
              {sel.has(it.key) && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-11"/></svg>}
            </span>
          </div>
        ))}
      </div>

      <div className="note-text" style={{ marginTop: 16 }}>
        對方僅能查看您勾選開放的項目。送出後將通知對方確認，經對方同意後即可查看；您可隨時於「同意他人查看」中調整項目或解除。
      </div>
    </Sheet>
  );
}

// 授權注意事項
function FamNoticeSheet({ onClose }) {
  return (
    <Sheet title="眷屬授權注意事項" onClose={onClose} footer={<button className="primary" onClick={onClose}>我已閱讀</button>}>
      <div className="note-text">
        感謝您使用衛生福利部中央健康保險署（下稱本署）所提供之健康存摺眷屬授權功能。為保障使用者權益，請務必詳讀本注意事項：<br/><br/>
        一、眷屬授權分為「我可查看」與「同意他人查看」，所有授權皆須經雙方確認後始生效。<br/>
        二、您可自行設定開放查看的健康項目與授權期限（永久或自訂到期日）。<br/>
        三、您可隨時調整分享項目或解除綁定，調整後立即生效。<br/>
        四、被授權方僅能查看授權方所開放之項目，且不得將資料另作他用。<br/>
        五、若您於本注意事項修改後仍繼續使用本功能，即視為您已閱讀、瞭解並同意接受。
      </div>
    </Sheet>
  );
}

Object.assign(window, {
  FamEditViewableSheet, FamEditSharerSheet, FamAcceptSheet, FamAgreeSheet,
  FamInviteViewSheet, FamInviteSharerSheet, FamNoticeSheet,
});
