const STORE_KEY = "daoyin_prototype_state_v1";
const PUBLIC_MODE = true;

const hexagrams = [
  ["䷀", "乾", "乾为天", "Qian", "乾：元亨，利贞。", "天行健，君子以自强不息。", "Clarity, force, and disciplined movement."],
  ["䷁", "坤", "坤为地", "Kun", "坤：元亨，利牝马之贞。", "地势坤，君子以厚德载物。", "Receptivity, patience, and grounded support."],
  ["䷂", "屯", "水雷屯", "Zhun", "屯：元亨，利贞。勿用有攸往，利建侯。", "云雷，屯；君子以经纶。", "Beginning under pressure; organize before moving."],
  ["䷃", "蒙", "山水蒙", "Meng", "蒙：亨。匪我求童蒙，童蒙求我。", "山下出泉，蒙；君子以果行育德。", "Learning, humility, and first principles."],
  ["䷄", "需", "水天需", "Xu", "需：有孚，光亨，贞吉。利涉大川。", "云上于天，需；君子以饮食宴乐。", "Waiting with preparation, not passivity."],
  ["䷅", "讼", "天水讼", "Song", "讼：有孚窒，惕中吉，终凶。", "天与水违行，讼；君子以作事谋始。", "Conflict asks for clarity before escalation."],
  ["䷆", "师", "地水师", "Shi", "师：贞，丈人吉，无咎。", "地中有水，师；君子以容民畜众。", "Discipline, coordination, and shared direction."],
  ["䷇", "比", "水地比", "Bi", "比：吉。原筮，元永贞，无咎。", "地上有水，比；先王以建万国，亲诸侯。", "Alliance, closeness, and sincere belonging."],
  ["䷈", "小畜", "风天小畜", "Xiao Xu", "小畜：亨。密云不雨，自我西郊。", "风行天上，小畜；君子以懿文德。", "Small restraint; gather strength quietly."],
  ["䷉", "履", "天泽履", "Lu", "履：履虎尾，不咥人，亨。", "上天下泽，履；君子以辨上下，定民志。", "Careful conduct in a delicate situation."],
  ["䷊", "泰", "地天泰", "Tai", "泰：小往大来，吉亨。", "天地交，泰；后以财成天地之道。", "Flow, harmony, and opening conditions."],
  ["䷋", "否", "天地否", "Pi", "否：否之匪人，不利君子贞。", "天地不交，否；君子以俭德辟难。", "Blockage; preserve integrity until movement returns."],
  ["䷌", "同人", "天火同人", "Tong Ren", "同人：同人于野，亨。", "天与火，同人；君子以类族辨物。", "Community, shared purpose, and open alliance."],
  ["䷍", "大有", "火天大有", "Da You", "大有：元亨。", "火在天上，大有；君子以遏恶扬善。", "Abundance with responsibility."],
  ["䷎", "谦", "地山谦", "Qian", "谦：亨，君子有终。", "地中有山，谦；君子以裒多益寡。", "Modesty that creates lasting strength."],
  ["䷏", "豫", "雷地豫", "Yu", "豫：利建侯行师。", "雷出地奋，豫；先王以作乐崇德。", "Readiness, enthusiasm, and timing."],
  ["䷐", "随", "泽雷随", "Sui", "随：元亨，利贞，无咎。", "泽中有雷，随；君子以向晦入宴息。", "Adaptation without losing the center."],
  ["䷑", "蛊", "山风蛊", "Gu", "蛊：元亨，利涉大川。", "山下有风，蛊；君子以振民育德。", "Repair what has been neglected."],
  ["䷒", "临", "地泽临", "Lin", "临：元亨，利贞。", "泽上有地，临；君子以教思无穷。", "Approach, oversight, and gentle leadership."],
  ["䷓", "观", "风地观", "Guan", "观：盥而不荐，有孚颙若。", "风行地上，观；先王以省方观民设教。", "Observe before acting."],
  ["䷔", "噬嗑", "火雷噬嗑", "Shi He", "噬嗑：亨，利用狱。", "雷电，噬嗑；先王以明罚敕法。", "Remove obstruction through clear action."],
  ["䷕", "贲", "山火贲", "Bi", "贲：亨。小利有攸往。", "山下有火，贲；君子以明庶政，无敢折狱。", "Adornment, form, and measured beauty."],
  ["䷖", "剥", "山地剥", "Bo", "剥：不利有攸往。", "山附于地，剥；上以厚下安宅。", "Stripping away; protect the root."],
  ["䷗", "复", "地雷复", "Fu", "复：亨。出入无疾，朋来无咎。", "雷在地中，复；先王以至日闭关。", "Return, renewal, and first movement back."],
  ["䷘", "无妄", "天雷无妄", "Wu Wang", "无妄：元亨，利贞。", "天下雷行，物与无妄。", "Truthful action without forced agenda."],
  ["䷙", "大畜", "山天大畜", "Da Xu", "大畜：利贞，不家食吉。", "天在山中，大畜；君子以多识前言往行。", "Great restraint and accumulated strength."],
  ["䷚", "颐", "山雷颐", "Yi", "颐：贞吉。观颐，自求口实。", "山下有雷，颐；君子以慎言语，节饮食。", "Nourishment, speech, and what you take in."],
  ["䷛", "大过", "泽风大过", "Da Guo", "大过：栋桡，利有攸往，亨。", "泽灭木，大过；君子以独立不惧。", "Excess pressure; act with sober courage."],
  ["䷜", "坎", "坎为水", "Kan", "习坎：有孚，维心亨。", "水洊至，习坎；君子以常德行。", "Depth, risk, and inner steadiness."],
  ["䷝", "离", "离为火", "Li", "离：利贞，亨。畜牝牛吉。", "明两作，离；大人以继明照于四方。", "Clarity, illumination, and attachment."],
  ["䷞", "咸", "泽山咸", "Xian", "咸：亨，利贞，取女吉。", "山上有泽，咸；君子以虚受人。", "Influence, attraction, and sincere response."],
  ["䷟", "恒", "雷风恒", "Heng", "恒：亨，无咎，利贞。", "雷风，恒；君子以立不易方。", "Endurance and lasting orientation."],
  ["䷠", "遁", "天山遁", "Dun", "遁：亨，小利贞。", "天下有山，遁；君子以远小人。", "Strategic withdrawal."],
  ["䷡", "大壮", "雷天大壮", "Da Zhuang", "大壮：利贞。", "雷在天上，大壮；君子以非礼弗履。", "Power must be guided by restraint."],
  ["䷢", "晋", "火地晋", "Jin", "晋：康侯用锡马蕃庶。", "明出地上，晋；君子以自昭明德。", "Progress, visibility, and earned recognition."],
  ["䷣", "明夷", "地火明夷", "Ming Yi", "明夷：利艰贞。", "明入地中，明夷；君子以莅众，用晦而明。", "Brightness hidden; protect your light."],
  ["䷤", "家人", "风火家人", "Jia Ren", "家人：利女贞。", "风自火出，家人；君子以言有物而行有恒。", "Household order, roles, and trust."],
  ["䷥", "睽", "火泽睽", "Kui", "睽：小事吉。", "上火下泽，睽；君子以同而异。", "Difference can still find alignment."],
  ["䷦", "蹇", "水山蹇", "Jian", "蹇：利西南，不利东北。", "山上有水，蹇；君子以反身修德。", "Difficulty invites inward correction."],
  ["䷧", "解", "雷水解", "Xie", "解：利西南。无所往，其来复吉。", "雷雨作，解；君子以赦过宥罪。", "Release, loosening, and relief after tension."],
  ["䷨", "损", "山泽损", "Sun", "损：有孚，元吉，无咎。", "山下有泽，损；君子以惩忿窒欲。", "Decrease what is excessive."],
  ["䷩", "益", "风雷益", "Yi", "益：利有攸往，利涉大川。", "风雷，益；君子以见善则迁。", "Increase through generosity and correction."],
  ["䷪", "夬", "泽天夬", "Guai", "夬：扬于王庭，孚号有厉。", "泽上于天，夬；君子以施禄及下。", "Decision, declaration, and clean separation."],
  ["䷫", "姤", "天风姤", "Gou", "姤：女壮，勿用取女。", "天下有风，姤；后以施命诰四方。", "Encounter with strong influence."],
  ["䷬", "萃", "泽地萃", "Cui", "萃：亨，王假有庙。", "泽上于地，萃；君子以除戎器。", "Gathering, assembly, and shared focus."],
  ["䷭", "升", "地风升", "Sheng", "升：元亨，用见大人。", "地中生木，升；君子以顺德。", "Gradual ascent through cultivation."],
  ["䷮", "困", "泽水困", "Kun", "困：亨，贞，大人吉。", "泽无水，困；君子以致命遂志。", "Constraint tests sincerity and endurance."],
  ["䷯", "井", "水风井", "Jing", "井：改邑不改井，无丧无得。", "木上有水，井；君子以劳民劝相。", "The shared source; maintain what nourishes."],
  ["䷰", "革", "泽火革", "Ge", "革：己日乃孚，元亨利贞。", "泽中有火，革；君子以治历明时。", "Change at the right time."],
  ["䷱", "鼎", "火风鼎", "Ding", "鼎：元吉，亨。", "木上有火，鼎；君子以正位凝命。", "Transformation, offering, and cultural vessel."],
  ["䷲", "震", "震为雷", "Zhen", "震：亨。震来虩虩，笑言哑哑。", "洊雷，震；君子以恐惧修省。", "Shock awakens attention."],
  ["䷳", "艮", "艮为山", "Gen", "艮：艮其背，不获其身。", "兼山，艮；君子以思不出其位。", "Stillness, boundary, and stopping."],
  ["䷴", "渐", "风山渐", "Jian", "渐：女归吉，利贞。", "山上有木，渐；君子以居贤德善俗。", "Gradual progress through proper order."],
  ["䷵", "归妹", "雷泽归妹", "Gui Mei", "归妹：征凶，无攸利。", "泽上有雷，归妹；君子以永终知敝。", "Misaligned joining; clarify terms."],
  ["䷶", "丰", "雷火丰", "Feng", "丰：亨。王假之，勿忧。", "雷电皆至，丰；君子以折狱致刑。", "Fullness, brightness, and timely action."],
  ["䷷", "旅", "火山旅", "Lu", "旅：小亨，旅贞吉。", "山上有火，旅；君子以明慎用刑。", "Traveling; keep conduct clear."],
  ["䷸", "巽", "巽为风", "Xun", "巽：小亨，利有攸往。", "随风，巽；君子以申命行事。", "Gentle penetration and repeated influence."],
  ["䷹", "兑", "兑为泽", "Dui", "兑：亨，利贞。", "丽泽，兑；君子以朋友讲习。", "Joy, exchange, and sincere speech."],
  ["䷺", "涣", "风水涣", "Huan", "涣：亨。王假有庙。", "风行水上，涣；先王以享于帝立庙。", "Dispersion; release what has congealed."],
  ["䷻", "节", "水泽节", "Jie", "节：亨，苦节不可贞。", "泽上有水，节；君子以制数度。", "Measure, boundary, and rhythm."],
  ["䷼", "中孚", "风泽中孚", "Zhong Fu", "中孚：豚鱼吉，利涉大川。", "泽上有风，中孚；君子以议狱缓死。", "Inner trust and truthfulness."],
  ["䷽", "小过", "雷山小过", "Xiao Guo", "小过：亨，利贞。", "山上有雷，小过；君子以行过乎恭。", "Small excess; attend to details."],
  ["䷾", "既济", "水火既济", "Ji Ji", "既济：亨，小利贞。", "水在火上，既济；君子以思患而预防之。", "Completion requires maintenance."],
  ["䷿", "未济", "火水未济", "Wei Ji", "未济：亨。小狐汔济，濡其尾。", "火在水上，未济；君子以慎辨物居方。", "Not yet complete; keep attention at the crossing."]
].map((h, index) => ({
  id: index + 1,
  symbol: h[0],
  name: h[1],
  fullName: h[2],
  pinyin: h[3],
  judgment: h[4],
  image: h[5],
  modern: h[6],
  tags: tagFor(index + 1)
}));

