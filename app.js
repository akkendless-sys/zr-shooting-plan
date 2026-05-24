// app.js — collaborative version, syncs to server

const FEISHU_BASE_URL = 'https://ocn0396e2sc0.feishu.cn/base/HoN7bdvFma83LjsudqycC4IRnjg';

const defaultData = {
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
  modelBookings: [],
  modelPool: [
    { id: 'mp1', title: '常用模特 · 待录入', body: '请在此添加模特联系方式 / 适合内容 / 报价' }
  ],
  view: { tab: 'overview', calView: 'month', year: 2026, month: 5 }
};

function uid() { return 'e' + Date.now() + Math.floor(Math.random() * 1000); }

function generateSeedEvents() {
  const ev = [];
  // May 25-31 prep
  ev.push({ id: uid(), date: '2026-05-26', type: 'prep', title: '6月对标筛选 · 美美展示批次1', time: '全天', location: '线上', owner: '编导组', notes: '挑选 3-5 条对标发定板群', feishu: '' });
  ev.push({ id: uid(), date: '2026-05-27', type: 'prep', title: '6月对标筛选 · 客户见证批次1', time: '全天', location: '线上', owner: '编导组', notes: '挑选 4 条对标 + 脚本撰写', feishu: '' });
  ev.push({ id: uid(), date: '2026-05-28', type: 'prep', title: '模特预约 · 6月第1周客户见证', time: '上午', location: '线上', owner: 'MCN运营', notes: '提前 3-7 天定模特', feishu: '' });
  ev.push({ id: uid(), date: '2026-05-29', type: 'prep', title: '6月口播脚本 · 第1-2条', time: '全天', location: '线上', owner: '编导组', notes: '从388脚本库筛选+定稿', feishu: '' });
  ev.push({ id: uid(), date: '2026-05-30', type: 'prep', title: '档期统一确认 · 6月第1周', time: '下午', location: '诊所', owner: '辉总+编导+摄影+妆造', notes: '四方档期锁定', feishu: '' });

  // June Week 1
  ev.push({ id: uid(), date: '2026-06-02', type: 'cs', title: '客户见证拍摄日 · 案例A (产出4条)', time: '09:00-17:00', location: '诊所', owner: '模特A', notes: '严格按对标分镜', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-03', type: 'mm', title: '美美展示拍摄日 · 院内场', time: '10:00-18:00', location: '诊所', owner: '辉总', notes: '先前再后 · 3-7条', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-04', type: 'kb', title: '口播拍摄 · 第1-2条', time: '14:00-17:00', location: '诊所', owner: '辉总', notes: '抗衰 + 玻尿酸误区', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-05', type: 'publish', title: '发布 · 口播#1', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-06', type: 'publish', title: '发布 · 客户见证#1', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-07', type: 'publish', title: '发布 · 美美展示#1', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });

  // June Week 2
  ev.push({ id: uid(), date: '2026-06-08', type: 'prep', title: '6月第2周对标+模特预约', time: '上午', location: '线上', owner: '编导组+运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-09', type: 'cs', title: '客户见证拍摄日 · 案例B', time: '09:00-17:00', location: '诊所', owner: '模特B', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-10', type: 'mm', title: '美美展示拍摄日 · 外景场', time: '10:00-18:00', location: '外景棚', owner: '辉总', notes: '换场景调性', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-11', type: 'kb', title: '口播拍摄 · 第3-4条', time: '14:00-17:00', location: '诊所', owner: '辉总', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-12', type: 'publish', title: '发布 · 客户见证#2', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-13', type: 'publish', title: '发布 · 美美展示#2', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-14', type: 'publish', title: '发布 · 口播#2', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });

  // June Week 3
  ev.push({ id: uid(), date: '2026-06-15', type: 'prep', title: '上半月复盘 + 第3周筹备', time: '全天', location: '诊所', owner: '全员', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-16', type: 'cs', title: '客户见证拍摄日 · 案例C', time: '09:00-17:00', location: '诊所', owner: '模特C', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-17', type: 'mm', title: '美美展示拍摄日 · 院内场', time: '10:00-18:00', location: '诊所', owner: '辉总', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-18', type: 'kb', title: '口播拍摄 · 第5-6条', time: '14:00-17:00', location: '诊所', owner: '辉总', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-19', type: 'publish', title: '发布 · 客户见证#3', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-20', type: 'publish', title: '发布 · 美美展示#3', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-21', type: 'publish', title: '发布 · 口播#3', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });

  // June Week 4
  ev.push({ id: uid(), date: '2026-06-22', type: 'prep', title: '6月第4周对标+模特预约', time: '上午', location: '线上', owner: '编导组+运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-23', type: 'cs', title: '客户见证拍摄日 · 案例D', time: '09:00-17:00', location: '诊所', owner: '模特D', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-24', type: 'mm', title: '美美展示拍摄日 · 外景场', time: '10:00-18:00', location: '外景棚', owner: '辉总', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-25', type: 'kb', title: '口播拍摄 · 第7-8条', time: '14:00-17:00', location: '诊所', owner: '辉总', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-26', type: 'publish', title: '发布 · 客户见证#4', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-27', type: 'publish', title: '发布 · 美美展示#4', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });
  ev.push({ id: uid(), date: '2026-06-28', type: 'publish', title: '发布 · 口播#4', time: '20:00', location: '抖音+小红书', owner: 'MCN运营', notes: '', feishu: '' });

  ev.push({ id: uid(), date: '2026-06-30', type: 'prep', title: '全月复盘 + 7月排期初稿', time: '全天', location: '诊所', owner: '全员', notes: '', feishu: '' });

  return ev;
}

// ===== State =====
let data = null;
let saveTimer = null;
let isDirty = false;

const syncStatusEl = () => document.getElementById('syncStatus');

function setSyncStatus(text, cls) {
  const el = syncStatusEl();
  if (el) {
    el.textContent = text;
    el.className = 'sync-status ' + (cls || '');
  }
}

async function loadData() {
  setSyncStatus('加载中…');
  try {
    const res = await fetch('/api/data', { credentials: 'include' });
    if (res.status === 401) { location.href = '/login.html'; return; }
    const json = await res.json();
    if (json.data) {
      data = Object.assign({}, defaultData, json.data);
    } else {
      // First load — seed
      data = JSON.parse(JSON.stringify(defaultData));
      data.events = generateSeedEvents();
      await pushData(); // save initial seed to server
    }
    setSyncStatus('已同步', 'saved');
  } catch (e) {
    setSyncStatus('加载失败', 'error');
    data = JSON.parse(JSON.stringify(defaultData));
    data.events = generateSeedEvents();
  }
}

async function pushData() {
  if (!data) return;
  setSyncStatus('保存中…', 'saving');
  try {
    const res = await fetch('/api/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    if (res.status === 401) { location.href = '/login.html'; return; }
    const json = await res.json();
    if (json.ok) {
      setSyncStatus('已同步', 'saved');
      isDirty = false;
    } else {
      setSyncStatus('保存失败', 'error');
    }
  } catch (e) {
    setSyncStatus('网络错误', 'error');
  }
}

function markDirty() {
  isDirty = true;
  setSyncStatus('保存中…', 'saving');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    // Pull current overview notes from DOM before save
    const notesEl = document.getElementById('overview-notes');
    if (notesEl) data.overviewNotes = notesEl.innerText;
    pushData();
  }, 800);
}

async function logout() {
  await fetch('/api/logout', { method: 'POST', credentials: 'include' });
  location.href = '/login.html';
}

// ===== Rendering =====
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + name));
    data.view.tab = name;
    markDirty();
    if (name === 'calendar') renderCalendarOrGantt();
  });
});

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
        <div class="module-title"><span class="pill ${t.type === 'kb' ? 'pill-kb' : t.type === 'mm' ? 'pill-mm' : 'pill-cs'}">${t.label}</span></div>
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
    markDirty();
    renderSummary();
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

function renderModelBookings() {
  const el = document.getElementById('model-list');
  const items = data.modelBookings || [];
  if (!items.length) { el.innerHTML = '<div class="empty">还没有预约</div>'; return; }
  el.innerHTML = items.map((m, i) => `
    <div class="module">
      <div class="module-head">
        <div class="module-title" contenteditable="true" data-mb="title" data-idx="${i}">${esc(m.title)}</div>
        <div class="module-actions"><button class="btn btn-sm btn-ghost btn-danger" onclick="deleteModelBooking(${i})">×</button></div>
      </div>
      <div style="margin-top:8px;">
        <div class="info-line"><span class="k">拍摄日</span><span class="v" contenteditable="true" data-mb="shootDate" data-idx="${i}">${esc(m.shootDate||'')}</span></div>
        <div class="info-line"><span class="k">预约确认日</span><span class="v" contenteditable="true" data-mb="confirmDate" data-idx="${i}">${esc(m.confirmDate||'')}</span></div>
        <div class="info-line"><span class="k">用途</span><span class="v" contenteditable="true" data-mb="purpose" data-idx="${i}">${esc(m.purpose||'')}</span></div>
        <div class="info-line"><span class="k">联系方式</span><span class="v" contenteditable="true" data-mb="contact" data-idx="${i}">${esc(m.contact||'')}</span></div>
        <div class="info-line"><span class="k">状态</span><span class="v" contenteditable="true" data-mb="status" data-idx="${i}">${esc(m.status||'待确认')}</span></div>
      </div>
      <div class="module-body" contenteditable="true" data-mb="notes" data-idx="${i}" style="margin-top:8px;">${esc(m.notes||'')}</div>
    </div>`).join('');
  el.querySelectorAll('[contenteditable]').forEach(c => c.addEventListener('blur', () => {
    data.modelBookings[parseInt(c.dataset.idx)][c.dataset.mb] = c.innerText.trim();
    markDirty();
  }));
}
function addModelBooking() { data.modelBookings.push({ id: uid(), title: '新模特预约', shootDate: '', confirmDate: '', purpose: '客户见证', contact: '', status: '待确认', notes: '' }); markDirty(); renderModelBookings(); }
function deleteModelBooking(i) { if (!confirm('删除？')) return; data.modelBookings.splice(i, 1); markDirty(); renderModelBookings(); }

function renderModelPool() {
  const el = document.getElementById('model-pool');
  const items = data.modelPool || [];
  if (!items.length) { el.innerHTML = '<div class="empty">还没有模特</div>'; return; }
  el.innerHTML = items.map((m, i) => `
    <div class="module">
      <div class="module-head">
        <div class="module-title" contenteditable="true" data-mp="title" data-idx="${i}">${esc(m.title)}</div>
        <div class="module-actions"><button class="btn btn-sm btn-ghost btn-danger" onclick="deleteModelPool(${i})">×</button></div>
      </div>
      <div class="module-body" contenteditable="true" data-mp="body" data-idx="${i}">${esc(m.body)}</div>
    </div>`).join('');
  el.querySelectorAll('[contenteditable]').forEach(c => c.addEventListener('blur', () => {
    data.modelPool[parseInt(c.dataset.idx)][c.dataset.mp] = c.innerText.trim();
    markDirty();
  }));
}
function addModelPool() { data.modelPool.push({ id: uid(), title: '新模特', body: '联系方式 / 适合内容 / 报价' }); markDirty(); renderModelPool(); }
function deleteModelPool(i) { if (!confirm('删除？')) return; data.modelPool.splice(i, 1); markDirty(); renderModelPool(); }

// Calendar
function renderCalendarOrGantt() {
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
    html += `<div class="cal-day other" onclick="openDayModal('${dateStr}')"><div class="day-num">${d}</div>${renderDayEvents(dateStr)}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += `<div class="cal-day ${dateStr === todayStr ? 'today' : ''}" onclick="openDayModal('${dateStr}')"><div class="day-num">${d}</div>${renderDayEvents(dateStr)}</div>`;
  }
  const totalCells = startWeekday + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    const nm = month === 12 ? 1 : month + 1;
    const ny = month === 12 ? year + 1 : year;
    const dateStr = `${ny}-${String(nm).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
    html += `<div class="cal-day other" onclick="openDayModal('${dateStr}')"><div class="day-num">${i}</div>${renderDayEvents(dateStr)}</div>`;
  }
  cal.innerHTML = html;
}
function renderDayEvents(dateStr) {
  const evs = data.events.filter(e => e.date === dateStr);
  if (!evs.length) return '<div class="cal-events"></div>';
  return '<div class="cal-events">' + evs.slice(0, 3).map(e =>
    `<div class="cal-event ev-${e.type}" onclick="event.stopPropagation(); openEditModal('${e.id}')" title="${esc(e.title)}">${esc(e.title)}</div>`
  ).join('') + (evs.length > 3 ? `<div style="font-size:10px; color:var(--text-3);">+${evs.length - 3} 更多</div>` : '') + '</div>';
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
  const groups = [
    { key: 'prep', label: '筹备', color: 'var(--kb-amber)' },
    { key: 'kb', label: '专业口播', color: 'var(--kb-blue)' },
    { key: 'mm', label: '美美展示', color: 'var(--kb-purple)' },
    { key: 'cs', label: '客户见证', color: 'var(--kb-teal)' },
    { key: 'publish', label: '发布', color: 'var(--accent)' }
  ];
  let html = `<div class="gantt-header" style="grid-template-columns: ${labelWidth}px repeat(${daysInMonth}, ${dayWidth}px);"><div class="gantt-label-col">类型 / 日期</div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month - 1, d);
    const wd = dt.getDay();
    const wc = (wd === 0 || wd === 6) ? 'weekend' : '';
    const tc = (formatDate(dt) === todayStr) ? 'today' : '';
    html += `<div class="gantt-label-col ${wc} ${tc}" style="text-align:center; padding: 6px 0;">${d}</div>`;
  }
  html += `</div>`;
  for (const g of groups) {
    html += `<div class="gantt-row" style="grid-template-columns: ${labelWidth}px repeat(${daysInMonth}, ${dayWidth}px);">`;
    html += `<div class="gantt-label-col"><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${g.color}; margin-right:4px;"></span>${g.label}</div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month - 1, d);
      const wd = dt.getDay();
      const wc = (wd === 0 || wd === 6) ? 'weekend' : '';
      const tc = (formatDate(dt) === todayStr) ? 'today' : '';
      const dateStr = formatDate(dt);
      const cellEvs = data.events.filter(e => e.date === dateStr && e.type === g.key);
      const bars = cellEvs.map(e =>
        `<div class="gantt-bar" style="left:2px; right:2px; background:${g.color};" onclick="event.stopPropagation(); openEditModal('${e.id}')" title="${esc(e.title)}">${esc(truncate(e.title, 8))}</div>`
      ).join('');
      html += `<div class="gantt-track ${wc} ${tc}" onclick="openDayModal('${dateStr}')">${bars}</div>`;
    }
    html += `</div>`;
  }
  gantt.innerHTML = html;
}

