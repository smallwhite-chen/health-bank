// Coach marks (onboarding tooltips with spotlight)
const COACH_STEPS = [
  {
    selector: '[data-coach="tips"]',
    icon: "bell",
    title: "貼心提醒",
    body: "根據您的就醫紀錄與健康數據，系統會主動提醒您待辦的健康事項，例如檢驗報告已出爐、建議回診或洗牙時間等。",
    placement: "below",
  },
  {
    selector: '[data-coach="quick"]',
    icon: "grid",
    title: "常用查詢",
    body: "快速進入您最常使用的功能，包含慢連箋用藥、手術紀錄、住院紀錄及其他檢驗資料，一鍵即可查詢。",
    placement: "below",
  },
  {
    selector: '[data-coach="tabbar"]',
    icon: "compass",
    title: "底部導覽列",
    body: "隨時切換「首頁」、「就醫紀錄」、「檢驗報告」、「常用功能」與「全部服務」，掌握您的完整健康資訊。",
    placement: "above",
  },
];

function CoachMarks({ onClose }) {
  const [step, setStep] = React.useState(0);
  const [rect, setRect] = React.useState(null);
  const [phoneRect, setPhoneRect] = React.useState(null);

  const measure = React.useCallback(() => {
    const phone = document.querySelector(".phone");
    if (!phone) return;
    const target = phone.querySelector(COACH_STEPS[step].selector);
    if (!target) { setRect(null); return; }
    const pr = phone.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    setPhoneRect({ w: pr.width, h: pr.height });
    setRect({
      top: tr.top - pr.top,
      left: tr.left - pr.left,
      width: tr.width,
      height: tr.height,
    });
  }, [step]);

  React.useEffect(() => {
    // Scroll target into view first, then measure
    const phone = document.querySelector(".phone");
    if (!phone) return;
    const target = phone.querySelector(COACH_STEPS[step].selector);
    const scroller = target?.closest(".app-scroll");
    if (scroller && target) {
      const scrollTop = Math.max(0, target.offsetTop - 120);
      scroller.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
    const t1 = setTimeout(measure, 320);
    return () => clearTimeout(t1);
  }, [step, measure]);

  if (!rect || !phoneRect) {
    // Render dim overlay only while measuring
    return <div className="coach-overlay"><div className="coach-dim-only"/></div>;
  }

  const PAD = 6;
  const sx = rect.left - PAD;
  const sy = rect.top - PAD;
  const sw = rect.width + PAD * 2;
  const sh = rect.height + PAD * 2;
  const radius = 14;

  const cur = COACH_STEPS[step];
  const placeBelow = cur.placement === "below";

  // Tooltip dims (approx) for arrow positioning
  const tipW = 280;
  // center tip horizontally on target, clamp inside phone
  const targetCenterX = sx + sw / 2;
  const tipLeft = Math.min(Math.max(targetCenterX - tipW / 2, 16), phoneRect.w - tipW - 16);
  const arrowLeft = Math.min(Math.max(targetCenterX - tipLeft - 8, 20), tipW - 28);

  const tipTop    = placeBelow ? sy + sh + 14 : "auto";
  const tipBottom = placeBelow ? "auto" : phoneRect.h - sy + 14;

  const isLast = step === COACH_STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <div className="coach-overlay">
      <svg className="coach-mask" width={phoneRect.w} height={phoneRect.h}>
        <defs>
          <mask id="coach-cutout">
            <rect width="100%" height="100%" fill="white"/>
            <rect x={sx} y={sy} width={sw} height={sh} rx={radius} ry={radius} fill="black"/>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(15, 23, 42, 0.62)" mask="url(#coach-cutout)"/>
      </svg>

      <div className="coach-tooltip" style={{
        top: tipTop,
        bottom: tipBottom,
        left: tipLeft,
        width: tipW,
      }}>
        <div className={`coach-arrow ${placeBelow ? "up" : "down"}`} style={{ left: arrowLeft }}/>
        <div className="coach-head">
          <span className="coach-ico"><Icon name={cur.icon} size={16}/></span>
          <span className="coach-title">{cur.title}</span>
          <button className="coach-x" onClick={onClose} aria-label="關閉">
            <Icon name="plus" size={14} style={{ transform: "rotate(45deg)" }}/>
          </button>
        </div>
        <div className="coach-body">{cur.body}</div>
        <div className="coach-foot">
          <div className="coach-dots">
            {COACH_STEPS.map((_, i) => (
              <span key={i} className={`coach-dot ${i === step ? "on" : ""}`}/>
            ))}
          </div>
          <div className="coach-actions">
            {!isFirst && (
              <button className="coach-btn ghost" onClick={() => setStep(step - 1)}>
                <Icon name="chev-right" size={12} style={{ transform: "rotate(180deg)" }}/> 上一步
              </button>
            )}
            <button className="coach-btn primary" onClick={() => isLast ? onClose() : setStep(step + 1)}>
              {isLast ? "完成" : <>下一步 <Icon name="chev-right" size={12}/></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.CoachMarks = CoachMarks;
