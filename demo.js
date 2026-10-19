'use strict';
// Buildless, browser-local presentation. No core imports, APIs or persistence.
const content=document.querySelector('#content');
const nav=document.querySelector('#navigation');
const menu=document.querySelector('.menu-toggle');
let step=0,mode='',conflict='unknown',tourIndex=0;
let selectedExample=null;
const inputExamples={normal:'查看自己公司的任务',denied:'查看另一家公司的资料',unknown:'AI 想继续工作，但资料没确认'};
const tour=['about','input','normal','denied','unknown','completion','disagreement','progress','future2','future3','future4','vision'];
const button=(label,action,primary=true)=>`<button class="${primary?'primary':'secondary'}" data-action="${action}">${label}</button>`;
const progressBody=()=>`<div class="progress-grid"><section class="card"><h2 class="allow">✅ 已经做到</h2><p>当前项目的本地规则与测试基础，不是生产承诺。</p><ul><li>已有企业隔离与越权拒绝检查。</li><li>重要允许／拒绝决定可保存并读回。</li><li>关键账号关系经过假资料重启恢复验证。</li><li>执行声明不能代替现实结果验证。</li><li>工作、观点与经验关系完成第一阶段假资料规则验证。</li></ul></section><section class="card"><h2 class="warning">🟡 正在验证</h2><ul><li>当前公开路演体验的可理解性。</li><li>分歧与经验关系的适用边界。</li></ul><p>真实业务、企业数据来源、生产级长期保存仍未验证，不能作为当前成果。</p></section><section class="card"><h2 class="unknown">🔵 以后会做</h2><ul><li>企业微信、钉钉、飞书。</li><li>Google Workspace、Microsoft 365。</li><li>真实业务接入与生产验证。</li><li>设备观察、受控测试及受控执行。</li></ul><p>均需另行批准与验证。</p></section></div>`;
const futureBody=()=>`<p class="note">以下全部为规划。当前没有真实设备连接，也未在本路演执行设备操作。</p><div class="routes">${[['L0','👁 看现实'],['L1','🧠 给诊断建议'],['L2','🧪 受控测试'],['L3','⚙️ 受控执行'],['L4','🔄 在限制范围内自动调整']].map(([level,text])=>`<div class="route"><b>${level}</b><span>${text}</span><span class="tag">规划 · 未验证</span></div>`).join('')}</div>`;
function home(){selectedExample=null;return `<section class="input-home"><div class="eyebrow">RealityOS 路演判断器 · 不是大模型</div><h1>你想让 AI 做什么？</h1><p class="lead">AI 会给答案，RealityOS 负责判断它能不能真的去做。</p><p class="muted">根据当前公开展示规则，对你输入的工作场景进行演示判断。规则有限，不能替代真实企业审核。</p><form id="question-form" autocomplete="off"><label for="work-question">直接用普通话描述一个工作场景。</label><textarea id="work-question" name="scenario" rows="4" maxlength="1200" required placeholder="例如：把客户报价发给外部供应商，经理口头同意了，可以吗？" aria-describedby="input-privacy"></textarea><p id="input-privacy" class="privacy">请不要输入密码、密钥、真实客户隐私或其他敏感资料。输入不保存、不发送。</p><button class="primary" type="submit">让 RealityOS 判断</button></form><div class="example-inputs"><p>不知道怎么问？点一个例子。</p>${Object.entries(inputExamples).map(([id,text])=>`<button class="example-chip" data-action="fill:${id}">${id==='normal'?'✅':id==='denied'?'⛔':'❓'} ${text}</button>`).join('')}</div><div class="aside-links"><a href="#completion">AI 说完成了，就真的完成了吗？</a><a href="#experience">体验三个逐步案例</a><a href="#tour">按顺序开始路演</a></div><p class="privacy">模型 API 费用：不适用，本演示未调用外部模型。商业价值：尚未测量。</p></section>`;}
const escapeText=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function showInputResult(question){
 const answer=window.roadshowJudge(question);
 const list=values=>'<ul>'+values.map(value=>'<li>'+escapeText(value)+'</li>').join('')+'</ul>';
 content.innerHTML=`<section class="input-result"><span class="tag">演示模拟结果 · 浏览器规则，不是大模型</span><h1>RealityOS 路演判断</h1><p class="muted">这个演示不会连接真实企业系统，也不会执行真实业务操作。以下不是正式批准。</p><div class="question-echo"><span>你输入的场景</span><p id="question-echo-text"></p></div><div class="answer-blocks"><section><h2>结果</h2><p class="answer-result ${answer.tone}">${escapeText(answer.result)}</p>${answer.completion?'<p class="warning">⚠️ 不能认定完成</p>':''}${answer.conflict?'<span class="tag">不同意见判断 · 正在验证</span><p>'+(answer.conditionsDiffer?'条件其实不同，不能直接选边。':'是否真正冲突仍需完整资料，当前不替任何一方判对。')+'</p>':''}</section><section><h2>为什么</h2>${list(answer.why)}</section><section><h2>还缺什么</h2>${list(answer.missing)}</section><section><h2>怎样才算真的完成</h2><p>${escapeText(answer.done)}</p></section></div><div class="actions">${button(mode==='tour'?'继续':'查看 RealityOS 现在做到哪一步',mode==='tour'?'tour-next':'progress-next')}</div><div class="aside-links">${mode==='tour'?'':button('返回输入其他工作场景','back-input',false)}<a href="#completion">AI 说完成了，就真的完成了吗？</a><a href="#disagreement">两个人说法不一样，谁对？</a></div><p class="privacy">输入仅在当前页面临时展示，刷新即清除。没有模型调用费用；商业价值尚未测量。</p></section>`;
 document.querySelector('#question-echo-text').textContent=question;
 selectedExample=null;content.focus({preventScroll:true});window.scrollTo(0,0);
}
function experience(){return `<section class="intro"><div class="eyebrow">30 秒体验</div><h1>如果 AI 想做一件事，<br>谁来把关？</h1><p>假设你是一家制造企业的负责人。现在 AI 想帮你处理一项工作。</p></section><div class="steps-hint"><span><b>1</b> 选择一个例子</span><span><b>2</b> 看系统判断</span><span><b>3</b> 理解最终结果</span></div><div class="cards">${[['normal','✅','正常操作','员工查看自己公司的任务。','看看为什么可以'],['denied','⛔','越权操作','员工想查看另一家公司的资料。','看看为什么被拒绝'],['unknown','❓','资料不够','AI 想继续，但重要信息还没确认。','看看 RealityOS 怎么处理']].map(([id,icon,title,copy,cta])=>`<section class="card"><div class="icon">${icon}</div><h2>${title}</h2><p>${copy}</p>${button(cta,'case:'+id,false)}</section>`).join('')}</div><div class="aside-links"><a href="#completion">AI 说完成了，就真的完成了吗？</a><a href="#disagreement">两个人说法不一样，谁对？</a></div>`;}
const scenes={normal:[['👤','谁在操作？','未来制造 A 的李明（演示员工）。'],['🏢','他代表哪个公司？','未来制造 A。'],['🔐','他能看这项工作吗？','这次查看本公司订单处理记录的权限符合演示设定。'],['✅','允许','人员、公司和这次操作都符合要求，所以可以继续。']],denied:[['👤','当前人员','未来制造 A 的李明（演示员工）。'],['📄','他想查看什么？','未来制造 B 的订单资料。'],['⛔','拒绝','你属于 A 公司，不能查看 B 公司的资料。']],unknown:[['🤖','AI 的建议','“我建议继续执行。”'],['❓','还不能继续','有重要信息没有确认。'],['❓','信息不够，暂时不能继续','RealityOS 不会猜。资料不够时，不会把“不知道”变成“可以”。']],completion:[['🤖','AI 说完成了，<br>就真的完成了吗？','“任务已经完成。”'],['👁','现实结果在哪里？','有没有独立于 AI 说法的现实结果？'],['📎','证明在哪里？','有没有可核对的记录？'],['🔎','谁检查过？','有没有确认结果是否真的正确？'],['🛟','失败以后怎么办？','有没有需要人工处理或继续核实的地方？'],['⚠️','不能认定完成','AI 的一句“完成了”，不能代替现实结果。']]};
function story(id){const list=scenes[id],item=list[Math.min(step,list.length-1)],last=step===list.length-1;const tone=id==='normal'?'allow':id==='denied'?'deny':id==='completion'?'warning':'unknown';return `<section class="story"><div class="story-header"><span class="label">演示结果 · 虚构案例</span><span class="story-count">${step+1} / ${list.length}</span></div><div class="scene"><span class="symbol" aria-hidden="true">${item[0]}</span><h2 class="${last?tone:''}">${item[1]}</h2><p>${item[2]}</p>${id==='denied'&&last?'<p>即使知道资料编号，也不能绕过去。</p>':''}${id==='unknown'&&step===1?'<ul><li>条件还没确认</li><li>来源还没确认</li><li>结果还不能证明</li></ul>':''}${last&&id==='normal'?'<details><summary>看看系统为什么允许</summary><p>本案例设定：李明的身份、公司归属及本次查看权限一致。这里没有访问任何企业，也没有真实授权或执行。</p></details>':''}</div>${button(last?(mode==='tour'?'继续':id==='completion'?'查看已经做到哪一步':'看看系统怎样确认任务完成'):'继续看下一项检查',last?'story-end':'step')}${mode!=='tour'?'<div class="actions"><a class="text-button" href="#experience">返回选择其他案例</a></div>':''}</section>`;}
function disagreement(){const results={conflict:['🔴 真正说法冲突','假设双方谈的是同一客户、同一订单版本、同一时间和已确认条件，且两种交期要求不能同时成立。仍不能仅凭冲突判断谁正确。'],different:['🟡 条件其实不同','员工甲谈老客户，员工乙谈新客户。条件不同，不能直接认定他们互相矛盾。'],unknown:['❓ 资料还不够','客户类型或来源还没确认。先补资料，不急着判断谁对。']};return `<section class="story"><span class="tag">正在验证 · 演示模拟</span><h1>两个人说法不一样，谁对？</h1><p class="quote">员工甲：“这个客户提前 3 天可以交货。”</p><p class="quote">员工乙：“至少要提前 7 天。”</p><p class="muted">先别急着判断谁对。要核对：同一种客户吗？订单条件和时间一样吗？来源确认了吗？</p><div class="conflict-select">${button('试试条件完全相同','conflict:conflict',false)}${button('试试客户类型不同','conflict:different',false)}${button('试试来源还没确认','conflict:unknown',false)}</div><div class="scene" aria-live="polite"><span class="label">演示结果</span><h2>${results[conflict][0]}</h2><p>${results[conflict][1]}</p></div><a class="primary" href="#progress">查看已经做到哪一步</a></section>`;}
function about(){return `<section class="about-copy"><div class="eyebrow">1 分钟了解</div><h1>从“AI 说了”，<br>走到“现实证明了”。</h1><p>普通 AI 可以提出答案和行动建议。RealityOS 要把这些建议放回具体的人、公司、权限和现实结果里检查。</p><div class="plain-flow"><span>任务</span>→<span>能不能做</span>→<span>执行</span>→<span>现实结果</span>→<span>证明</span>→<span>确认完成</span></div><p>没有权限，不继续。资料不够，不猜。没有现实结果，不把一句“完成了”当成完成。</p><details><summary>想深入了解：技术名称与边界</summary><p>权限与代表关系（Authority / Delegation）、能力与影响（Capability / Effect）、执行、证据与来源（Evidence / Provenance）、独立验证（Verification）、恢复（Recovery）。这些职责保持分开；模型输出不能替代权限或现实证明。</p><p>本页不运行私有核心。所有案例都是静态假资料，既不证明真实企业已接入，也不代表生产可用。</p></details><div class="actions"><a class="primary" href="#experience">开始 30 秒体验</a><a class="text-button" href="#tour">路演模式：按顺序讲一遍</a></div></section>`;}

