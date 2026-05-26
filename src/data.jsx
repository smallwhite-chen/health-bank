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
      diagnosis: "過敏性鼻炎",
      procedure: "一般門診診察",
    },
    org: {
      name: "台大醫院",
      doctor: "陳怡安",
    },
    subdx: [
      { idx: "次診斷1", label: "疾病分類：眼結膜炎" },
    ],
    meds: {
      drug: [
        { name: "安莫西林膠囊 500毫克", en: "Amoxicillin 500mg", days: 7, indication: "用於敏感菌引起之呼吸道感染，包括肺炎、支氣管炎、咽喉炎及扁桃腺炎等" },
        { name: "普拿疼錠 500毫克", en: "Acetaminophen 500mg", days: 5, indication: "用於緩解輕度至中度疼痛及退燒，適用於頭痛、牙痛、關節痛及感冒引起的發燒" },
        { name: "右旋美乙乙嗎南錠 15毫克", en: "Dextromethorphan 15mg", days: 5, indication: "用於抑制非生產性（乾性）咳嗽，適用於感冒、流感及過敏所引起的咳嗽症狀" },
      ],
      nondrug: [
        { code: "09040C", name: "尿液常規檢驗", qty: 1, reportId: "urine" },
        { code: "09044C", name: "尿蛋白定量",   qty: 1, reportId: "protein" },
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

  serviceCategories: ["個人紀錄", "就醫及用藥紀錄", "檢驗檢查結果", "疾病照護"],

  services: {
    "個人紀錄": [
      { icon: "syringe",  label: "預防接種資料" },
      { icon: "shield",   label: "COVID-19 疫苗接種/病毒檢測結果" },
      { icon: "shield",   label: "過敏資料" },
      { icon: "report",   label: "重大傷病證明" },
      { icon: "pulse",    label: "人工電子耳" },
      { icon: "pulse",    label: "生理量測" },
      { icon: "report",   label: "行為指標-飲食" },
      { icon: "pulse",    label: "行為指標-運動" },
      { icon: "calendar", label: "生理期紀錄" },
      { icon: "pill",     label: "自費藥品" },
      { icon: "box",      label: "自費醫材" },
    ],
    "就醫及用藥紀錄": [
      { icon: "stetho",   label: "西醫門診" },
      { icon: "stetho",   label: "中醫門診" },
      { icon: "stetho",   label: "牙醫門診" },
      { icon: "bed",      label: "住院紀錄" },
      { icon: "pill",     label: "目前用藥" },
      { icon: "calendar", label: "慢性處方箋" },
      { icon: "scissors", label: "手術紀錄" },
    ],
    "檢驗檢查結果": [
      { icon: "shield",   label: "成人健檢" },
      { icon: "tube",     label: "血液檢查" },
      { icon: "flask",    label: "尿液檢查" },
      { icon: "report",   label: "病理切片" },
      { icon: "report",   label: "影像報告" },
      { icon: "report",   label: "其他檢驗資料" },
    ],
    "疾病照護": [
      { icon: "shield",   label: "慢性病管理" },
      { icon: "shield",   label: "癌症照護" },
      { icon: "pulse",    label: "心血管追蹤" },
      { icon: "report",   label: "復健紀錄" },
    ],
  },
};

window.Data = Data;