const oracleSlips = [
  { grade: "上上签", poem: "云开月明静候佳音", guidance: "势已渐开，宜守正待时，勿急躁求成。" },
  { grade: "上签", poem: "风入松庭万象新", guidance: "有新机入局，宜顺势整理旧事，稳步推进。" },
  { grade: "上签", poem: "清泉出石心自明", guidance: "先澄清本心，再定取舍，答案会变得清楚。" },
  { grade: "中上签", poem: "静观其变守中行", guidance: "此时重在观察，不宜被外界声势牵动。" },
  { grade: "中上签", poem: "一灯照夜渐通途", guidance: "眼前虽未大开，但已有可循之路。" },
  { grade: "中平签", poem: "山高水远步须稳", guidance: "事情需要耐心与次第，先处理最确定的一步。" },
  { grade: "中平签", poem: "云厚无雨且养真", guidance: "条件尚未成熟，宜蓄力、修正、等待时机。" },
  { grade: "小吉签", poem: "竹影扶风有暗香", guidance: "小处见吉，贵在柔和表达与持续积累。" },
  { grade: "小吉签", poem: "月在中天慎独行", guidance: "可行，但需自持，不宜轻许承诺。" },
  { grade: "待时签", poem: "雷藏地底勿妄动", guidance: "动机未定、形势未明时，先止后观。" },
  { grade: "待时签", poem: "水绕前山路未穷", guidance: "看似受阻，实则仍有回旋空间。" },
  { grade: "警省签", poem: "火照寒潭见本心", guidance: "此卦提醒你看清真实原因，避免只看表象。" },
  { grade: "警省签", poem: "履霜知戒慎初萌", guidance: "细微处已有征兆，宜尽早修正。" },
  { grade: "转机签", poem: "旧叶辞枝新气生", guidance: "适合断舍离，调整后会出现新的秩序。" },
  { grade: "转机签", poem: "舟过浅滩风渐顺", guidance: "难处正在松动，但仍需稳住节奏。" },
  { grade: "守成签", poem: "玉藏深山待良工", guidance: "价值需要时间显现，先守其真，再求其用。" }
];

function tagFor(id) {
  const bank = [
    ["clarity", "strength", "gold"],
    ["grounding", "receptive", "earth"],
    ["beginning", "water", "movement"],
    ["learning", "stillness", "water"],
    ["waiting", "water", "heaven"],
    ["conflict", "clarity", "water"],
    ["discipline", "water", "earth"],
    ["alliance", "water", "earth"]
  ];
  return bank[(id - 1) % bank.length];
}

const productsSeed = [
  {
    id: "p-inc-001",
    sku: "INC-001",
    category: "Incense / 香",
    name: "Sandalwood Incense / 檀香",
    price: 48,
    material: "Sandalwood, natural binder",
    origin: "Fujian, China",
    kind: "香",
    kaiGuangAvailable: true,
    kaiGuangPrice: 38,
    kaiGuangDays: 7,
    recordAvailable: true,
    recordPrice: 68,
    recordDays: 4,
    tags: ["clarity", "peace", "fire"]
  },
  {
    id: "p-brc-001",
    sku: "BRC-001",
    category: "Bracelets / 手串",
    name: "Obsidian Bracelet / 黑曜石手串",
    price: 128,
    material: "Obsidian, adjustable cord",
    origin: "Yunnan, China",
    kind: "串",
    kaiGuangAvailable: true,
    kaiGuangPrice: 46,
    kaiGuangDays: 9,
    recordAvailable: true,
    recordPrice: 88,
    recordDays: 5,
    tags: ["grounding", "water", "stillness"]
  },
  {
    id: "p-tea-001",
    sku: "TEA-001",
    category: "Tea Ware / 茶器",
    name: "Celadon Tea Cup / 青瓷茶盏",
    price: 86,
    material: "Celadon porcelain",
    origin: "Longquan, China",
    kind: "器",
    kaiGuangAvailable: false,
    kaiGuangPrice: 0,
    kaiGuangDays: 0,
    recordAvailable: false,
    recordPrice: 0,
    recordDays: 0,
    tags: ["ritual", "wood", "calm"]
  },
  {
    id: "p-obj-001",
    sku: "OBJ-001",
    category: "Objects / 摆件",
    name: "Mountain Stone Object / 山形摆件",
    price: 168,
    material: "Carved stone",
    origin: "Anhui, China",
    kind: "山",
    kaiGuangAvailable: true,
    kaiGuangPrice: 58,
    kaiGuangDays: 10,
    recordAvailable: true,
    recordPrice: 108,
    recordDays: 6,
    tags: ["stillness", "mountain", "grounding"]
  }
];

