// app.js v2 — adds: model calendar, model photo cards, editable categories,
// drag-to-reschedule, sub-tabs, import/export

// ============================================================
// Default categories (editable now)
// ============================================================
const DEFAULT_CATEGORIES = [
  { key: 'prep',    name: '筹备',     color: '#BA7517' },
  { key: 'kb',      name: '专业口播',  color: '#185FA5' },
  { key: 'mm',      name: '美美展示',  color: '#534AB7' },
  { key: 'cs',      name: '客户见证',  color: '#0F6E56' },
  { key: 'publish', name: '发布',     color: '#D85A30' },
];

const COLOR_SWATCHES = [
  '#D85A30','#993C1D','#BA7517','#0F6E56','#5DCAA5',
  '#185FA5','#3B9DD9','#534AB7','#7C70E0','#A32D2D',
  '#888780','#1A1A1A'
];

const defaultData = {
  categories: DEFAULT_CATEGORIES.map(c => ({ ...c })),
  targets: [
    { id: 't1', type: 'kb', label: '专业口播', weekly: 2, monthly: 8, location: '院内', purpose: '展示专业度 + 干货输出' },
    { id: 't2', type: 'mm', label: '美美展示', weekly: 2, monthly: 8, location: '院内 + 外景', purpose: '颜值展示 · 前丑后帅变装' },
    { id: 't3', type: 'cs', label: '客户见证', weekly: 3, monthly: 12, location: '院内', purpose: '案例验证 · 转化主力' }
  ],
  milestones: [
    { id: 'm1', title: '6月1日 · 整月对标全部到位 (定板群)', desc: '所有美美展示与客户见证的对标视频需在5月底完成收集并发至定板群确认' },
    { id: 'm2', title: '6月第1周 · 第一批客户见证拍摄启动', desc: '4条客户见证脚本与模特同步到位' },
    { id: 'm3', title: '6月15日 · 上半月复盘', desc: '统计已发布数据，调整下半月方向' },
    { id: 'm4', title: '6月30日 · 全月完结 + 7月预排', desc: '完成全月30条产出 + 7月初稿' }
  ],
  overviewNotes: '— 客户见证为本月主力，所有筹备工作提前 3-7 天闭环；\n— 美美展示一天拍 3-7 条，先变装前再统一拍变装后；\n— 严格按对标拍摄，不拍海量无关素材；\n— 每周日晚提前定好下周对标并发到定板群。',
  modelSop: [
    { id: 's1', title: '提前 3-7 天预定', body: '下一个拍摄日的模特需提前 3-7 天确认档期' },
    { id: 's2', title: '预沟通与熟悉', body: '拍摄前与模特进行一轮远程沟通' },
    { id: 's3', title: '脚本提前到位', body: '脚本提前一天发给模特让其有时间消化' },
    { id: 's4', title: '当日严格按画面拍', body: '按对标分镜逐条拍摄，不临场起意' }
  ],
  workflows: {
    kb: [
      { id: 'wkb1', title: '选题对标', body: '从 388 条口播脚本库筛选本周主题', checklist: [
        { text: '从脚本库选定 2 条作为本周主题', done: false },
        { text: '对标视频发至定板群', done: false },
        { text: '完成口播分镜与提词', done: false }
      ]},
      { id: 'wkb2', title: '拍摄准备', body: '辉总 IP · 院内固定机位 · 一镜到底', checklist: [
        { text: '确认拍摄日', done: false },
        { text: '提词器到位', done: false },
        { text: '服装妆造与背景统一', done: false }
      ]},
      { id: 'wkb3', title: '拍摄日 · 一次 2 条', body: '节省机位与时间', checklist: [
        { text: '辉总到场前 30 分钟妆造完成', done: false },
        { text: '现场顺一遍逐字稿', done: false },
        { text: '拍完立即回看素材', done: false }
      ]},
      { id: 'wkb4', title: '后期与发布', body: '24 小时内交初剪 · 当周发布', checklist: [
        { text: '初剪 24h 内交付', done: false },
        { text: '审核 + 包装(封面/标题)', done: false },
        { text: '按发布日历投放', done: false }
      ]}
    ],
    mm: [
      { id: 'wmm1', title: '【前置 · 必做】找好对标 + 发定板群', body: '没有对标不开拍', checklist: [
        { text: '从竞品账号筛选当周对标 3-5 条', done: false },
        { text: '统一发至定板群确认', done: false },
        { text: '注明画面/情绪/转场亮点', done: false }
      ]},
      { id: 'wmm2', title: '【前置 · 必做】定好拍摄人员与编导匹配时间', body: '四方档期统一确认', checklist: [
        { text: '编导确认对标', done: false },
        { text: '摄影/灯光档期锁定', done: false },
        { text: '妆造师档期锁定', done: false },
        { text: '辉总本人档期锁定', done: false }
      ]},
      { id: 'wmm3', title: '拍摄前 · 4 大要素确认', body: '场景 / 衣服妆造 / 时间 / 地点', checklist: [
        { text: '场景 (院内某区域 or 外景)', done: false },
        { text: '衣服与妆造 (前 + 后两套)', done: false },
        { text: '时间 (妆造起 → 拍摄起)', done: false },
        { text: '地点具体位置', done: false }
      ]},
      { id: 'wmm4', title: '拍摄日 · 一天 3-7 条节奏', body: '先统一拍变装前再拍变装后', checklist: [
        { text: '妆造预留 60-90 分钟', done: false },
        { text: '先拍完所有"变装前"', done: false },
        { text: '换装一次性拍完所有"变装后"', done: false },
        { text: '每条收工立即标注用途', done: false }
      ]},
      { id: 'wmm5', title: '后期与发布', body: '转场剪辑 · 注意卡点节奏', checklist: [
        { text: '剪辑师 48h 内交初剪', done: false },
        { text: '确认转场卡点节奏', done: false },
        { text: '按发布日历分批投放', done: false }
      ]}
    ],
    cs: [
      { id: 'wcs1', title: '【前置 · 必做】找好对标并明确产出', body: '一次拍摄前明确产出几条视频', checklist: [
        { text: '明确产出视频数量 (例:4条)', done: false },
        { text: '每条对应一个对标视频', done: false },
        { text: '依对标写好脚本与画面分镜', done: false }
      ]},
      { id: 'wcs2', title: '【前置 · 必做】模特预约与沟通', body: '提前 3-7 天 + 一轮预沟通', checklist: [
        { text: '提前 3-7 天定好模特', done: false },
        { text: '一轮预沟通', done: false },
        { text: '脚本提前一天发给模特', done: false }
      ]},
      { id: 'wcs3', title: '拍摄日 · 高效采集', body: '只拍对标相关 · 不海量乱拍', checklist: [
        { text: '只采集对标相关素材', done: false },
        { text: '抓关键点 · 不临场加戏', done: false },
        { text: '按预设画面严格拍摄', done: false },
        { text: '每条素材当场确认够剪', done: false }
      ]},
      { id: 'wcs4', title: '后期与发布', body: '注意合规 · 不出现疗效承诺', checklist: [
        { text: '剪辑师 48h 内交初剪', done: false },
        { text: '医疗合规审核', done: false },
        { text: '客户本人确认授权', done: false },
        { text: '一周 3 条均匀投放', done: false }
      ]}
    ]
  },
  events: [],
  modelBookings: [], // { id, modelId, date, purpose, status, notes }
  modelPool: [],     // { id, name, photo, fields: [{key, value}] }
  teamMembers: [],   // { id, name, role, color, photo, fields: [{key, value}] }
  teamSchedule: [],  // { id, memberId, date, status: 'rest'|'leave', notes }
  doctors: [],       // { id, name }
  clinicEvents: [],  // { id, date, title, timeRange, room, notes }
  clinicDoctorDays: [], // { id, date, doctorId }
  perfTags: ['夯爆了', '人上人', 'NPC', '拉完了'],
  goalKeys: ['待拍摄数量','待拍摄场次','已拍摄素材','已拍摄待剪','已完成剪辑','待发布存片','已发布条数'],
  videos: [],        // { id, title, cover, publishDate, predictTag, actualTag, rating, platforms:[{name,collect,comment,like,kezi,url}], fields:[{key,value}] }
  monthGoals: {},    // { 'kb': {待拍摄数:0,...}, 'mm': {...}, 'cs': {...} }
  teamIssues: [],    // { id, problem, solution, resolved, optimize }
  view: { tab: 'overview', calView: 'month', year: 2026, month: 5, mmYear: 2026, mmMonth: 5, teamYear: 2026, teamMonth: 5, clinicYear: 2026, clinicMonth: 5, pubYear: 2026, pubMonth: 5, wfTab: 'all', reviewTab: 'all' }
};

function uid() { return 'e' + Date.now() + Math.floor(Math.random() * 1000); }

