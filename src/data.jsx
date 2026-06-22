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
    "癌症篩檢結果": ["大腸癌篩檢", "口腔癌篩檢", "肺癌篩檢", "乳癌篩檢", "子宮頸癌篩檢"],
  },

  // 子分類說明：選定特定子分類時，於報告列表上方顯示
  reportSubCatNotes: {
    "大腸癌篩檢": {
      item: "定量免疫法糞潛血檢查，系統顯示最近三次報告",
      advice: [
        "建議每 3 年 1 次定期接受大腸癌篩檢。",
        "任何檢查都會有偽陰性個案發生，即使檢查結果正常，有任何異狀，均應儘速就醫。",
      ],
    },
    "口腔癌篩檢": {
      item: "口腔黏膜目視及觸診檢查，系統顯示最近三次報告",
      advice: [
        "建議 30 歲以上有嚼檳榔（含已戒）或吸菸習慣者，每 2 年 1 次口腔黏膜檢查。",
        "任何檢查都會有偽陰性個案發生，即使檢查結果正常，口腔有任何異狀，均應儘速就醫。",
      ],
    },
    "肺癌篩檢": {
      item: "低劑量電腦斷層（LDCT）檢查，系統顯示最近三次報告",
      advice: [
        "建議具肺癌家族史或重度吸菸史之高風險族群，每 2 年 1 次低劑量電腦斷層檢查。",
        "任何檢查都會有偽陰性個案發生，即使檢查結果正常，有任何異狀，均應儘速就醫。",
      ],
    },
    "乳癌篩檢": {
      item: "乳房 X 光攝影檢查，系統顯示最近三次報告",
      advice: [
        "建議 45-69 歲女性（或 40-44 歲具乳癌家族史者），每 2 年 1 次乳房 X 光攝影檢查。",
        "任何檢查都會有偽陰性個案發生，即使檢查結果正常，有任何異狀，均應儘速就醫。",
      ],
    },
    "子宮頸癌篩檢": {
      item: "子宮頸抹片檢查，系統顯示最近三次報告",
      advice: [
        "建議 30 歲以上女性，每 3 年至少 1 次子宮頸抹片檢查。",
        "任何檢查都會有偽陰性個案發生，即使檢查結果正常，有任何異狀，均應儘速就醫。",
      ],
    },
  },

  reports: [
    { id: "r1",    date: "115年4月30日", type: "其他檢驗資料", examName: "血中尿素氮", item: "BUN", org: "台大醫院", result: "13.5 mg/dL", refVal: "4.7 - 23", judge: "正常", summary: "腎功能指標於參考範圍內" },
    { id: "r2",    date: "115年1月20日", type: "其他檢驗資料", examName: "肌酸酐", item: "Creatinine", org: "亞東醫院", result: "0.5 mg/dL", refVal: "0.6 - 1.3", judge: "異常", summary: "腎功能指標於參考範圍內" },
    { id: "r_img", date: "114年12月20日",type: "影像或病理檢查報告", item: "胸部 X 光攝影",       org: "馬偕醫院", summary: "雙肺野清晰，心影大小正常" },
    { id: "r3",    date: "114年12月10日",type: "其他檢驗資料", examName: "丙胺酸轉胺酶", item: "ALT (GPT)", org: "馬偕醫院", result: "22 U/L", refVal: "0 - 40", judge: "正常", summary: "肝功能指標於參考範圍內" },
    { id: "r_oral",date: "114年11月18日",type: "癌症篩檢結果", subcat:"口腔癌篩檢", item: "口腔黏膜檢查",     org: "亞東醫院", summary: "未見可疑病灶，建議每兩年再追蹤", result: "無異常", readings: ["未見可疑病灶", "口腔黏膜未發現病變，建議每 2 年 1 次定期檢查。"] },
    { id: "r_oral2",date: "112年10月08日",type: "癌症篩檢結果", subcat:"口腔癌篩檢", item: "口腔黏膜檢查",     org: "亞東醫院", summary: "未見可疑病灶", result: "無異常", readings: ["未見可疑病灶", "口腔黏膜未發現病變，建議每 2 年 1 次定期檢查。"] },
    { id: "r_oral3",date: "110年9月22日",type: "癌症篩檢結果", subcat:"口腔癌篩檢", item: "口腔黏膜檢查",     org: "台大醫院", summary: "未見可疑病灶", result: "無異常", readings: ["未見可疑病灶", "口腔黏膜未發現病變，建議每 2 年 1 次定期檢查。"] },
    { id: "r_lung",date: "114年9月10日", type: "癌症篩檢結果", subcat:"肺癌篩檢",   item: "低劑量電腦斷層 (LDCT)", org: "台大醫院", summary: "未發現結節，建議定期追蹤", result: "無異常", readings: ["未發現肺部結節", "未發現任何病灶變化，建議每 2 年 1 次定期檢查。"] },
    { id: "r_lung2",date: "112年8月14日", type: "癌症篩檢結果", subcat:"肺癌篩檢",   item: "低劑量電腦斷層 (LDCT)", org: "台大醫院", summary: "未發現結節", result: "無異常", readings: ["未發現肺部結節", "未發現任何病灶變化，建議每 2 年 1 次定期檢查。"] },
    { id: "r_lung3",date: "110年7月30日", type: "癌症篩檢結果", subcat:"肺癌篩檢",   item: "低劑量電腦斷層 (LDCT)", org: "馬偕醫院", summary: "未發現結節", result: "無異常", readings: ["未發現肺部結節", "未發現任何病灶變化，建議每 2 年 1 次定期檢查。"] },
    { id: "r_glu", date: "114年5月23日", type: "血糖檢驗報告",       item: "糖化血色素 HbA1c",   org: "亞東醫院", summary: "HbA1c 5.5 %，參考區間內" },
    { id: "r4",    date: "114年4月2日",  type: "癌症篩檢結果", subcat:"大腸癌篩檢", item: "大腸癌篩檢（糞便潛血）", org: "台大醫院", summary: "糞便潛血陰性", result: "陰性", readings: ["糞便潛血反應陰性", "未發現異常，建議每 3 年 1 次定期篩檢。"] },
    { id: "r4b",   date: "112年3月15日", type: "癌症篩檢結果", subcat:"大腸癌篩檢", item: "大腸癌篩檢（糞便潛血）", org: "台大醫院", summary: "糞便潛血陰性", result: "陰性", readings: ["糞便潛血反應陰性", "未發現異常，建議每 3 年 1 次定期篩檢。"] },
    { id: "r4c",   date: "110年6月20日", type: "癌症篩檢結果", subcat:"大腸癌篩檢", item: "大腸癌篩檢（糞便潛血）", org: "亞東醫院", summary: "糞便潛血陰性", result: "陰性", readings: ["糞便潛血反應陰性", "未發現異常，建議每 3 年 1 次定期篩檢。"] },
    { id: "r_breast",date: "114年7月15日", type: "癌症篩檢結果", subcat:"乳癌篩檢", item: "乳房 X 光攝影（乳房攝影）", org: "馬偕醫院", summary: "乳房組織正常", result: "無異常", readings: ["乳房組織未見異常鈣化點", "未發現可疑腫塊，建議每 2 年 1 次定期篩檢。"] },
    { id: "r_breast2",date: "112年6月10日", type: "癌症篩檢結果", subcat:"乳癌篩檢", item: "乳房 X 光攝影（乳房攝影）", org: "馬偕醫院", summary: "乳房組織正常", result: "無異常", readings: ["乳房組織未見異常鈣化點", "未發現可疑腫塊，建議每 2 年 1 次定期篩檢。"] },
    { id: "r_breast3",date: "110年5月18日", type: "癌症篩檢結果", subcat:"乳癌篩檢", item: "乳房 X 光攝影（乳房攝影）", org: "台大醫院", summary: "乳房組織正常", result: "無異常", readings: ["乳房組織未見異常鈣化點", "未發現可疑腫塊，建議每 2 年 1 次定期篩檢。"] },
    { id: "r_cervix",date: "114年6月05日", type: "癌症篩檢結果", subcat:"子宮頸癌篩檢", item: "子宮頸抹片檢查", org: "亞東醫院", summary: "抹片結果正常", result: "無異常", readings: ["子宮頸細胞未見異常", "抹片結果正常，建議每 3 年 1 次定期篩檢。", "抹片結果正常，建議每 3 年 1 次定期篩檢。"] },
    { id: "r_cervix2",date: "111年5月20日", type: "癌症篩檢結果", subcat:"子宮頸癌篩檢", item: "子宮頸抹片檢查", org: "亞東醫院", summary: "抹片結果正常", result: "無異常", readings: ["子宮頸細胞未見異常", "抹片結果正常，建議每 3 年 1 次定期篩檢。"] },
    { id: "r_cervix3",date: "108年4月12日", type: "癌症篩檢結果", subcat:"子宮頸癌篩檢", item: "子宮頸抹片檢查", org: "台大醫院", summary: "抹片結果正常", result: "無異常", readings: ["子宮頸細胞未見異常", "抹片結果正常，建議每 3 年 1 次定期篩檢。"] },
    { id: "r_pa",  date: "114年3月12日", type: "影像或病理檢查報告", item: "腹部超音波",         org: "亞東醫院", summary: "肝、膽、胰、脾、腎未見異常" },
    { id: "r5",    date: "114年2月8日",  type: "血脂檢驗報告",       item: "血脂檢查",           org: "馬偕醫院", summary: "總膽固醇 185 mg/dL，三酸甘油脂 120 mg/dL" },
  ],

  // 血糖檢驗報告：醣化血紅素 (HbA1c) 時間序列，供圖表＋近三次表格使用
  // today 用於計算「近 N 年」區間；參考值上限 5.6%
  glucoseMeta: {
    metric: "醣化血紅素",
    unit: "%",
    refLow: 4.0,
    refHigh: 5.6,
    refText: "4.0 – 5.6 %",
    today: { y: 115, m: 6, d: 10 },
  },
  glucoseReadings: [
    { date: "115年5月15日", value: 5.4, org: "亞東醫院" },
    { date: "115年1月22日", value: 5.9, org: "亞東醫院" },
    { date: "114年8月8日",  value: 5.5, org: "台大醫院" },
    { date: "114年5月23日", value: 5.5, org: "亞東醫院" },
    { date: "113年11月8日", value: 5.6, org: "台大醫院" },
    { date: "113年5月2日",  value: 5.6, org: "馬偕醫院" },
    { date: "112年9月2日",  value: 5.7, org: "亞東醫院" },
  ],

  // 血脂檢驗報告：四項各自獨立的檢驗項目卡片
  lipidMeta: {
    title: "血脂檢驗報告",
    sub: "系統顯示最近一次檢查結果",
    noteRange: "111/12/01 至 114/12/17",
  },
  lipidItems: [
    {
      id: "tc",
      name: "總膽固醇",
      unit: "mg/dL",
      date: "114/05/23",
      value: 180,
      source: "A",
      refText: "<200 mg/dL",
      refType: "max",
      ref: 200,
      history: [
        { date: "111/11/02", value: 212 },
        { date: "112/05/18", value: 205 },
        { date: "112/12/06", value: 196 },
        { date: "113/06/21", value: 188 },
        { date: "114/05/23", value: 180 },
      ],
      education: {
        ref: "<200 mg/dl",
        body: "總膽固醇值過高可能有動脈硬化風險，通常要再檢查高密度脂蛋白「好」膽固醇與低密度脂蛋白「壞」膽固醇的濃度。如果總膽固醇值高，建議應至院所就醫，與您的醫師討論。",
        resources: ["台灣血脂衛教協會", "中華民國血脂及動脈硬化學會", "心肌梗塞學會｜TAMIS"],
      },
    },
    {
      id: "tg",
      name: "三酸甘油脂",
      unit: "mg/dL",
      date: "114/05/23",
      value: 210,
      source: "B",
      refText: "<150 mg/dL",
      refType: "max",
      ref: 150,
      history: [
        { date: "111/11/02", value: 158 },
        { date: "112/05/18", value: 164 },
        { date: "112/12/06", value: 131 },
        { date: "113/06/21", value: 188 },
        { date: "114/05/23", value: 210 },
      ],
      education: {
        ref: "<150 mg/dl",
        body: "三酸甘油酯是血脂肪的一種，又稱「中性脂肪」。三酸甘油酯過高者常伴隨膽固醇過高，或有較高風險罹患急性胰臟炎，建議應至院所就醫，與您的醫師討論。",
        resources: ["台灣血脂衛教協會", "中華民國血脂及動脈硬化學會", "心肌梗塞學會｜TAMIS"],
      },
    },
    {
      id: "hdl",
      name: "高密度脂蛋白膽固醇（HDL）",
      unit: "mg/dL",
      date: "114/05/23",
      value: 67,
      source: "B",
      refText: ">50 mg/dL",
      refType: "min",
      ref: 50,
      history: [
        { date: "111/11/02", value: 46 },
        { date: "112/05/18", value: 49 },
        { date: "112/12/06", value: 54 },
        { date: "113/06/21", value: 61 },
        { date: "114/05/23", value: 67 },
      ],
      education: {
        ref: ">50 mg/dl",
        body: "高密度脂蛋白就是俗稱「好」膽固醇，本項數值若偏低，血管動脈粥狀硬化風險提高，建議應至院所就醫，與您的醫師討論。",
        resources: ["台灣血脂衛教協會", "中華民國血脂及動脈硬化學會", "心肌梗塞學會｜TAMIS"],
      },
    },
    {
      id: "ldl",
      name: "低密度脂蛋白膽固醇（LDL）",
      unit: "mg/dL",
      date: "114/05/23",
      value: 95,
      source: "B",
      refText: "<130 mg/dL",
      refType: "max",
      ref: 130,
      history: [
        { date: "111/11/02", value: 142 },
        { date: "112/05/18", value: 131 },
        { date: "112/12/06", value: 121 },
        { date: "113/06/21", value: 108 },
        { date: "114/05/23", value: 95 },
      ],
      education: {
        ref: "<130 mg/dl",
        body: "低密度脂蛋白就是俗稱「壞」膽固醇，本項數值若偏高，血管動脈粥狀硬化風險提高，建議應至院所就醫，與您的醫師討論。",
        resources: ["台灣血脂衛教協會", "中華民國血脂及動脈硬化學會", "心肌梗塞學會｜TAMIS"],
      },
    },
  ],

  // 其他檢驗資料 — 詳細資料內頁（依報告 id）
  otherReportDetail: {
    r1: { date: "115/04/30", examName: "血中尿素氮", item: "BUN", result: "13.5 mg/dL", refVal: "4.7 - 23", judge: "正常", org: "台大醫院", code: "09014C", visitDate: "115/04/30", source: "A - 特約醫事機構不定期上傳" },
    r2: { date: "115/01/20", examName: "肌酸酐", item: "Creatinine", result: "0.5 mg/dL", refVal: "0.6 - 1.3", judge: "異常", org: "亞東醫院", code: "09015C", visitDate: "115/01/20", source: "B - 特約醫事機構定期上傳" },
    r3: { date: "114/12/10", examName: "丙胺酸轉胺酶", item: "ALT (GPT)", result: "22 U/L", refVal: "0 - 40", judge: "正常", org: "馬偕醫院", code: "09025C", visitDate: "114/12/10", source: "A - 特約醫事機構不定期上傳" },
  },

  // 影像或病理檢查報告 — 詳細資料（依報告 id）
  imageReportDetail: {
    r_img: {
      date: "114/12/20",
      org: "馬偕醫院",
      orderName: "胸部 X 光攝影（單向）",
      code: "32001C",
      visitDate: "",
      uploadTime: "114/12/21 09:42",
      radiation: "0.1 mSv",
      source: "E-特約醫事機構影像上傳",
      reportText: "肝臟腫瘤，疑似血管瘤，膽囊息肉",
      jpg: true,
      dcmSize: "3.34 MB",
    },
    r_pa: {
      date: "114/03/12",
      org: "亞東醫院",
      orderName: "腹部超音波檢查",
      code: "19009C",
      visitDate: "",
      uploadTime: "114/03/12 16:10",
      radiation: "-",
      source: "E-特約醫事機構影像上傳",
      reportText: "",
      jpg: true,
      dcmSize: "5.18 MB",
    },
  },

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