const idSeed = [
  ["DY-2026-INC-00027", "INC-001", "Incense / 香", "Available", ""],
  ["DY-2026-BRC-00138", "BRC-001", "Bracelets / 手串", "Available", ""],
  ["DY-2026-BRC-00139", "BRC-001", "Bracelets / 手串", "Available", ""],
  ["DY-2026-TEA-00041", "TEA-001", "Tea Ware / 茶器", "Available", ""],
  ["DY-2026-OBJ-00018", "OBJ-001", "Objects / 摆件", "Available", ""]
].map(([id, sku, category, status, order]) => ({ id, sku, category, status, order }));

const initialState = {
  lang: "en",
  user: null,
  users: [],
  readings: [],
  cart: [],
  orders: [],
  products: productsSeed,
  daoIds: idSeed,
  draftReading: null,
  adminTab: "products"
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return structuredClone(initialState);
    return { ...structuredClone(initialState), ...JSON.parse(raw) };
  } catch {
    return structuredClone(initialState);
  }
}

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function route() {
  const hash = location.hash.replace("#", "") || "/";
  const [path, queryString] = hash.split("?");
  const params = Object.fromEntries(new URLSearchParams(queryString || ""));
  return { path, params };
}

function nav(path) {
  location.hash = path;
}

window.addEventListener("hashchange", render);
document.addEventListener("click", handleClick);
document.addEventListener("input", handleInput);
document.addEventListener("change", handleChange);

function t(en, zh) {
  return state.lang === "zh" ? zh : en;
}