function generateSeedEvents() {
  const ev = [];
  ev.push({ id: uid(), date: '2026-05-26', type: 'prep', title: '6月对标筛选 · 美美展示批次1', time: '全天', location: '线上', owner: '编导组', notes: '挑选 3-5 条对标发定板群', feishu: '' });
  ev.push({ id: uid(), date: '2026-05-27', type: 'prep', title: '6月对标筛选 · 客户见证批次1', time: '全天', location: '线上', owner: '编导组', notes: '挑选 4 条对标 + 脚本撰写', feishu: '' });
  ev.push({ id: uid(), date: '2026-05-28', type: 'prep', title: '模特预约 · 6月第1周客户见证', time: '上午', location: '线上', owner: 'MCN运营', notes: '提前 3-7 天定模特', feishu: '' });
  ev.push({ id: uid(), date: '2026-05-29', type: 'prep', title: '6月口播脚本 · 第1-2条', time: '全天', location: '线上', owner: '编导组', notes: '从388脚本库筛选+定稿', feishu: '' });
  ev.push({ id: uid(), date: '2026-05-30', type: 'prep', title: '档期统一确认 · 6月第1周', time: '下午', location: '诊所', owner: '辉总+编导+摄影+妆造', notes: '四方档期锁定', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-02', type: 'cs', title: '客户见证拍摄日 · 案例A (产出4条)', time: '09:00-17:00', location: '诊所', owner: '模特A', notes: '严格按对标分镜', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-03', type: 'mm', title: '美美展示拍摄日 · 院内场', time: '10:00-18:00', location: '诊所', owner: '辉总', notes: '先前再后 · 3-7条', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-04', type: 'kb', title: '口播拍摄 · 第1-2条', time: '14:00-17:00', location: '诊所', owner: '辉总', notes: '抗衰 + 玻尿酸误区', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-05', type: 'publish', title: '发布 · 口播#1', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-06', type: 'publish', title: '发布 · 客户见证#1', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-07', type: 'publish', title: '发布 · 美美展示#1', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-09', type: 'cs', title: '客户见证拍摄日 · 案例B', time: '09:00-17:00', location: '诊所', owner: '模特B', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-10', type: 'mm', title: '美美展示拍摄日 · 外景场', time: '10:00-18:00', location: '外景棚', owner: '辉总', notes: '换场景调性', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-11', type: 'kb', title: '口播拍摄 · 第3-4条', time: '14:00-17:00', location: '诊所', owner: '辉总', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-16', type: 'cs', title: '客户见证拍摄日 · 案例C', time: '09:00-17:00', location: '诊所', owner: '模特C', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-17', type: 'mm', title: '美美展示拍摄日 · 院内场', time: '10:00-18:00', location: '诊所', owner: '辉总', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-18', type: 'kb', title: '口播拍摄 · 第5-6条', time: '14:00-17:00', location: '诊所', owner: '辉总', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-23', type: 'cs', title: '客户见证拍摄日 · 案例D', time: '09:00-17:00', location: '诊所', owner: '模特D', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-24', type: 'mm', title: '美美展示拍摄日 · 外景场', time: '10:00-18:00', location: '外景棚', owner: '辉总', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-25', type: 'kb', title: '口播拍摄 · 第7-8条', time: '14:00-17:00', location: '诊所', owner: '辉总', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-30', type: 'prep', title: '全月复盘 + 7月排期初稿', time: '全天', location: '诊所', owner: '全员', notes: '', feishu: '' });
  return ev;
}

// ============================================================
// State + sync
// ============================================================
let data = null;
let saveTimer = null;
let isDirty = false;
let pushInFlight = false;
let pushQueued = false;

function setSyncStatus(text, cls) {
  const el = document.getElementById('syncStatus');
  if (el) { el.textContent = text; el.className = 'sync-status ' + (cls || ''); }
}

function mergeData(loaded) {
  const merged = Object.assign({}, defaultData, loaded);
  // Ensure required arrays exist
  if (!Array.isArray(merged.categories) || !merged.categories.length) {
    merged.categories = DEFAULT_CATEGORIES.map(c => ({...c}));
  }
  if (!Array.isArray(merged.modelSop)) merged.modelSop = defaultData.modelSop.map(s => ({...s}));
  if (!Array.isArray(merged.modelBookings)) merged.modelBookings = [];
  if (!Array.isArray(merged.modelPool)) merged.modelPool = [];
  // Migrate old modelPool format (had title/body) to new (name/fields)
  merged.modelPool = merged.modelPool.map(m => {
    if (m.fields) return m; // already new format
    return {
      id: m.id || uid(),
      name: m.title || m.name || '未命名',
      photo: '',
      fields: [
        { key: '负责联系人', value: '' },
        { key: '蹭到的热点明星', value: '' },
        { key: '预计拍摄时长', value: '' },
        { key: '身高', value: '' },
        { key: '备注', value: m.body || '' }
      ]
    };
  });
  if (!Array.isArray(merged.teamMembers)) merged.teamMembers = [];
  if (!merged.teamMembers.length) {
    // First-time seed with default project crew
    merged.teamMembers = [
      { id: uid(), name: '辉总', role: 'IP', color: '#D85A30', photo: '', fields: [
        { key: '岗位', value: 'IP / 出镜' },
        { key: '联系方式', value: '' },
        { key: '备注', value: '' }
      ]},
      { id: uid(), name: '金水', role: '编导', color: '#185FA5', photo: '', fields: [
        { key: '岗位', value: '编导' },
        { key: '联系方式', value: '' },
        { key: '备注', value: '' }
      ]},
      { id: uid(), name: '唐唐', role: '剪辑', color: '#0F6E56', photo: '', fields: [
        { key: '岗位', value: '剪辑' },
        { key: '联系方式', value: '' },
        { key: '备注', value: '' }
      ]},
      { id: uid(), name: '刘鹤', role: '拍剪', color: '#534AB7', photo: '', fields: [
        { key: '岗位', value: '拍剪' },
        { key: '联系方式', value: '' },
        { key: '备注', value: '' }
      ]},
    ];
  }
  if (!Array.isArray(merged.teamSchedule)) merged.teamSchedule = [];
  if (!Array.isArray(merged.doctors)) merged.doctors = [
    { id: uid(), name: '时院长' }
  ];
  if (!Array.isArray(merged.clinicEvents)) merged.clinicEvents = [];
  if (!Array.isArray(merged.clinicDoctorDays)) merged.clinicDoctorDays = [];
  if (!Array.isArray(merged.perfTags) || !merged.perfTags.length) merged.perfTags = ['夯爆了', '人上人', 'NPC', '拉完了'];
  if (!Array.isArray(merged.videos)) merged.videos = [];
  merged.videos.forEach(v => {
    if (v.adInvested === undefined) v.adInvested = false;
    if (v.adAmount === undefined) v.adAmount = '';
    if (!Array.isArray(v.platforms)) v.platforms = [];
    if (!Array.isArray(v.fields)) v.fields = [];
  });
  if (!merged.monthGoals || typeof merged.monthGoals !== 'object') merged.monthGoals = {};
  if (!Array.isArray(merged.goalKeys) || !merged.goalKeys.length) {
    merged.goalKeys = ['待拍摄数量','待拍摄场次','已拍摄素材','已拍摄待剪','已完成剪辑','待发布存片','已发布条数'];
  }
  ['kb','mm','cs'].forEach(k => {
    if (!merged.monthGoals[k]) merged.monthGoals[k] = {};
  });
  if (!Array.isArray(merged.teamIssues)) merged.teamIssues = [];
  if (!merged.view) merged.view = { ...defaultData.view };
  if (merged.view.mmYear == null) merged.view.mmYear = merged.view.year || 2026;
  if (merged.view.mmMonth == null) merged.view.mmMonth = merged.view.month || 5;
  if (merged.view.teamYear == null) merged.view.teamYear = merged.view.year || 2026;
  if (merged.view.teamMonth == null) merged.view.teamMonth = merged.view.month || 5;
  if (merged.view.clinicYear == null) merged.view.clinicYear = merged.view.year || 2026;
  if (merged.view.clinicMonth == null) merged.view.clinicMonth = merged.view.month || 5;
  if (merged.view.pubYear == null) merged.view.pubYear = merged.view.year || 2026;
  if (merged.view.pubMonth == null) merged.view.pubMonth = merged.view.month || 5;
  if (!merged.view.reviewTab) merged.view.reviewTab = 'all';
  if (!merged.view.collapsed) merged.view.collapsed = {};
  if (!merged.view.issueFilter) merged.view.issueFilter = 'all';
  if (!merged.view.wfTab) merged.view.wfTab = 'all';
  return merged;
}

async function loadData() {
  setSyncStatus('加载中…');
  try {
    const res = await fetch('/api/data', { credentials: 'include' });
    if (res.status === 401) { location.href = '/login.html'; return false; }
    const json = await res.json();

    // CASE 1: server returned an error (parse failure, corrupt file)
    if (json && json.error) {
      showFatalLoadError(`服务器加载数据失败：${json.error}<br><br>这通常是 plan.json 文件损坏导致。<br>请联系管理员从备份恢复，不要在此界面操作（任何编辑都不会保存）。`);
      return false;
    }

    // CASE 2: server returned data successfully
    if (json && json.data) {
      data = mergeData(json.data);
      lastSaveOkTs = json.updated_at || Date.now();
      setSyncStatus('已同步', 'saved');
      return true;
    }

    // CASE 3: server returned {data: null} (truly empty file, no data ever saved)
    // This is the DANGEROUS case. We must NEVER auto-seed and save here
    // unless we can prove this is a genuine first-run.
    // Strategy: ask user explicitly.
    const isGenuineFirstRun = await confirmGenuineFirstRun();
    if (isGenuineFirstRun) {
      data = mergeData(defaultData);
      data.events = generateSeedEvents();
      await pushData();
      setSyncStatus('已同步', 'saved');
      return true;
    } else {
      showFatalLoadError('已暂停以保护你的数据。如果你确实是第一次使用，请刷新页面并选择"是，初始化"。否则请联系管理员从备份恢复。');
      return false;
    }
  } catch (e) {
    // Network failure or unexpected error. DO NOT seed here either.
    showFatalLoadError(`无法加载数据：${e.message}<br><br>请检查网络后刷新页面。<br>本次会话不会做任何修改，你之前的数据是安全的。`);
    return false;
  }
}

// Show a blocking, full-screen error that prevents any editing
function showFatalLoadError(htmlMsg) {
  setSyncStatus('加载失败 · 已暂停', 'error');
  const overlay = document.createElement('div');
  overlay.id = 'fatal-load-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(20,18,15,0.96);
    z-index: 99999; display: flex; align-items: center; justify-content: center;
    padding: 40px;
  `;
  overlay.innerHTML = `
    <div style="max-width: 540px; background: white; border-radius: 14px; padding: 32px 36px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
      <div style="font-size: 20px; font-weight: 600; color: #A32D2D; margin-bottom: 12px;">⚠️ 数据加载已暂停</div>
      <div style="color: #5F5E5A; font-size: 14px; line-height: 1.7; margin-bottom: 24px;">${htmlMsg}</div>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button id="fatal-retry" style="padding: 9px 18px; background: #D85A30; color: white; border: none; border-radius: 8px; font-size: 13px; cursor: pointer;">重新加载</button>
        <button id="fatal-logout" style="padding: 9px 18px; background: white; color: #1A1A1A; border: 1px solid rgba(0,0,0,0.2); border-radius: 8px; font-size: 13px; cursor: pointer;">退出登录</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('fatal-retry').onclick = () => location.reload();
  document.getElementById('fatal-logout').onclick = () => { fetch('/api/logout',{method:'POST',credentials:'include'}).then(()=>location.href='/login.html'); };
}

// Ask the user point-blank: is this really first run?
function confirmGenuineFirstRun() {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(20,18,15,0.96);
      z-index: 99999; display: flex; align-items: center; justify-content: center;
      padding: 40px;
    `;
    overlay.innerHTML = `
      <div style="max-width: 560px; background: white; border-radius: 14px; padding: 32px 36px;">
        <div style="font-size: 18px; font-weight: 600; color: #1A1A1A; margin-bottom: 12px;">系统未检测到任何数据</div>
        <div style="color: #5F5E5A; font-size: 14px; line-height: 1.7; margin-bottom: 8px;">
          服务器报告 plan.json 为空。这通常发生在：
        </div>
        <ul style="color: #5F5E5A; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
          <li>✅ 系统首次启动（正常）</li>
          <li>⚠️ Volume 没挂载好（异常）</li>
          <li>⚠️ 数据被意外清空（严重）</li>
        </ul>
        <div style="background: #FAECE7; color: #993C1D; padding: 12px 14px; border-radius: 8px; font-size: 13px; line-height: 1.6; margin-bottom: 18px;">
          <strong>如果你以前在这里录入过数据</strong>，点"暂停"并联系管理员检查 Volume 和备份。点"初始化"会用默认种子数据覆盖现状。
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button id="fr-init" style="padding: 9px 18px; background: #D85A30; color: white; border: none; border-radius: 8px; font-size: 13px; cursor: pointer;">是，初始化（确认首次使用）</button>
          <button id="fr-pause" style="padding: 9px 18px; background: white; color: #1A1A1A; border: 1px solid rgba(0,0,0,0.2); border-radius: 8px; font-size: 13px; cursor: pointer;">暂停（保护现有数据）</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('fr-init').onclick = () => { overlay.remove(); resolve(true); };
    document.getElementById('fr-pause').onclick = () => { overlay.remove(); resolve(false); };
  });
}

async function pushData() {
  if (!data) return;
  // Serialize: if a push is already in flight, queue another after it
  if (pushInFlight) { pushQueued = true; return; }
  pushInFlight = true;
  setSyncStatus('保存中…', 'saving');
  const payload = JSON.stringify(data);
  let success = false;
  for (let attempt = 0; attempt < 3 && !success; attempt++) {
    try {
      const res = await fetch('/api/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: payload
      });
      if (res.status === 401) { location.href = '/login.html'; return; }
      const json = await res.json();
      if (json.ok) {
        success = true;
        isDirty = false;
        lastSaveOkTs = json.updated_at || Date.now();
        setSyncStatus('已同步', 'saved');
      } else {
        await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  if (!success) setSyncStatus('保存失败 · 改动仍在本地', 'error');
  pushInFlight = false;
  // If something changed while we were saving, push again
  if (pushQueued) { pushQueued = false; pushData(); }
}

function markDirty() {
  isDirty = true;
  lastLocalEditTs = Date.now();
  setSyncStatus('保存中…', 'saving');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const notesEl = document.getElementById('overview-notes');
    if (notesEl) data.overviewNotes = notesEl.innerText;
    pushData();
  }, 800);
}

async function logout() {
  await fetch('/api/logout', { method: 'POST', credentials: 'include' });
  location.href = '/login.html';
}

// ============================================================
// Helpers
// ============================================================
function esc(s) { if (s == null) return ''; return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function formatDate(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function truncate(s, n) { if (!s) return ''; return s.length > n ? s.slice(0, n) + '…' : s; }
function findCategory(key) { return data.categories.find(c => c.key === key) || { key, name: key, color: '#888' }; }

// ============================================================
// Tabs
// ============================================================
document.querySelectorAll('.tabs:not(.sub-tabs) > .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    if (typeof rangeMode !== 'undefined' && rangeMode.active) exitRangeMode();
    document.querySelectorAll('.tabs:not(.sub-tabs) > .tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + name));
    data.view.tab = name;
    markDirty();
    if (name === 'calendar') renderCalendarOrGantt();
    if (name === 'models') renderModelsPanel();
    if (name === 'team') renderTeamPanel();
    if (name === 'clinic') renderClinicPanel();
    if (name === 'review') renderReviewPanel();
  });
});

document.querySelectorAll('#workflow-tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const which = tab.dataset.wftab;
    document.querySelectorAll('#workflow-tabs .tab').forEach(t => t.classList.toggle('active', t === tab));
    data.view.wfTab = which;
    applyWorkflowTab();
    markDirty();
  });
});

function applyWorkflowTab() {
  const which = data.view.wfTab || 'all';
  document.querySelectorAll('[data-wf-section]').forEach(sec => {
    const cat = sec.dataset.wfSection;
    sec.style.display = (which === 'all' || which === cat) ? '' : 'none';
  });
}

// ============================================================
// Summary / Targets / Milestones / Notes
// ============================================================
function renderSummary() {
  const totalShoot = data.events.filter(e => ['kb','mm','cs'].includes(e.type)).length;
  const totalPublish = data.events.filter(e => e.type === 'publish').length;
  const totalPrep = data.events.filter(e => e.type === 'prep').length;
  const weeklyTotal = data.targets.reduce((s, t) => s + (t.weekly || 0), 0);
  const monthlyTotal = data.targets.reduce((s, t) => s + (t.monthly || 0), 0);
  document.getElementById('summary-grid').innerHTML = `
    <div class="stat"><div class="label">周更目标</div><div class="value">${weeklyTotal} 条</div><div class="meta">客户见证 ${data.targets.find(t=>t.type==='cs')?.weekly||0} · 美美 ${data.targets.find(t=>t.type==='mm')?.weekly||0} · 口播 ${data.targets.find(t=>t.type==='kb')?.weekly||0}</div></div>
    <div class="stat"><div class="label">月度目标</div><div class="value">${monthlyTotal} 条</div><div class="meta">达成日更节奏</div></div>
    <div class="stat"><div class="label">已排拍摄</div><div class="value">${totalShoot}</div><div class="meta">${totalPrep} 个筹备日</div></div>
    <div class="stat"><div class="label">已排发布</div><div class="value">${totalPublish}</div><div class="meta">日历可查具体日期</div></div>
  `;
}

function renderTargets() {
  const el = document.getElementById('target-grid');
  el.innerHTML = data.targets.map((t, i) => `
    <div class="module">
      <div class="module-head">
        <div class="module-title"><span class="pill ${t.type === 'kb' ? 'pill-kb' : t.type === 'mm' ? 'pill-mm' : 'pill-cs'}">${esc(t.label)}</span></div>
      </div>
      <div style="margin-top:8px;">
        <div class="info-line"><span class="k">周产出</span><span class="v" contenteditable="true" data-target="weekly" data-idx="${i}">${t.weekly}</span></div>
        <div class="info-line"><span class="k">月产出</span><span class="v" contenteditable="true" data-target="monthly" data-idx="${i}">${t.monthly}</span></div>
        <div class="info-line"><span class="k">拍摄地</span><span class="v" contenteditable="true" data-target="location" data-idx="${i}">${esc(t.location)}</span></div>
        <div class="info-line"><span class="k">目的</span><span class="v" contenteditable="true" data-target="purpose" data-idx="${i}" style="text-align:right; max-width:60%;">${esc(t.purpose)}</span></div>
      </div>
    </div>`).join('');
  el.querySelectorAll('[contenteditable]').forEach(c => c.addEventListener('blur', () => {
    const idx = parseInt(c.dataset.idx);
    const field = c.dataset.target;
    let val = c.innerText.trim();
    if (field === 'weekly' || field === 'monthly') val = parseInt(val) || 0;
    data.targets[idx][field] = val;
    markDirty(); renderSummary();
  }));
}

