'use strict';
// Presentation-only rules. No model, core, storage, tools or network access.
// Describes a scenario; never authenticates a person or authorizes an action.
window.roadshowJudge=function(input){
 const text=String(input).trim();
 const has=re=>re.test(text);
 const f={
  cross:has(/另一家|其他公司|别的公司|其他企业|跨企业|跨公司|B\s*公司|公司\s*B/i),
  own:has(/自己公司|自己企业|本公司|本企业|我司/),
  read:has(/查看|查询|读取|看一下|查阅|观察|看.*订单|看.*任务/),
  external:has(/外部|供应商|客户|第三方|个人邮箱|外网/)&&has(/发送|发给|转发|传给|分享|导出|上传|外发/),
  private:has(/隐私|身份证|个人信息|密码|密钥|机密|商业秘密/),
  remove:has(/删除|清空|销毁|抹掉/),
  modify:has(/修改|改动|覆盖|变更|更新.*(?:报价|合同|订单)/),
  completion:has(/(?:AI|Agent|机器人).*(?:完成|成功|success)|任务.*(?:显示|声称|说).*(?:完成|成功)|(?:订单|任务).*(?:已完成|已经.*完成|处理完成)/i),
  insufficient:has(/不完整|不齐|没确认|未确认|没有确认|缺少|缺失|资料不够|资料不足|信息不足|不知道|不明确|不确定/),
  source:has(/来源.*(?:不明|未知|未确认|没确认|缺失|不存在)/),
  human:has(/口头|同意|经理|批准|人工确认|审批|负责人/),
  device:has(/设备|机器|生产线|机器人|阀门|传感器/),
  deviceSafety:has(/关闭.{0,8}(?:安全保护|互锁)|绕过.{0,8}(?:安全开关|互锁)|取消.{0,4}急停|禁用.{0,4}保护|强制(?:启动|运行)|设备直接重启|机器直接启动/),
  control:has(/重启|启动|停机|停止设备|控制|开关|开阀|关阀|调节|设定|参数/),
  payment:has(/付款|支付|转账|打款|报销/),
  contract:has(/合同|签约/),
  quote:has(/报价|询价/),
  conflict:has(/说法不同|意见不同|分歧|谁对|甲.*乙|三天.*七天|3\s*天.*7\s*天/),
  conditionsDiffer:has(/老客户.*新客户|新客户.*老客户|条件不同|数量不同|时间不同/),
  experience:has(/经验|过去做法|以前.*(?:做|成功)|上次/),
  denied:has(/没有.{0,8}(?:授权|权限)|没.{0,4}(?:授权|权限)|未获.{0,4}(?:批准|授权)|不能访问|不允许(?:查看|访问|操作)|无权|权限.*撤回|账号.*停用|规定.{0,6}不允许/),
  skip:has(/(?:不要|不用|无需|不必|别).{0,5}(?:检查|验证|确认|审核)|(?:跳过|忽略|绕过).{0,5}(?:权限|审批|审核|规则|检查|验证|来源)|直接执行/),
  selfClaim:has(/我是老板|最高权限|所有权限|全部.{0,4}(?:授权|权限|可以做)|所有授权|我自己的公司|我是本公司/)
 };
 const why=[],missing=[];let result='❓ 信息不够，暂时不能判断',tone='unknown';
 const add=(a,b)=>{why.push(a);if(b)missing.push(b);};
 if(f.denied)add('场景明确包含无授权、禁止访问或账号失效，普通查看也不能跳过这个限制。','有效授权和当前账号状态；不能用自称本公司或经理同意替代。');
 if(f.skip)add('要求跳过检查本身不能成为放行理由。','按正常流程核对身份、权限、来源及必要批准，不能直接执行。');
 if(f.deviceSafety)add('涉及设备安全保护，不能仅凭输入直接执行，更不能绕过互锁或急停。','现场工程师和安全负责人确认，保留安全保护，并制定合规的受控方案。');
 if(f.selfClaim)add('身份和权限不能只靠输入内容自我证明。','真实系统可核对的身份、企业归属及本次具体权限。');
 if(f.cross)add('场景涉及另一家企业的资料；知道资料编号也不等于有权查看。','本人的真实企业归属和合法访问范围，不能靠输入中的自称确认。');
 if(f.external)add('把资料发给外部人员，会让资料离开当前企业边界。','允许外发的正式权限、具体资料范围、接收方身份和保密要求。');
 if(f.human)add('“经理同意”或口头批准只是一个说法，不能代替权限和必要证据。','可核对的审批依据，以及审批人是否有权批准这次操作。');
 if(f.remove||f.modify)add('删除或修改正式业务资料会改变真实记录，不能先做再补手续。','对象和版本、影响范围、备份与恢复办法，以及有效批准。');
 if(f.device&&f.control)add('设备控制会影响现场安全，不能因为报警就让 AI 自己重启或调参。','工程师确认、安全条件、设备状态和受控操作方案。');
 if(f.payment||f.contract)add('付款或合同相关操作可能产生资金或法律后果。','金额或条款、授权范围、对方身份、适当负责人的确认。');
 if(f.quote&&!f.external&&!f.modify)add('报价涉及具体版本、价格依据和适用条件，不能只看一句建议。','当前报价版本、客户要求和负责人的确认。');
 if(f.completion)add('“任务已完成”这句话本身不能证明现实任务真的完成。','现实结果在哪里？证明在哪里？谁检查过？失败怎么办？');
 if(f.insufficient||f.source)add('重要资料或来源尚未确认，不能把“不知道”变成“可以”。','把未确认的条件、来源和证明补齐，再重新判断。');
 if(f.conflict)add('先核对客户、订单、数量、时间、生产条件和来源；不能直接替双方选边。',f.conditionsDiffer?'条件不同的说法应分别核对，不能当成同条件冲突。':'双方完整条件、同一订单版本及已确认的来源。');
 if(f.experience)add('过去成功或个人经验，不会自动成为企业规则，更不能创造权限。','这次场景是否适用、经验版本及现实结果依据。');
 if(f.device&&!f.control&&!f.deviceSafety&&f.read)add('这是只读状态场景，不是设备控制；可进入只读范围和权限确认，不能由此操作设备。','设备身份、只读范围、当前权限及状态来源。');
 const risky=f.external||f.remove||f.modify||(f.device&&f.control)||f.deviceSafety||f.payment||f.contract;
 // Collect all signals before selecting a result. Risk always outranks an
 // ordinary own-company read; no statement in the input authenticates itself.
 if(f.denied){result='⛔ 不允许';tone='deny';}
 else if(f.skip){result='🟡 需要人工确认';tone='warning';}
 else if(f.cross||(f.private&&f.external)||f.deviceSafety){result='⛔ 不允许';tone='deny';}
 else if(risky){result='🟡 需要人工确认';tone='warning';}
 else if(f.completion||f.insufficient||f.source||f.conflict||f.experience){result='❓ 信息不够，暂时不能判断';}
 else if(f.human||f.selfClaim||(f.device&&f.read)){result='🟡 需要人工确认';tone='warning';}
 else if(f.own&&f.read&&!f.device&&!f.quote){result='✅ 可以继续';tone='allow';add('输入描述的是本人企业内的普通只读查看，可继续进入身份和权限核对。','仍需真实系统确认账号启用、企业归属和本次权限；本页不做真实认证。');}
 if(!why.length)add('这段描述还不足以套用明确的路演规则。','谁要做？代表哪家公司？做什么？涉及什么资料或设备？希望得到什么结果？');
 const offTopic=!(f.denied||f.skip||f.selfClaim||f.deviceSafety||f.device)&&!has(/工作|企业|公司|员工|任务|订单|设备|报价|客户|资料|权限|AI|Agent|机器人|付款|合同|交期|交货|经验|来源|供应商|审批|文件|消息|数据|老板|经理|销售|采购|财务/i);
 if(offTopic){result='❓ 信息不够，暂时不能判断';tone='unknown';why.splice(0,why.length,'这个演示主要用于体验 RealityOS 如何判断企业工作场景。');missing.splice(0,missing.length,'请描述一个工作场景，包括谁、哪家公司、准备做什么。');}
 const done=f.completion?'不能认定完成。需要独立的现实读回、可核对证明及适当人员或独立检查确认；失败或结果未知时停止盲目重试。':f.cross||f.denied?'停止未经授权的读取或操作，并确认没有取得不属于自己的资料。只有新请求获得真实授权后才可重新判断。':risky?'先完成真实授权与必要人工确认；之后还需现实结果、可核对记录、独立检查和失败处理。这个网页不会执行这些动作。':'需要正确范围内的现实结果、可核对记录，以及适当人员或独立检查确认。当前只是路演解释，不表示真实工作已完成。';
 return {result,tone,why:why.slice(0,5),missing:[...new Set(missing)].slice(0,5),done,conflict:f.conflict,completion:f.completion,conditionsDiffer:f.conditionsDiffer};
};