function currentUserId() {
  if (state.user) return state.user.id;
  let visitorId = localStorage.getItem("daoyin_visitor_id");
  if (!visitorId) {
    visitorId = `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem("daoyin_visitor_id", visitorId);
  }
  return visitorId;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function hasReadingToday() {
  const uid = currentUserId();
  const today = todayKey();
  return state.readings.some((r) => r.userId === uid && r.date === today);
}

function shell(content) {
  const { path } = route();
  const navs = [
    ["/oracle", "Oracle"],
    ["/hexagrams", "Hexagrams"],
    ["/consecration", "Consecration"],
    ["/shop", "Shop"],
    ["/journal", "Journal"],
    ["/about", "About"]
  ].concat(PUBLIC_MODE ? [] : [["/admin", "Manage"]]);
  return `
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" href="#/">
          <span class="seal">道印</span>
          <span class="brand-text"><strong>DaoYin</strong><span>道印</span></span>
        </a>
        <nav class="nav">
          ${navs.map(([href, label]) => `<a class="${path.startsWith(href) ? "active" : ""}" href="#${href}">${label}</a>`).join("")}
        </nav>
        <div class="actions">
          <button class="lang" data-action="toggle-lang">${state.lang === "en" ? "EN | 中文" : "中文 | EN"}</button>
          <a class="account-pill" href="#/account">${state.user ? state.user.name : "Account"}</a>
          <a class="icon-link" href="#/cart" title="Cart">Cart ${state.cart.length ? `(${state.cart.length})` : ""}</a>
        </div>
      </header>
      ${content}
      <footer class="site-footer">
        <div>
          <strong>道印 DaoYin</strong>
          <p>Prototype content notice: classical Chinese Yi Jing text is treated as public-domain source material; English interpretations and interface copy are original prototype text. No third-party translations or product images are used.</p>
        </div>
        <a href="#/about">Content & Copyright</a>
      </footer>
    </div>
  `;
}

function render() {
  const { path, params } = route();
  const routes = {
    "/": homePage,
    "/oracle": oracleIntroPage,
    "/oracle/form": oracleFormPage,
    "/oracle/cast": castPage,
    "/reading": () => readingPage(params.id),
    "/hexagrams": hexagramsPage,
    "/shop": shopPage,
    "/product": () => productPage(params.id),
    "/cart": cartPage,
    "/checkout": checkoutPage,
    "/order": () => orderPage(params.id),
    "/account": accountPage,
    "/admin": adminPage,
    "/consecration": consecrationPage,
    "/journal": journalPage,
    "/about": aboutPage
  };
  const view = routes[path] || homePage;
  document.getElementById("app").innerHTML = shell(view());
}

function homePage() {
  return `
    <main class="page hero">
      <section class="hero-inner">
        <p class="eyebrow">道印 DaoYin</p>
        <h1>Daoist Oracle for Modern Rituals</h1>
        <p class="lead">Draw an oracle. Read the signs. Find ritual objects aligned with the hexagram, with optional Kai Guang / 开光 service and DaoYin ID / 道印编号 management.</p>
        <div class="button-row">
          <a class="btn primary" href="#/oracle">Draw an Oracle / 抽签</a>
          <a class="btn ghost" href="#/hexagrams">Read Hexagrams / 解卦</a>
        </div>
        <div class="category-rail">
          <a href="#/shop?cat=Incense">Incense<span>香</span></a>
          <a href="#/shop?cat=Bracelets">Bracelets<span>手串</span></a>
          <a href="#/shop?cat=Tea">Tea Ware<span>茶器</span></a>
          <a href="#/shop?cat=Objects">Objects<span>摆件</span></a>
        </div>
      </section>
    </main>
  `;
}

function oracleIntroPage() {
  const blocked = hasReadingToday();
  return `
    <main class="page">
      <section class="grid two">
        <div class="panel">
          <p class="eyebrow">Before the Reading</p>
          <h2>起卦之前</h2>
          <div class="rule-list">
            <div class="rule-item"><strong>不动不占</strong><span>没有特别困惑的事情，不要随意占卜。</span><p class="muted">Do not consult without true movement.</p></div>
            <div class="rule-item"><strong>不诚不占</strong><span>心绪杂乱或抱着玩乐心态时，往往难以得其正。</span><p class="muted">Sincerity keeps the reading clear.</p></div>
            <div class="rule-item"><strong>一事一占</strong><span>请针对一件具体事情起卦，不要同时混问多事。</span><p class="muted">One matter, one reading.</p></div>
          </div>
          ${blocked ? `
            <div class="notice">每日一卦，贵在慎问。今日已完成起卦，可明日再问；商品浏览与购买不受限制。</div>
            <div class="button-row"><a class="btn" href="#/account">View Previous Reading</a><a class="btn primary" href="#/shop">Shop Ritual Objects</a></div>
          ` : `
            <label class="check"><input type="checkbox" id="oracleConsent" /> <span>I understand and will ask with sincerity.</span></label>
            <div class="button-row"><button class="btn primary" data-action="continue-oracle" disabled>Continue / 继续</button></div>
          `}
        </div>
        <aside class="panel">
          <h3>Daily Rule</h3>
          <p class="muted">Each ID can complete one oracle reading per day. Shopping, checkout, and order management remain unlimited.</p>
          <div class="hex-lines">
            ${renderLines([1, 0, 1, 0, 1, 1])}
          </div>
        </aside>
      </section>
    </main>
  `;
}

function oracleFormPage() {
  return `
    <main class="page">
      <section class="panel">
        <div class="section-head">
          <div>
            <p class="eyebrow">Set Your Intention</p>
            <h2>Choose the question carried into the reading.</h2>
          </div>
        </div>
        <form class="form" id="oracleForm">
          <div class="field">
            <label>Question Type</label>
            <div class="choice-grid" id="questionChoices">
              ${["Love / 姻缘", "Career / 事业", "Wealth / 财运", "Health / 健康", "Peace / 平安", "Direction / 方向", "Other / 其他"].map((c) => `<button type="button" class="choice" data-choice="${c}">${c}</button>`).join("")}
            </div>
          </div>
          <div class="field">
            <label>Specific Question</label>
            <textarea name="question" required placeholder="Ask one concrete matter."></textarea>
          </div>
          <div class="grid two">
            <div class="field"><label>Birth Date *</label><input name="birthDate" type="date" required /></div>
            <div class="field"><label>Birth Time</label><input name="birthTime" type="time" /></div>
          </div>
          <div class="grid two">
            <div class="field"><label>Birth Country / Region</label><input name="birthCountry" placeholder="United States" /></div>
            <div class="field"><label>Birth City</label><input name="birthCity" placeholder="Optional" /></div>
          </div>
          <div class="notice">完整八字需出生时间与出生地。若无法提供出生时间，本次仅用于生成基础生辰信息。</div>
          <button class="btn primary" type="submit">Begin Casting / 起卦</button>
        </form>
      </section>
    </main>
  `;
}

function castPage() {
  if (!state.draftReading) nav("/oracle/form");
  const draft = state.draftReading || { casts: [] };
  const casts = draft.casts || [];
  const lines = casts.map((c) => c.line);
  const current = Math.min(casts.length + 1, 6);
  return `
    <main class="page">
      <section class="oracle-stage">
        <div class="coin-area">
          <div>
            <p class="eyebrow">Cast the Coins / 起卦</p>
            <h2>第 ${current} / 6 爻</h2>
            <div class="coins">
              ${(draft.lastCoins || ["道", "印", "卦"]).map((c) => `<span class="coin">${c}</span>`).join("")}
            </div>
            <div class="button-row">
              ${casts.length < 6 ? `<button class="btn primary" data-action="cast-coin">Cast / 掷钱</button>` : `<button class="btn primary" data-action="finish-reading">Read Result / 解卦</button>`}
              <button class="btn ghost" data-action="reset-cast">Restart</button>
            </div>
          </div>
        </div>
        <div class="panel">
          <h3>Six Lines</h3>
          <p class="muted">Lines are built from bottom to top. 老阴 and 老阳 become moving lines.</p>
          <div class="hex-lines">${renderLines(lines, true)}</div>
          <div class="grid two">
            ${casts.map((c, i) => `<div class="panel slim"><strong>${i + 1}</strong><p>${c.sum} · ${c.name}</p></div>`).join("")}
          </div>
        </div>
      </section>
    </main>
  `;
}

function readingPage(id) {
  const reading = state.readings.find((r) => r.id === id) || state.readings[state.readings.length - 1];
  if (!reading) return `<main class="page"><div class="empty">No reading yet.</div></main>`;
  const hex = hexagrams[reading.hexagramId - 1];
  const changed = hexagrams[reading.changedHexagramId - 1];
  const slip = oracleSlipForReading(reading);
  const recs = recommendProducts(hex.tags).slice(0, 3);
  return `
    <main class="page">
      <section class="result-layout">
        <div class="slip">
          <div>
            <div class="grade">${slip.grade}</div>
            <div class="poem">${slip.poem}</div>
            <div class="slip-guidance">${slip.guidance}</div>
          </div>
        </div>
        <div class="panel">
          <p class="eyebrow">Oracle Reading</p>
          <h2>${hex.fullName} <span class="muted">${hex.symbol}</span></h2>
          <div class="meta-row"><span>Reading ID</span><strong>${reading.id}</strong></div>
          <div class="meta-row"><span>Question</span><strong>${escapeHtml(reading.question)}</strong></div>
          <div class="grid two">
            <div>
              <h3>本卦</h3>
              <div class="hex-lines">${renderLines(reading.lines, true)}</div>
            </div>
            <div>
              <h3>变卦</h3>
              <p>${changed.fullName} ${changed.symbol}</p>
              <div class="hex-lines">${renderLines(reading.changedLines, true)}</div>
            </div>
          </div>
          <div class="panel slim">
            <h3>周易原文</h3>
            <p>${hex.judgment}</p>
            <p>${hex.image}</p>
          </div>
          <div class="grid two">
            <div class="panel slim"><h3>Interpretation</h3><p>${hex.modern}</p></div>
            <div class="panel slim"><h3>Birth Pattern / 生辰信息</h3><p>${reading.birthPattern}</p></div>
          </div>
          <div class="share-panel">
            <div>
              <h3>Share Reading / 分享卦象</h3>
              <p class="muted">Export a social poster. Products, prices, birth date, and order data are excluded.</p>
            </div>
            <label class="check"><input type="checkbox" id="hideQuestionPoster" /> <span>Hide question on poster / 隐藏问题</span></label>
            <div class="share-actions">
              <button class="btn gold" data-action="export-reading" data-reading="${reading.id}" data-preset="story">Story 1080×1920</button>
              <button class="btn" data-action="export-reading" data-reading="${reading.id}" data-preset="square">Square 1080×1080</button>
              <button class="btn" data-action="export-reading" data-reading="${reading.id}" data-preset="wide">Wide 1600×900</button>
              <button class="btn ghost" data-action="copy-reading-link" data-reading="${reading.id}">Copy Link</button>
            </div>
          </div>
        </div>
      </section>
      <section class="panel slim" style="margin-top:18px">
        <div class="section-head">
          <div><h3>Matched Ritual Objects</h3><p>Optional objects aligned by symbolic tags. Recommendation rules remain configurable.</p></div>
        </div>
        <div class="mini-rail">
          ${recs.map((p) => `
            <div class="mini-product">
              <span class="mini-thumb">${p.kind}</span>
              <span><strong>${p.name}</strong><br><span class="muted">$${p.price}</span></span>
              <a class="btn ghost" href="#/product?id=${p.id}">View</a>
            </div>
          `).join("")}
        </div>
      </section>
    </main>
  `;
}

function hexagramsPage() {
  return `
    <main class="page">
      <div class="section-head">
        <div><p class="eyebrow">Hexagram Content Module</p><h2>64 卦内容库</h2><p>Chinese originals remain primary; English interpretation is secondary and editable later.</p></div>
      </div>
      <div class="grid four">
        ${hexagrams.map((h) => `
          <article class="panel slim">
            <h3>${h.symbol} ${h.fullName}</h3>
            <p class="muted">${h.pinyin}</p>
            <p>${h.judgment}</p>
            <div class="tag-row">${h.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
          </article>
        `).join("")}
      </div>
    </main>
  `;
}

function shopPage() {
  const { params } = route();
  const cat = params.cat || "All";
  const products = state.products.filter((p) => cat === "All" || p.category.includes(cat));
  return `
    <main class="page">
      <div class="section-head">
        <div><p class="eyebrow">Shop</p><h2>Ritual Objects</h2></div>
      </div>
      <div class="filters">
        ${["All", "Incense", "Bracelets", "Tea", "Objects"].map((c) => `<a class="btn ${cat === c ? "primary" : ""}" href="#/shop?cat=${c}">${c}</a>`).join("")}
      </div>
      <div class="product-grid">
        ${products.map(productCard).join("")}
      </div>
    </main>
  `;
}

function productCard(p) {
  return `
    <article class="product-card">
      <a href="#/product?id=${p.id}">
        <div class="product-art" data-kind="${p.kind}"></div>
        <div class="product-body">
          <h3>${p.name}</h3>
          <p class="muted">${p.material}</p>
          <strong>$${p.price}</strong>
          <div class="tag-row">
            <span class="tag">DaoYin ID / 道印编号</span>
            ${p.kaiGuangAvailable ? `<span class="tag">Kai Guang / 开光 可选</span>` : ""}
          </div>
        </div>
      </a>
    </article>
  `;
}

function productPage(id) {
  const p = state.products.find((product) => product.id === id) || state.products[0];
  return `
    <main class="page">
      <section class="product-detail">
        <div class="product-photo"></div>
        <div class="panel">
          <p class="eyebrow">${p.category}</p>
          <h2>${p.name}</h2>
          <p class="lead">$${p.price}</p>
          <div class="meta-row"><span>Material</span><strong>${p.material}</strong></div>
          <div class="meta-row"><span>Origin</span><strong>${p.origin}</strong></div>
          <div class="meta-row"><span>DaoYin ID / 道印编号</span><strong>Assigned after payment</strong></div>
          <div class="notice">Kai Guang / 开光 is an optional service. Selecting it adds a ritual service fee and extends fulfillment time.</div>
          <div class="service-row">
            <label class="check"><input type="checkbox" id="kgService" ${!p.kaiGuangAvailable ? "disabled" : ""} /> <span><strong>Kai Guang / 开光</strong><br><span class="muted">+$${p.kaiGuangPrice}, adds ${p.kaiGuangDays}-${p.kaiGuangDays + 3} days</span></span></label>
          </div>
          <div class="service-row">
            <label class="check"><input type="checkbox" id="recService" disabled /> <span><strong>Recorded Consecration / 实地开光录制</strong><br><span class="muted">+$${p.recordPrice}, requires Kai Guang, adds ${p.recordDays}-${p.recordDays + 2} days</span></span></label>
          </div>
          <div id="estimateBox" class="panel slim" style="margin-top:16px">${estimateHtml(p, false, false)}</div>
          <div class="button-row"><button class="btn primary" data-action="add-cart" data-product="${p.id}">Add to Cart</button></div>
          <div class="tag-row">${p.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        </div>
      </section>
    </main>
  `;
}

function cartPage() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.total, 0);
  return `
    <main class="page">
      <div class="section-head"><div><p class="eyebrow">Cart</p><h2>Your Cart</h2></div></div>
      ${state.cart.length ? `
        <section class="grid two">
          <div class="panel">
            ${state.cart.map((item, index) => cartItemHtml(item, index)).join("")}
          </div>
          <aside class="panel">
            <h3>Order Summary</h3>
            <div class="summary-line"><span>Subtotal</span><strong>$${subtotal}</strong></div>
            <div class="summary-line"><span>Shipping</span><span>Calculated at checkout</span></div>
            <div class="button-row"><a class="btn primary" href="#/checkout">Checkout</a></div>
          </aside>
        </section>
      ` : `<div class="empty panel">Your cart is empty. <a href="#/shop">Shop ritual objects</a>.</div>`}
    </main>
  `;
}

function cartItemHtml(item, index) {
  const p = state.products.find((x) => x.id === item.productId);
  return `
    <div class="meta-row">
      <div>
        <h3>${p.name}</h3>
        <p class="muted">DaoYin ID assigned after payment</p>
        <p>${item.kaiGuang ? "Kai Guang / 开光 selected" : "No Kai Guang"} · ${item.recorded ? "Recorded Consecration selected" : "No recording"}</p>
        <p class="muted">Estimated fulfillment: ${item.days} days</p>
      </div>
      <div><strong>$${item.total}</strong><br><button class="btn ghost" data-action="remove-cart" data-index="${index}">Remove</button></div>
    </div>
  `;
}

function checkoutPage() {
  if (!state.cart.length) return `<main class="page"><div class="empty panel">Cart is empty.</div></main>`;
  const subtotal = state.cart.reduce((sum, item) => sum + item.total, 0);
  return `
    <main class="page">
      <section class="grid two">
        <div class="panel">
          <p class="eyebrow">Checkout</p>
          <h2>Shipping and Payment</h2>
          <form class="form" id="checkoutForm">
            <div class="field"><label>Email</label><input name="email" type="email" required value="${state.user?.email || ""}" /></div>
            <div class="field"><label>Name</label><input name="name" required value="${state.user?.name || ""}" /></div>
            <div class="field"><label>Address</label><input name="address" required /></div>
            <div class="grid two">
              <div class="field"><label>Country</label><input name="country" required value="United States" /></div>
              <div class="field"><label>Postal Code</label><input name="postal" required /></div>
            </div>
            <button class="btn primary" type="submit">Pay Now</button>
          </form>
        </div>
        <aside class="panel">
          <h3>Order Summary</h3>
          ${state.cart.map((item) => {
            const p = state.products.find((x) => x.id === item.productId);
            return `<div class="summary-line"><span>${p.name}<br><span class="muted">${item.kaiGuang ? "开光 " : ""}${item.recorded ? "实地录制" : ""}</span></span><strong>$${item.total}</strong></div>`;
          }).join("")}
          <div class="summary-line"><span>Total</span><strong>$${subtotal}</strong></div>
        </aside>
      </section>
    </main>
  `;
}

function orderPage(id) {
  const order = state.orders.find((o) => o.id === id);
  if (!order) return `<main class="page"><div class="empty panel">Order not found.</div></main>`;
  return `
    <main class="page">
      <section class="grid two">
        <div class="panel">
          <p class="eyebrow">Order Details</p>
          <h2>${order.id}</h2>
          <div class="meta-row"><span>Status</span><strong>${order.status}</strong></div>
          ${order.items.map((item) => {
            const p = state.products.find((x) => x.id === item.productId);
            return `
              <div class="panel slim" style="margin-top:16px">
                <h3>${p.name}</h3>
                <div class="meta-row"><span>DaoYin ID / 道印编号</span><strong>${item.daoYinId}</strong></div>
                <div class="timeline-row"><span>Paid</span><strong>Done</strong></div>
                <div class="timeline-row"><span>Kai Guang / 开光</span><strong>${item.kaiGuang ? "Pending" : "Not selected"}</strong></div>
                <div class="timeline-row"><span>Recorded Consecration / 实地开光录制</span><strong>${item.recorded ? "Pending" : "Not selected"}</strong></div>
                <div class="timeline-row"><span>Shipped</span><strong>Pending</strong></div>
              </div>
            `;
          }).join("")}
        </div>
        <aside class="panel">
          <h3>Recorded Video</h3>
          <p class="muted">Available after recording is completed. The recording must show the DaoYin ID / 道印编号 for verification of uniqueness.</p>
          <div class="notice">No certificate or certificate verification module is included in this prototype.</div>
        </aside>
      </section>
    </main>
  `;
}

function accountPage() {
  if (!state.user) {
    return `
      <main class="page">
        <section class="grid two">
          <div class="panel">
            <p class="eyebrow">Account</p>
            <h2>Sign in</h2>
            <form class="form" id="loginForm">
              <div class="field"><label>Email</label><input name="email" type="email" required /></div>
              <div class="field"><label>Name</label><input name="name" required /></div>
              <button class="btn primary" type="submit">Continue</button>
            </form>
          </div>
          <div class="panel"><h3>Prototype account system</h3><p class="muted">This creates a local browser account and links readings, carts, and orders to it.</p></div>
        </section>
      </main>
    `;
  }
  const readings = state.readings.filter((r) => r.userId === state.user.id);
  const orders = state.orders.filter((o) => o.userId === state.user.id);
  return `
    <main class="page">
      <div class="section-head">
        <div><p class="eyebrow">Account</p><h2>${state.user.name}</h2><p>${state.user.email}</p></div>
        <button class="btn ghost" data-action="logout">Logout</button>
      </div>
      <section class="grid two">
        <div class="panel">
          <h3>Reading History</h3>
          ${readings.length ? readings.map((r) => `<div class="meta-row"><span>${r.date} · ${hexagrams[r.hexagramId - 1].fullName}</span><a class="btn ghost" href="#/reading?id=${r.id}">View</a></div>`).join("") : `<p class="muted">No readings yet.</p>`}
        </div>
        <div class="panel">
          <h3>Orders</h3>
          ${orders.length ? orders.map((o) => `<div class="meta-row"><span>${o.id} · $${o.total}</span><a class="btn ghost" href="#/order?id=${o.id}">View</a></div>`).join("") : `<p class="muted">No orders yet.</p>`}
        </div>
      </section>
    </main>
  `;
}

function adminPage() {
  if (PUBLIC_MODE) {
    return `
      <main class="page">
        <section class="panel">
          <p class="eyebrow">Public Preview</p>
          <h2>Management tools are hidden in the public prototype.</h2>
          <p class="lead">商品管理、编号库和订单后台仍保留在代码模型中，但公开部署版不展示管理入口，避免外部访问误解为真实后台。</p>
          <div class="button-row"><a class="btn primary" href="#/">Back to Home</a></div>
        </section>
      </main>
    `;
  }
  const tab = state.adminTab || "products";
  return `
    <main class="page">
      <div class="section-head">
        <div><p class="eyebrow">Product Management System</p><h2>Manage Prototype Data</h2></div>
      </div>
      <div class="admin-tabs">
        ${["products", "ids", "orders", "content"].map((x) => `<button class="btn ${tab === x ? "primary" : ""}" data-action="admin-tab" data-tab="${x}">${x}</button>`).join("")}
      </div>
      ${tab === "products" ? adminProducts() : tab === "ids" ? adminIds() : tab === "orders" ? adminOrders() : adminContent()}
    </main>
  `;
}

function adminProducts() {
  return `
    <section class="grid two">
      <div class="table-wrap">
        <table><thead><tr><th>Name</th><th>SKU</th><th>Price</th><th>Services</th></tr></thead><tbody>
          ${state.products.map((p) => `<tr><td>${p.name}</td><td>${p.sku}</td><td>$${p.price}</td><td>${p.kaiGuangAvailable ? "开光" : "-"} ${p.recordAvailable ? "录制" : ""}</td></tr>`).join("")}
        </tbody></table>
      </div>
      <div class="panel">
        <h3>Add Mock Product</h3>
        <form class="form" id="productForm">
          <div class="field"><label>Name</label><input name="name" required placeholder="Bronze Object / 铜摆件" /></div>
          <div class="field"><label>SKU</label><input name="sku" required placeholder="OBJ-002" /></div>
          <div class="field"><label>Price</label><input name="price" type="number" required /></div>
          <button class="btn primary" type="submit">Add Product</button>
        </form>
      </div>
    </section>
  `;
}

function adminIds() {
  return `
    <section class="table-wrap">
      <table><thead><tr><th>DaoYin ID</th><th>SKU</th><th>Category</th><th>Status</th><th>Order</th></tr></thead><tbody>
        ${state.daoIds.map((id) => `<tr><td>${id.id}</td><td>${id.sku}</td><td>${id.category}</td><td>${id.status}</td><td>${id.order || "-"}</td></tr>`).join("")}
      </tbody></table>
    </section>
  `;
}

function adminOrders() {
  return `
    <section class="table-wrap">
      <table><thead><tr><th>Order</th><th>User</th><th>Total</th><th>Status</th><th>Items</th></tr></thead><tbody>
        ${state.orders.map((o) => `<tr><td>${o.id}</td><td>${o.userName}</td><td>$${o.total}</td><td>${o.status}</td><td>${o.items.length}</td></tr>`).join("")}
      </tbody></table>
    </section>
  `;
}

function adminContent() {
  return `
    <section class="table-wrap">
      <table><thead><tr><th>ID</th><th>卦名</th><th>卦辞</th><th>English interpretation</th><th>Tags</th></tr></thead><tbody>
        ${hexagrams.slice(0, 16).map((h) => `<tr><td>${h.id}</td><td>${h.symbol} ${h.fullName}</td><td>${h.judgment}</td><td>${h.modern}</td><td>${h.tags.join(", ")}</td></tr>`).join("")}
      </tbody></table>
    </section>
  `;
}

function consecrationPage() {
  return `
    <main class="page">
      <section class="panel">
        <p class="eyebrow">Consecration</p>
        <h2>Kai Guang / 开光 as an optional service</h2>
        <div class="grid three" style="margin-top:24px">
          <div class="panel slim"><h3>开光</h3><p>Optional paid service. It increases fulfillment time and cost.</p></div>
          <div class="panel slim"><h3>道印编号</h3><p>Each managed item receives a unique DaoYin ID after payment.</p></div>
          <div class="panel slim"><h3>实地开光录制</h3><p>Additional paid service requiring Kai Guang. The video must show the DaoYin ID.</p></div>
        </div>
      </section>
    </main>
  `;
}

function journalPage() {
  return `
    <main class="page">
      <section class="panel">
        <p class="eyebrow">Journal</p>
        <h2>Daoist culture notes</h2>
        <p class="lead">Article module placeholder: 易经原文、铜钱起卦、八卦意象、开光服务说明。</p>
        <div class="notice">Content policy: future articles should use original writing, public-domain classical sources, licensed images, and clear citations. Do not copy modern translations, commentary, product photography, or museum images without permission.</div>
      </section>
    </main>
  `;
}

function aboutPage() {
  return `
    <main class="page">
      <section class="grid two">
        <div class="panel">
          <p class="eyebrow">About</p>
          <h2>道印 DaoYin</h2>
          <p class="lead">A premium Daoist ritual lifestyle prototype centered on oracle readings, hexagram interpretation, DaoYin ID management, and optional Kai Guang / 开光 services.</p>
        </div>
        <div class="panel">
          <h3>Content & Copyright</h3>
          <p>《周易》经典中文原文为古籍内容；本原型中的英文解释和界面文案为原创原型文本，不采用第三方现代译文。</p>
          <p class="muted">For production, all article copy, product photography, iconography, audio, video, fonts, and translations should be original, licensed, or verified public-domain material.</p>
        </div>
      </section>
    </main>
  `;
}

function renderLines(lines, bottomUp = false) {
  const source = bottomUp ? [...lines].reverse() : lines;
  const padded = [...source];
  while (padded.length < 6) padded.unshift(null);
  return padded.map((line) => {
    if (line === null || typeof line === "undefined") return `<div class="yao yang" style="opacity:.14"></div>`;
    const cls = line.type || (line === 1 ? "yang" : "yin");
    const moving = line.moving ? " moving" : "";
    return `<div class="yao ${cls}${moving}"></div>`;
  }).join("");
}

function estimateHtml(p, kaiGuang, recorded) {
  let price = p.price;
  let min = 5;
  let max = 8;
  if (kaiGuang) {
    price += p.kaiGuangPrice;
    min += p.kaiGuangDays;
    max += p.kaiGuangDays + 3;
  }
  if (recorded) {
    price += p.recordPrice;
    min += p.recordDays;
    max += p.recordDays + 2;
  }
  return `
    <h3>Estimated Fulfillment</h3>
    <div class="summary-line"><span>Total item price</span><strong>$${price}</strong></div>
    <div class="summary-line"><span>Processing time</span><strong>${min}-${max} days</strong></div>
  `;
}

function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "toggle-lang") {
    state.lang = state.lang === "en" ? "zh" : "en";
    save();
    render();
  }
  if (action === "continue-oracle") nav("/oracle/form");
  if (action === "cast-coin") castCoin();
  if (action === "reset-cast") {
    state.draftReading.casts = [];
    state.draftReading.lastCoins = null;
    save();
    render();
  }
  if (action === "finish-reading") finishReading();
  if (action === "export-reading") exportReadingPoster(target.dataset.reading, target.dataset.preset || "story");
  if (action === "copy-reading-link") copyReadingLink(target.dataset.reading);
  if (action === "add-cart") addCart(target.dataset.product);
  if (action === "remove-cart") {
    state.cart.splice(Number(target.dataset.index), 1);
    save();
    render();
  }
  if (action === "logout") {
    state.user = null;
    save();
    render();
  }
  if (action === "admin-tab") {
    state.adminTab = target.dataset.tab;
    save();
    render();
  }
}

function handleInput(event) {
  if (event.target.id === "oracleConsent") {
    const btn = document.querySelector("[data-action='continue-oracle']");
    if (btn) btn.disabled = !event.target.checked;
  }
}

function handleChange(event) {
  if (event.target.id === "kgService") {
    const rec = document.getElementById("recService");
    if (rec) {
      rec.disabled = !event.target.checked;
      if (!event.target.checked) rec.checked = false;
    }
    updateEstimateBox();
  }
  if (event.target.id === "recService") updateEstimateBox();
}

document.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.id === "oracleForm") submitOracleForm(event.target);
  if (event.target.id === "checkoutForm") submitCheckout(event.target);
  if (event.target.id === "loginForm") submitLogin(event.target);
  if (event.target.id === "productForm") submitProduct(event.target);
});

document.addEventListener("click", (event) => {
  const choice = event.target.closest("[data-choice]");
  if (!choice) return;
  document.querySelectorAll("[data-choice]").forEach((el) => el.classList.remove("active"));
  choice.classList.add("active");
});

function submitOracleForm(form) {
  const selected = document.querySelector("[data-choice].active");
  if (!selected) return alert("Please choose a question type.");
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.question.trim()) return alert("Please enter one concrete question.");
  state.draftReading = {
    type: selected.dataset.choice,
    question: data.question.trim(),
    birthDate: data.birthDate,
    birthTime: data.birthTime,
    birthCountry: data.birthCountry,
    birthCity: data.birthCity,
    casts: []
  };
  save();
  nav("/oracle/cast");
}

function castCoin() {
  const coins = [flip(), flip(), flip()];
  const sum = coins.reduce((a, b) => a + b.value, 0);
  const map = {
    6: { name: "老阴", type: "yin", moving: true, changed: "yang" },
    7: { name: "少阳", type: "yang", moving: false, changed: "yang" },
    8: { name: "少阴", type: "yin", moving: false, changed: "yin" },
    9: { name: "老阳", type: "yang", moving: true, changed: "yin" }
  };
  const result = map[sum];
  state.draftReading.casts.push({ sum, coins: coins.map((c) => c.face), name: result.name, line: result });
  state.draftReading.lastCoins = coins.map((c) => c.face);
  save();
  render();
}

function flip() {
  const heads = Math.random() > 0.5;
  return { value: heads ? 3 : 2, face: heads ? "阳" : "阴" };
}

function oracleSlipForReading(reading) {
  if (reading.oracleSlip) return reading.oracleSlip;
  const movingCount = (reading.lines || []).filter((line) => line.moving).length;
  const questionWeight = String(reading.question || "").length;
  const key = (reading.hexagramId * 7 + reading.changedHexagramId * 3 + movingCount * 11 + questionWeight) % oracleSlips.length;
  return oracleSlips[key];
}

function finishReading() {
  const draft = state.draftReading;
  if (!draft || draft.casts.length < 6) return;
  const lines = draft.casts.map((c) => c.line);
  const changedLines = lines.map((line) => ({
    type: line.moving ? line.changed : line.type,
    moving: false
  }));
  const hexagramId = idFromLines(lines);
  const changedHexagramId = idFromLines(changedLines);
  const reading = {
    id: `R-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(state.readings.length + 1).padStart(4, "0")}`,
    userId: currentUserId(),
    date: todayKey(),
    type: draft.type,
    question: draft.question,
    birthPattern: birthPattern(draft.birthDate, draft.birthTime),
    lines,
    changedLines,
    hexagramId,
    changedHexagramId
  };
  reading.oracleSlip = oracleSlipForReading(reading);
  state.readings.push(reading);
  state.draftReading = null;
  save();
  nav(`/reading?id=${reading.id}`);
}

function exportReadingPoster(readingId, preset = "story") {
  const reading = state.readings.find((r) => r.id === readingId);
  if (!reading) return alert("Reading not found.");
  const hex = hexagrams[reading.hexagramId - 1];
  const changed = hexagrams[reading.changedHexagramId - 1];
  const hideQuestion = document.getElementById("hideQuestionPoster")?.checked || false;
  const sizes = {
    story: { width: 1080, height: 1920, label: "1080x1920" },
    square: { width: 1080, height: 1080, label: "1080x1080" },
    wide: { width: 1600, height: 900, label: "1600x900" }
  };
  const size = sizes[preset] || sizes.story;
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");

  if (preset === "wide") {
    drawWidePoster(ctx, canvas, reading, hex, changed, hideQuestion);
  } else if (preset === "square") {
    drawSquarePoster(ctx, canvas, reading, hex, changed, hideQuestion);
  } else {
    drawStoryPoster(ctx, canvas, reading, hex, changed, hideQuestion);
  }

  canvas.toBlob((blob) => {
    if (!blob) return alert("Could not export image.");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `daoyin-${reading.id}-${size.label}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, "image/png");
}