function renderMilestones() {
  const el = document.getElementById('milestone-list');
  el.innerHTML = data.milestones.map((m, i) => `
    <div class="module">
      <div class="module-head">
        <div class="module-title" contenteditable="true" data-ms="title" data-idx="${i}">${esc(m.title)}</div>
        <div class="module-actions"><button class="btn btn-sm btn-ghost btn-danger" onclick="deleteMilestone(${i})">×</button></div>
      </div>
      <div class="module-body" contenteditable="true" data-ms="desc" data-idx="${i}">${esc(m.desc)}</div>
    </div>`).join('');
  el.querySelectorAll('[contenteditable]').forEach(c => c.addEventListener('blur', () => {
    data.milestones[parseInt(c.dataset.idx)][c.dataset.ms] = c.innerText.trim();
    markDirty();
  }));
}
function addMilestone() { data.milestones.push({ id: uid(), title: '新里程碑', desc: '点击编辑详情…' }); markDirty(); renderMilestones(); }
function deleteMilestone(i) { if (!confirm('删除？')) return; data.milestones.splice(i, 1); markDirty(); renderMilestones(); }

function renderOverviewNotes() { document.getElementById('overview-notes').innerText = data.overviewNotes || ''; }

// ============================================================
// Workflows (with sub-tab support)
// ============================================================
function renderWorkflow(category) {
  const el = document.getElementById('workflow-' + category);
  const items = data.workflows[category] || [];
  if (!items.length) { el.innerHTML = '<div class="empty">还没有要点</div>'; return; }
  el.innerHTML = items.map((it, i) => `
    <div class="module">
      <div class="module-head">
        <div class="module-title" contenteditable="true" data-wf-cat="${category}" data-wf-field="title" data-idx="${i}">${esc(it.title)}</div>
        <div class="module-actions"><button class="btn btn-sm btn-ghost btn-danger" onclick="deleteWorkflow('${category}', ${i})">删除</button></div>
      </div>
      <div class="module-body" contenteditable="true" data-wf-cat="${category}" data-wf-field="body" data-idx="${i}">${esc(it.body)}</div>
      <ul class="checklist">${(it.checklist||[]).map((c, ci) => `
        <li>
          <input type="checkbox" ${c.done ? 'checked' : ''} onchange="toggleCheck('${category}', ${i}, ${ci}, this.checked)">
          <span class="ck-text ${c.done ? 'done' : ''}" contenteditable="true" data-wf-cat="${category}" data-wf-idx="${i}" data-ck-idx="${ci}">${esc(c.text)}</span>
          <button class="ck-del" onclick="deleteCheck('${category}', ${i}, ${ci})">×</button>
        </li>`).join('')}</ul>
      <div class="ck-add"><input type="text" placeholder="+ 新增 checklist 条目，回车添加" onkeydown="if(event.key==='Enter'){addCheck('${category}',${i},this.value); this.value='';}"></div>
    </div>`).join('');
  el.querySelectorAll('[contenteditable]').forEach(c => c.addEventListener('blur', () => {
    const cat = c.dataset.wfCat;
    if (c.dataset.wfField) {
      data.workflows[cat][parseInt(c.dataset.idx)][c.dataset.wfField] = c.innerText.trim();
    } else if (c.dataset.ckIdx !== undefined) {
      data.workflows[cat][parseInt(c.dataset.wfIdx)].checklist[parseInt(c.dataset.ckIdx)].text = c.innerText.trim();
    }
    markDirty();
  }));
}
function addWorkflowItem(cat) { data.workflows[cat].push({ id: uid(), title: '新要点', body: '点击编辑', checklist: [] }); markDirty(); renderWorkflow(cat); }
function deleteWorkflow(cat, i) { if (!confirm('删除？')) return; data.workflows[cat].splice(i, 1); markDirty(); renderWorkflow(cat); }
function toggleCheck(cat, i, ci, checked) { data.workflows[cat][i].checklist[ci].done = checked; markDirty(); renderWorkflow(cat); }
function addCheck(cat, i, text) { text = text.trim(); if (!text) return; data.workflows[cat][i].checklist.push({ text, done: false }); markDirty(); renderWorkflow(cat); }
function deleteCheck(cat, i, ci) { data.workflows[cat][i].checklist.splice(ci, 1); markDirty(); renderWorkflow(cat); }


// ============================================================
// Categories (editable legend)
// ============================================================
function renderCategoryLegend() {
  const el = document.getElementById('category-legend');
  el.innerHTML = data.categories.map(c =>
    `<span><span class="legend-dot" style="background:${c.color}"></span>${esc(c.name)}</span>`
  ).join('');
  // also refresh selects in modals
  ['m-type', 'e-type'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) {
      const current = sel.value;
      sel.innerHTML = data.categories.map(c => `<option value="${esc(c.key)}">${esc(c.name)}</option>`).join('');
      if (current) sel.value = current;
    }
  });
}

let openCatPicker = null;
function openCategoryEditor() {
  renderCategoryEditor();
  document.getElementById('cat-modal-bg').classList.add('show');
}
function closeCategoryEditor() {
  document.getElementById('cat-modal-bg').classList.remove('show');
  if (openCatPicker) openCatPicker.remove();
  openCatPicker = null;
}
function renderCategoryEditor() {
  const el = document.getElementById('cat-editor-list');
  el.innerHTML = data.categories.map((c, i) => `
    <div class="cat-row">
      <div class="cat-color" data-idx="${i}" style="background:${c.color}"></div>
      <input class="cat-name" data-idx="${i}" value="${esc(c.name)}">
      <span class="cat-key">${esc(c.key)}</span>
      <button class="btn btn-sm btn-ghost btn-danger" onclick="deleteCategory(${i})">×</button>
    </div>
  `).join('');
  el.querySelectorAll('.cat-name').forEach(input => {
    input.addEventListener('blur', () => {
      data.categories[parseInt(input.dataset.idx)].name = input.value.trim() || '未命名';
      markDirty(); renderCategoryLegend(); renderCalendarOrGantt();
    });
  });
  el.querySelectorAll('.cat-color').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      showColorPicker(dot, parseInt(dot.dataset.idx));
    });
  });
}
function showColorPicker(target, idx) {
  if (openCatPicker) openCatPicker.remove();
  const picker = document.createElement('div');
  picker.className = 'color-picker';
  picker.innerHTML = COLOR_SWATCHES.map(c => `<span class="swatch" data-c="${c}" style="background:${c}"></span>`).join('');
  document.body.appendChild(picker);
  const r = target.getBoundingClientRect();
  picker.style.left = (r.left) + 'px';
  picker.style.top = (r.bottom + 4 + window.scrollY) + 'px';
  picker.querySelectorAll('.swatch').forEach(s => {
    s.addEventListener('click', () => {
      data.categories[idx].color = s.dataset.c;
      markDirty();
      renderCategoryEditor();
      renderCategoryLegend();
      renderCalendarOrGantt();
      picker.remove();
      openCatPicker = null;
    });
  });
  openCatPicker = picker;
  setTimeout(() => {
    document.addEventListener('click', function onDoc() {
      if (openCatPicker) openCatPicker.remove();
      openCatPicker = null;
      document.removeEventListener('click', onDoc);
    }, { once: true });
  }, 0);
}
function addCategory() {
  const key = 'cat_' + Date.now().toString(36);
  data.categories.push({ key, name: '新分类', color: COLOR_SWATCHES[data.categories.length % COLOR_SWATCHES.length] });
  markDirty(); renderCategoryEditor(); renderCategoryLegend();
}
function deleteCategory(i) {
  const cat = data.categories[i];
  if (data.categories.length <= 1) { alert('至少保留一个分类'); return; }
  const used = data.events.filter(e => e.type === cat.key).length;
  const fallback = data.categories.find((c, ci) => ci !== i);
  const msg = used > 0
    ? `共有 ${used} 条事项属于「${cat.name}」，删除后这些事项将归到「${fallback.name}」分类。是否继续？`
    : `删除分类「${cat.name}」？`;
  if (!confirm(msg)) return;
  data.events.forEach(e => { if (e.type === cat.key) e.type = fallback.key; });
  data.categories.splice(i, 1);
  markDirty(); renderCategoryEditor(); renderCategoryLegend(); renderCalendarOrGantt();
}

// ============================================================
// Schedule calendar (with drag-to-reschedule)
// ============================================================
function renderCalendarOrGantt() {
  renderCategoryLegend();
  if (data.view.calView === 'month') renderCalendar();
  else renderGantt();
}

