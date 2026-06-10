// 其他檢驗資料 — 詳細資料內頁
function OtherReportDetailScreen({ navigate, params }) {
  const map = window.Data.otherReportDetail || {};
  const report = (window.Data.reports || []).find((r) => r.id === (params && params.id));
  const fallbackDate = report ? report.date.replace(/(\d+)年(\d+)月(\d+)日/, "$1/$2/$3") : "—";
  const d = map[params && params.id] || {
    date: fallbackDate,
    examName: report ? (report.examName || report.item) : "—",
    item: report ? report.item : "—",
    result: report ? (report.result || "—") : "—",
    refVal: report ? (report.refVal || "—") : "—",
    judge: report ? (report.judge || "—") : "—",
    org: report ? report.org : "—",
    code: "—",
    visitDate: fallbackDate,
    source: "A - 特約醫事機構不定期上傳",
  };

  const judgeCls = d.judge === "正常" ? "ok" : d.judge && d.judge !== "—" ? "abn" : "";

  return (
    <>
      <DetailHeader title="其他檢驗報告" onBack={() => navigate(-1)} />
      <div className="app-scroll" data-screen-label="其他檢驗報告">

        {/* 報告結果 */}
        <div className="detail-section">
          <div className="sec-head"><Icon name="report" size={16} className="ico" /> 報告結果</div>
          <div className="img-field">
            <div className="k">檢查日期</div>
            <div className="v strong">{d.date}</div>
          </div>
          <div className="img-field">
            <div className="k">檢驗名稱</div>
            <div className="v strong">{d.examName}</div>
          </div>
          <div className="img-field">
            <div className="k">檢驗項目</div>
            <div className="v strong">{d.item}</div>
          </div>
          <div className="img-field">
            <div className="k">檢查結果</div>
            <div className="v strong">{d.result}</div>
          </div>
          <div className="img-field">
            <div className="k">參考值</div>
            <div className="v strong">{d.refVal}</div>
          </div>
          <div className="img-field">
            <div className="k">判讀</div>
            <div className={`v strong report-judge ${judgeCls}`}>{d.judge}</div>
          </div>
        </div>

        {/* 報告摘要 */}
        <div className="detail-section">
          <div className="sec-head"><Icon name="info" size={16} className="ico" /> 報告摘要</div>
          <div className="img-field">
            <div className="k">醫事機構</div>
            <div className="v"><span className="img-link-text">{d.org}</span></div>
          </div>
          <div className="img-field">
            <div className="k">醫令代碼</div>
            <div className="v strong">{d.code}</div>
          </div>
          <div className="img-field">
            <div className="k">就醫日期/入院日期</div>
            <div className="v strong">{d.visitDate}</div>
          </div>
          <div className="img-field">
            <div className="k">資料來源</div>
            <div className="v strong">{d.source}</div>
          </div>
        </div>

        <div className="h-16" />
      </div>
    </>
  );
}

window.OtherReportDetailScreen = OtherReportDetailScreen;
