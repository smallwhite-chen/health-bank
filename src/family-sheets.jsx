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

// 分享他人查看 — 編輯（對方資料、期限、分享項目、編輯項目、刪除）
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
          <div className="fam-confirm-sub">刪除並停止分享後將立即無法再讓對方查看你的健康存摺資料，如需再次分享須重新發起邀請並經對方同意。</div>
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
          提醒：對方僅能查看你勾選分享的項目。調整後立即生效；刪除分享後對方將無法再查看你的任何資料。
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
        <b style={{ color:"var(--text-primary)" }}>{m.name}</b> 想開放其健康存摺資料給你查看，接受後你即可在「檢視家人健康資訊」中切換檢視。
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
        接受即表示你同意查看對方分享之健康資料，並遵守眷屬授權注意事項。你可隨時於「我可查看」中解除。
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
          <b style={{ color:"var(--text-primary)" }}>{m.name}</b> 想查看你的健康存摺資料。
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
          以下為 <b style={{ color:"var(--text-primary)" }}>{m.name}</b> 希望查看的時間與項目，你可調整後再決定是否同意。
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

        <div className="chip-group-label" style={{ marginTop: 20 }}>你可調整實際開放的項目與期限</div>
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
        <div className="chip-group-label" style={{ marginTop: 16 }}>你將開放給對方</div>
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
          同意即表示你授權 {m.name} 查看上述健康存摺資料，並遵守眷屬授權注意事項。你可隨時於「分享他人查看」中調整項目或解除綁定。
        </div>
      </>
    );
    footer = (
      <>
        <button onClick={() => setStep(2)}>上一步</button>
        <button className="primary" onClick={() => onToast(`已同意 ${m.name} 查看你的資料（示意）`)}>確認同意</button>
      </>
    );
  }

  return (
    <Sheet title="分享他人查看請求" onClose={onClose} footer={footer}>
      {StepBar}
      {body}
    </Sheet>
  );
}

// 發起邀請 — 流程 A（送出邀請查看他人健康資料）
const FAM_RELATIONS = ["配偶", "父母", "子女", "祖父母", "孫子女", "外祖父母", "外孫子女", "曾祖父母", "外曾祖父母", "兄弟姊妹", "監護人", "其他"];

// 眷屬授權 — 同意事項全文（供邀請流程內嵌捲動框使用）
function _FamTermsText() {
  return (
    <div className="fam-terms">
      <p className="fam-terms-p">感謝您使用衛生福利部中央健康保險署(下稱本署)所提供之健康存摺。</p>
      <p className="fam-terms-p">為了保障使用者的權益，請務必詳讀本注意事項。日後本署如有修改或變更本注意事項之內容，修改後之內容將公布於健康存摺畫面上(含全民健保行動快易通｜健康存摺App及網頁版)。若您於本注意事項修改後仍繼續使用健康存摺之眷屬授權功能，即視為您已閱讀、瞭解並同意接受本注意事項。如果您對本注意事項的內容有任何疑慮或異議時，請停止使用授權服務。</p>

      <div className="fam-terms-h">一、名詞定義</div>
      <p className="fam-terms-p">(一)使用者：全民健康保險之保險對象已登入健康存摺者。</p>
      <p className="fam-terms-p">(二)授權：係指健康存摺之眷屬管理機制，授權指定使用者查閱及下載授權人健康存摺之資料。</p>
      <p className="fam-terms-p">(三)同一健保戶：被保險人及其依附投保之眷屬(如配偶、父母或子女)。</p>

      <div className="fam-terms-h">二、眷屬授權</div>
      <p className="fam-terms-p">成年人得將其健康存摺於特定期間授權予他人管理，任一方得於授權期間內隨時取消；但未成年子女之健康存摺限授權予同一健保戶之被保險人管理，並依下列規定辦理：</p>
      <p className="fam-terms-p">(一)子女為未滿十五歲，由系統自動授權同一健保戶之被保險人，並自子女滿十五歲之日起終止其授權。</p>
      <p className="fam-terms-p">(二)子女為滿十五歲未滿十八歲，應經其同意，授權同一健保戶之被保險人至子女成年，並得隨時取消。</p>
      <p className="fam-terms-p">(三)經向本署申請資料保護者之健康存摺僅限本人使用，不開放授權予他人管理；已授權者，自申請之次日終止其授權。</p>

      <div className="fam-terms-h">三、使用者責任</div>
      <p className="fam-terms-p">使用者將健康存摺授權他人查閱及下載，使用者及被授權者應負擔相關法律責任。</p>
    </div>
  );
}