function renderCalendar() {
  document.getElementById('month-view').style.display = '';
  document.getElementById('gantt-view').style.display = 'none';
  const year = data.view.year, month = data.view.month;
  document.getElementById('month-label').textContent = `${year}年${month}月`;
  const first = new Date(year, month - 1, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = formatDate(new Date());
  const cal = document.getElementById('calendar');
  let html = ['日', '一', '二', '三', '四', '五', '六'].map(h => `<div class="cal-head">${h}</div>`).join('');
  const prevMonthDays = new Date(year, month - 1, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const pm = month === 1 ? 12 : month - 1;
    const py = month === 1 ? year - 1 : year;
    const dateStr = `${py}-${String(pm).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += `<div class="cal-day other" data-date="${dateStr}" onclick="openDayModal('${dateStr}')"><div class="day-num">${d}</div>${renderDayEvents(dateStr)}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += `<div class="cal-day ${dateStr === todayStr ? 'today' : ''}" data-date="${dateStr}" onclick="openDayModal('${dateStr}')"><div class="day-num">${d}</div>${renderDayEvents(dateStr)}</div>`;
  }
  const totalCells = startWeekday + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    const nm = month === 12 ? 1 : month + 1;
    const ny = month === 12 ? year + 1 : year;
    const dateStr = `${ny}-${String(nm).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
    html += `<div class="cal-day other" data-date="${dateStr}" onclick="openDayModal('${dateStr}')"><div class="day-num">${i}</div>${renderDayEvents(dateStr)}</div>`;
  }
  cal.innerHTML = html;
  attachCalendarDnD();
}
function renderDayEvents(dateStr) {
  const evs = data.events.filter(e => e.date === dateStr);
  if (!evs.length) return '<div class="cal-events"></div>';
  return '<div class="cal-events">' + evs.slice(0, 3).map(e => {
    const cat = findCategory(e.type);
    return `<div class="cal-event" draggable="true" data-event-id="${esc(e.id)}" style="background:${cat.color}" onclick="event.stopPropagation(); openEditModal('${e.id}')" title="${esc(e.title)}">${esc(e.title)}</div>`;
  }).join('') + (evs.length > 3 ? `<div style="font-size:10px; color:var(--text-3);">+${evs.length - 3} 更多</div>` : '') + '</div>';
}

function attachCalendarDnD() {
  let draggingId = null;
  document.querySelectorAll('#calendar .cal-event[draggable="true"]').forEach(el => {
    el.addEventListener('dragstart', e => {
      draggingId = el.dataset.eventId;
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', draggingId);
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      document.querySelectorAll('.cal-day.drag-over').forEach(d => d.classList.remove('drag-over'));
      draggingId = null;
    });
  });
  document.querySelectorAll('#calendar .cal-day').forEach(cell => {
    cell.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; cell.classList.add('drag-over'); });
    cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
    cell.addEventListener('drop', e => {
      e.preventDefault();
      cell.classList.remove('drag-over');
      const id = e.dataTransfer.getData('text/plain') || draggingId;
      const date = cell.dataset.date;
      if (!id || !date) return;
      const ev = data.events.find(x => x.id === id);
      if (ev && ev.date !== date) {
        ev.date = date;
        markDirty();
        renderCalendarOrGantt();
        renderSummary();
      }
    });
  });
}

function changeMonth(delta) {
  let m = data.view.month + delta, y = data.view.year;
  if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
  data.view.month = m; data.view.year = y;
  markDirty(); renderCalendarOrGantt();
}
function goToMonth(y, m) { data.view.year = y; data.view.month = m; markDirty(); renderCalendarOrGantt(); }
function switchView(v) {
  data.view.calView = v;
  document.querySelectorAll('.view-switch button').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  markDirty(); renderCalendarOrGantt();
}

function renderGantt() {
  document.getElementById('month-view').style.display = 'none';
  document.getElementById('gantt-view').style.display = '';
  const year = data.view.year, month = data.view.month;
  document.getElementById('month-label').textContent = `${year}年${month}月`;
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = formatDate(new Date());
  const dayWidth = 36, labelWidth = 220;
  const gantt = document.getElementById('gantt');
  let html = `<div class="gantt-header" style="grid-template-columns: ${labelWidth}px repeat(${daysInMonth}, ${dayWidth}px);"><div class="gantt-label-col">类型 / 日期</div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month - 1, d);
    const wd = dt.getDay();
    const wc = (wd === 0 || wd === 6) ? 'weekend' : '';
    const tc = (formatDate(dt) === todayStr) ? 'today' : '';
    html += `<div class="gantt-label-col ${wc} ${tc}" style="text-align:center; padding: 6px 0;">${d}</div>`;
  }
  html += `</div>`;
  for (const g of data.categories) {
    html += `<div class="gantt-row" style="grid-template-columns: ${labelWidth}px repeat(${daysInMonth}, ${dayWidth}px);">`;
    html += `<div class="gantt-label-col"><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${g.color}; margin-right:4px;"></span>${esc(g.name)}</div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month - 1, d);
      const wd = dt.getDay();
      const wc = (wd === 0 || wd === 6) ? 'weekend' : '';
      const tc = (formatDate(dt) === todayStr) ? 'today' : '';
      const dateStr = formatDate(dt);
      const cellEvs = data.events.filter(e => e.date === dateStr && e.type === g.key);
      const bars = cellEvs.map(e =>
        `<div class="gantt-bar" draggable="true" data-event-id="${esc(e.id)}" style="left:2px; right:2px; background:${g.color};" onclick="event.stopPropagation(); openEditModal('${e.id}')" title="${esc(e.title)}">${esc(truncate(e.title, 8))}</div>`
      ).join('');
      html += `<div class="gantt-track ${wc} ${tc}" data-date="${dateStr}" onclick="openDayModal('${dateStr}')">${bars}</div>`;
    }
    html += `</div>`;
  }
  gantt.innerHTML = html;
  attachGanttDnD();
}
function attachGanttDnD() {
  document.querySelectorAll('#gantt .gantt-bar').forEach(el => {
    el.addEventListener('dragstart', e => {
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', el.dataset.eventId);
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      document.querySelectorAll('.gantt-track.drag-over').forEach(d => d.classList.remove('drag-over'));
    });
  });
  document.querySelectorAll('#gantt .gantt-track').forEach(cell => {
    cell.addEventListener('dragover', e => { e.preventDefault(); cell.classList.add('drag-over'); });
    cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
    cell.addEventListener('drop', e => {
      e.preventDefault();
      cell.classList.remove('drag-over');
      const id = e.dataTransfer.getData('text/plain');
      const date = cell.dataset.date;
      const ev = data.events.find(x => x.id === id);
      if (ev && ev.date !== date) {
        ev.date = date;
        markDirty(); renderCalendarOrGantt(); renderSummary();
      }
    });
  });
}

// ============================================================
// Day modal (schedule events)
// ============================================================
let currentModalDate = null;
function openDayModal(dateStr) {
  currentModalDate = dateStr;
  document.getElementById('modal-title').textContent = `${dateStr} · 日程`;
  const evs = data.events.filter(e => e.date === dateStr);
  const evList = evs.length ? evs.map(e => {
    const cat = findCategory(e.type);
    return `
    <div class="event-row">
      <div class="event-row-left">
        <div class="ev-tag" style="background: ${cat.color};"></div>
        <div style="flex:1; min-width:0;">
          <div class="title">${esc(e.title)}</div>
          <div class="meta">${esc(e.time||'')} · ${esc(e.location||'')} · ${esc(e.owner||'')}</div>
          ${e.feishu ? `<a class="feishu-link" href="${esc(e.feishu)}" target="_blank">↗ 查看本次对标</a>` : ''}
        </div>
      </div>
      <div style="display:flex; gap:4px;">
        <button class="btn btn-sm" onclick="openEditModal('${e.id}'); closeModal();">编辑</button>
      </div>
    </div>`;
  }).join('') : '<div class="empty">这一天还没有安排</div>';
  document.getElementById('modal-day-events').innerHTML = '<div class="event-list">' + evList + '</div>';
  // Refresh type select
  const sel = document.getElementById('m-type');
  sel.innerHTML = data.categories.map(c => `<option value="${esc(c.key)}">${esc(c.name)}</option>`).join('');
  ['m-title','m-time','m-location','m-owner','m-feishu','m-notes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('modal-bg').classList.add('show');
}
function closeModal() { document.getElementById('modal-bg').classList.remove('show'); }
function saveNewEvent() {
  const title = document.getElementById('m-title').value.trim();
  if (!title) { alert('请填写标题'); return; }
  data.events.push({
    id: uid(), date: currentModalDate,
    type: document.getElementById('m-type').value,
    title,
    time: document.getElementById('m-time').value.trim(),
    location: document.getElementById('m-location').value.trim(),
    owner: document.getElementById('m-owner').value.trim(),
    feishu: document.getElementById('m-feishu').value.trim(),
    notes: document.getElementById('m-notes').value.trim()
  });
  markDirty(); closeModal(); renderCalendarOrGantt(); renderSummary();
}

let currentEditId = null;
function openEditModal(id) {
  const e = data.events.find(x => x.id === id);
  if (!e) return;
  currentEditId = id;
  const sel = document.getElementById('e-type');
  sel.innerHTML = data.categories.map(c => `<option value="${esc(c.key)}">${esc(c.name)}</option>`).join('');
  document.getElementById('e-id').value = id;
  document.getElementById('e-type').value = e.type;
  document.getElementById('e-date-input').value = e.date;
  document.getElementById('e-title').value = e.title;
  document.getElementById('e-time').value = e.time || '';
  document.getElementById('e-location').value = e.location || '';
  document.getElementById('e-owner').value = e.owner || '';
  document.getElementById('e-feishu').value = e.feishu || '';
  document.getElementById('e-notes').value = e.notes || '';
  document.getElementById('edit-modal-bg').classList.add('show');
}
function closeEditModal() { document.getElementById('edit-modal-bg').classList.remove('show'); }
function saveEditEvent() {
  const e = data.events.find(x => x.id === currentEditId);
  if (!e) return;
  e.type = document.getElementById('e-type').value;
  e.date = document.getElementById('e-date-input').value;
  e.title = document.getElementById('e-title').value.trim();
  e.time = document.getElementById('e-time').value.trim();
  e.location = document.getElementById('e-location').value.trim();
  e.owner = document.getElementById('e-owner').value.trim();
  e.feishu = document.getElementById('e-feishu').value.trim();
  e.notes = document.getElementById('e-notes').value.trim();
  markDirty(); closeEditModal(); renderCalendarOrGantt(); renderSummary();
}
function deleteEvent() {
  if (!confirm('删除？')) return;
  data.events = data.events.filter(x => x.id !== currentEditId);
  markDirty(); closeEditModal(); renderCalendarOrGantt(); renderSummary();
}


// ============================================================
// Model SOP (editable steps)
// ============================================================
function renderModelSop() {
  const el = document.getElementById('model-sop-list');
  el.innerHTML = data.modelSop.map((s, i) => `
    <div class="step">
      <button class="btn btn-sm btn-ghost btn-danger step-del" onclick="deleteModelSop(${i})">×</button>
      <div class="step-num">${i + 1}</div>
      <div class="step-title" contenteditable="true" data-sop="title" data-idx="${i}">${esc(s.title)}</div>
      <div class="step-body" contenteditable="true" data-sop="body" data-idx="${i}">${esc(s.body)}</div>
    </div>
  `).join('');
  el.querySelectorAll('[contenteditable]').forEach(c => c.addEventListener('blur', () => {
    data.modelSop[parseInt(c.dataset.idx)][c.dataset.sop] = c.innerText.trim();
    markDirty();
  }));
}
function addModelSop() {
  data.modelSop.push({ id: uid(), title: '新步骤', body: '点击编辑详情' });
  markDirty(); renderModelSop();
}
function deleteModelSop(i) {
  if (!confirm('删除该步骤？')) return;
  data.modelSop.splice(i, 1);
  markDirty(); renderModelSop();
}

// ============================================================
// Model calendar
// ============================================================
function renderModelCalendar() {
  const year = data.view.mmYear, month = data.view.mmMonth;
  document.getElementById('mm-month-label').textContent = `${year}年${month}月`;
  const first = new Date(year, month - 1, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = formatDate(new Date());
  const cal = document.getElementById('model-calendar');
  let html = ['日', '一', '二', '三', '四', '五', '六'].map(h => `<div class="cal-head">${h}</div>`).join('');
  const prevMonthDays = new Date(year, month - 1, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const pm = month === 1 ? 12 : month - 1;
    const py = month === 1 ? year - 1 : year;
    const dateStr = `${py}-${String(pm).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += renderMmDayCell(dateStr, d, true, false);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += renderMmDayCell(dateStr, d, false, dateStr === todayStr);
  }
  const totalCells = startWeekday + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    const nm = month === 12 ? 1 : month + 1;
    const ny = month === 12 ? year + 1 : year;
    const dateStr = `${ny}-${String(nm).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
    html += renderMmDayCell(dateStr, i, true, false);
  }
  cal.innerHTML = html;
}
function renderMmDayCell(dateStr, dayNum, isOther, isToday) {
  const bookings = data.modelBookings.filter(b => b.date === dateStr);
  let badge = '';
  if (bookings.length === 1) badge = '<div class="booking-dot"></div>';
  else if (bookings.length > 1) badge = `<div class="booking-count">${bookings.length}</div>`;
  const previews = bookings.slice(0, 2).map(b => {
    const m = data.modelPool.find(x => x.id === b.modelId);
    const name = m ? m.name : '已删除模特';
    return `<div class="cal-event" style="background: var(--accent);" onclick="event.stopPropagation(); openBookingAction('${b.id}')">${esc(name)}</div>`;
  }).join('');
  const more = bookings.length > 2 ? `<div style="font-size:10px; color:var(--text-3);">+${bookings.length - 2} 更多</div>` : '';
  return `
    <div class="cal-day ${isOther ? 'other' : ''} ${isToday ? 'today' : ''}" onclick="openMmDayModal('${dateStr}')">
      <div class="day-num">${dayNum}</div>
      <div class="cal-events">${previews}${more}</div>
      ${badge}
    </div>
  `;
}
function changeMmonth(delta) {
  let m = data.view.mmMonth + delta, y = data.view.mmYear;
  if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
  data.view.mmMonth = m; data.view.mmYear = y;
  markDirty(); renderModelCalendar();
}

// ============================================================
// Booking day modal
// ============================================================
let currentBookingDate = null;
function openMmDayModal(dateStr) {
  currentBookingDate = dateStr;
  document.getElementById('mm-day-title').textContent = `${dateStr} · 模特预约`;
  const bookings = data.modelBookings.filter(b => b.date === dateStr);
  let listHtml = '';
  if (!bookings.length) listHtml = '<div class="empty">这一天还没有预约</div>';
  else {
    listHtml = bookings.map(b => {
      const m = data.modelPool.find(x => x.id === b.modelId);
      const name = m ? m.name : '已删除模特';
      const photo = (m && m.photo) ? `style="background-image:url('${esc(m.photo)}'); background-size: cover; background-position: center;"` : '';
      return `
      <div class="event-row" onclick="openBookingAction('${b.id}')" style="cursor:pointer;">
        <div class="event-row-left">
          <div style="width:32px; height:32px; border-radius:50%; background:var(--surface-2); flex-shrink:0;" ${photo}></div>
          <div style="flex:1; min-width:0;">
            <div class="title">${esc(name)}</div>
            <div class="meta">${esc(b.purpose||'')} · ${esc(b.status||'')}</div>
          </div>
        </div>
        <div style="font-size:11px; color: var(--text-3);">点击 →</div>
      </div>`;
    }).join('');
  }
  document.getElementById('mm-day-bookings').innerHTML = '<div class="event-list">' + listHtml + '</div>';
  // refresh model select
  const sel = document.getElementById('mb-model-id');
  if (!data.modelPool.length) {
    sel.innerHTML = '<option value="">（请先在下方添加模特）</option>';
  } else {
    sel.innerHTML = data.modelPool.map(m => `<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');
  }
  document.getElementById('mb-purpose').value = '客户见证';
  document.getElementById('mb-status').value = '待确认';
  document.getElementById('mb-notes').value = '';
  document.getElementById('mm-day-modal-bg').classList.add('show');
}
function closeMmDayModal() { document.getElementById('mm-day-modal-bg').classList.remove('show'); }
function saveNewBooking() {
  const modelId = document.getElementById('mb-model-id').value;
  if (!modelId) { alert('请先添加模特到模特库'); return; }
  data.modelBookings.push({
    id: uid(),
    modelId,
    date: currentBookingDate,
    purpose: document.getElementById('mb-purpose').value,
    status: document.getElementById('mb-status').value,
    notes: document.getElementById('mb-notes').value.trim()
  });
  markDirty(); closeMmDayModal(); renderModelCalendar();
}

