// 影像或病理檢查報告 — 詳細資料內頁
function ImageReportDetailScreen({ navigate, params }) {
  const map = window.Data.imageReportDetail || {};
  const report = (window.Data.reports || []).find((r) => r.id === (params && params.id));
  // 以 id 取詳細資料，找不到時用清單卡片基本資料補上預設
  const d = map[params && params.id] || {
    date: report ? report.date.replace(/(\d+)年(\d+)月(\d+)日/, "$1/$2/$3") : "—",
    org: report ? report.org : "—",
    orderName: report ? report.item : "—",
    code: "—",
    visitDate: "",
    uploadTime: "",
    radiation: "-",
    source: "E-特約醫事機構影像上傳",
    reportText: "",
    jpg: true,
    dcmSize: "3.34 MB",
  };

  const dash = (v) => (v && String(v).trim() !== "" ? v : "—");
  const [mediaTab, setMediaTab] = React.useState("jpg");
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const browseRef = React.useRef(null);
  const imgId = (params && params.id) || "img";
  const IMAGE_COUNT = 5;
  const openViewer = (e) => { browseRef.current = e.currentTarget; setViewerOpen(true); };
  const closeViewer = () => { setViewerOpen(false); if (browseRef.current) { browseRef.current.focus(); browseRef.current = null; } };
  // 影像載入狀態：idle（未載入）→ loading（準備中）→ ready（可瀏覽）
  const [jpgState, setJpgState] = React.useState("idle");
  const loadImages = () => {
    setJpgState("loading");
    setTimeout(() => setJpgState("ready"), 1400);
  };
  // DCM 產製狀態：idle（未產製）→ producing（產製中）→ ready（可下載）
  const [dcmState, setDcmState] = React.useState("idle");
  const [declOpen, setDeclOpen] = React.useState(false);
  const declTriggerRef = React.useRef(null);
  const openDecl = (e) => { declTriggerRef.current = e.currentTarget; setDeclOpen(true); };
  const closeDecl = () => {
    setDeclOpen(false);
    if (declTriggerRef.current) { declTriggerRef.current.focus(); declTriggerRef.current = null; }
  };
  const confirmDecl = () => {
    setDeclOpen(false);
    declTriggerRef.current = null;
    setDcmState("producing");
    setTimeout(() => setDcmState("ready"), 1600);
  };

  return (
    <>
      <DetailHeader title="影像或病理檢查報告詳細資料" onBack={() => navigate(-1)} />
      <div className="app-scroll" data-screen-label="影像或病理檢查報告詳細資料">

        {/* 基本資料卡 */}
        <div className="detail-section img-info">
          <div className="img-date"><Icon name="calendar" size={15} className="ico" /> {d.date}</div>
          <div className="img-field">
            <div className="k">醫事機構</div>
            <div className="v"><span className="img-link-text">{d.org}</span></div>
          </div>
          <div className="img-field">
            <div className="k">檢驗檢查醫囑名稱</div>
            <div className="v strong">{d.orderName}</div>
          </div>
          <div className="img-field">
            <div className="k">醫囑代碼</div>
            <div className="v strong">{d.code}</div>
          </div>
          <div className="img-field">
            <div className="k">就醫日期/入院日期</div>
            <div className="v">{dash(d.visitDate)}</div>
          </div>
          <div className="img-field">
            <div className="k">醫事機構上傳報告時間</div>
            <div className="v">{dash(d.uploadTime)}</div>
          </div>
          <div className="img-field">
            <div className="k">醫療輻射參考劑量</div>
            <div className="v strong">{dash(d.radiation)}</div>
          </div>
          <div className="img-field">
            <div className="k">資料來源</div>
            <div className="v strong">{d.source}</div>
          </div>
        </div>

        {/* 影像或病理報告內容 */}
        <div className="detail-section">
          <div className="sec-head"><Icon name="report" size={16} className="ico" /> 影像或病理報告內容</div>
          <div className={d.reportText && d.reportText.trim() ? "img-report-text" : "img-empty"}>{d.reportText && d.reportText.trim() ? d.reportText : "無資料"}</div>
        </div>

        {/* 影像報告內容（JPG） */}
        {/* 影像報告內容 / 醫療級影像壓縮檔下載（頁籤切換） */}
        <div className="detail-section img-media-card">
          <div className="img-media-tabs" role="tablist" aria-label="影像內容切換">
            <button
              type="button" role="tab"
              id="img-tab-jpg"
              aria-selected={mediaTab === "jpg"}
              aria-controls="img-panel-jpg"
              tabIndex={mediaTab === "jpg" ? 0 : -1}
              className={mediaTab === "jpg" ? "active" : ""}
              onClick={() => setMediaTab("jpg")}
            >影像報告內容</button>
            <button
              type="button" role="tab"
              id="img-tab-dcm"
              aria-selected={mediaTab === "dcm"}
              aria-controls="img-panel-dcm"
              tabIndex={mediaTab === "dcm" ? 0 : -1}
              className={mediaTab === "dcm" ? "active" : ""}
              onClick={() => setMediaTab("dcm")}
            >醫療級影像壓縮檔下載</button>
          </div>

          {mediaTab === "jpg" ? (
            <div role="tabpanel" id="img-panel-jpg" aria-labelledby="img-tab-jpg">
              <div className="img-media-subhead">格式：JPG</div>
              {jpgState === "ready" ? (
                <div className="img-jpg-wrap">
                  <div className="img-thumb" role="img" aria-label="影像報告縮圖預覽">
                    <Icon name="image" size={30} />
                    <span className="img-thumb-label">JPG</span>
                  </div>
                  <button type="button" className="img-browse-link" onClick={openViewer}>
                    瀏覽影像內容 <Icon name="chev-right" size={15} />
                  </button>
                </div>
              ) : jpgState === "loading" ? (
                <div className="img-load-state">
                  <span className="img-spinner" aria-hidden="true"></span>
                  <p className="img-load-text">影像準備中，請稍候…</p>
                </div>
              ) : (
                <div className="img-load-state">
                  <p className="img-load-desc">請點選下方「載入影像」，系統將開始準備影像，完成後即可瀏覽。</p>
                  <button type="button" className="img-load-btn" onClick={loadImages}>
                    <Icon name="image" size={16} /> 載入影像
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div role="tabpanel" id="img-panel-dcm" aria-labelledby="img-tab-dcm">
              <div className="img-media-subhead">格式：DCM</div>
              {dcmState === "ready" ? (
                <div className="img-jpg-wrap">
                  <div className="img-thumb" role="img" aria-label="醫療級影像壓縮檔">
                    <Icon name="save" size={28} />
                    <span className="img-thumb-label">DCM</span>
                  </div>
                  <button type="button" className="img-browse-link">
                    前往下載檔案 <Icon name="chev-right" size={15} />
                  </button>
                </div>
              ) : dcmState === "producing" ? (
                <div className="img-load-state">
                  <span className="img-spinner" aria-hidden="true"></span>
                  <p className="img-load-text">檔案產製中，請稍候…</p>
                </div>
              ) : (
                <div className="img-load-state">
                  <p className="img-load-desc">醫療級影像檔案原始大小 <b>{d.dcmSize}</b></p>
                  <p className="img-load-desc">產製程序約 10 分鐘，請前往<span className="img-load-link">下載服務</span>畫面進行下載。</p>
                  <p className="img-warn"><Icon name="info" size={15} className="img-warn-ico" /> 請確保個人之儲存設備，有足夠儲存空間以保存下載檔案。</p>
                  <button type="button" className="img-load-btn" onClick={openDecl}>
                    <Icon name="save" size={16} /> 產製檔案
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 備註 */}
        <div className="glu-note" style={{ margin: "16px 16px 6px" }}>
          <div className="glu-note-title">註：</div>
          <ol className="glu-note-list">
            <li>若為當日首次進入此功能，相關影像檔可能尚在準備中，建議於數分鐘後再行查看。</li>
            <li>點選「醫療級影像壓縮檔下載」欄位之「產製檔案」，系統將進入檔案準備程序，可至「<span className="glu-note-link">下載服務</span>」畫面下方的「產製列表」進行檔案下載。</li>
          </ol>
        </div>

        <div className="h-16" />
      </div>

      {viewerOpen && ReactDOM.createPortal(
        <ImageViewerSheet baseId={imgId} count={IMAGE_COUNT} onClose={closeViewer} />,
        document.querySelector(".app-shell") || document.querySelector(".desktop-shell") || document.body
      )}

      {declOpen && ReactDOM.createPortal(
        <Sheet
          title="聲明書"
          onClose={closeDecl}
          footer={
            <>
              <button onClick={closeDecl}>取消</button>
              <button className="primary" onClick={confirmDecl}>是，我了解</button>
            </>
          }
        >
          <h3 className="decl-title">民眾下載健康存摺資料之聲明書</h3>
          <p className="decl-body">健康存摺有您的詳細就醫療資料，下載後請妥善保管，資料如有需要轉交第三人或企業、公司使用，應請自行評估風險及責任。</p>
          <p className="decl-reminder"><b>提醒您：</b>資料提供給第三人時，請留意是否只提供部分資料、並約定使用期間及日後可要求刪除資料的權利。</p>
        </Sheet>,
        document.querySelector(".app-shell") || document.querySelector(".desktop-shell") || document.body
      )}
    </>
  );
}

// 影像內容檢視 Bottom Sheet（多圖切換）
function ImageViewerSheet({ baseId, count, onClose }) {
  const [idx, setIdx] = React.useState(0);
  const sheetRef = React.useRef(null);
  const titleId = "img-viewer-title";

  React.useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const c = el.querySelector(".img-viewer-close");
    if (c) c.focus({ preventScroll: true });
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
    if (e.key === "ArrowRight") { setIdx((i) => Math.min(count - 1, i + 1)); return; }
    if (e.key === "ArrowLeft") { setIdx((i) => Math.max(0, i - 1)); return; }
    if (e.key !== "Tab") return;
    const els = [...sheetRef.current.querySelectorAll('button:not([disabled])')].filter((x) => x.offsetParent !== null);
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus({ preventScroll: true }); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus({ preventScroll: true }); }
  };

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(count - 1, i + 1));

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet img-viewer-sheet"
        role="dialog" aria-modal="true" aria-labelledby={titleId}
        ref={sheetRef} tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="grabber" />
        <div className="sheet-head">
          <div className="sheet-title" id={titleId}>影像內容</div>
          <button className="close img-viewer-close" aria-label="關閉" onClick={onClose}>
            <Icon name="plus" size={18} style={{ transform: "rotate(45deg)" }} />
          </button>
        </div>

        <div className="img-viewer-body">
          <div className="img-viewer-frame">
            <image-slot
              id={`${baseId}-img-${idx}`}
              key={idx}
              shape="rounded"
              radius="10"
              fit="contain"
              placeholder={`拖曳放入影像 ${idx + 1}`}
            ></image-slot>
          </div>

          <div className="img-viewer-controls">
            <button
              type="button"
              className="img-viewer-nav left"
              aria-label="上一張"
              onClick={prev}
              disabled={idx === 0}
            ><Icon name="chev-left" size={24} /></button>

            <span className="img-viewer-counter" aria-live="polite">{idx + 1}/{count}</span>

            <button
              type="button"
              className="img-viewer-nav right"
              aria-label="下一張"
              onClick={next}
              disabled={idx === count - 1}
            ><Icon name="chev-right" size={24} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ImageReportDetailScreen = ImageReportDetailScreen;
