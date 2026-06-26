// 眷屬管理 — 待確認區 + 兩頁籤（我可查看 / 同意他人查看）
function FamilySettingsScreen({ navigate, openSheet, isFav, onToggleFav, onSwitchMember }) {
  const fam = (window.Data && window.Data.family) || { pending: [], viewable: [], sharers: [] };
  const shareItems = (window.Data && window.Data.shareItems) || [];
  const empty = window.useEmptyState ? window.useEmptyState() : false;

  const [tab, setTab] = React.useState("viewable"); // 預設「我可查看」
  const [introHidden, setIntroHidden] = React.useState(() => {
    try { return localStorage.getItem("hb_fam_intro_hidden") === "1"; } catch (e) { return false; }
  });
  const hideIntro = () => { try { localStorage.setItem("hb_fam_intro_hidden", "1"); } catch (e) {} setIntroHidden(true); };
  const toggleIntro = () => setIntroHidden(h => {
    const next = !h; try { localStorage.setItem("hb_fam_intro_hidden", next ? "1" : "0"); } catch (e) {}
    return next;
  });

  const pending = empty ? [] : fam.pending;
  const viewable = empty ? [] : fam.viewable;
  const sharers = empty ? [] : fam.sharers;

  const labelOf = (k) => { const it = shareItems.find(s => s.key === k); return it ? it.label : k; };

  return (
    <>
      <TopBar onA11y={() => openSheet("a11y")} onReminders={() => navigate("reminders")} onLogo={() => navigate("home")}/>
      <div className="app-scroll fam-scroll">

        {/* 單元說明匡 */}
        {!introHidden && (
          <div className="hm-link-banner">
            <div className="hm-link-banner-main">
              <p className="hm-link-banner-text">您可邀請家人查看對方的健康存摺資料，或開放自己的資料給家人。所有授權皆需雙方同意，並可隨時設定查看項目、調整期限或解除。</p>
              <div className="hm-link-banner-actions">
                <button className="hm-link-banner-dismiss" onClick={hideIntro}>不再顯示此訊息</button>
                <button className="hm-link-banner-btn" onClick={() => openSheet("famNotice")}>
                  <Icon name="info" size={14}/> 授權說明
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 標題 + 加入常用 */}
        <PageTitle favoriteKey="familySettings" isFav={isFav} onToggleFav={onToggleFav}>
          眷屬管理
          <button
            className="info"
            onClick={toggleIntro}
            aria-label="單元說明"
            style={{ background:"none", border:0, padding:4, cursor:"pointer", color: !introHidden ? "var(--brand-700)" : "var(--text-tertiary)" }}>
            <Icon name="info" size={18}/>
          </button>
        </PageTitle>

        {/* 待確認區（僅有待確認項目時出現，A/B 混合） */}
        {pending.length > 0 && (
          <div className="fam-pending">
            <div className="fam-pending-head">
              <Icon name="bell" size={15}/> 共有 {pending.length} 項待您確認
            </div>
            <div className="fam-pending-list">
              {pending.map(p => {
                const incoming = p.type === "incoming";
                return (
                  <button
                    key={p.id}
                    className="fam-pending-card"
                    onClick={() => openSheet(incoming ? "famAccept" : "famAgree", p)}>
                    <span className="fam-pending-main">
                      <span className="fam-card-name">{p.name} <span className="fam-card-rel">{p.relation}</span></span>
                      <span className="fam-pending-text" style={{ marginTop: 3 }}>
                        {incoming ? "想開放資料給您，待您確認" : "想查看您的資料，待您確認"}
                      </span>
                    </span>
                    <span className={"fam-pending-tag " + (incoming ? "is-incoming" : "is-request")}>
                      查看
                      <Icon name="chev-right" size={12}/>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 頁籤 */}
        <div className="fam-tabs" role="tablist">
          <button role="tab" className={"fam-tab" + (tab === "viewable" ? " active" : "")} onClick={() => setTab("viewable")}>我可查看</button>
          <button role="tab" className={"fam-tab" + (tab === "sharers" ? " active" : "")} onClick={() => setTab("sharers")}>同意他人查看</button>
        </div>

        {tab === "viewable" ? (
          <>
            {viewable.length === 0 ? (
              <div style={{ padding:"8px 16px" }}>
                <EmptyState label="目前沒有可查看的對象" hint="可透過下方按鈕發起查看他人邀請" compact/>
              </div>
            ) : (
              <div className="fam-list">
                {viewable.map(m => (
                  <div key={m.id} className="fam-card">
                    <div className="fam-card-main">
                      <div className="fam-card-name">{m.name} <span className="fam-card-rel">{m.relation}</span></div>
                      <div className="fam-card-meta">
                        <span><span className="lab">授權期限：</span>{m.expiry}</span>
                      </div>
                    </div>
                    <div className="fam-card-actions">
                      <button className="fam-card-switch" onClick={() => onSwitchMember && onSwitchMember(m.name)}>
                        <Icon name="switch" size={15}/> 切換
                      </button>
                      <button className="fam-card-edit" aria-label={`編輯 ${m.name}`} onClick={() => openSheet("famEditViewable", m)}>
                        <Icon name="edit" size={16}/> 編輯
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="fam-invite-btn" onClick={() => openSheet("famInviteView")}>
              <Icon name="plus" size={18}/> 送出邀請查看他人健康資料
            </button>

            <div className="fam-notes">
              <div className="fam-notes-title"><Icon name="info" size={15}/> 注意事項</div>
              <ul className="fam-notes-list">
                <li>未滿15歲「子女」依附法定代理人之一為全民健保眷屬加(在)保者，或滿15歲未滿18歲「子女」於健康存摺系統設定同意父母查閱／下載其健康存摺者（系統自動產製無需申請）。</li>
                <li>未受「子女」依附全民健保加(在)保之法定代理人，需至本署各分區業務組顧客服務中心申請。</li>
                <li>滿18歲民眾可登入健康存摺線上設定他人代為管理健康存摺。</li>
                <li>以上如屬受保護名單，則限制代管其健康存摺。</li>
                <li>如仍有疑義，請洽本署各分區業務組。</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {sharers.length === 0 ? (
              <div style={{ padding:"8px 16px" }}>
                <EmptyState label="目前沒有開放查看的對象" hint="可透過下方按鈕發起同意他人查看邀請" compact/>
              </div>
            ) : (
              <div className="fam-list">
                {sharers.map(m => (
                  <div key={m.id} className="fam-card">
                    <div className="fam-card-main">
                      <div className="fam-card-name">{m.name} <span className="fam-card-rel">{m.relation}</span></div>
                      <div className="fam-card-meta">
                        <span><span className="lab">授權期限：</span>{m.expiry}</span>
                      </div>
                    </div>
                    <button className="fam-card-edit" aria-label={`編輯 ${m.name}`} onClick={() => openSheet("famEditSharer", m)}>
                      <Icon name="edit" size={16}/> 編輯
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button className="fam-invite-btn" onClick={() => openSheet("famInviteSharer")}>
              <Icon name="plus" size={18}/> 發出邀請同意他人查看你的健康資料
            </button>

            <div className="fam-notes">
              <div className="fam-notes-title"><Icon name="info" size={15}/> 注意事項</div>
              <ul className="fam-notes-list">
                <li>本服務適用之對象年齡須滿15歲且未滿18歲之民眾。</li>
                <li>設定啟用後，滿15歲且未滿18歲子女依附父或母之一為全民健保眷屬加(在)保者，其父或母不需申請，即可查閱／下載該子女健康存摺。</li>
                <li>本服務「啟用狀態」資料預設為「不啟用」，點選後即為「啟用」，並可重複異動其意願表示。</li>
              </ul>
            </div>
          </>
        )}

        <div className="h-16"/>
      </div>
    </>
  );
}

window.FamilySettingsScreen = FamilySettingsScreen;