// ============================================================
// Booking action chooser (jump vs inline)
// ============================================================
let currentBookingId = null;
function openBookingAction(bookingId) {
  const b = data.modelBookings.find(x => x.id === bookingId);
  if (!b) return;
  currentBookingId = bookingId;
  const m = data.modelPool.find(x => x.id === b.modelId);
  document.getElementById('booking-action-name').textContent = m
    ? `${m.name} · ${b.purpose || ''} · ${b.status || ''}`
    : '已删除模特';
  document.getElementById('booking-action-bg').classList.add('show');
}
function closeBookingAction() { document.getElementById('booking-action-bg').classList.remove('show'); }
function bookingAction(kind) {
  const b = data.modelBookings.find(x => x.id === currentBookingId);
  if (!b) { closeBookingAction(); return; }
  const m = data.modelPool.find(x => x.id === b.modelId);
  closeBookingAction();
  closeMmDayModal();
  if (!m) { alert('该模特已删除'); return; }
  if (kind === 'jump') {
    // Switch nothing (already on models tab). Scroll to model pool and highlight card.
    const card = document.querySelector(`.model-card[data-model-id="${m.id}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('highlight');
      setTimeout(() => card.classList.remove('highlight'), 2600);
    }
  } else if (kind === 'inline') {
    openModelDetail(m.id);
  }
}
function deleteBooking() {
  if (!confirm('删除此预约？')) return;
  data.modelBookings = data.modelBookings.filter(b => b.id !== currentBookingId);
  markDirty(); closeBookingAction(); renderModelCalendar();
}

// ============================================================
// Model pool (photo cards)
// ============================================================
function renderModelPool() {
  const el = document.getElementById('model-pool');
  if (!data.modelPool.length) {
    el.innerHTML = '<div class="empty" style="grid-column: 1/-1;">还没有模特，点右上角"+ 新增模特"开始添加</div>';
    return;
  }
  el.innerHTML = data.modelPool.map(m => {
    const bg = m.photo ? `background-image:url('${esc(m.photo)}')` : '';
    return `
      <div class="model-card" data-model-id="${esc(m.id)}" onclick="openModelDetail('${esc(m.id)}')">
        <div class="model-photo" style="${bg}">${m.photo ? '' : '无照片'}</div>
        <div class="model-name">${esc(m.name || '未命名')}</div>
      </div>
    `;
  }).join('');
}
function addModelPool() {
  const m = {
    id: uid(),
    name: '新模特',
    photo: '',
    fields: [
      { key: '负责联系人', value: '' },
      { key: '蹭到的热点明星', value: '' },
      { key: '预计拍摄时长', value: '' },
      { key: '身高', value: '' },
      { key: '备注', value: '' }
    ]
  };
  data.modelPool.push(m);
  markDirty(); renderModelPool();
  openModelDetail(m.id);
}

// ============================================================
// Model detail modal
// ============================================================
let currentModelId = null;
function openModelDetail(modelId) {
  const m = data.modelPool.find(x => x.id === modelId);
  if (!m) return;
  currentModelId = modelId;
  document.getElementById('md-title').textContent = m.name || '未命名';
  document.getElementById('md-title').setAttribute('contenteditable', 'true');
  document.getElementById('md-title').oninput = () => {
    m.name = document.getElementById('md-title').innerText.trim() || '未命名';
    markDirty();
    renderModelPool();
  };
  // photo
  const ph = document.getElementById('md-photo');
  if (m.photo) { ph.style.backgroundImage = `url('${m.photo}')`; ph.textContent = ''; }
  else { ph.style.backgroundImage = ''; ph.textContent = '无照片'; }
  renderModelFields();
  document.getElementById('model-detail-bg').classList.add('show');
}
function closeModelDetail() { document.getElementById('model-detail-bg').classList.remove('show'); renderModelPool(); }
function renderModelFields() {
  const m = data.modelPool.find(x => x.id === currentModelId);
  if (!m) return;
  const el = document.getElementById('md-fields');
  el.innerHTML = m.fields.map((f, i) => `
    <div class="md-field" draggable="true" data-idx="${i}">
      <span class="md-handle">⋮⋮</span>
      <span class="md-key" contenteditable="true" data-key data-idx="${i}">${esc(f.key)}</span>
      <span class="md-val" contenteditable="true" data-val data-idx="${i}">${esc(f.value)}</span>
      <button class="btn btn-sm btn-ghost btn-danger md-del" onclick="deleteModelField(${i})">×</button>
    </div>
  `).join('');
  el.querySelectorAll('[contenteditable]').forEach(c => c.addEventListener('blur', () => {
    const i = parseInt(c.dataset.idx);
    const which = c.dataset.key !== undefined ? 'key' : 'val';
    if (which === 'key') m.fields[i].key = c.innerText.trim() || '字段';
    else m.fields[i].value = c.innerText.trim();
    markDirty();
  }));
  attachFieldDnD();
}
function attachFieldDnD() {
  const m = data.modelPool.find(x => x.id === currentModelId);
  if (!m) return;
  let dragIdx = null;
  document.querySelectorAll('#md-fields .md-field').forEach(el => {
    el.addEventListener('dragstart', e => {
      dragIdx = parseInt(el.dataset.idx);
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      document.querySelectorAll('.md-field').forEach(f => {
        f.classList.remove('drag-over-top','drag-over-bot');
      });
    });
    el.addEventListener('dragover', e => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const before = (e.clientY - r.top) < r.height / 2;
      document.querySelectorAll('.md-field').forEach(f => f.classList.remove('drag-over-top','drag-over-bot'));
      el.classList.add(before ? 'drag-over-top' : 'drag-over-bot');
    });
    el.addEventListener('drop', e => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const before = (e.clientY - r.top) < r.height / 2;
      const targetIdx = parseInt(el.dataset.idx);
      if (dragIdx === null || dragIdx === targetIdx) return;
      const item = m.fields.splice(dragIdx, 1)[0];
      let insertAt = before ? targetIdx : targetIdx + 1;
      if (dragIdx < targetIdx) insertAt--;
      m.fields.splice(insertAt, 0, item);
      dragIdx = null;
      markDirty(); renderModelFields();
    });
  });
}
function addModelField() {
  const m = data.modelPool.find(x => x.id === currentModelId);
  if (!m) return;
  m.fields.push({ key: '新字段', value: '' });
  markDirty(); renderModelFields();
}
function deleteModelField(i) {
  const m = data.modelPool.find(x => x.id === currentModelId);
  if (!m) return;
  m.fields.splice(i, 1);
  markDirty(); renderModelFields();
}
function deleteCurrentModel() {
  if (!confirm('删除该模特？相关预约不会被删除，但会显示"已删除模特"')) return;
  data.modelPool = data.modelPool.filter(x => x.id !== currentModelId);
  markDirty(); closeModelDetail(); renderModelCalendar();
}

// Photo upload + URL
function uploadModelPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!/^image\//.test(file.type)) { alert('请选择图片文件'); return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      // resize to max 800px and convert to JPG quality 0.7
      const maxW = 800;
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      const m = data.modelPool.find(x => x.id === currentModelId);
      if (m) {
        m.photo = dataUrl;
        markDirty();
        const ph = document.getElementById('md-photo');
        ph.style.backgroundImage = `url('${dataUrl}')`;
        ph.textContent = '';
        renderModelPool();
      }
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}
function promptModelPhotoUrl() {
  const url = prompt('输入图片 URL：');
  if (!url) return;
  const m = data.modelPool.find(x => x.id === currentModelId);
  if (m) {
    m.photo = url.trim();
    markDirty();
    const ph = document.getElementById('md-photo');
    ph.style.backgroundImage = `url('${m.photo}')`;
    ph.textContent = '';
    renderModelPool();
  }
}
function clearModelPhoto() {
  const m = data.modelPool.find(x => x.id === currentModelId);
  if (!m) return;
  m.photo = '';
  markDirty();
  const ph = document.getElementById('md-photo');
  ph.style.backgroundImage = '';
  ph.textContent = '无照片';
  renderModelPool();
}

// ============================================================
// Render models panel (call when entering models tab)
// ============================================================
function renderModelsPanel() {
  renderModelSop();
  renderModelCalendar();
  renderModelPool();
}

// ============================================================
// Import / Export
// ============================================================
function exportData() {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `zr-plan-${formatDate(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function importData(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      let imported = JSON.parse(e.target.result);
      if (imported.data) imported = imported.data;
      if (!confirm('导入将覆盖当前所有数据，确定继续？建议先点"导出"备份当前数据。')) {
        ev.target.value = '';
        return;
      }
      data = mergeData(imported);
      pushData().then(() => location.reload());
    } catch (err) {
      alert('文件格式错误：' + err.message);
    }
  };
  reader.readAsText(file);
  ev.target.value = '';
}

// Close modals on outside click
['modal-bg','edit-modal-bg','cat-modal-bg','mm-day-modal-bg','booking-action-bg','model-detail-bg','team-day-modal-bg','team-detail-bg','clinic-day-modal-bg','video-detail-bg'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('click', e => { if (e.target.id === id) el.classList.remove('show'); });
});

// Auto-refresh (poll server) — with strong local-data protection
let lastRefresh = Date.now();
let lastLocalEditTs = 0;       // when did the user last edit anything
let lastSaveOkTs = 0;          // when did our last successful save complete
async function pollRefresh() {
  // NEVER pull from server if:
  //  - tab hidden
  //  - we have unsaved local changes
  //  - a save is currently in flight or queued
  //  - the user edited something in the last 60s (they're actively working)
  if (document.hidden) return;
  if (isDirty || pushInFlight || pushQueued) return;
  if (Date.now() - lastLocalEditTs < 60000) return;
  if (Date.now() - lastRefresh < 30000) return;
  lastRefresh = Date.now();
  try {
    const res = await fetch('/api/data', { credentials: 'include' });
    if (res.status === 401) { location.href = '/login.html'; return; }
    const json = await res.json();
    // If server reports an error mid-session, freeze syncs and warn user
    if (json && json.error) {
      setSyncStatus('⚠ 服务器异常 · 已停止同步', 'error');
      return;
    }
    // Only adopt server data if it is NEWER than our last successful save.
    // This prevents a stale server snapshot from clobbering our work.
    if (json.data && (json.updated_at || 0) > lastSaveOkTs) {
      if (JSON.stringify(json.data) !== JSON.stringify(data)) {
        data = mergeData(json.data);
        initAll();
      }
    }
  } catch (_) {}
}
setInterval(pollRefresh, 5000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) pollRefresh(); });

// ============================================================
// Init
// ============================================================
function initAll() {
  // Safety: range banner must never be visible on load
  const _b = document.getElementById('team-range-banner');
  if (_b) _b.style.display = 'none';
  // Restore main tab
  if (data.view.tab && data.view.tab !== 'overview') {
    document.querySelectorAll('.tabs:not(.sub-tabs) > .tab').forEach(t => t.classList.toggle('active', t.dataset.tab === data.view.tab));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + data.view.tab));
  }
  // Restore wf tab
  document.querySelectorAll('#workflow-tabs .tab').forEach(t => t.classList.toggle('active', t.dataset.wftab === data.view.wfTab));
  // Restore review tab
  document.querySelectorAll('#review-tabs .tab').forEach(t => t.classList.toggle('active', t.dataset.rvtab === data.view.reviewTab));
  // Restore cal view
  if (data.view.calView === 'gantt') {
    document.querySelectorAll('.view-switch button').forEach(b => b.classList.toggle('active', b.dataset.view === 'gantt'));
  }

  renderSummary();
  renderTargets();
  renderMilestones();
  renderOverviewNotes();
  renderWorkflow('kb');
  renderWorkflow('mm');
  renderWorkflow('cs');
  applyWorkflowTab();
  renderModelsPanel();
  renderTeamPanel();
  renderClinicPanel();
  renderReviewPanel();
  renderCalendarOrGantt();
  // Daily backup reminder
  scheduleBackupReminder();
}