function FamInviteViewSheet({ onClose, onToast }) {
  const shareItems = (window.Data && window.Data.shareItems) || [];
  const [step, setStep] = useFamS(1);
  const [name, setName] = useFamS("");
  const [pid, setPid] = useFamS("");
  const [birth, setBirth] = useFamS("");
  const [relation, setRelation] = useFamS("配偶");
  const [expiry, setExpiry] = useFamS({ mode: "forever" });
  const [agreed, setAgreed] = useFamS(false);
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
        {step === 1 ? "步驟 1／3　功能說明" : step === 2 ? "步驟 2／3　填寫查看對方資料" : "步驟 3／3　設定期望查看範圍"}
      </div>
    </>
  );

  if (step === 1) {
    return (
      <Sheet title="查看他人健康資料" onClose={onClose} footer={
        <>
          <button onClick={onClose}>取消</button>
          <button className="primary" disabled={!agreed} style={!agreed ? { opacity:0.5 } : null} onClick={() => setStep(2)}>同意，下一步</button>
        </>
      }>
        {StepBar}
        <div className="fam-consent">
          <div className="fam-consent-h2" style={{ marginTop: 0 }}>什麼是「查看他人健康資料」？</div>
          <p className="fam-consent-p">你可以向他人提出邀請，在對方同意授權後，查看對方的健康存摺資料（例如就醫、用藥、檢驗報告等），方便你關心眷屬的健康狀況。</p>
          <div className="fam-consent-h2">重要：需要對方同意授權才能查看</div>
          <p className="fam-consent-p">送出邀請後，必須由對方本人登入健康存摺、確認同意授權，你才能看到對方資料。<br/>對方也可以自行決定授權期限與開放項目給你。</p>
          <div className="fam-consent-h2">接下來的步驟</div>
          <ol className="fam-consent-steps">
            <li>填寫你要查看的對方資料</li>
            <li>送出邀請給對方</li>
            <li>等待對方同意後即可查看</li>
          </ol>
        </div>

        <div className="fam-consent-h2" style={{ marginTop: 20 }}>同意事項</div>
        <div className="fam-terms-box">
          <_FamTermsText/>
        </div>
        <button type="button" className={"fam-terms-agree" + (agreed ? " on" : "")} onClick={() => setAgreed(a => !a)}>
          <span className={"fam-check" + (agreed ? " on" : "")}>
            {agreed && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-11"/></svg>}
          </span>
          <span className="fam-terms-agree-txt">我已詳讀並同意上述注意事項</span>
        </button>
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
          <div className="fam-field-label">姓名</div>
          <input className="fam-input" placeholder="請輸入姓名" value={name} onChange={e => setName(e.target.value)}/>
        </div>

        <div className="fam-field">
          <div className="fam-field-label">身分證號碼</div>
          <input className="fam-input" placeholder="請輸入身分證號碼" maxLength={10} value={pid}
            onChange={e => setPid(e.target.value.toUpperCase())}/>
        </div>

        <div className="fam-field">
          <div className="fam-field-label">對方出生年月日</div>
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
        此為你期望查看的項目，最終實際開放項目仍由對方（資料擁有者）於同意時決定。<br/>送出後將通知對方確認，經對方同意後你即可於「我可查看」中檢視。
      </div>
    </Sheet>
  );
}

// 發起邀請 — 流程 B（發出邀請分享他人查看你的健康資料）
function FamInviteSharerSheet({ onClose, onToast }) {
  const shareItems = (window.Data && window.Data.shareItems) || [];
  const [step, setStep] = useFamS(1);
  const [name, setName] = useFamS("");
  const [pid, setPid] = useFamS("");
  const [birth, setBirth] = useFamS("");
  const [relation, setRelation] = useFamS("配偶");
  const [expiry, setExpiry] = useFamS({ mode: "custom", date: "" });
  const [agreed, setAgreed] = useFamS(false);
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
      <Sheet title="分享他人查看健康資料" onClose={onClose} footer={
        <>
          <button onClick={onClose}>取消</button>
          <button className="primary" disabled={!agreed} style={!agreed ? { opacity:0.5 } : null} onClick={() => setStep(2)}>同意，下一步</button>
        </>
      }>
        {StepBar}
        <div className="fam-consent">
          <div className="fam-consent-h2" style={{ marginTop: 0 }}>什麼是「分享他人查看」？</div>
          <p className="fam-consent-p">你可以把自己的健康存摺資料開放給信任的家人，讓對方在你同意的範圍內查看你的就醫、用藥、檢驗報告等資訊，方便家人一起照顧你的健康。</p>
          <div className="fam-consent-h2">重要：開放範圍由你決定</div>
          <p className="fam-consent-p">要分享哪些項目、開放多久，都由你在下一步自行勾選設定。<br/>對方只看得到你開放的項目，而且你隨時都可以取消。</p>
          <div className="fam-consent-h2">接下來的步驟</div>
          <ol className="fam-consent-steps">
            <li>填寫你要開放查看的對象資料</li>
            <li>勾選要分享的項目與開放期限</li>
            <li>送出邀請，待對方接受後即生效</li>
          </ol>
        </div>

        <div className="fam-consent-h2" style={{ marginTop: 20 }}>同意事項</div>
        <div className="fam-terms-box">
          <_FamTermsText/>
        </div>
        <button type="button" className={"fam-terms-agree" + (agreed ? " on" : "")} onClick={() => setAgreed(a => !a)}>
          <span className={"fam-check" + (agreed ? " on" : "")}>
            {agreed && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-11"/></svg>}
          </span>
          <span className="fam-terms-agree-txt">我已詳讀並同意上述注意事項</span>
        </button>
      </Sheet>
    );
  }

  if (step === 2) {
    return (
      <Sheet title="分享他人查看健康資料" onClose={onClose} footer={
        <>
          <button onClick={() => setStep(1)}>上一步</button>
          <button className="primary" disabled={!infoValid} style={!infoValid ? { opacity:0.5 } : null} onClick={() => setStep(3)}>下一步</button>
        </>
      }>
        {StepBar}

        <div className="fam-field">
          <div className="fam-field-label">被授權對象姓名</div>
          <input className="fam-input" placeholder="請輸入對方姓名" value={name} onChange={e => setName(e.target.value)}/>
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
    <Sheet title="分享他人查看健康資料" onClose={onClose} footer={
      <>
        <button onClick={() => setStep(2)}>上一步</button>
        <button className="primary" disabled={!sendValid} style={!sendValid ? { opacity:0.5 } : null}
          onClick={() => onToast(`已發出邀請，開放你的健康存摺給 ${name.trim()} 查看，待對方同意（示意）`)}>
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
        對方僅能查看你勾選開放的項目。送出後將通知對方確認，經對方同意後即可查看；你可隨時於「分享他人查看」中調整項目或解除。
      </div>
    </Sheet>
  );
}

// 操作說明（主要功用 / 雙向授權 / 注意事項）
function FamNoticeSheet({ onClose }) {
  const notes = [
    "你可以自己選要開放哪些健康項目，也能設定授權期限（永久或指定到期日）。",
    "想調整分享項目或取消授權，隨時都可以，改完立即生效。",
    "對方只看得到你開放的項目，資料不會被拿去做其他用途。",
    "未滿 18 歲或無法自行設定者，另有依附健保眷屬、臨櫃申請等規定，詳情請洽健保署。",
  ];
  return (
    <Sheet title="眷屬管理操作說明" onClose={onClose} footer={<button className="primary" onClick={onClose}>我知道了</button>}>
      <div className="fg-lead">
        眷屬管理讓你和家人可以互相查看健康存摺資料，一起照顧彼此的健康。以下三個重點，幫你快速上手。
      </div>

      {/* ① 主要功用 */}
      <section className="fg-sec">
        <div className="fg-sec-head">
          <span className="fg-sec-ico"><Icon name="heart" size={18}/></span>
          <div className="fg-sec-title">主要功用</div>
        </div>
        <p className="fg-sec-body">
          不用再各自登入、來回詢問，眷屬管理讓你在同一個地方，就能看到家人的就醫紀錄、用藥、檢驗報告等資訊。方便你照顧孩子、關心長輩，也能把自己的健康狀況分享給信任的家人。
        </p>
        <figure className="fg-fig">
          <div className="fg-fig-people">
            <span className="fg-avatar"><Icon name="user" size={20}/></span>
            <span className="fg-avatar"><Icon name="user" size={20}/></span>
            <span className="fg-avatar"><Icon name="user" size={20}/></span>
          </div>
          <span className="fg-fig-link"><Icon name="chev-right" size={16}/></span>
          <span className="fg-card"><Icon name="report" size={20}/></span>
        </figure>
        <figcaption className="fg-fig-cap">在一個地方，關心全家人的健康</figcaption>
      </section>

      {/* ② 雙向授權 */}
      <section className="fg-sec">
        <div className="fg-sec-head">
          <span className="fg-sec-ico"><Icon name="switch" size={18}/></span>
          <div className="fg-sec-title">雙向授權，雙方同意才生效</div>
        </div>
        <p className="fg-sec-body">
          授權有兩個方向，而且都要「被查看的那一方」本人同意後才會生效——不會有人在你不知道的情況下看到你的資料。
        </p>
        <figure className="fg-flow">
          <div className="fg-node">
            <span className="fg-avatar fg-avatar--lg"><Icon name="user" size={22}/></span>
            <span className="fg-node-label">你</span>
          </div>
          <span className="fg-flow-ico"><Icon name="switch" size={22}/></span>
          <div className="fg-node">
            <span className="fg-avatar fg-avatar--lg"><Icon name="user" size={22}/></span>
            <span className="fg-node-label">家人</span>
          </div>
        </figure>
        <figcaption className="fg-fig-cap">需雙方確認，並可隨時解除</figcaption>

        <div className="fg-dir">
          <span className="fg-sec-ico fg-sec-ico--sm"><Icon name="user" size={15}/></span>
          <div>
            <div className="fg-dir-t">我可查看</div>
            <div className="fg-dir-d">向家人送出邀請，等對方同意後，就能查看對方開放的資料。</div>
          </div>
        </div>
        <div className="fg-dir">
          <span className="fg-sec-ico fg-sec-ico--sm"><Icon name="switch" size={15}/></span>
          <div>
            <div className="fg-dir-t">分享他人查看</div>
            <div className="fg-dir-d">把自己的資料開放給家人，由你決定要分享哪些項目。</div>
          </div>
        </div>
      </section>

      {/* ③ 注意事項 */}
      <section className="fg-sec">
        <div className="fg-sec-head">
          <span className="fg-sec-ico"><Icon name="shield" size={18}/></span>
          <div className="fg-sec-title">使用前，先看這幾點</div>
        </div>
        <ul className="fg-notes">
          {notes.map((n, i) => (
            <li key={i} className="fg-note-item"><span className="fg-dot"/>{n}</li>
          ))}
        </ul>
      </section>
    </Sheet>
  );
}

Object.assign(window, {
  FamEditViewableSheet, FamEditSharerSheet, FamAcceptSheet, FamAgreeSheet,
  FamInviteViewSheet, FamInviteSharerSheet, FamNoticeSheet,
});