function futureStage(stage){
 const pages={
  1:['现在：先让 AI 安全地做数字工作','当前已有基础 / 假资料验证','👤 谁在操作<br>🏢 代表哪个公司<br>🔐 有没有权限<br>❓ 资料够不够<br>📋 结果有没有证明','出错以后能不能找到原因。当前只证明已有基础和限定测试，不代表生产完成。'],
  2:['下一步：连接真实企业工作','后续规划 · 当前尚未真实接通','企业微信 · 钉钉 · 飞书<br>邮件 · 文件 · 表格<br>报价 · 合同 · 订单 · 审批 · 质量记录','员工提出工作 → RealityOS 判断 → 企业真实系统 → 真实结果 → 证据与确认。'],
  3:['再下一步：连接设备和现场','后续规划 · 当前没有设备连接','设备报警 → 读取状态<br>→ AI 给排查建议 → 工程师确认<br>→ 低风险测试 → 读取真实结果<br>→ 确认问题有没有解决','先让 AI 看见现实，再逐步允许它在安全范围内影响现实。看现实 → 理解和建议 → 受控测试 → 受控执行。'],
  4:['未来：一群被管理的 AI 一起工作','后续规划 · 尚未实现大规模协同','销售 AI · 采购 AI · 报价 AI<br>质量 AI · 设备诊断 AI · 财务 AI<br>↓<br><strong>RealityOS</strong>','一群数字员工，都经过 RealityOS 管理：谁能做什么、代表谁、能用哪些资料、做了什么、现实发生什么、有什么证明、失败怎么办。']
 };
 const p=pages[stage];return '<section class="future-stage"><span class="tag">'+p[1]+'</span><h1>'+p[0]+'</h1><div class="scene"><p class="stage-items">'+p[2]+'</p><p>'+p[3]+'</p></div></section>';
}
function vision(){return '<section class="story"><span class="tag">最终愿景 · 非已完成能力</span><h1>让 AI 不只是知道答案，<br>而是在被授权时，<br>安全地把答案变成现实结果。</h1><div class="vision-route"><p>现在：判断能不能做</p><p>↓ 下一步：连接真实企业系统</p><p>↓ 再下一步：连接设备和现场</p><p>↓ 未来：管理大量 AI 协同工作</p></div><h2>RealityOS</h2><p class="muted">Execute the Real World,<br>Prove the Result.</p></section>';}