function scheduleBackupReminder() {
  try {
    const today = new Date().toDateString();
    const last = localStorage.getItem('zr_last_backup_prompt');
    if (last === today) return; // already prompted today
    // Show reminder 90s after load so it doesn't startle the user on first thing
    setTimeout(() => {
      // Check if data is meaningful (not just defaults)
      const hasMeaningfulData = (data.videos||[]).length > 0
        || (data.modelPool||[]).length > 0
        || (data.teamIssues||[]).length > 0
        || (data.clinicEvents||[]).length > 0
        || (data.milestones||[]).length > 4; // more than seed
      if (!hasMeaningfulData) return;
      const div = document.createElement('div');
      div.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: white; border: 1px solid rgba(0,0,0,0.12);
        border-radius: 12px; padding: 14px 18px; max-width: 320px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 999;
        font-size: 13px; line-height: 1.6;
      `;
      div.innerHTML = `
        <div style="font-weight:600; margin-bottom:4px;">📥 今日数据备份提醒</div>
        <div style="color:#5F5E5A; margin-bottom:10px;">建议每天点一次"导出"下载备份。云端单点存储有风险。</div>
        <div style="display:flex; gap:6px;">
          <button id="br-export" style="flex:1; padding:6px 10px; background:#D85A30; color:white; border:none; border-radius:6px; font-size:12px; cursor:pointer;">立即导出</button>
          <button id="br-close" style="padding:6px 10px; background:white; color:#5F5E5A; border:1px solid rgba(0,0,0,0.18); border-radius:6px; font-size:12px; cursor:pointer;">今天已备份</button>
        </div>
      `;
      document.body.appendChild(div);
      document.getElementById('br-export').onclick = () => {
        if (typeof exportData === 'function') exportData();
        localStorage.setItem('zr_last_backup_prompt', today);
        div.remove();
      };
      document.getElementById('br-close').onclick = () => {
        localStorage.setItem('zr_last_backup_prompt', today);
        div.remove();
      };
    }, 90000);
  } catch (_) {}
}

(async function bootstrap() {
  const ok = await loadData();
  if (!ok || !data) {
    // Hide loading spinner so user sees the error overlay clearly
    document.getElementById('loadingScreen').classList.add('hidden');
    return;
  }
  initAll();
  document.getElementById('loadingScreen').classList.add('hidden');
  document.getElementById('appRoot').style.display = '';
})();

// ============================================================
// Team panel
// ============================================================
function renderTeamPanel() {
  renderTeamList();
  renderTeamCalendar();
}

function renderTeamList() {
  const el = document.getElementById('team-list');
  if (!data.teamMembers.length) {
    el.innerHTML = '<div class="empty" style="grid-column: 1/-1;">还没有成员，点右上角"+ 新增成员"添加</div>';
    return;
  }
  el.innerHTML = data.teamMembers.map(m => {
    const bg = m.photo ? `background-image:url('${esc(m.photo)}')` : '';
    return `
      <div class="model-card" data-team-id="${esc(m.id)}" onclick="openTeamDetail('${esc(m.id)}')">
        <div class="model-photo" style="${bg}; position:relative;">
          ${m.photo ? '' : '无照片'}
          <div style="position:absolute; bottom:6px; right:6px; width:14px; height:14px; border-radius:50%; background:${m.color || '#888'}; border: 2px solid white;"></div>
        </div>
        <div class="model-name">
          ${esc(m.name || '未命名')}
          <div style="font-size:11px; color:var(--text-3); font-weight:400; margin-top:2px;">${esc(m.role || '')}</div>
          <button class="btn btn-sm" style="margin-top:6px; width:100%;" onclick="event.stopPropagation(); enterRangeMode('${esc(m.id)}')">📅 连选排休</button>
        </div>
      </div>`;
  }).join('');
  document.getElementById('team-list').dataset.ready = '1';
}

function addTeamMember() {
  const colorIdx = data.teamMembers.length % COLOR_SWATCHES.length;
  const m = {
    id: uid(),
    name: '新成员',
    role: '',
    color: COLOR_SWATCHES[colorIdx],
    photo: '',
    fields: [
      { key: '岗位', value: '' },
      { key: '联系方式', value: '' },
      { key: '备注', value: '' }
    ]
  };
  data.teamMembers.push(m);
  markDirty(); renderTeamList();
  openTeamDetail(m.id);
}

// ============================================================
// Team member detail modal
// ============================================================
let currentTeamId = null;
let openTeamColorPicker = null;
function openTeamDetail(memberId) {
  const m = data.teamMembers.find(x => x.id === memberId);
  if (!m) return;
  currentTeamId = memberId;
  const title = document.getElementById('td-title');
  title.textContent = m.name || '未命名';
  title.setAttribute('contenteditable', 'true');
  title.oninput = () => {
    m.name = title.innerText.trim() || '未命名';
    markDirty(); renderTeamList(); renderTeamCalendar();
  };
  const ph = document.getElementById('td-photo');
  if (m.photo) { ph.style.backgroundImage = `url('${m.photo}')`; ph.textContent = ''; }
  else { ph.style.backgroundImage = ''; ph.textContent = '无照片'; }
  const colorEl = document.getElementById('td-color');
  colorEl.style.background = m.color || '#888';
  colorEl.onclick = (e) => {
    e.stopPropagation();
    showTeamColorPicker(colorEl);
  };
  renderTeamFields();
  document.getElementById('team-detail-bg').classList.add('show');
}
function closeTeamDetail() {
  document.getElementById('team-detail-bg').classList.remove('show');
  if (openTeamColorPicker) { openTeamColorPicker.remove(); openTeamColorPicker = null; }
  renderTeamList();
  renderTeamCalendar();
}
function showTeamColorPicker(target) {
  if (openTeamColorPicker) openTeamColorPicker.remove();
  const picker = document.createElement('div');
  picker.className = 'color-picker';
  picker.innerHTML = COLOR_SWATCHES.map(c => `<span class="swatch" data-c="${c}" style="background:${c}"></span>`).join('');
  document.body.appendChild(picker);
  const r = target.getBoundingClientRect();
  picker.style.left = (r.left) + 'px';
  picker.style.top = (r.bottom + 4 + window.scrollY) + 'px';
  picker.querySelectorAll('.swatch').forEach(s => {
    s.addEventListener('click', (e) => {
      e.stopPropagation();
      const m = data.teamMembers.find(x => x.id === currentTeamId);
      if (m) {
        m.color = s.dataset.c;
        target.style.background = s.dataset.c;
        markDirty();
      }
      picker.remove();
      openTeamColorPicker = null;
    });
  });
  openTeamColorPicker = picker;
  setTimeout(() => {
    document.addEventListener('click', function onDoc() {
      if (openTeamColorPicker) openTeamColorPicker.remove();
      openTeamColorPicker = null;
      document.removeEventListener('click', onDoc);
    }, { once: true });
  }, 0);
}

function renderTeamFields() {
  const m = data.teamMembers.find(x => x.id === currentTeamId);
  if (!m) return;
  const el = document.getElementById('td-fields');
  el.innerHTML = m.fields.map((f, i) => `
    <div class="md-field" draggable="true" data-idx="${i}">
      <span class="md-handle">⋮⋮</span>
      <span class="md-key" contenteditable="true" data-key data-idx="${i}">${esc(f.key)}</span>
      <span class="md-val" contenteditable="true" data-val data-idx="${i}">${esc(f.value)}</span>
      <button class="btn btn-sm btn-ghost btn-danger md-del" onclick="deleteTeamField(${i})">×</button>
    </div>
  `).join('');
  el.querySelectorAll('[contenteditable]').forEach(c => c.addEventListener('blur', () => {
    const i = parseInt(c.dataset.idx);
    if (c.dataset.key !== undefined) m.fields[i].key = c.innerText.trim() || '字段';
    else m.fields[i].value = c.innerText.trim();
    markDirty();
  }));
  attachTeamFieldDnD();
}
function attachTeamFieldDnD() {
  const m = data.teamMembers.find(x => x.id === currentTeamId);
  if (!m) return;
  let dragIdx = null;
  document.querySelectorAll('#td-fields .md-field').forEach(el => {
    el.addEventListener('dragstart', e => {
      dragIdx = parseInt(el.dataset.idx);
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      document.querySelectorAll('#td-fields .md-field').forEach(f => f.classList.remove('drag-over-top','drag-over-bot'));
    });
    el.addEventListener('dragover', e => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const before = (e.clientY - r.top) < r.height / 2;
      document.querySelectorAll('#td-fields .md-field').forEach(f => f.classList.remove('drag-over-top','drag-over-bot'));
      el.classList.add(before ? 'drag-over-top' : 'drag-over-bot');
    });
    el.addEventListener('drop', e => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const before = (e.clientY - r.top) < r.height / 2;
      const targetIdx = parseInt(el.dataset.idx);
      if (dragIdx === null || dragIdx === targetIdx) return;
      const item = m.fields.splice(dragIdx, 1)[0];
      let insertAt = before ? targetIdx : targetIdx + 1;
      if (dragIdx < targetIdx) insertAt--;
      m.fields.splice(insertAt, 0, item);
      dragIdx = null;
      markDirty(); renderTeamFields();
    });
  });
}
function addTeamField() {
  const m = data.teamMembers.find(x => x.id === currentTeamId);
  if (!m) return;
  m.fields.push({ key: '新字段', value: '' });
  markDirty(); renderTeamFields();
}
function deleteTeamField(i) {
  const m = data.teamMembers.find(x => x.id === currentTeamId);
  if (!m) return;
  m.fields.splice(i, 1);
  markDirty(); renderTeamFields();
}
function deleteCurrentTeamMember() {
  if (!confirm('删除该成员？相关排期也会被删除')) return;
  data.teamSchedule = data.teamSchedule.filter(s => s.memberId !== currentTeamId);
  data.teamMembers = data.teamMembers.filter(x => x.id !== currentTeamId);
  markDirty(); closeTeamDetail(); renderTeamList(); renderTeamCalendar();
}

function uploadTeamPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!/^image\//.test(file.type)) { alert('请选择图片文件'); return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 800;
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      const m = data.teamMembers.find(x => x.id === currentTeamId);
      if (m) {
        m.photo = dataUrl;
        markDirty();
        const ph = document.getElementById('td-photo');
        ph.style.backgroundImage = `url('${dataUrl}')`;
        ph.textContent = '';
        renderTeamList();
      }
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}
function promptTeamPhotoUrl() {
  const url = prompt('输入图片 URL：');
  if (!url) return;
  const m = data.teamMembers.find(x => x.id === currentTeamId);
  if (m) {
    m.photo = url.trim();
    markDirty();
    const ph = document.getElementById('td-photo');
    ph.style.backgroundImage = `url('${m.photo}')`;
    ph.textContent = '';
    renderTeamList();
  }
}
function clearTeamPhoto() {
  const m = data.teamMembers.find(x => x.id === currentTeamId);
  if (!m) return;
  m.photo = '';
  markDirty();
  const ph = document.getElementById('td-photo');
  ph.style.backgroundImage = '';
  ph.textContent = '无照片';
  renderTeamList();
}

// ============================================================
// Team calendar
// ============================================================
function renderTeamCalendar() {
  const year = data.view.teamYear, month = data.view.teamMonth;
  document.getElementById('team-month-label').textContent = `${year}年${month}月`;
  const first = new Date(year, month - 1, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = formatDate(new Date());
  const cal = document.getElementById('team-calendar');
  let html = ['日', '一', '二', '三', '四', '五', '六'].map(h => `<div class="cal-head">${h}</div>`).join('');
  const prevMonthDays = new Date(year, month - 1, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const pm = month === 1 ? 12 : month - 1;
    const py = month === 1 ? year - 1 : year;
    const dateStr = `${py}-${String(pm).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += renderTeamDayCell(dateStr, d, true, false);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += renderTeamDayCell(dateStr, d, false, dateStr === todayStr);
  }
  const totalCells = startWeekday + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    const nm = month === 12 ? 1 : month + 1;
    const ny = month === 12 ? year + 1 : year;
    const dateStr = `${ny}-${String(nm).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
    html += renderTeamDayCell(dateStr, i, true, false);
  }
  cal.innerHTML = html;
  attachTeamCalendarHandlers();
}
function renderTeamDayCell(dateStr, dayNum, isOther, isToday) {
  const items = data.teamSchedule.filter(s => s.date === dateStr);
  const chips = items.map(s => {
    const m = data.teamMembers.find(x => x.id === s.memberId);
    if (!m) return '';
    const color = s.status === 'leave' ? '#A32D2D' : (m.color || '#888');
    const cls = s.status === 'leave' ? 'team-chip leave' : 'team-chip';
    return `<div class="${cls}" data-schedule-id="${esc(s.id)}" style="background:${color}" title="${esc(m.name)} · ${s.status === 'leave' ? '请假' : '休息'}">${esc(m.name)}</div>`;
  }).join('');
  return `
    <div class="cal-day ${isOther ? 'other' : ''} ${isToday ? 'today' : ''}" data-team-date="${dateStr}">
      <div class="day-num">${dayNum}</div>
      <div class="team-cal-events">${chips}</div>
    </div>
  `;
}
function attachTeamCalendarHandlers() {
  document.querySelectorAll('#team-calendar .cal-day').forEach(cell => {
    cell.addEventListener('click', (e) => {
      // If clicked on a chip, toggle that schedule instead
      if (e.target.classList.contains('team-chip')) {
        e.stopPropagation();
        const sid = e.target.dataset.scheduleId;
        const s = data.teamSchedule.find(x => x.id === sid);
        if (s) {
          // cycle: rest → leave → none
          if (s.status === 'rest') { s.status = 'leave'; }
          else if (s.status === 'leave') {
            data.teamSchedule = data.teamSchedule.filter(x => x.id !== sid);
          }
          markDirty(); renderTeamCalendar();
        }
        return;
      }
      const date = cell.dataset.teamDate;
      if (rangeMode.active) {
        handleRangeClick(date);
      } else {
        openTeamDayModal(date);
      }
    });
    if (rangeMode.active) {
      cell.addEventListener('mouseenter', () => {
        if (rangeMode.startDate) {
          highlightRange(rangeMode.startDate, cell.dataset.teamDate);
        }
      });
    }
  });
}

function changeTeamMonth(delta) {
  let m = data.view.teamMonth + delta, y = data.view.teamYear;
  if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
  data.view.teamMonth = m; data.view.teamYear = y;
  markDirty(); renderTeamCalendar();
}

// ============================================================
// Team day modal (per-person checklist)
// ============================================================
let currentTeamDayDate = null;
function openTeamDayModal(dateStr) {
  currentTeamDayDate = dateStr;
  document.getElementById('team-day-title').textContent = `${dateStr} · 休息 / 请假`;
  renderTeamDayChecklist();
  document.getElementById('team-day-modal-bg').classList.add('show');
}
function renderTeamDayChecklist() {
  const el = document.getElementById('team-day-checklist');
  if (!data.teamMembers.length) {
    el.innerHTML = '<div class="empty">还没有成员</div>';
    return;
  }
  el.innerHTML = data.teamMembers.map(m => {
    const existing = data.teamSchedule.find(s => s.date === currentTeamDayDate && s.memberId === m.id);
    const curStatus = existing ? existing.status : '';
    const bg = m.photo ? `background-image:url('${esc(m.photo)}'); background-size:cover; background-position:center;` : '';
    return `
      <div class="team-day-row">
        <div class="avatar" style="${bg}">${m.photo ? '' : esc((m.name||'').slice(0,1))}</div>
        <div class="name">
          ${esc(m.name)}
          <div style="font-size:11px; color:var(--text-3); font-weight:400;">${esc(m.role || '')}</div>
        </div>
        <div class="status-buttons">
          <button class="rest ${curStatus === 'rest' ? 'active' : ''}" onclick="setTeamDayStatus('${esc(m.id)}', 'rest')">休息</button>
          <button class="leave ${curStatus === 'leave' ? 'active' : ''}" onclick="setTeamDayStatus('${esc(m.id)}', 'leave')">请假</button>
          <button class="${curStatus === '' ? 'active' : ''}" onclick="setTeamDayStatus('${esc(m.id)}', '')">在岗</button>
        </div>
      </div>
    `;
  }).join('');
}
function setTeamDayStatus(memberId, status) {
  data.teamSchedule = data.teamSchedule.filter(s => !(s.date === currentTeamDayDate && s.memberId === memberId));
  if (status === 'rest' || status === 'leave') {
    data.teamSchedule.push({ id: uid(), memberId, date: currentTeamDayDate, status });
  }
  markDirty();
  renderTeamDayChecklist();
  renderTeamCalendar();
}
function closeTeamDayModal() { document.getElementById('team-day-modal-bg').classList.remove('show'); }

// ============================================================
// Range mode (click member → click start day → click end day)
// ============================================================
const rangeMode = { active: false, memberId: null, startDate: null };

function enterRangeMode(memberId) {
  const m = data.teamMembers.find(x => x.id === memberId);
  if (!m) return;
  rangeMode.active = true;
  rangeMode.memberId = memberId;
  rangeMode.startDate = null;
  const banner = document.getElementById('team-range-banner');
  banner.style.display = 'flex';
  document.getElementById('team-range-banner-text').textContent = `连选模式 · ${m.name}：点起始日 → 终止日`;
  renderTeamCalendar();
}
function exitRangeMode() {
  rangeMode.active = false;
  rangeMode.memberId = null;
  rangeMode.startDate = null;
  document.getElementById('team-range-banner').style.display = 'none';
  document.querySelectorAll('#team-calendar .cal-day').forEach(c => {
    c.classList.remove('range-target', 'range-hover');
  });
  renderTeamCalendar();
}
function handleRangeClick(date) {
  if (!rangeMode.startDate) {
    rangeMode.startDate = date;
    document.getElementById('team-range-banner-text').textContent = `起始日：${date} · 再点终止日`;
    highlightRange(date, date);
    return;
  }
  // Second click: commit the range
  const status = document.getElementById('team-range-status').value;
  const [start, end] = [rangeMode.startDate, date].sort();
  const memberId = rangeMode.memberId;
  // Iterate every date in range
  const startD = new Date(start), endD = new Date(end);
  for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
    const ds = formatDate(d);
    data.teamSchedule = data.teamSchedule.filter(s => !(s.date === ds && s.memberId === memberId));
    data.teamSchedule.push({ id: uid(), memberId, date: ds, status });
  }
  markDirty();
  exitRangeMode();
}
function highlightRange(startDate, endDate) {
  const [s, e] = [startDate, endDate].sort();
  document.querySelectorAll('#team-calendar .cal-day').forEach(cell => {
    const d = cell.dataset.teamDate;
    cell.classList.remove('range-target', 'range-hover');
    if (d >= s && d <= e) cell.classList.add('range-hover');
    if (d === rangeMode.startDate) cell.classList.add('range-target');
  });
}

// ============================================================
// Review sub-tabs
// ============================================================
document.querySelectorAll('#review-tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const which = tab.dataset.rvtab;
    document.querySelectorAll('#review-tabs .tab').forEach(t => t.classList.toggle('active', t === tab));
    data.view.reviewTab = which;
    applyReviewTab();
    markDirty();
  });
});
function applyReviewTab() {
  const which = data.view.reviewTab || 'all';
  document.querySelectorAll('[data-rv-section]').forEach(sec => {
    const s = sec.dataset.rvSection;
    sec.style.display = (which === 'all' || which === s) ? '' : 'none';
  });
}

// ============================================================
// CLINIC BOARD
// ============================================================
function renderClinicPanel() {
  renderDoctorList();
  renderClinicCalendar();
}

let doctorListOpen = false;
function toggleDoctorList() {
  doctorListOpen = !doctorListOpen;
  document.getElementById('doctor-list-wrap').style.display = doctorListOpen ? '' : 'none';
  document.getElementById('doctor-toggle-btn').textContent = doctorListOpen ? '收起 ▴' : '展开 ▾';
}
function renderDoctorList() {
  const el = document.getElementById('doctor-list');
  el.innerHTML = data.doctors.map(d => `
    <span class="doctor-chip-pool">
      <span contenteditable="true" data-doc-id="${esc(d.id)}">${esc(d.name)}</span>
      <span class="del" onclick="deleteDoctor('${esc(d.id)}')">×</span>
    </span>
  `).join('') + `<button class="btn btn-sm" onclick="addDoctor()">+ 添加医生</button>`;
  el.querySelectorAll('[data-doc-id]').forEach(c => c.addEventListener('blur', () => {
    const doc = data.doctors.find(x => x.id === c.dataset.docId);
    if (doc) { doc.name = c.innerText.trim() || '未命名'; markDirty(); renderClinicCalendar(); }
  }));
}
function addDoctor() {
  data.doctors.push({ id: uid(), name: '新医生' });
  markDirty(); renderDoctorList();
}
function deleteDoctor(id) {
  if (!confirm('删除该医生？相关排班也会删除')) return;
  data.clinicDoctorDays = data.clinicDoctorDays.filter(x => x.doctorId !== id);
  data.doctors = data.doctors.filter(x => x.id !== id);
  markDirty(); renderDoctorList(); renderClinicCalendar();
}

function renderClinicCalendar() {
  const year = data.view.clinicYear, month = data.view.clinicMonth;
  document.getElementById('clinic-month-label').textContent = `${year}年${month}月`;
  const first = new Date(year, month - 1, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = formatDate(new Date());
  const cal = document.getElementById('clinic-calendar');
  let html = ['日','一','二','三','四','五','六'].map(h => `<div class="cal-head">${h}</div>`).join('');
  const prevMonthDays = new Date(year, month - 1, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const pm = month === 1 ? 12 : month - 1, py = month === 1 ? year - 1 : year;
    const ds = `${py}-${String(pm).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += renderClinicDayCell(ds, d, true, false);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += renderClinicDayCell(ds, d, false, ds === todayStr);
  }
  const totalCells = startWeekday + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    const nm = month === 12 ? 1 : month + 1, ny = month === 12 ? year + 1 : year;
    const ds = `${ny}-${String(nm).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
    html += renderClinicDayCell(ds, i, true, false);
  }
  cal.innerHTML = html;
}
function renderClinicDayCell(dateStr, dayNum, isOther, isToday) {
  const rooms = data.clinicEvents.filter(e => e.date === dateStr);
  const docDays = data.clinicDoctorDays.filter(x => x.date === dateStr);
  const roomChips = rooms.slice(0, 2).map(e =>
    `<div class="clinic-chip room" title="${esc(e.title)} ${esc(e.timeRange||'')}">${esc(e.title)}</div>`
  ).join('');
  const docChips = docDays.slice(0, 3).map(dd => {
    const doc = data.doctors.find(x => x.id === dd.doctorId);
    return doc ? `<div class="clinic-chip doc">${esc(doc.name)}</div>` : '';
  }).join('');
  const more = (rooms.length > 2) ? `<div style="font-size:10px;color:var(--text-3);">+${rooms.length-2}占用</div>` : '';
  return `
    <div class="cal-day ${isOther?'other':''} ${isToday?'today':''}" onclick="openClinicDayModal('${dateStr}')">
      <div class="day-num">${dayNum}</div>
      <div class="cal-events">${roomChips}${docChips}${more}</div>
    </div>`;
}
function changeClinicMonth(delta) {
  let m = data.view.clinicMonth + delta, y = data.view.clinicYear;
  if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
  data.view.clinicMonth = m; data.view.clinicYear = y;
  markDirty(); renderClinicCalendar();
}

let currentClinicDate = null;
function openClinicDayModal(dateStr) {
  currentClinicDate = dateStr;
  document.getElementById('clinic-day-title').textContent = `${dateStr} · 院内日程`;
  // doctor checklist
  const dc = document.getElementById('clinic-doctor-checklist');
  if (!data.doctors.length) {
    dc.innerHTML = '<div class="empty" style="padding:8px;">请先在上方"医生名单"添加医生</div>';
  } else {
    dc.innerHTML = data.doctors.map(d => {
      const on = data.clinicDoctorDays.some(x => x.date === dateStr && x.doctorId === d.id);
      return `<button class="doctor-pick ${on?'active':''}" onclick="toggleClinicDoctor('${esc(d.id)}')">${esc(d.name)}</button>`;
    }).join('');
  }
  renderClinicEventList();
  ['ce-title','ce-time','ce-room','ce-notes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('clinic-day-modal-bg').classList.add('show');
}
function toggleClinicDoctor(docId) {
  const exists = data.clinicDoctorDays.find(x => x.date === currentClinicDate && x.doctorId === docId);
  if (exists) data.clinicDoctorDays = data.clinicDoctorDays.filter(x => x !== exists);
  else data.clinicDoctorDays.push({ id: uid(), date: currentClinicDate, doctorId: docId });
  markDirty(); openClinicDayModal(currentClinicDate); renderClinicCalendar();
}
function renderClinicEventList() {
  const el = document.getElementById('clinic-event-list');
  const evs = data.clinicEvents.filter(e => e.date === currentClinicDate);
  if (!evs.length) { el.innerHTML = '<div class="empty" style="padding:6px;">暂无占用</div>'; return; }
  el.innerHTML = evs.map(e => `
    <div class="event-row">
      <div class="event-row-left">
        <div class="ev-tag" style="background:var(--kb-teal);"></div>
        <div style="flex:1;min-width:0;">
          <div class="title">${esc(e.title)}</div>
          <div class="meta">${esc(e.timeRange||'')} · ${esc(e.room||'')}${e.notes?' · '+esc(e.notes):''}</div>
        </div>
      </div>
      <button class="btn btn-sm btn-ghost btn-danger" onclick="deleteClinicEvent('${esc(e.id)}')">×</button>
    </div>`).join('');
}
function saveClinicEvent() {
  const title = document.getElementById('ce-title').value.trim();
  if (!title) { alert('请填写事项'); return; }
  data.clinicEvents.push({
    id: uid(), date: currentClinicDate, title,
    timeRange: document.getElementById('ce-time').value.trim(),
    room: document.getElementById('ce-room').value.trim(),
    notes: document.getElementById('ce-notes').value.trim()
  });
  markDirty();
  ['ce-title','ce-time','ce-room','ce-notes'].forEach(id => document.getElementById(id).value = '');
  renderClinicEventList(); renderClinicCalendar();
}
function deleteClinicEvent(id) {
  data.clinicEvents = data.clinicEvents.filter(e => e.id !== id);
  markDirty(); renderClinicEventList(); renderClinicCalendar();
}
function closeClinicDayModal() { document.getElementById('clinic-day-modal-bg').classList.remove('show'); }

// ============================================================
// REVIEW PANEL
// ============================================================
function renderReviewPanel() {
  renderMonthGoals();
  renderVideoGrid();
  renderPubCalendar();
  renderTeamIssues();
  applyReviewTab();
  applyCollapse();
}

// Collapse / expand sections in review panel
function toggleCollapse(key, headerEl) {
  data.view.collapsed[key] = !data.view.collapsed[key];
  markDirty();
  applyCollapse();
}
function applyCollapse() {
  document.querySelectorAll('[data-collapse-body]').forEach(body => {
    const key = body.dataset.collapseBody;
    const collapsed = !!data.view.collapsed[key];
    body.style.display = collapsed ? 'none' : '';
    const header = document.querySelector(`.collapse-toggle[onclick*="'${key}'"]`);
    if (header) header.classList.toggle('collapsed', collapsed);
  });
}

// Issue filter (shared across 全部总览 and 团队问题 sub-tab)
function setIssueFilter(f) {
  data.view.issueFilter = f;
  document.querySelectorAll('#issue-filter button').forEach(b => b.classList.toggle('active', b.dataset.ifilter === f));
  markDirty();
  renderTeamIssues();
}

// ----- Month goals (editable keys) -----
const GOAL_TYPES = [['kb','专业口播'],['mm','美美展示'],['cs','客户见证']];
function renderMonthGoals() {
  const el = document.getElementById('month-goals');
  let html = '<table class="goals-table"><thead><tr><th>指标 \\ 类型</th>';
  GOAL_TYPES.forEach(([k,label]) => html += `<th>${label}</th>`);
  html += '<th style="width:40px;"></th></tr></thead><tbody>';
  data.goalKeys.forEach((gk, gi) => {
    html += `<tr><td><span class="gkey" contenteditable="true" data-gi="${gi}">${esc(gk)}</span></td>`;
    GOAL_TYPES.forEach(([tk]) => {
      const v = (data.monthGoals[tk] && data.monthGoals[tk][gk] != null) ? data.monthGoals[tk][gk] : 0;
      html += `<td><span class="gval" contenteditable="true" data-tk="${tk}" data-gk="${esc(gk)}">${v}</span></td>`;
    });
    html += `<td><button class="btn btn-sm btn-ghost btn-danger" onclick="deleteGoalKey(${gi})">×</button></td></tr>`;
  });
  html += '</tbody></table>';
  html += '<button class="btn btn-sm" onclick="addGoalKey()" style="margin-top:10px;">+ 新增指标</button>';
  el.innerHTML = html;
  el.querySelectorAll('.gval').forEach(c => c.addEventListener('blur', () => {
    const tk = c.dataset.tk, gk = c.dataset.gk;
    if (!data.monthGoals[tk]) data.monthGoals[tk] = {};
    data.monthGoals[tk][gk] = parseInt(c.innerText.trim()) || 0;
    markDirty();
  }));
  el.querySelectorAll('.gkey').forEach(c => c.addEventListener('blur', () => {
    const gi = parseInt(c.dataset.gi);
    const oldKey = data.goalKeys[gi];
    const newKey = c.innerText.trim() || '新指标';
    if (newKey === oldKey) return;
    // rename key across all types
    data.goalKeys[gi] = newKey;
    GOAL_TYPES.forEach(([tk]) => {
      if (data.monthGoals[tk] && data.monthGoals[tk][oldKey] != null) {
        data.monthGoals[tk][newKey] = data.monthGoals[tk][oldKey];
        delete data.monthGoals[tk][oldKey];
      }
    });
    markDirty(); renderMonthGoals();
  }));
}
function addGoalKey() {
  data.goalKeys.push('新指标');
  markDirty(); renderMonthGoals();
}
function deleteGoalKey(gi) {
  const gk = data.goalKeys[gi];
  if (!confirm(`删除指标「${gk}」？`)) return;
  data.goalKeys.splice(gi, 1);
  GOAL_TYPES.forEach(([tk]) => { if (data.monthGoals[tk]) delete data.monthGoals[tk][gk]; });
  markDirty(); renderMonthGoals();
}

// ----- Video cards -----
function tagColorByName(name) {
  const map = { '夯爆了':'#A32D2D', '人上人':'#D85A30', 'NPC':'#888780', '拉完了':'#185FA5' };
  return map[name] || '#534AB7';
}
function renderVideoGrid() {
  const el = document.getElementById('video-grid');
  if (!data.videos.length) {
    el.innerHTML = '<div class="empty" style="grid-column:1/-1;">还没有视频，点右上角"+ 新增视频"</div>';
    return;
  }
  el.innerHTML = data.videos.map(v => {
    const bg = v.cover ? `background-image:url('${esc(v.cover)}')` : '';
    const ratingStr = v.rating ? '★'.repeat(v.rating) : '';
    const corner = `
      <div class="video-corner">
        ${v.predictTag ? `<div class="video-tag"><span class="lbl">预</span>${esc(v.predictTag)}</div>` : ''}
        ${v.actualTag ? `<div class="video-tag" style="background:${tagColorByName(v.actualTag)}"><span class="lbl">实</span>${esc(v.actualTag)}</div>` : ''}
        ${ratingStr ? `<div class="video-rating-corner">${ratingStr}</div>` : ''}
      </div>`;
    const platMini = (v.platforms||[]).slice(0,4).map(p =>
      `<div class="prow"><span>${esc(p.name||'平台')}</span><span>藏${p.collect||0}·评${p.comment||0}·赞${p.like||0}·客资${p.kezi||0}</span></div>`
    ).join('');
    const adBadge = v.adInvested
      ? `<div style="font-size:11px; color:var(--accent); font-weight:500; margin-top:4px;">💰 已投流 ${v.adAmount ? '¥'+esc(v.adAmount) : ''}</div>`
      : '';
    return `
      <div class="video-card" data-video-id="${esc(v.id)}" onclick="openVideoDetail('${esc(v.id)}')">
        <div class="video-cover" style="${bg}">${v.cover?'':'无封面'}${corner}</div>
        <div class="video-meta">
          <div class="video-name">${esc(v.title||'未命名视频')}</div>
          <div class="video-platforms-mini">${platMini||'<span style="color:var(--text-3)">暂无平台数据</span>'}</div>
          ${adBadge}
        </div>
      </div>`;
  }).join('');
}
function addVideo() {
  const v = {
    id: uid(), title: '新视频', cover: '', publishDate: '',
    predictTag: '', actualTag: '', rating: 0,
    adInvested: false, adAmount: '',
    platforms: [{ name: '抖音', collect:0, comment:0, like:0, kezi:0, url:'' }],
    fields: []
  };
  data.videos.push(v);
  markDirty(); renderVideoGrid(); openVideoDetail(v.id);
}

let currentVideoId = null;
function openVideoDetail(id) {
  const v = data.videos.find(x => x.id === id);
  if (!v) return;
  currentVideoId = id;
  const title = document.getElementById('vd-title');
  title.textContent = v.title || '未命名视频';
  title.setAttribute('contenteditable','true');
  title.oninput = () => { v.title = title.innerText.trim()||'未命名视频'; markDirty(); renderVideoGrid(); };
  const cv = document.getElementById('vd-cover');
  if (v.cover) { cv.style.backgroundImage = `url('${v.cover}')`; cv.textContent=''; }
  else { cv.style.backgroundImage=''; cv.textContent='无封面'; }
  document.getElementById('vd-pubdate').value = v.publishDate || '';
  document.getElementById('vd-pubdate').onchange = (e) => { v.publishDate = e.target.value; markDirty(); renderPubCalendar(); };
  // tag selects
  const predict = document.getElementById('vd-predict');
  const actual = document.getElementById('vd-actual');
  const opts = '<option value="">—</option>' + data.perfTags.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
  predict.innerHTML = opts; actual.innerHTML = opts;
  predict.value = v.predictTag || ''; actual.value = v.actualTag || '';
  predict.onchange = () => { v.predictTag = predict.value; markDirty(); renderVideoGrid(); };
  actual.onchange = () => { v.actualTag = actual.value; markDirty(); renderVideoGrid(); };
  renderVideoRating(v);
  // 投流 fields
  renderVideoAd(v);
  const amtInput = document.getElementById('vd-ad-amount');
  amtInput.value = v.adAmount || '';
  amtInput.oninput = () => { v.adAmount = amtInput.value.trim(); markDirty(); renderVideoGrid(); };
  renderVideoPlatforms(v);
  renderVideoFields(v);
  document.getElementById('video-detail-bg').classList.add('show');
}
function renderVideoRating(v) {
  const el = document.getElementById('vd-rating');
  el.innerHTML = [1,2,3,4,5].map(n =>
    `<span class="star ${n <= (v.rating||0) ? 'on':''}" onclick="setVideoRating(${n})">★</span>`
  ).join('');
}
function setVideoRating(n) {
  const v = data.videos.find(x => x.id === currentVideoId);
  if (!v) return;
  v.rating = (v.rating === n) ? 0 : n;
  markDirty(); renderVideoRating(v); renderVideoGrid();
}
function renderVideoAd(v) {
  document.getElementById('vd-ad-yes').classList.toggle('active', v.adInvested === true);
  document.getElementById('vd-ad-no').classList.toggle('active', v.adInvested === false);
  document.getElementById('vd-ad-amount').style.display = v.adInvested ? '' : 'none';
}
function setVideoAd(val) {
  const v = data.videos.find(x => x.id === currentVideoId);
  if (!v) return;
  v.adInvested = val;
  if (!val) v.adAmount = '';
  markDirty(); renderVideoAd(v); renderVideoGrid();
}
function renderVideoPlatforms(v) {
  const el = document.getElementById('vd-platforms');
  let html = `<div class="platform-head"><span>平台</span><span>收藏</span><span>评论</span><span>点赞</span><span>客资</span><span></span></div>`;
  html += v.platforms.map((p, i) => `
    <div class="platform-row">
      <input data-pi="${i}" data-pf="name" value="${esc(p.name||'')}" placeholder="平台名">
      <input data-pi="${i}" data-pf="collect" value="${esc(p.collect||0)}" type="number">
      <input data-pi="${i}" data-pf="comment" value="${esc(p.comment||0)}" type="number">
      <input data-pi="${i}" data-pf="like" value="${esc(p.like||0)}" type="number">
      <input data-pi="${i}" data-pf="kezi" value="${esc(p.kezi||0)}" type="number">
      <button class="pdel" onclick="deleteVideoPlatform(${i})">×</button>
    </div>
    <div class="platform-row" style="grid-template-columns:1fr auto; margin-top:-2px; margin-bottom:8px;">
      <input data-pi="${i}" data-pf="url" value="${esc(p.url||'')}" placeholder="发布链接 URL" style="font-size:11px;">
      <span></span>
    </div>
  `).join('');
  el.innerHTML = html;
  el.querySelectorAll('input[data-pi]').forEach(inp => inp.addEventListener('input', () => {
    const i = parseInt(inp.dataset.pi), pf = inp.dataset.pf;
    if (pf === 'name' || pf === 'url') v.platforms[i][pf] = inp.value;
    else v.platforms[i][pf] = parseInt(inp.value) || 0;
    markDirty(); renderVideoGrid();
  }));
}
function addVideoPlatform() {
  const v = data.videos.find(x => x.id === currentVideoId);
  if (!v) return;
  v.platforms.push({ name:'', collect:0, comment:0, like:0, kezi:0, url:'' });
  markDirty(); renderVideoPlatforms(v);
}
function deleteVideoPlatform(i) {
  const v = data.videos.find(x => x.id === currentVideoId);
  if (!v) return;
  v.platforms.splice(i, 1);
  markDirty(); renderVideoPlatforms(v); renderVideoGrid();
}
function renderVideoFields(v) {
  const el = document.getElementById('vd-fields');
  if (!v.fields) v.fields = [];
  el.innerHTML = v.fields.map((f, i) => `
    <div class="md-field">
      <span class="md-key" contenteditable="true" data-key data-idx="${i}">${esc(f.key)}</span>
      <span class="md-val" contenteditable="true" data-val data-idx="${i}">${esc(f.value)}</span>
      <button class="btn btn-sm btn-ghost btn-danger md-del" onclick="deleteVideoField(${i})">×</button>
    </div>`).join('');
  el.querySelectorAll('[contenteditable]').forEach(c => c.addEventListener('blur', () => {
    const i = parseInt(c.dataset.idx);
    if (c.dataset.key !== undefined) v.fields[i].key = c.innerText.trim()||'字段';
    else v.fields[i].value = c.innerText.trim();
    markDirty();
  }));
}
function addVideoField() {
  const v = data.videos.find(x => x.id === currentVideoId);
  if (!v) return;
  if (!v.fields) v.fields = [];
  v.fields.push({ key:'新字段', value:'' });
  markDirty(); renderVideoFields(v);
}
function deleteVideoField(i) {
  const v = data.videos.find(x => x.id === currentVideoId);
  if (!v) return;
  v.fields.splice(i, 1);
  markDirty(); renderVideoFields(v);
}
function deleteCurrentVideo() {
  if (!confirm('删除该视频？')) return;
  data.videos = data.videos.filter(x => x.id !== currentVideoId);
  markDirty(); closeVideoDetail(); renderVideoGrid(); renderPubCalendar();
}
function closeVideoDetail() { document.getElementById('video-detail-bg').classList.remove('show'); renderVideoGrid(); }

function uploadVideoCover(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!/^image\//.test(file.type)) { alert('请选择图片'); return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 800, scale = Math.min(1, maxW/img.width);
      const w = Math.round(img.width*scale), h = Math.round(img.height*scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      const v = data.videos.find(x => x.id === currentVideoId);
      if (v) {
        v.cover = dataUrl; markDirty();
        const cv = document.getElementById('vd-cover');
        cv.style.backgroundImage = `url('${dataUrl}')`; cv.textContent='';
        renderVideoGrid();
      }
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}
function promptVideoCoverUrl() {
  const url = prompt('输入封面图 URL：');
  if (!url) return;
  const v = data.videos.find(x => x.id === currentVideoId);
  if (v) {
    v.cover = url.trim(); markDirty();
    const cv = document.getElementById('vd-cover');
    cv.style.backgroundImage = `url('${v.cover}')`; cv.textContent='';
    renderVideoGrid();
  }
}
function clearVideoCover() {
  const v = data.videos.find(x => x.id === currentVideoId);
  if (!v) return;
  v.cover = ''; markDirty();
  const cv = document.getElementById('vd-cover');
  cv.style.backgroundImage=''; cv.textContent='无封面';
  renderVideoGrid();
}

// ----- Publish calendar -----
function renderPubCalendar() {
  const year = data.view.pubYear, month = data.view.pubMonth;
  document.getElementById('pub-month-label').textContent = `${year}年${month}月`;
  const first = new Date(year, month - 1, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = formatDate(new Date());
  const cal = document.getElementById('pub-calendar');
  let html = ['日','一','二','三','四','五','六'].map(h => `<div class="cal-head">${h}</div>`).join('');
  const prevMonthDays = new Date(year, month - 1, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const pm = month === 1 ? 12 : month-1, py = month === 1 ? year-1 : year;
    const ds = `${py}-${String(pm).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += renderPubDayCell(ds, d, true, false);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += renderPubDayCell(ds, d, false, ds === todayStr);
  }
  const totalCells = startWeekday + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    const nm = month === 12 ? 1 : month+1, ny = month === 12 ? year+1 : year;
    const ds = `${ny}-${String(nm).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
    html += renderPubDayCell(ds, i, true, false);
  }
  cal.innerHTML = html;
}
function renderPubDayCell(dateStr, dayNum, isOther, isToday) {
  const vids = data.videos.filter(v => v.publishDate === dateStr);
  const chips = vids.slice(0,3).map(v =>
    `<div class="cal-event" style="background:var(--accent);" onclick="event.stopPropagation(); jumpToVideo('${esc(v.id)}')" title="${esc(v.title)}">${esc(v.title)}</div>`
  ).join('');
  const more = vids.length > 3 ? `<div style="font-size:10px;color:var(--text-3);">+${vids.length-3}</div>` : '';
  return `
    <div class="cal-day ${isOther?'other':''} ${isToday?'today':''}">
      <div class="day-num">${dayNum}</div>
      <div class="cal-events">${chips}${more}</div>
    </div>`;
}
function changePubMonth(delta) {
  let m = data.view.pubMonth + delta, y = data.view.pubYear;
  if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
  data.view.pubMonth = m; data.view.pubYear = y;
  markDirty(); renderPubCalendar();
}
function jumpToVideo(id) {
  // Switch to 全部总览 sub-tab, highlight the card there
  data.view.reviewTab = 'all';
  document.querySelectorAll('#review-tabs .tab').forEach(t => t.classList.toggle('active', t.dataset.rvtab === 'all'));
  applyReviewTab();
  setTimeout(() => {
    const card = document.querySelector(`.video-card[data-video-id="${id}"]`);
    if (card) {
      card.scrollIntoView({ behavior:'smooth', block:'center' });
      card.classList.add('highlight');
      setTimeout(() => card.classList.remove('highlight'), 2600);
    }
  }, 100);
  markDirty();
}

// ----- Team issues -----
function renderTeamIssues() {
  const el = document.getElementById('team-issues');
  // sync filter buttons active state
  const f = data.view.issueFilter || 'all';
  document.querySelectorAll('#issue-filter button').forEach(b => b.classList.toggle('active', b.dataset.ifilter === f));
  let list = data.teamIssues.map((it, i) => ({ it, i }));
  if (f === 'resolved') list = list.filter(x => x.it.resolved === true);
  else if (f === 'unresolved') list = list.filter(x => x.it.resolved !== true);
  if (!data.teamIssues.length) {
    el.innerHTML = '<div class="empty">还没有记录问题，点右上角"+ 新增问题"</div>';
    return;
  }
  if (!list.length) {
    el.innerHTML = `<div class="empty">没有「${f==='resolved'?'已解决':'未解决'}」的问题</div>`;
    return;
  }
  el.innerHTML = list.map(({ it, i }) => `
    <div class="issue-card">
      <div class="issue-row">
        <div class="issue-label">提出问题</div>
        <div class="issue-val" contenteditable="true" data-ti="problem" data-idx="${i}">${esc(it.problem)}</div>
        <button class="btn btn-sm btn-ghost btn-danger" onclick="deleteTeamIssue(${i})">×</button>
      </div>
      <div class="issue-row">
        <div class="issue-label">解决方案</div>
        <div class="issue-val" contenteditable="true" data-ti="solution" data-idx="${i}">${esc(it.solution)}</div>
      </div>
      <div class="issue-row">
        <div class="issue-label">是否解决</div>
        <div class="issue-resolved-toggle">
          <button class="yes ${it.resolved===true?'active':''}" onclick="setIssueResolved(${i}, true)">已解决</button>
          <button class="no ${it.resolved===false?'active':''}" onclick="setIssueResolved(${i}, false)">未解决</button>
        </div>
      </div>
      <div class="issue-row">
        <div class="issue-label">优化方案</div>
        <div class="issue-val" contenteditable="true" data-ti="optimize" data-idx="${i}">${esc(it.optimize)}</div>
      </div>
    </div>`).join('');
  el.querySelectorAll('[contenteditable]').forEach(c => c.addEventListener('blur', () => {
    data.teamIssues[parseInt(c.dataset.idx)][c.dataset.ti] = c.innerText.trim();
    markDirty();
  }));
}
function addTeamIssue() {
  data.teamIssues.push({ id: uid(), problem:'', solution:'', resolved:null, optimize:'' });
  markDirty(); renderTeamIssues();
}
function deleteTeamIssue(i) {
  if (!confirm('删除该问题记录？')) return;
  data.teamIssues.splice(i, 1);
  markDirty(); renderTeamIssues();
}
function setIssueResolved(i, val) {
  data.teamIssues[i].resolved = (data.teamIssues[i].resolved === val) ? null : val;
  markDirty(); renderTeamIssues();
}
