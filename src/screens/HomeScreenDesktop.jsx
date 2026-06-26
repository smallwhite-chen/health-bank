// Desktop-only home layout — cards arranged per the new
// reference image: full-width user card, tabs card, then a
// two-column row (recent visits | quick + family doctor).

function HomeScreenDesktop({ navigate, openSheet, currentMember }) {
  const { tips, visits, quickEntries, familyDoctor, carePlans, calendarEvents } = window.Data;
  const empty = useEmptyState();
  const recentVisits = visits.slice(0, 5);
  const name = currentMember || window.Data.user.name;
  const [tab, setTab] = React.useState("tips");

  return (
    <div className="dt-home">
      {/* ===== User card ===== */}
      <section className="dt-card dt-user-card">
        <div className="dt-user-left">
          <div className="dt-user-text">
            <div className="dt-user-hi">{name}</div>
            <button className="dt-user-chip" type="button">
              <span>個人紀錄</span>
              <Icon name="chev-right" size={12}/>
            </button>
          </div>
        </div>
        <button className="dt-switch-btn" onClick={() => openSheet("family")}>
          <Icon name="switch" size={14}/>
          <span>切換檢視眷屬健康資訊</span>
        </button>
      </section>

      {/* ===== Reminders / Calendar tabs ===== */}
      <section className="dt-card dt-tabs-card">
        <div className="dt-tabs">
          <button
            className={`dt-tab ${tab === "tips" ? "active" : ""}`}
            onClick={() => setTab("tips")}
          >貼心提醒</button>
          <button
            className={`dt-tab ${tab === "calendar" ? "active" : ""}`}
            onClick={() => setTab("calendar")}
          >行事曆</button>
        </div>
        <div className="dt-tabs-divider"/>

        {tab === "tips" ? (
          <>
            {empty ? (
              <EmptyState label="目前無貼心提醒" compact />
            ) : (
            <div className="dt-tips-grid">
              {tips.map(t => (
                <button
                  key={t.id}
                  className="dt-tip-row"
                  onClick={() => t.screen && navigate(t.screen, t.params)}
                >
                  <span className="dt-tip-ico"><Icon name={t.icon} size={18}/></span>
                  <span className="dt-tip-text">
                    <span className="dt-tip-title">{t.title}</span>
                    <span className="dt-tip-sub">{t.sub}</span>
                  </span>
                  <Icon name="chev-right" size={14}/>
                </button>
              ))}
            </div>
            )}
            <button
              className="dt-view-calendar"
              onClick={() => navigate("reminders")}
            >
              <Icon name="bell" size={16}/>
              <span>檢視完整提醒項目</span>
            </button>
          </>
        ) : (
          <>
            {empty ? (
              <EmptyState label="目前無行事曆活動" compact />
            ) : (
            <div className="dt-tips-grid">
              {calendarEvents.map(e => (
                <button
                  key={e.id}
                  className="dt-tip-row"
                  onClick={() => navigate("reminders")}
                >
                  <span className="dt-tip-ico"><Icon name={e.icon} size={18}/></span>
                  <span className="dt-tip-text">
                    <span className="dt-tip-title">{e.title}</span>
                    <span className="dt-tip-sub">{e.sub}</span>
                  </span>
                  <Icon name="chev-right" size={14}/>
                </button>
              ))}
            </div>
            )}
            <button
              className="dt-view-calendar"
              onClick={() => navigate("calendar")}
            >
              <Icon name={empty ? "plus" : "calendar"} size={16}/>
              <span>{empty ? "新增行程" : "檢視完整行事曆"}</span>
            </button>
          </>
        )}
      </section>

      {/* ===== Two-column row ===== */}
      <div className="dt-row">
        {/* Left: Recent visits */}
        <section className="dt-card dt-visits-card">
          <div className="dt-card-head">
            <h2>最近就醫紀錄</h2>
            <button className="dt-more" onClick={() => navigate("visits")}>
              <span>看更多</span>
              <Icon name="chev-right" size={12}/>
            </button>
          </div>
          <div className="dt-visit-list">
            {empty ? (
              <EmptyState label="目前無就醫紀錄" compact />
            ) : recentVisits.map((v) => (
              <button
                key={v.id}
                className="dt-visit-row"
                onClick={() => navigate("visitDetail", { id: v.id })}
              >
                <div className="dt-visit-body">
                  <div className="kv-row">
                    <span className="k">就醫日期</span>
                    <span className="v">
                      {v.date}
                      {v.category && <span className="tag" style={{ marginLeft: 6 }}>{v.category}</span>}
                    </span>
                  </div>
                  <div className="kv-row">
                    <span className="k">疾病分類</span>
                    <span className="v">{v.diagnosis}</span>
                  </div>
                  <div className="kv-row">
                    <span className="k">醫事機構</span>
                    <span className="v">{v.org}</span>
                  </div>
                </div>
                <Icon name="chev-right" size={16} className="dt-visit-chev"/>
              </button>
            ))}
          </div>
        </section>

        {/* Right column: quick + family doctor */}
        <div className="dt-col-right">
          <section className="dt-card dt-quick-card">
            <div className="dt-card-head">
              <h2>常用查詢</h2>
            </div>
            <div className="dt-quick-grid">
              {quickEntries.map(q => (
                <button
                  key={q.id}
                  className="dt-quick-tile"
                  onClick={() => navigate("services")}
                >
                  <span className="dt-quick-ico"><Icon name={q.icon} size={22}/></span>
                  <span className="dt-quick-label">{q.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="dt-card dt-care-card">
            <div className="dt-card-head">
              <h2>您目前參與健保署的照護計畫</h2>
            </div>
            <div className="dt-care-list">
              {empty ? (
                <>
                  <EmptyState label="目前無參與的照護計畫" compact />
                  <button className="dt-view-calendar" onClick={() => navigate("services")}>
                    <Icon name="external" size={16}/>
                    <span>瞭解更多</span>
                  </button>
                </>
              ) : carePlans.map(p => (
                <div key={p.id} className={`dt-care-row tone-${p.tone}`}>
                  <div className="dt-care-icon"><Icon name={p.icon} size={18}/></div>
                  <div className="dt-care-body">
                    <div className="dt-care-name">{p.name}</div>
                    <div className="dt-care-kv">
                      <span className="k">期間</span>
                      <span className="v">{p.start} ～ {p.end}</span>
                    </div>
                    <div className="dt-care-kv">
                      <span className="k">機構</span>
                      <span className="v">{p.org}</span>
                    </div>
                  </div>
                  <button className="dt-care-more" type="button" aria-label={`查看 ${p.name}`}>
                    <span>看更多</span>
                    <Icon name="chev-right" size={12}/>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

window.HomeScreenDesktop = HomeScreenDesktop;