function drawStoryPoster(ctx, canvas, reading, hex, changed, hideQuestion) {
  const slip = oracleSlipForReading(reading);
  drawPosterBackground(ctx, canvas.width, canvas.height);
  drawPosterSeal(ctx, 86, 86, 118);
  drawPosterText(ctx, "DaoYin / 道印", 230, 122, 34, "#efe9dc", "600");
  drawPosterText(ctx, "Oracle Reading / 解卦", 230, 168, 24, "rgba(239,233,220,.72)", "400");

  drawBaguaRing(ctx, 540, 468, 320);
  drawPosterText(ctx, hex.symbol, 540, 435, 132, "rgba(210,189,128,.9)", "400", "center", "Georgia, 'Times New Roman', serif");
  drawPosterText(ctx, hex.fullName, 540, 548, 62, "#efe9dc", "500", "center", "'STSong', 'Songti SC', serif");
  drawHexLines(ctx, reading.lines, 390, 645, 300, 24, true);

  drawOracleSlip(ctx, 132, 835, 280, 620);
  drawVerticalText(ctx, slip.poem, 272, 930, 54, "#101412");
  drawPosterText(ctx, slip.grade, 272, 895, 38, "#9c2f24", "500", "center", "'STSong', 'Songti SC', serif");

  drawPosterPanel(ctx, 468, 835, 480, 620);
  drawPosterText(ctx, "周易原文", 516, 915, 36, "#d2bd80", "500", "left", "'STSong', 'Songti SC', serif");
  drawWrappedText(ctx, hex.judgment, 516, 982, 390, 34, 42, "#efe9dc", "'STSong', 'Songti SC', serif");
  drawWrappedText(ctx, hex.image, 516, 1116, 390, 32, 42, "#efe9dc", "'STSong', 'Songti SC', serif");
  drawPosterText(ctx, "Interpretation", 516, 1278, 28, "#d2bd80", "600");
  drawWrappedText(ctx, hex.modern, 516, 1332, 380, 28, 40, "rgba(239,233,220,.78)");

  drawPosterText(ctx, "变卦", 134, 1538, 32, "#d2bd80", "500", "left", "'STSong', 'Songti SC', serif");
  drawPosterText(ctx, `${changed.symbol} ${changed.fullName}`, 214, 1538, 32, "#efe9dc", "500", "left", "'STSong', 'Songti SC', serif");
  drawPosterText(ctx, `Reading ID ${reading.id}`, 134, 1610, 24, "rgba(239,233,220,.62)");
  if (!hideQuestion) drawWrappedText(ctx, `Question: ${reading.question}`, 134, 1662, 790, 25, 36, "rgba(239,233,220,.62)");
  drawPosterText(ctx, "道印 DaoYin · Draw an oracle. Read the signs.", 540, 1816, 24, "rgba(239,233,220,.72)", "400", "center");
}