function render(){
 const route=location.hash.slice(1)||'home';
 nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='打开导航';
 document.querySelectorAll('nav a').forEach(a=>a.setAttribute('aria-current',a.hash==='#'+route?'page':'false'));
 let html='';
 if(route==='tour'){
  mode='tour';const page=tour[tourIndex];
  const marker='<div class="story-header"><span class="label">路演模式 · '+(tourIndex+1)+' / 12</span><span class="tag">演示模拟</span></div>';
  if(scenes[page])html=marker+story(page);
  else{
   let body=page==='about'?'<section class="story"><h1>AI 会给答案，<br>谁来确认能不能做？</h1><p class="lead">RealityOS 检查人员、企业、权限和现实结果。接下来，你可以自己输入一个工作问题。</p></section>':page==='input'?home():page==='disagreement'?disagreement():page==='progress'?'<h1>RealityOS 现在做到哪一步？</h1>'+progressBody():page==='vision'?vision():futureStage(Number(page.slice(-1)));
   if(page==='disagreement')body=body.replace('<a class="primary" href="#progress">查看已经做到哪一步</a>','');
   html=marker+body+(page==='input'?'': '<div class="actions">'+button(tourIndex===11?'结束路演，返回首页':'继续','tour-next')+'</div>');
  }
 }else{
  mode='';
  if(scenes[route])html=story(route);
  else if(route==='experience')html=experience();
  else if(route==='progress')html='<div class="intro"><div class="eyebrow">真实进展 · 不夸大边界</div><h1>RealityOS 现在做到哪一步？</h1><p>这些是项目当前基础，页面模拟不是实际运行证明。</p></div>'+progressBody()+'<div class="actions"><a class="primary" href="#future1">接下来 RealityOS 会变成什么</a></div>';
  else if(/^future[1-4]$/.test(route)){const n=Number(route.slice(-1));html=futureStage(n)+'<div class="actions"><a class="primary" href="#'+(n===4?'vision':'future'+(n+1))+'">继续看'+(n===4?'最终愿景':'下一步')+'</a></div>';}
  else if(route==='future')html=futureStage(1)+'<div class="actions"><a class="primary" href="#future2">继续看下一步</a></div>';
  else if(route==='vision')html=vision()+'<div class="actions"><a class="primary" href="#home">返回输入一个工作问题</a></div>';
  else if(route==='about')html=about();
  else if(route==='disagreement')html=disagreement();
  else if(route==='scenarios')html='<div class="intro"><span class="tag">未来场景 · 尚未打通</span><h1>从数字工作，走向真实现场。</h1></div><div class="scenario-grid"><section class="card"><h2>设备出问题时</h2><p>设备报警 → 读取状态 → 排查建议 → 工程师确认 → 低风险测试 → 结果与证据。</p><p>AI 不代替安全确认。</p></section><section class="card"><h2>从询价到交付</h2><p>客户要求 → 报价 → 人工确认 → 订单 → 生产 → 质量结果。</p><p>出了问题，追问谁做的、什么时候、根据什么。</p></section></div><div class="actions"><a class="primary" href="#future1">接下来 RealityOS 会变成什么</a></div>';
  else html=home();
 }
 content.innerHTML=html;content.focus({preventScroll:true});window.scrollTo(0,0);
}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'收起导航':'打开导航';});
document.addEventListener('input',event=>{if(event.target.id==='work-question')selectedExample=null;});
document.addEventListener('submit',event=>{if(event.target.id!=='question-form')return;event.preventDefault();const field=document.querySelector('#work-question'),question=field.value.trim();if(!question){field.value='';field.reportValidity();return;}showInputResult(question,selectedExample);});
document.addEventListener('click',event=>{const el=event.target.closest('[data-action]');if(!el)return;if(el.dataset.action==='progress-next'){location.hash='progress';}else if(el.dataset.action.startsWith('fill:')){selectedExample=el.dataset.action.split(':')[1];const field=document.querySelector('#work-question');field.value=inputExamples[selectedExample];field.focus();}else if(el.dataset.action==='back-input'){render();}});
document.addEventListener('click',event=>{const el=event.target.closest('[data-action]');if(!el)return;const action=el.dataset.action;if(action.startsWith('case:')){step=0;location.hash=action.split(':')[1];}else if(action==='step'){step++;render();}else if(action==='story-end'){if(mode==='tour'){tourIndex++;step=0;render();}else location.hash=location.hash==='#completion'?'progress':'completion';}else if(action==='tour-next'){if(tourIndex===11){tourIndex=0;location.hash='home';}else{tourIndex++;step=0;render();}}else if(action.startsWith('conflict:')){conflict=action.split(':')[1];render();}});
window.addEventListener('hashchange',()=>{step=0;if(location.hash==='#tour')tourIndex=0;render();});render();
