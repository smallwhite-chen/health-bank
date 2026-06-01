// Shared mock data for 健康存摺 prototype
const Data = {
  user: {
    name: "陳小白",
    initial: "陳",
  },

  tips: [
    {
      id: "t1",
      icon: "report",
      title: "血糖檢查報告",
      sub: "115年4月15日 於 亞東醫院 的檢驗報告已可檢視",
      screen: "reportDetail",
      params: { id: "r_glu" },
    },
    {
      id: "t2",
      icon: "calendar",
      title: "洗牙",
      sub: "建議於 115年6月15日 後安排洗牙",
      screen: null,
    },
  ],

  calendarEvents: [
    {
      id: "ev1",
      icon: "calendar",
      title: "回診：家庭醫學科",
      sub: "115年5月28日 09:30 臺大醫院",
    },
    {
      id: "ev2",
      icon: "calendar",
      title: "大腸癌篩檢",
      sub: "115年6月3日 08:00 新光醫院",
    },
  ],

  recentVisits: [
    { id: "v1", date: "115年3月7日",  category: "西醫", diagnosis: "急性上呼吸道感染", org: "佑恩小兒科" },
    { id: "v2", date: "115年2月18日", category: "西醫", diagnosis: "過敏性鼻炎",     org: "仁愛耳鼻喉科" },
    { id: "v3", date: "115年1月25日", category: "西醫", diagnosis: "急性腸胃炎",     org: "台大醫院" },
  ],

  visits: [
    { id: "v1", date: "115年3月7日",  category: "西醫", diagnosis: "急性上呼吸道感染", org: "佑恩小兒科" },
    { id: "v2", date: "115年2月18日", category: "西醫", diagnosis: "過敏性鼻炎",     org: "仁愛耳鼻喉科" },
    { id: "v3", date: "115年2月10日", category: "中醫", diagnosis: "肩頸痠痛",         org: "仁心中醫診所" },
    { id: "v4", date: "115年1月28日", category: "西醫", diagnosis: "急性腸胃炎",       org: "馬偕醫院" },
    { id: "v5", date: "115年1月15日", category: "牙醫", diagnosis: "牙周病",           org: "康美牙醫診所" },
    { id: "v6", date: "115年1月8日",  category: "西醫", diagnosis: "高血壓回診",       org: "亞東醫院" },
    { id: "v7", date: "114年12月22日",category: "西醫", diagnosis: "角膜炎",           org: "明亮眼科" },
  ],

  // Detail keyed by visit id — sample, same payload for all
  visitDetail: {
    summary: {
      date: "115年2月18日",
      type: "西醫",
      diagnosis: "H4010X0/隅角開放性青光眼，未明示期別",
      procedure: "-",
    },
    org: {
      name: "燦明大學眼",
      doctor: "陳怡安",
    },
    subdx: [
      { idx: "次診斷1", label: "H04129/未明示側性之淚腺乾眼症" },
      { idx: "次診斷2", label: "H35413/雙側視網膜格子狀退化" },
      { idx: "次診斷3", label: "H53143/雙側視覺不適" },
    ],
    meds: {
      drug: [
        { name: "適眼眼藥水2%", en: "CATOL EYE DROPS 2%", days: 28, img: "catol", indication: "青光眼、高眼壓。" },
        { name: "舒而坦　眼藥水", en: "XALATAN 50µg/ml (0.005%)", days: 28, img: "xalatan", indication: "六歲以上兒童與成人之青光眼、高眼壓。" },
      ],
      nondrug: [
        { code: "05211C", name: "門診藥事服務費一慢性病處方給藥二十八天以上（山地離島地區每人每日一百件內）", qty: 1, reportId: "urine" },
      ],
      lab: [
        { code: "23305C", name: "氣壓式眼壓測定", qty: 1, reportId: "vision", noReport: true },
        { code: "23506C", name: "微細超音波檢查", qty: 1, reportId: "iop" },
      ],
    },
  },

  quickEntries: [
    { id: "q1", icon: "flask",   label: "其他檢驗資料" },
    { id: "q2", icon: "image",   label: "影像或病理檢查報告" },
    { id: "q3", icon: "shield",  label: "癌症篩檢結果" },
    { id: "q4", icon: "tube",    label: "血糖檢驗報告" },
    { id: "q5", icon: "pulse",   label: "血脂檢驗報告" },
    { id: "q6", icon: "heart",   label: "成人預防保健" },
  ],

  familyDoctor: {
    year: "115年 指定家庭醫師",
    org: "樂澄診所",
    name: "陳怡穎醫師",
    phone: "0911-769-701",
    note: "24小時",
  },

  carePlans: [
    {
      id: "cp1",
      name: "大家醫計畫",
      start: "115年1月1日",
      end: "115年12月31日",
      org: "樂澄診所",
      icon: "stetho",
      tone: "teal",
    },
    {
      id: "cp2",
      name: "糖尿病照護網",
      start: "114年9月20日",
      end: "115年9月19日",
      org: "中山醫院 新陳代謝科",
      icon: "pulse",
      tone: "amber",
    },
  ],

  reportCategories: ["全部", "癌症篩檢結果", "血糖檢驗報告", "血脂檢驗報告", "影像或病理檢查報告", "其他檢驗資料"],

  // 子分類：選定主分類時，下方再顯示一列子分類 pill
  reportSubCategories: {
    "癌症篩檢結果": ["全部", "大腸癌篩檢", "口腔癌篩檢", "肺癌篩檢"],
  },

  reports: [
    { id: "r1",    date: "115年3月5日",  type: "其他檢驗資料",       item: "成人預防保健",       org: "台大醫院", summary: "BMI 23.5, 血壓 125/82, 各項指標正常" },
    { id: "r2",    date: "115年1月20日", type: "其他檢驗資料",       item: "勞工一般體檢",       org: "亞東醫院", summary: "聽力、視力正常，胸部X光無異常" },
    { id: "r_img", date: "114年12月20日",type: "影像或病理檢查報告", item: "胸部 X 光攝影",       org: "馬偕醫院", summary: "雙肺野清晰，心影大小正常" },
    { id: "r3",    date: "114年12月10日",type: "其他檢驗資料",       item: "40 歲以上成人健檢",   org: "馬偕醫院", summary: "血液常規正常，肝腎功能正常" },
    { id: "r_oral",date: "114年11月18日",type: "癌症篩檢結果", subcat:"口腔癌篩檢", item: "口腔黏膜檢查",     org: "亞東醫院", summary: "未見可疑病灶，建議每兩年再追蹤" },
    { id: "r_lung",date: "114年9月10日", type: "癌症篩檢結果", subcat:"肺癌篩檢",   item: "低劑量電腦斷層 (LDCT)", org: "台大醫院", summary: "未發現結節，建議定期追蹤" },
    { id: "r_glu", date: "114年5月23日", type: "血糖檢驗報告",       item: "糖化血色素 HbA1c",   org: "亞東醫院", summary: "HbA1c 5.5 %，參考區間內" },
    { id: "r4",    date: "114年4月2日",  type: "癌症篩檢結果", subcat:"大腸癌篩檢", item: "大腸癌篩檢（糞便潛血）", org: "台大醫院", summary: "糞便潛血陰性" },
    { id: "r_pa",  date: "114年3月12日", type: "影像或病理檢查報告", item: "腹部超音波",         org: "亞東醫院", summary: "肝、膽、胰、脾、腎未見異常" },
    { id: "r5",    date: "114年2月8日",  type: "血脂檢驗報告",       item: "血脂檢查",           org: "馬偕醫院", summary: "總膽固醇 185 mg/dL，三酸甘油脂 120 mg/dL" },
  ],

  reportDetail: {
    title: "血糖檢驗報告",
    name: "血糖檢驗報告",
    range: "4-6%",
    info: {
      date: "114/05/23",
      org: "亞東醫院",
      itemName: "糖化血色素 HbA1c",
      code: "09006C",
      visitDate: "114/05/23",
      source: "B - 特約醫事機構定期上傳",
    },
    history: [
      { date: "114/05/23", value: 5.5, src: "B" },
      { date: "113/11/08", value: 5.6, src: "B" },
      { date: "113/05/15", value: 5.9, src: "B" },
      { date: "112/09/02", value: 5.7, src: "B" },
    ],
  },

  favorites: [
    { id: "f1", icon: "pill",     label: "目前用藥" },
    { id: "f2", icon: "stetho",   label: "西醫門診" },
    { id: "f3", icon: "tube",     label: "血液檢查" },
    { id: "f4", icon: "syringe",  label: "預防接種資料" },
    { id: "f5", icon: "calendar", label: "慢性處方箋" },
    { id: "f6", icon: "shield",   label: "成人健檢" },
    { id: "f7", icon: "pulse",    label: "生理量測" },
    { id: "f8", icon: "shield",   label: "過敏資料" },
    null, null, null, null, // empty slots
  ],

  serviceCategories: [
    "個人紀錄",
    "就醫及用藥紀錄",
    "檢驗檢查結果",
    "疾病照護與防治",
    "健康資訊分享｜眷屬管理",
    "其他加值服務",
    "下載專區",
    "衛教資訊",
    "關於健康存摺服務",
  ],

  services: {
    "個人紀錄": [
      { icon: "shield",   label: "我參與的照護計劃" },
      { icon: "shield",   label: "過敏資料" },
      { icon: "syringe",  label: "預防接種資料" },
      { icon: "heart",    label: "器捐或安寧緩和醫療意願" },
      { icon: "pulse",    label: "生理量測" },
      { icon: "report",   label: "行為指標－飲食" },
      { icon: "pulse",    label: "行為指標－運動" },
      { icon: "calendar", label: "生理期紀錄" },
      { icon: "report",   label: "重大傷病證明" },
      { icon: "pulse",    label: "人工電子耳" },
      { icon: "report",   label: "資料提供紀錄" },
    ],
    "就醫及用藥紀錄": [
      { icon: "stetho",   label: "就醫總覽" },
      { icon: "stetho",   label: "最近就醫紀錄（西醫／中醫／牙醫）" },
      { icon: "pill",     label: "用藥紀錄" },
      { icon: "calendar", label: "慢連箋用藥資料" },
      { icon: "scissors", label: "手術紀錄" },
      { icon: "bed",      label: "住院紀錄" },
      { icon: "pill",     label: "自費藥品" },
      { icon: "box",      label: "自費醫材" },
    ],
    "檢驗檢查結果": [
      { icon: "shield",   label: "成人預防保健結果" },
      { icon: "report",   label: "自費健檢資料登錄" },
      { icon: "flask",    label: "癌症篩檢結果" },
      { icon: "star",     label: "健康金存摺" },
      { icon: "tube",     label: "血糖檢驗報告" },
      { icon: "flask",    label: "血脂檢驗報告" },
      { icon: "image",    label: "影像或病理檢查報告" },
      { icon: "report",   label: "其他檢驗資料" },
      { icon: "shield",   label: "COVID-19疫苗接種/病毒檢測結果" },
      { icon: "tube",     label: "骨質疏鬆檢驗報告" },
    ],
    "疾病照護與防治": [
      { icon: "pulse",    label: "代謝症候群專區" },
      { icon: "user",     label: "大家醫會員健康管理" },
      { icon: "home",     label: "居家醫療照護服務" },
      { icon: "pulse",    label: "慢性阻塞性肺病" },
      { icon: "shield",   label: "肝炎照護" },
      { icon: "pulse",    label: "動脈粥狀硬化心血管疾病(ASCVD)" },
      { icon: "flask",    label: "肝癌風險評估" },
      { icon: "pulse",    label: "末期腎病評估" },
      { icon: "pulse",    label: "心血管疾病風險評估" },
      { icon: "pulse",    label: "糖尿病追蹤" },
      { icon: "pulse",    label: "初期慢性腎病追蹤" },
      { icon: "shield",   label: "BC肝炎追蹤" },
    ],
    "健康資訊分享｜眷屬管理": [
      { icon: "user",     label: "眷屬管理－我可查看" },
      { icon: "switch",   label: "眷屬管理－同意他人查看" },
    ],
    "其他加值服務": [
      { icon: "syringe",  label: "兒童預防接種試算" },
      { icon: "sliders",  label: "生活型態評估量表" },
      { icon: "shield",   label: "健保協同商保" },
    ],
    "下載專區": [
      { icon: "save",     label: "HTML下載" },
      { icon: "save",     label: "PDF下載" },
      { icon: "save",     label: "XML下載" },
      { icon: "save",     label: "JSON下載" },
    ],
    "衛教資訊": [
      { icon: "info",     label: "健康時事" },
      { icon: "external", label: "衛教連結" },
    ],
    "關於健康存摺服務": [
      { icon: "image",    label: "觀看影音短片" },
      { icon: "info",     label: "健康存摺簡介" },
      { icon: "star",     label: "使用小技巧" },
      { icon: "phone",    label: "聯絡窗口" },
    ],
  },
};

window.Data = Data;

// Preserve a snapshot of the default favorites for the "reset" action
Data.defaultFavorites = Data.favorites.slice();

// Hydrate persisted favorites (saved by EditFavoritesScreen) if any
try {
  const saved = localStorage.getItem("hb_favorites");
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      Data.favorites = parsed;
    }
  }
} catch (e) {}