function drawSquarePoster(ctx, canvas, reading, hex, changed, hideQuestion) {
  const slip = oracleSlipForReading(reading);
  drawPosterBackground(ctx, canvas.width, canvas.height);
  drawPosterSeal(ctx, 64, 64, 96);
  drawPosterText(ctx, "DaoYin / 道印", 184, 102, 30, "#efe9dc", "600");
  drawPosterText(ctx, "Oracle Reading / 解卦", 184, 142, 21, "rgba(239,233,220,.72)");
  drawBaguaRing(ctx, 330, 450, 230);
  drawPosterText(ctx, hex.symbol, 330, 420, 104, "rgba(210,189,128,.88)", "400", "center", "Georgia, 'Times New Roman', serif");
  drawPosterText(ctx, hex.fullName, 330, 522, 48, "#efe9dc", "500", "center", "'STSong', 'Songti SC', serif");
  drawHexLines(ctx, reading.lines, 214, 600, 232, 18, true);

  drawOracleSlip(ctx, 612, 184, 258, 476);
  drawPosterText(ctx, slip.grade, 741, 238, 34, "#9c2f24", "500", "center", "'STSong', 'Songti SC', serif");
  drawVerticalText(ctx, slip.poem, 741, 286, 42, "#101412");

  drawPosterPanel(ctx, 92, 744, 896, 210);
  drawPosterText(ctx, "周易原文", 132, 806, 30, "#d2bd80", "500", "left", "'STSong', 'Songti SC', serif");
  drawWrappedText(ctx, `${hex.judgment} ${hex.image}`, 132, 858, 770, 27, 37, "#efe9dc", "'STSong', 'Songti SC', serif");
  drawPosterText(ctx, `${changed.symbol} ${changed.fullName} · Reading ID ${reading.id}`, 132, 1008, 22, "rgba(239,233,220,.62)");
  if (!hideQuestion) drawWrappedText(ctx, `Question: ${reading.question}`, 520, 1008, 420, 22, 30, "rgba(239,233,220,.62)");
}