// Modals
let currentModalDate = null;
function openDayModal(dateStr) {
  currentModalDate = dateStr;
  document.getElementById('modal-title').textContent = `${dateStr} · 日程`;
  const evs = data.events.filter(e => e.date === dateStr);
  const evList = evs.length ? evs.map(e => `
    <div class="event-row">
      <div class="event-row-left">
        <div class="ev-tag" style="background: ${tagColor(e.type)};"></div>
        <div style="flex:1; min-width:0;">
          <div class="title">${esc(e.title)}</div>
          <div class="meta">${esc(e.time||'')} · ${esc(e.location||'')} · ${esc(e.owner||'')}</div>
          ${e.feishu ? `<a class="feishu-link" href="${esc(e.feishu)}" target="_blank">↗ 查看本次对标</a>` : ''}
        </div>
      </div>
      <div style="display:flex; gap:4px;">
        <button class="btn btn-sm" onclick="openEditModal('${e.id}'); closeModal();">编辑</button>
      </div>
    </div>`).join('') : '<div class="empty">这一天还没有安排</div>';
  document.getElementById('modal-day-events').innerHTML = '<div class="event-list">' + evList + '</div>';
  document.getElementById('m-title').value = '';
  document.getElementById('m-time').value = '';
  document.getElementById('m-location').value = '';
  document.getElementById('m-owner').value = '';
  document.getElementById('m-feishu').value = '';
  document.getElementById('m-notes').value = '';
  document.getElementById('modal-bg').classList.add('show');
}
function closeModal() { document.getElementById('modal-bg').classList.remove('show'); }
function saveNewEvent() {
  const title = document.getElementById('m-title').value.trim();
  if (!title) { alert('请填写标题'); return; }
  data.events.push({
    id: uid(),
    date: currentModalDate,
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
document.getElementById('modal-bg').addEventListener('click', e => { if (e.target.id === 'modal-bg') closeModal(); });
document.getElementById('edit-modal-bg').addEventListener('click', e => { if (e.target.id === 'edit-modal-bg') closeEditModal(); });

function formatDate(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function esc(s) { if (s == null) return ''; return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function truncate(s, n) { if (!s) return ''; return s.length > n ? s.slice(0, n) + '…' : s; }
function tagColor(t) {
  return t === 'kb' ? 'var(--kb-blue)' : t === 'mm' ? 'var(--kb-purple)' :
         t === 'cs' ? 'var(--kb-teal)' : t === 'prep' ? 'var(--kb-amber)' : 'var(--accent)';
}

// Auto-refresh: pull server data every 30s when tab is visible
let lastRefresh = Date.now();
async function pollRefresh() {
  if (document.hidden || isDirty) return;
  if (Date.now() - lastRefresh < 30000) return;
  lastRefresh = Date.now();
  try {
    const res = await fetch('/api/data', { credentials: 'include' });
    if (res.status === 401) { location.href = '/login.html'; return; }
    const json = await res.json();
    if (json.data && JSON.stringify(json.data) !== JSON.stringify(data)) {
      data = Object.assign({}, defaultData, json.data);
      initAll();
    }
  } catch (_) {}
}
setInterval(pollRefresh, 5000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) pollRefresh(); });

function initAll() {
  if (data.view.tab && data.view.tab !== 'overview') {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === data.view.tab));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + data.view.tab));
  }
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
  renderModelBookings();
  renderModelPool();
  renderCalendarOrGantt();
}

(async function bootstrap() {
  await loadData();
  if (!data) return;
  initAll();
  document.getElementById('loadingScreen').classList.add('hidden');
  document.getElementById('appRoot').style.display = '';
})();
