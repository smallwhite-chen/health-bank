// Reminders screen — full-page (not tabbed in bottom nav)
function RemindersScreen({ navigate }) {
  const [tab, setTab] = React.useState("全部");
  const tabs = ["全部", "用藥提醒", "個人化"];
  const items = [
    { type:"用藥提醒", date:"115年4月15日", body:"您的慢性處方箋藥物「降血壓藥 Amlodipine 5mg」將於 115年4月20日 用完，請記得於到期前至藥局領藥或回診取得新處方。" },
    { type:"個人化", date:"115年4月12日", body:"根據您的健檢紀錄，您的空腹血糖值偏高（108 mg/dL），建議您近期安排回診追蹤，並留意飲食與運動習慣。" },
    { type:"用藥提醒", date:"115年4月10日", body:"提醒您今日應服用「Metformin 500mg」餐後一顆，請依照醫囑按時用藥，如有不適請聯繫您的家庭醫師。" },
    { type:"個人化", date:"115年4月8日",  body:"您距離上次洗牙已超過 5 個月，建議於 115年6月15日 前安排洗牙，維護口腔健康。" },
    { type:"用藥提醒", date:"115年4月5日",  body:"您的「降血脂藥 Rosuvastatin 10mg」處方已過期，請儘速回診由醫師評估是否續用。" },
    { type:"個人化", date:"115年3月28日", body:"您本月步數累積已達 85,000 步，距離健康目標 100,000 步還差 15,000 步，加油！" },
  ];
  const rows = tab === "全部" ? items : items.filter(i => i.type === tab);

  return (
    <>
      <DetailHeader title="提醒訊息" onBack={() => navigate(-1)}/>
      <div className="reminder-tabs">
        {tabs.map(t => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="app-scroll">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 16px 8px" }}>
          <div style={{ fontSize:18, fontWeight:700 }}>近期通知</div>
          <button className="read-all"><Icon name="shield" size={12}/> 全部已讀(6)</button>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="reminder-card">
            <div className="row1">
              <span className={r.type === "用藥提醒" ? "tag-blue" : "tag-amber"}>{r.type}</span>
              <span className="date">{r.date}</span>
            </div>
            <div className="body">
              <div className="txt">{r.body}</div>
              <Icon name="chev-right" size={14} className="chev"/>
            </div>
          </div>
        ))}
        <div className="h-16"/>
      </div>
    </>
  );
}

window.RemindersScreen = RemindersScreen;