function drawWidePoster(ctx, canvas, reading, hex, changed, hideQuestion) {
  const slip = oracleSlipForReading(reading);
  drawPosterBackground(ctx, canvas.width, canvas.height);
  drawPosterSeal(ctx, 72, 70, 98);
  drawPosterText(ctx, "DaoYin / 道印", 194, 108, 32, "#efe9dc", "600");
  drawPosterText(ctx, "Oracle Reading / 解卦", 194, 150, 22, "rgba(239,233,220,.72)");

  drawBaguaRing(ctx, 385, 462, 254);
  drawPosterText(ctx, hex.symbol, 385, 430, 112, "rgba(210,189,128,.88)", "400", "center", "Georgia, 'Times New Roman', serif");
  drawPosterText(ctx, hex.fullName, 385, 540, 52, "#efe9dc", "500", "center", "'STSong', 'Songti SC', serif");
  drawHexLines(ctx, reading.lines, 252, 620, 266, 18, true);

  drawOracleSlip(ctx, 690, 168, 240, 520);
  drawPosterText(ctx, slip.grade, 810, 226, 32, "#9c2f24", "500", "center", "'STSong', 'Songti SC', serif");
  drawVerticalText(ctx, slip.poem, 810, 278, 43, "#101412");

  drawPosterPanel(ctx, 990, 168, 472, 520);
  drawPosterText(ctx, "周易原文", 1034, 246, 32, "#d2bd80", "500", "left", "'STSong', 'Songti SC', serif");
  drawWrappedText(ctx, hex.judgment, 1034, 308, 360, 30, 40, "#efe9dc", "'STSong', 'Songti SC', serif");
  drawWrappedText(ctx, hex.image, 1034, 420, 360, 28, 38, "#efe9dc", "'STSong', 'Songti SC', serif");
  drawPosterText(ctx, "Interpretation", 1034, 556, 24, "#d2bd80", "600");
  drawWrappedText(ctx, hex.modern, 1034, 604, 350, 23, 32, "rgba(239,233,220,.78)");

  drawPosterText(ctx, `变卦 ${changed.symbol} ${changed.fullName}`, 72, 806, 28, "#efe9dc", "500", "left", "'STSong', 'Songti SC', serif");
  drawPosterText(ctx, `Reading ID ${reading.id}`, 432, 806, 22, "rgba(239,233,220,.62)");
  if (!hideQuestion) drawWrappedText(ctx, `Question: ${reading.question}`, 720, 806, 730, 22, 30, "rgba(239,233,220,.62)");
}

