function HomeScreen({ navigate, openSheet, currentMember }) {
  const { tips, recentVisits, quickEntries, familyDoctor, carePlans, calendarEvents } = window.Data;
  const empty = useEmptyState();
  const name = currentMember || window.Data.user.name;
  const [reminderTab, setReminderTab] = React.useState("tips");
  return (
    <>
      <TopBar onA11y={() => openSheet("a11y")} onReminders={() => navigate("reminders")} onLogo={() => navigate("home")}/>
      <div className="app-scroll">
        {/* User card */}
        <div className="user-card">
          <div className="info">
            {(currentMember && currentMember !== "陳小白") && (
              <div className="hi-label">目前檢視眷屬</div>
            )}
            <div className="hi">{name}</div>
            {(!currentMember || currentMember === "陳小白") && (
              <span className="chip" onClick={() => navigate("health")} style={{ cursor: "pointer" }}>個人量測紀錄 <Icon name="chev-right" size={12}/></span>
            )}
          </div>
          <button className="switch" onClick={() => openSheet("family")}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
              <Icon name="switch" size={14}/>
              <span>切換檢視眷屬<br/>健康資訊</span>
            </span>
          </button>
        </div>

        {/* 貼心提醒 / 行事曆 segmented tabs */}
        <div className="tip-tabs">
          <button
            className={reminderTab === "tips" ? "active" : ""}
            onClick={() => setReminderTab("tips")}
          >貼心提醒</button>
          <button
            className={reminderTab === "calendar" ? "active" : ""}
            onClick={() => setReminderTab("calendar")}
          >行事曆</button>
        </div>

        {reminderTab === "tips" ? (
          <div data-coach="tips" style={{ padding: "0 16px" }}>
            {empty ? (
              <EmptyState label="目前無貼心提醒" compact />
            ) : tips.map(t => (
              <div key={t.id} className="tip-card" onClick={() => t.screen && navigate(t.screen, t.params)} style={{ cursor: t.screen ? "pointer" : "default" }}>
                <div className="ico-box"><Icon name={t.icon} size={20}/></div>
                <div className="text">
                  <div className="title">{t.title}</div>
                  <div className="sub">{t.sub}</div>
                </div>
                <Icon name="chev-right" size={16} className="chev"/>
              </div>
            ))}
            <button className="view-calendar-btn" onClick={() => navigate("reminders")}>
              <Icon name="bell" size={16}/>
              <span>檢視完整提醒項目</span>
            </button>
          </div>
        ) : (
          <div style={{ padding: "0 16px" }}>
            {empty ? (
              <>
                <EmptyState label="目前無行事曆活動" compact />
                <button className="view-calendar-btn" onClick={() => navigate("calendar")}>
                  <Icon name="plus" size={16}/>
                  <span>新增行程</span>
                </button>
              </>
            ) : (
              <>
                {calendarEvents.map(e => (
                  <div key={e.id} className="tip-card" onClick={() => navigate("reminders")} style={{ cursor: "pointer" }}>
                    <div className="ico-box"><Icon name={e.icon} size={20}/></div>
                    <div className="text">
                      <div className="title">{e.title}</div>
                      <div className="sub">{e.sub}</div>
                    </div>
                    <Icon name="chev-right" size={16} className="chev"/>
                  </div>
                ))}
                <button className="view-calendar-btn" onClick={() => navigate("calendar")}>
                  <Icon name="calendar" size={16}/>
                  <span>檢視完整行事曆</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* 常用查詢 */}
        <div className="section-title"><h2>常用查詢</h2></div>
        <div data-coach="quick" className="quick-grid">
          {quickEntries.map(q => (
            <div key={q.id} className="quick-item">
              <span className="ico"><Icon name={q.icon} size={22}/></span>
              <span>{q.label}</span>
            </div>
          ))}
        </div>

        {/* 最近就醫紀錄 */}
        <div className="section-title">
          <h2>最近就醫紀錄</h2>
          <button className="more" onClick={() => navigate("visits")}>看更多 <Icon name="chev-right" size={12}/></button>
        </div>
        <div style={{ padding: "0 16px" }}>
          {empty ? (
            <EmptyState label="目前無就醫紀錄" compact />
          ) : recentVisits.map(v => (
            <VisitRow key={v.id} v={v} onClick={() => navigate("visitDetail", { id: v.id })}/>
          ))}
        </div>

        {/* 您參與的照護計畫 */}
        <div className="section-title">
          <h2>您目前參與健保署的照護計畫</h2>
        </div>
        <div className="care-plan-list">
          {empty ? (
            <>
              <EmptyState label="目前無參與的照護計畫" compact />
              <button className="view-calendar-btn" onClick={() => navigate("services")}>
                <Icon name="external" size={16}/>
                <span>瞭解更多</span>
              </button>
            </>
          ) : carePlans.map(p => (
            <div key={p.id} className={`care-plan-card tone-${p.tone}`}>
              <div className="cp-head">
                <div className="cp-icon"><Icon name={p.icon} size={18}/></div>
                <div className="cp-name">{p.name}</div>
              </div>
              <div className="cp-meta">
                <div className="cp-row">
                  <span className="cp-label">期間</span>
                  <span className="cp-value">{p.start} ～ {p.end}</span>
                </div>
                <div className="cp-row">
                  <span className="cp-label">機構</span>
                  <span className="cp-value">{p.org}</span>
                </div>
              </div>
              <button className="cp-more" type="button">
                <span>看更多</span>
                <Icon name="chev-right" size={12}/>
              </button>
            </div>
          ))}
        </div>

        <div className="h-16"/>
      </div>
    </>
  );
}

window.HomeScreen = HomeScreen;
