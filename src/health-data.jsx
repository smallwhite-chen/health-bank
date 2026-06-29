// 個人量測紀錄 — 資料定義（生理量測完整；飲食／運動／生理期為骨架示意）
// 趨勢資料由詳細頁依時間區間以 metric.id 為種子確定性生成，這裡只放定義。
(function () {
  const physio = [
    {
      id: "bp", name: "血壓", short: "血壓", unit: "mmHg", kind: "bp", icon: "pulse",
      sys: 118, dia: 76, sysVar: 9, diaVar: 7, decimals: 0,
      refText: "收縮壓 < 120 / 舒張壓 < 80",
      normal: { sysHigh: 120, diaHigh: 80 },
      edu: {
        title: "如何正確量測血壓",
        steps: [
          "量測前 30 分鐘避免咖啡因、菸酒與運動。",
          "靜坐休息 5 分鐘，背靠椅背、雙腳平放不交叉。",
          "壓脈帶綁在上臂、與心臟同高，鬆緊以可伸入一指為宜。",
          "量測時保持安靜、不說話；建議早晚各量一次取平均。",
        ],
        note: "若多次收縮壓 ≥ 140 或舒張壓 ≥ 90 mmHg，建議諮詢醫師。",
      },
    },
    {
      id: "weight", name: "體重", short: "體重", unit: "kg", kind: "line", icon: "scale",
      base: 63.2, variance: 0.9, decimals: 1, refText: "維持 BMI 18.5–24",
      edu: { title: "體重量測小提醒", steps: ["固定於晨起、如廁後、空腹量測較準確。", "穿著輕便、每次使用同一台體重計。", "以每週趨勢觀察，不需每日數字波動而焦慮。"], note: "短期內體重快速變化，建議就醫評估。" },
    },
    {
      id: "bmi", name: "BMI", short: "BMI", unit: "", kind: "line", icon: "scale",
      base: 22.4, variance: 0.3, decimals: 1, refText: "健康範圍 18.5–24",
      edu: { title: "認識 BMI", steps: ["BMI = 體重(kg) ÷ 身高(m)²。", "18.5–24 為健康範圍，≥ 27 為肥胖。", "BMI 未考量肌肉量，請搭配腰圍一起評估。"], note: "運動員等肌肉量高者，BMI 僅供參考。" },
    },
    {
      id: "waist", name: "腰圍", short: "腰圍", unit: "cm", kind: "line", icon: "ruler",
      base: 81, variance: 1.6, decimals: 0, refText: "男性 < 90 / 女性 < 80",
      edu: { title: "如何量測腰圍", steps: ["站立、雙腳與肩同寬，自然呼氣。", "皮尺繞過肚臍上緣（肋骨下緣與骨盆上緣中線）。", "皮尺貼合不勒緊，與地面平行讀數。"], note: "腰圍過大與代謝症候群風險相關。" },
    },
    {
      id: "calf", name: "小腿圍", short: "小腿圍", unit: "cm", kind: "line", icon: "ruler",
      base: 35.4, variance: 0.6, decimals: 1, refText: "男 ≥ 34 / 女 ≥ 33 為佳",
      edu: { title: "如何量測小腿圍", steps: ["坐姿、膝蓋彎曲約 90 度，腳掌平貼地面。", "皮尺繞小腿最粗處水平量測。", "左右腿皆量，取較大值記錄。"], note: "小腿圍偏小可能與肌少症相關，建議搭配握力評估。" },
    },
    {
      id: "height", name: "身高", short: "身高", unit: "cm", kind: "line", icon: "ruler",
      base: 168, variance: 0.2, decimals: 0, refText: "成人通常變化不大",
      edu: { title: "身高量測小提醒", steps: ["脫鞋、背靠牆站直，雙眼平視前方。", "後腦、肩、臀、腳跟貼牆。", "以平板輕壓頭頂讀數。"], note: "中老年身高明顯變矮，留意骨質疏鬆。" },
    },
    {
      id: "glucose_fasting", name: "飯前（空腹）血糖", short: "空腹血糖", unit: "mg/dL", kind: "line", icon: "drop",
      base: 94, variance: 6, decimals: 0, refText: "70–99",
      edu: { title: "如何量測空腹血糖", steps: ["量測前至少空腹 8 小時（可喝白開水）。", "酒精棉消毒指腹、待乾後採血。", "建議固定於晨起時段量測。"], note: "空腹血糖 ≥ 126 mg/dL，建議就醫進一步檢查。" },
    },
    {
      id: "glucose_post", name: "飯後血糖", short: "飯後血糖", unit: "mg/dL", kind: "line", icon: "drop",
      base: 132, variance: 13, decimals: 0, refText: "飯後 2 小時 < 140",
      edu: { title: "如何量測飯後血糖", steps: ["自第一口進食起算 2 小時量測。", "量測前避免額外進食或含糖飲料。", "記錄飲食內容有助判讀數值變化。"], note: "飯後 2 小時 ≥ 200 mg/dL，建議就醫評估。" },
    },
    {
      id: "spo2", name: "血氧濃度", short: "血氧", unit: "%", kind: "line", icon: "lungs",
      base: 98, variance: 1, decimals: 0, refText: "95–100",
      edu: { title: "如何量測血氧", steps: ["手指放入血氧機前先搓熱、去除指甲油。", "量測時手部放鬆、保持靜止。", "待數值穩定數秒後再讀取。"], note: "血氧持續低於 94%，建議盡速就醫。" },
    },
    {
      id: "temp", name: "體溫", short: "體溫", unit: "°C", kind: "line", icon: "thermometer",
      base: 36.5, variance: 0.2, decimals: 1, refText: "36–37.5",
      edu: { title: "體溫量測小提醒", steps: ["剛運動、洗澡、進食後勿立即量測。", "依體溫計種類選擇耳溫、額溫或腋溫。", "固定使用同一量測方式以利比較。"], note: "耳溫 ≥ 38°C 即為發燒。" },
    },
    {
      id: "tg", name: "三酸甘油脂", short: "三酸甘油脂", unit: "mg/dL", kind: "line", icon: "drop",
      base: 118, variance: 16, decimals: 0, refText: "< 150",
      edu: { title: "三酸甘油脂", steps: ["抽血前需空腹 9–12 小時。", "前一天避免飲酒與高油飲食。", "規律運動與控制精緻醣類有助下降。"], note: "≥ 200 mg/dL 屬偏高，建議調整生活型態並追蹤。" },
    },
    {
      id: "hdl", name: "高密度脂蛋白膽固醇", short: "HDL", unit: "mg/dL", kind: "line", icon: "drop",
      base: 56, variance: 5, decimals: 0, refText: "男 > 40 / 女 > 50",
      edu: { title: "高密度脂蛋白（好膽固醇）", steps: ["規律有氧運動可提升 HDL。", "減少反式脂肪攝取。", "戒菸有助改善 HDL 數值。"], note: "HDL 偏低會增加心血管風險。" },
    },
    {
      id: "ldl", name: "低密度脂蛋白膽固醇", short: "LDL", unit: "mg/dL", kind: "line", icon: "drop",
      base: 112, variance: 11, decimals: 0, refText: "< 130（高風險者更低）",
      edu: { title: "低密度脂蛋白（壞膽固醇）", steps: ["減少飽和脂肪與內臟類攝取。", "增加膳食纖維（全穀、蔬果）。", "依醫囑追蹤，必要時藥物控制。"], note: "心血管高風險者目標值更嚴格，請依醫師建議。" },
    },
    {
      id: "sleep", name: "睡眠", short: "睡眠", unit: "小時", kind: "line", icon: "moon",
      base: 7.1, variance: 0.8, decimals: 1, refText: "成人 7–9 小時",
      edu: { title: "改善睡眠品質", steps: ["固定就寢與起床時間。", "睡前 1 小時減少藍光與咖啡因。", "臥室保持昏暗、安靜、涼爽。"], note: "長期睡眠不足與多種慢性病相關。" },
    },
  ];

  const categories = ["生理量測", "飲食記錄", "運動紀錄", "生理期紀錄"];

  // 飲食記錄（骨架示意）
  const diet = {
    nutrients: [
      { key: "cal", label: "熱量", value: 1480, unit: "kcal", goal: 1800 },
      { key: "protein", label: "蛋白質", value: 62, unit: "g", goal: 75 },
      { key: "fat", label: "脂肪", value: 48, unit: "g", goal: 60 },
      { key: "sugar", label: "糖", value: 36, unit: "g", goal: 50 },
      { key: "sodium", label: "鈉", value: 1850, unit: "mg", goal: 2400 },
    ],
    meals: [
      { id: "m1", name: "早餐", items: "全麥吐司、無糖豆漿、水煮蛋", time: "今天 08:10", cal: 420 },
      { id: "m2", name: "午餐", items: "糙米飯、清蒸雞胸、燙青菜", time: "今天 12:30", cal: 610 },
      { id: "m3", name: "點心", items: "原味優格、藍莓", time: "今天 15:20", cal: 180 },
    ],
  };

  // 運動紀錄（骨架示意）
  const exercise = {
    summary: [
      { key: "steps", label: "步數", value: 7820, unit: "步", icon: "footprints" },
      { key: "dist", label: "距離", value: 5.4, unit: "km", icon: "activity" },
      { key: "cal", label: "消耗熱量", value: 430, unit: "kcal", icon: "flame" },
    ],
    items: [
      { id: "e1", name: "快走", intensity: "中強度", time: "今天 07:10", dur: "30 分鐘", cal: 165 },
      { id: "e2", name: "重量訓練", intensity: "高強度", time: "昨天 19:40", dur: "45 分鐘", cal: 230 },
      { id: "e3", name: "瑜伽", intensity: "低強度", time: "前天 21:00", dur: "25 分鐘", cal: 85 },
    ],
  };

  // 生理期紀錄（骨架示意）— 標記在月曆上的區間
  const menstrual = {
    monthLabel: "115 年 6 月",
    cycleAvg: 28,
    periodAvg: 5,
    lastStart: "115/06/03",
    // 以日期數字標記：start 起 period 天為經期
    periods: [
      { start: 3, end: 7 },
    ],
    predictNextStart: "115/07/01",
  };

  window.Data.health = {
    categories,
    physio,
    pinnedDefault: ["bp", "weight", "glucose_fasting", "spo2"],
    diet,
    exercise,
    menstrual,
  };

  // 方便以 id 取得 metric
  window.Data.healthById = physio.reduce((m, x) => { m[x.id] = x; return m; }, {});

  // ---- 趨勢資料：以 metric.id + 區間為種子，確定性生成假資料 ----
  function makeRng(seedStr) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < seedStr.length; i++) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return function () {
      h += 0x6D2B79F5;
      let t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const RANGES = {
    "天":   { n: 8,  lab: (i) => `${String(6 + i * 2).padStart(2, "0")}:00` },
    "週":   { n: 7,  lab: (i) => ["一", "二", "三", "四", "五", "六", "日"][i] },
    "月":   { n: 10, lab: (i) => `${i * 3 + 1}日` },
    "6個月": { n: 6,  lab: (i) => `${i + 1}月` },
    "年":   { n: 12, lab: (i) => `${i + 1}月` },
    "近15天": { n: 8,  lab: (i) => dayLab(15, i, 8) },
    "近30天": { n: 10, lab: (i) => dayLab(30, i, 10) },
    "近45天": { n: 10, lab: (i) => dayLab(45, i, 10) },
    "自訂區間": { n: 10, lab: (i) => dayLab(30, i, 10) },
  };

  // 以 2026/6/15 為基準結束日，生成 MM/DD 標籤
  function dayLab(daysBack, i, n) {
    const end = new Date(2026, 5, 15);
    const frac = n === 1 ? 1 : i / (n - 1);
    const back = Math.round((1 - frac) * (daysBack - 1));
    const t = new Date(end);
    t.setDate(end.getDate() - back);
    return `${t.getMonth() + 1}/${t.getDate()}`;
  }

  function round(v, d) { const p = Math.pow(10, d); return Math.round(v * p) / p; }

  function genSeries(metricId, range) {
    const m = window.Data.healthById[metricId];
    const cfg = RANGES[range] || RANGES["週"];
    const rng = makeRng(metricId + "|" + range);
    const n = cfg.n;
    const pts = [];
    // 緩慢趨勢 + 雜訊
    const trend = (rng() - 0.5) * (m.kind === "bp" ? m.sysVar : m.variance) * 0.8;
    for (let i = 0; i < n; i++) {
      const frac = n === 1 ? 0 : i / (n - 1);
      const label = cfg.lab(i);
      if (m.kind === "bp") {
        const sys = round(m.sys + trend * frac + (rng() - 0.5) * 2 * m.sysVar, 0);
        const dia = round(m.dia + trend * 0.5 * frac + (rng() - 0.5) * 2 * m.diaVar, 0);
        pts.push({ label, sys, dia });
      } else {
        const value = round(m.base + trend * frac + (rng() - 0.5) * 2 * m.variance, m.decimals);
        pts.push({ label, value });
      }
    }
    return pts;
  }

  function averageOf(metricId, range) {
    const m = window.Data.healthById[metricId];
    const pts = genSeries(metricId, range);
    if (m.kind === "bp") {
      const sys = Math.round(pts.reduce((s, p) => s + p.sys, 0) / pts.length);
      const dia = Math.round(pts.reduce((s, p) => s + p.dia, 0) / pts.length);
      return { sys, dia, text: `${sys}/${dia}` };
    }
    const avg = pts.reduce((s, p) => s + p.value, 0) / pts.length;
    return { value: round(avg, m.decimals), text: String(round(avg, m.decimals)) };
  }

  function latestOf(metricId) {
    const m = window.Data.healthById[metricId];
    const pts = genSeries(metricId, "月");
    const last = pts[pts.length - 1];
    if (m.kind === "bp") return { text: `${last.sys}/${last.dia}`, unit: m.unit };
    return { text: String(last.value), unit: m.unit };
  }

  // 縮圖用短序列（取值陣列）
  function sparkValues(metricId) {
    const m = window.Data.healthById[metricId];
    const pts = genSeries(metricId, "月");
    if (m.kind === "bp") return pts.map((p) => p.sys);
    return pts.map((p) => p.value);
  }

  window.HealthUtil = { genSeries, averageOf, latestOf, sparkValues, RANGES };
})();