async function copyReadingLink(readingId) {
  const url = `${location.origin}${location.pathname}#/reading?id=${encodeURIComponent(readingId)}`;
  try {
    await navigator.clipboard.writeText(url);
    alert("Reading link copied. It will work for others after the site is deployed online.");
  } catch {
    window.prompt("Copy this link. It will work for others after online deployment:", url);
  }
}

function drawPosterBackground(ctx, width, height) {
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#1a312c");
  grad.addColorStop(0.48, "#24483f");
  grad.addColorStop(1, "#101412");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(830, 250, 40, 830, 250, 760);
  glow.addColorStop(0, "rgba(210,189,128,.28)");
  glow.addColorStop(1, "rgba(210,189,128,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(210,189,128,.08)";
  ctx.lineWidth = 1;
  for (let x = 80; x < width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 80; y < height; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(16,20,18,.26)";
  ctx.beginPath();
  ctx.moveTo(0, 1570);
  ctx.lineTo(160, 1460);
  ctx.lineTo(282, 1536);
  ctx.lineTo(430, 1382);
  ctx.lineTo(590, 1534);
  ctx.lineTo(746, 1412);
  ctx.lineTo(1080, 1580);
  ctx.lineTo(1080, 1920);
  ctx.lineTo(0, 1920);
  ctx.closePath();
  ctx.fill();
}

function drawPosterSeal(ctx, x, y, size) {
  ctx.fillStyle = "#9c2f24";
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = "rgba(239,233,220,.55)";
  ctx.lineWidth = 5;
  ctx.strokeRect(x + 10, y + 10, size - 20, size - 20);
  drawPosterText(ctx, "道印", x + size / 2, y + size / 2 + 12, 42, "#efe9dc", "500", "center", "'STSong', 'Songti SC', serif");
}

function drawBaguaRing(ctx, x, y, radius) {
  ctx.save();
  ctx.strokeStyle = "rgba(210,189,128,.42)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, radius - 62, 0, Math.PI * 2);
  ctx.stroke();
  const glyphs = ["乾", "兑", "离", "震", "巽", "坎", "艮", "坤"];
  ctx.font = "34px 'STSong', 'Songti SC', serif";
  ctx.fillStyle = "rgba(210,189,128,.82)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  glyphs.forEach((g, i) => {
    const a = -Math.PI / 2 + (Math.PI * 2 * i) / glyphs.length;
    ctx.fillText(g, x + Math.cos(a) * (radius - 30), y + Math.sin(a) * (radius - 30));
  });
  ctx.restore();
}

function drawOracleSlip(ctx, x, y, width, height) {
  ctx.fillStyle = "rgba(238,233,220,.9)";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "rgba(156,47,36,.58)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 14, y + 14, width - 28, height - 28);
  ctx.fillStyle = "rgba(156,47,36,.08)";
  ctx.fillRect(x, y, 34, height);
  ctx.fillRect(x + width - 34, y, 34, height);
}

function drawPosterPanel(ctx, x, y, width, height) {
  ctx.fillStyle = "rgba(16,20,18,.34)";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "rgba(210,189,128,.32)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
}

function drawHexLines(ctx, lines, x, y, width, gap, bottomUp = false) {
  const source = bottomUp ? [...lines].reverse() : lines;
  const lineHeight = 24;
  source.forEach((line, i) => {
    const yy = y + i * (lineHeight + gap);
    ctx.fillStyle = line.moving ? "#d2bd80" : "#efe9dc";
    if (line.type === "yang") {
      ctx.fillRect(x, yy, width, lineHeight);
    } else {
      ctx.fillRect(x, yy, width * 0.42, lineHeight);
      ctx.fillRect(x + width * 0.58, yy, width * 0.42, lineHeight);
    }
  });
}

function drawPosterText(ctx, text, x, y, size, color, weight = "400", align = "left", font = "Inter, system-ui, sans-serif") {
  ctx.save();
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawWrappedText(ctx, text, x, y, maxWidth, size, lineHeight, color, font = "Inter, system-ui, sans-serif") {
  ctx.save();
  ctx.font = `400 ${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  const chars = String(text).split("");
  let line = "";
  let yy = y;
  chars.forEach((char) => {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = char;
      yy += lineHeight;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line, x, yy);
  ctx.restore();
}

function drawVerticalText(ctx, text, x, y, size, color) {
  ctx.save();
  ctx.font = `500 ${size}px 'STSong', 'Songti SC', serif`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  Array.from(text).forEach((char, index) => {
    ctx.fillText(char, x, y + index * size * 1.28);
  });
  ctx.restore();
}

function idFromLines(lines) {
  const bits = lines.map((line) => (line.type === "yang" ? 1 : 0)).join("");
  let total = 0;
  for (let i = 0; i < bits.length; i++) total += bits[i] === "1" ? 2 ** i : 0;
  return (total % 64) + 1;
}

function birthPattern(date, time) {
  if (!date) return "Unknown";
  const year = Number(date.slice(0, 4));
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const yearPillar = stems[(year - 4) % 10] + branches[(year - 4) % 12];
  return `Year Pillar: ${yearPillar}. Month and day pillars are prototype placeholders. Time pillar: ${time ? "provided" : "未知"}.`;
}

function recommendProducts(tags) {
  return [...state.products].sort((a, b) => score(b, tags) - score(a, tags));
}

function score(product, tags) {
  return product.tags.filter((tag) => tags.includes(tag)).length;
}

function updateEstimateBox() {
  const { params } = route();
  const p = state.products.find((product) => product.id === params.id) || state.products[0];
  const kaiGuang = document.getElementById("kgService")?.checked || false;
  const recorded = document.getElementById("recService")?.checked || false;
  const box = document.getElementById("estimateBox");
  if (box) box.innerHTML = estimateHtml(p, kaiGuang, recorded);
}

function addCart(productId) {
  const p = state.products.find((product) => product.id === productId);
  const kaiGuang = document.getElementById("kgService")?.checked || false;
  const recorded = document.getElementById("recService")?.checked || false;
  let total = p.price;
  let days = 8;
  if (kaiGuang) {
    total += p.kaiGuangPrice;
    days += p.kaiGuangDays + 3;
  }
  if (recorded) {
    total += p.recordPrice;
    days += p.recordDays + 2;
  }
  state.cart.push({ productId, kaiGuang, recorded, total, days });
  save();
  nav("/cart");
}

function submitCheckout(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  if (!state.user) {
    state.user = { id: `u-${Date.now()}`, name: data.name, email: data.email };
    state.users.push(state.user);
  }
  const orderId = `O-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(state.orders.length + 1).padStart(4, "0")}`;
  const items = state.cart.map((item) => {
    const p = state.products.find((product) => product.id === item.productId);
    const daoYinId = assignDaoId(p, item, orderId);
    return { ...item, daoYinId };
  });
  const total = state.cart.reduce((sum, item) => sum + item.total, 0);
  const order = {
    id: orderId,
    userId: state.user.id,
    userName: state.user.name,
    status: items.some((item) => item.kaiGuang) ? "Consecration Pending" : "Paid",
    total,
    items,
    createdAt: new Date().toISOString()
  };
  state.orders.push(order);
  state.cart = [];
  save();
  nav(`/order?id=${order.id}`);
}

function assignDaoId(product, item, orderId) {
  let record = state.daoIds.find((id) => id.sku === product.sku && id.status === "Available");
  if (!record) {
    record = {
      id: nextDaoId(product),
      sku: product.sku,
      category: product.category,
      status: "Available",
      order: ""
    };
    state.daoIds.push(record);
  }
  record.status = item.kaiGuang ? "Consecration Pending" : "Sold";
  record.order = orderId;
  return record.id;
}

function nextDaoId(product) {
  const cls = product.sku.split("-")[0];
  const count = state.daoIds.filter((id) => id.sku === product.sku).length + 1;
  return `DY-2026-${cls}-${String(count).padStart(5, "0")}`;
}

function submitLogin(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const existing = state.users.find((u) => u.email === data.email);
  state.user = existing || { id: `u-${Date.now()}`, name: data.name, email: data.email };
  if (!existing) state.users.push(state.user);
  save();
  render();
}

function submitProduct(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  state.products.push({
    id: `p-${Date.now()}`,
    sku: data.sku,
    category: "Objects / 摆件",
    name: data.name,
    price: Number(data.price),
    material: "Prototype material",
    origin: "China",
    kind: "物",
    kaiGuangAvailable: true,
    kaiGuangPrice: 48,
    kaiGuangDays: 9,
    recordAvailable: true,
    recordPrice: 88,
    recordDays: 5,
    tags: ["ritual", "grounding"]
  });
  save();
  render();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

render();
