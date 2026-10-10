/**
 * Player3：委托板任务目录（列表 ↔ 详情共用字段）
 * 在 requests.html / detail.html 中于 site.js 之前引入。
 */
(function () {
  "use strict";

  var IMG = "../../../shared/p5ui/assets/src-assets/images/";

  window.P5_TASK_CATALOG = [
    {
      id: "T01",
      title: "印象空间：迷途回声",
      tag: "行动",
      level: "★★★",
      district: "涩谷",
      timeWindow: "夜间 22:00–04:00",
      summary: "在 Mementos 浅层反复出现的认知残响，需要清理以稳定通道。",
      cover: IMG + "portraits/mona.png",
      client: "摩尔加纳",
      risk: "中",
      reward: "同伴 SP +1",
      statusLabel: "待处理",
      body: [
        "认知世界出现周期性杂音，疑似某人的压抑情绪外溢。",
        "建议携带恢复道具，优先处理会召唤增援的精英影。",
        "注意：拖太久会导致警戒条异常上涨（原型演示文案）。"
      ]
    },
    {
      id: "T02",
      title: "可疑账号：幽灵拍卖",
      tag: "情报",
      level: "★★",
      district: "秋叶原",
      timeWindow: "任意",
      summary: "追踪利用暗网销赃的账号链路，整理证据交给双叶。",
      cover: IMG + "portraits/futaba.png",
      client: "佐仓双叶",
      risk: "低",
      reward: "情报词条解锁",
      statusLabel: "待处理",
      body: [
        "多个卖家使用相同话术模板，背后可能是同一认知扭曲源。",
        "建议从交易时间戳与收货地址重合度切入。",
        "风险：钓鱼链接较多，勿在原型页面外点击不明地址。"
      ]
    },
    {
      id: "T03",
      title: "补习班周边：失物招领潮",
      tag: "支援",
      level: "★",
      district: "四轩茶屋",
      timeWindow: "放学后",
      summary: "连续大量「被自愿」遗失的物品，需要人手协助登记与归还。",
      cover: IMG + "portraits/ann.png",
      client: "高卷杏",
      risk: "低",
      reward: "社群好感 +",
      statusLabel: "待处理",
      body: [
        "失主描述互相矛盾，像是集体暗示下的结果。",
        "建议分三组核对时间线，避免单人疲劳误判。",
        "若出现威胁短信，立即切换为「行动」优先级。"
      ]
    },
    {
      id: "T04",
      title: "殿堂残响：金色雕像",
      tag: "行动",
      level: "★★★",
      district: "新宿",
      timeWindow: "深夜",
      summary: "小型殿堂碎片泄漏至现实边缘，需压制具现化守卫。",
      cover: IMG + "portraits/yusuke.png",
      client: "喜多川祐介",
      risk: "高",
      reward: "稀有素材（占位）",
      statusLabel: "待处理",
      body: [
        "守卫对「审美攻击」有额外反应（原型设定）。",
        "建议携带破甲技能与群体治疗。",
        "风险提示：战场有色彩干扰，注意 UI 误判。"
      ]
    },
    {
      id: "T05",
      title: "学生会档案：空白页事件",
      tag: "情报",
      level: "★★",
      district: "秀尽学园",
      timeWindow: "午休",
      summary: "多份正当程序文件出现整页空白，怀疑人为篡改或认知污染。",
      cover: IMG + "portraits/makoto.png",
      client: "新岛真",
      risk: "中",
      reward: "律令类词条",
      statusLabel: "待处理",
      body: [
        "空白页边缘有微弱热感残留，拍摄角度不同会呈现不同水印。",
        "建议交叉比对打印机日志与门禁记录。",
        "若牵涉教职工，降低公开讨论音量。"
      ]
    },
    {
      id: "T06",
      title: "健身房：幽灵预约",
      tag: "支援",
      level: "★",
      district: "涩谷",
      timeWindow: "傍晚",
      summary: "器械被匿名占用却无人到场，影响普通客人体验。",
      cover: IMG + "portraits/ryuji.png",
      client: "坂本龙司",
      risk: "低",
      reward: "体力上限提示",
      statusLabel: "待处理",
      body: [
        "预约系统出现循环队列错误，疑似脚本刷号。",
        "建议先联系前台冻结异常账号批次。",
        "完成後在委托板标记「已闭环」便于统计。"
      ]
    },
    {
      id: "T07",
      title: "印象空间：深潜信标校准",
      tag: "行动",
      level: "★★★",
      district: "异世界",
      timeWindow: "无限制",
      summary: "信标读数漂移，需要有人在三层以下重新锚定坐标。",
      cover: IMG + "crowd/crowd3.png",
      client: "怪盗团（公开频道）",
      risk: "高",
      reward: "探索进度 +",
      statusLabel: "待处理",
      body: [
        "漂移方向与某人的「后悔」关键词强相关。",
        "建议两人一组，单人作业极易迷路。",
        "深潜区域敌人等级跳跃大，务必备齐退出道具。"
      ]
    },
    {
      id: "T08",
      title: "植物园：夜间灌溉异常",
      tag: "支援",
      level: "★",
      district: "神田",
      timeWindow: "夜间",
      summary: "灌溉系统定时紊乱，导致珍贵样本受损风险。",
      cover: IMG + "portraits/haru.png",
      client: "奥村春",
      risk: "低",
      reward: "种植线剧情占位",
      statusLabel: "待处理",
      body: [
        "控制板日志显示人为远程指令，但 IP 指向空壳路由。",
        "建议先手动切到安全模式，再排查传感器。",
        "若闻到异常花香，佩戴防护口罩（剧情占位）。"
      ]
    },
    {
      id: "T09",
      title: "检事局外围：媒体话术包",
      tag: "情报",
      level: "★★",
      district: "霞关",
      timeWindow: "工作时段",
      summary: "收集高度同质化的通稿口径，分析幕后推手。",
      cover: IMG + "portraits/akechi.png",
      client: "匿名情报商",
      risk: "中",
      reward: "舆论战占位",
      statusLabel: "待处理",
      body: [
        "话术包更新频率异常稳定，像流水线产品。",
        "建议建立关键词云与发布时间相关性矩阵。",
        "注意自我保护：不要单独接触可疑线人。"
      ]
    },
    {
      id: "T10",
      title: "印象空间：群体焦虑块",
      tag: "行动",
      level: "★★",
      district: "异世界",
      timeWindow: "周末",
      summary: "巨大阴影聚合体，会周期性释放范围恐慌。",
      cover: IMG + "crowd/crowd7.png",
      client: "摩尔加纳",
      risk: "中",
      reward: "同伴勇气 +",
      statusLabel: "待处理",
      body: [
        "阴影核心藏在移动平台之后，需要分路吸引火力。",
        "建议携带净化/解除恐惧的被动或道具。",
        "战斗时间过长会叠加层数，速战速决。"
      ]
    },
    {
      id: "T11",
      title: "旧书店：索引卡片错位",
      tag: "支援",
      level: "★",
      district: "吉祥寺",
      timeWindow: "下午",
      summary: "珍本索引与实体位置长期不一致，需要志愿者逐架核对。",
      cover: IMG + "portraits/yusuke.png",
      client: "喜多川祐介",
      risk: "低",
      reward: "美术资料占位",
      statusLabel: "待处理",
      body: [
        "错位模式呈现「螺旋」形状，不像随机错误。",
        "建议从最近进货批次反向追踪。",
        "核对时轻拿轻放，避免触发警报（占位）。"
      ]
    },
    {
      id: "T12",
      title: "地铁闸机：误扣费集群",
      tag: "情报",
      level: "★",
      district: "全线",
      timeWindow: "高峰",
      summary: "同一卡组在短时间内被多点扣费，疑似系统漏洞或攻击。",
      cover: IMG + "portraits/futaba.png",
      client: "佐仓双叶",
      risk: "低",
      reward: "交通类词条",
      statusLabel: "待处理",
      body: [
        "扣费时间戳呈等差数列，极像自动化脚本。",
        "建议拉取一周样本做可视化。",
        "对外口径统一为「调查中」，避免恐慌。"
      ]
    },
    {
      id: "T13",
      title: "印象空间：守财奴宝库",
      tag: "行动",
      level: "★★★",
      district: "异世界",
      timeWindow: "夜间",
      summary: "守财奴型阴影囤积大量「安全券」，需要夺取并释放。",
      cover: IMG + "crowd/crowd10.png",
      client: "怪盗团（公开频道）",
      risk: "高",
      reward: "金钱占位奖励",
      statusLabel: "待处理",
      body: [
        "宝库门与阴影 HP 绑定，需先削弱再开启。",
        "建议带上降低防御或即死耐性对策（占位）。",
        "战利品分配记得截图留念（原型玩笑）。"
      ]
    },
    {
      id: "T14",
      title: "慈善晚会：邀请函黑市",
      tag: "情报",
      level: "★★",
      district: "六本木",
      timeWindow: "晚间",
      summary: "邀请函被加价倒卖，追踪卖方社交痕迹。",
      cover: IMG + "portraits/haru.png",
      client: "奥村春",
      risk: "中",
      reward: "社交线占位",
      statusLabel: "待处理",
      body: [
        "卖方头像均来自同一批 AI 生成素材。",
        "建议从支付托管方反查 KYC 漏洞。",
        "进入会场前核对防伪水印版本号。"
      ]
    },
    {
      id: "T15",
      title: "河岸：涂鸦诅咒传言",
      tag: "支援",
      level: "★",
      district: "目黑",
      timeWindow: "黄昏",
      summary: "特定涂鸦旁频繁发生意外，需要现场记录与安抚。",
      cover: IMG + "portraits/ann.png",
      client: "高卷杏",
      risk: "低",
      reward: "艺术社群 +",
      statusLabel: "待处理",
      body: [
        "传言扩散路径符合课堂闲聊拓扑。",
        "建议联合当地志愿者做科普展板。",
        "若涂鸦内容涉及隐私，立即打码存档。"
      ]
    },
    {
      id: "T16",
      title: "印象空间：巡逻路线复写",
      tag: "行动",
      level: "★★",
      district: "异世界",
      timeWindow: "任意",
      summary: "敌人巡逻路线被恶意复写，导致安全区缩小。",
      cover: IMG + "crowd/crowd1.png",
      client: "新岛真",
      risk: "中",
      reward: "战术笔记占位",
      statusLabel: "待处理",
      body: [
        "复写脚本留有「签名」式拐点，可逆推来源层。",
        "建议小队保持三角站位推进。",
        "遇到红色信标不要贸然触碰。"
      ]
    },
    {
      id: "T17",
      title: "电竞馆：假赛盘口异动",
      tag: "情报",
      level: "★★",
      district: "秋叶原",
      timeWindow: "夜间",
      summary: "盘口在赛前出现异常单向押注，需要数据快照。",
      cover: IMG + "portraits/futaba.png",
      client: "佐仓双叶",
      risk: "中",
      reward: "电竞词条",
      statusLabel: "待处理",
      body: [
        "异动账户与某选手训练室 MAC 地址冲突（占位）。",
        "建议只收集公开数据，避免侵入式手段。",
        "结果出炉后记得更新委托状态。"
      ]
    },
    {
      id: "T18",
      title: "社区食堂：供应链短驳",
      tag: "支援",
      level: "★",
      district: "四轩茶屋",
      timeWindow: "清晨",
      summary: "食材短驳车迟到导致菜单缩水，需要临时调度人手。",
      cover: IMG + "portraits/ryuji.png",
      client: "坂本龙司",
      risk: "低",
      reward: "体力恢复占位",
      statusLabel: "待处理",
      body: [
        "迟到点集中在同一施工路段。",
        "建议绘制替代路线并预演一次。",
        "完成后请给店长一句好评（占位）。"
      ]
    },
    {
      id: "T19",
      title: "印象空间：镜像走廊",
      tag: "行动",
      level: "★★★",
      district: "异世界",
      timeWindow: "深夜",
      summary: "走廊自我复制，需要找到主镜节点并击破。",
      cover: IMG + "crowd/crowd5.png",
      client: "摩尔加纳",
      risk: "高",
      reward: "技能卡占位",
      statusLabel: "待处理",
      body: [
        "主镜节点会模仿玩家最近三次技能（占位）。",
        "建议轮换属性攻击避免被读穿。",
        "迷路时用双叶的导航语音包（玩笑）。"
      ]
    },
    {
      id: "T20",
      title: "天文台：观测日志缺口",
      tag: "情报",
      level: "★",
      district: "台场",
      timeWindow: "凌晨",
      summary: "关键时段日志缺失，需要补采星图与云量记录。",
      cover: IMG + "portraits/sumire.png",
      client: "芳泽霞",
      risk: "低",
      reward: "体操部线占位",
      statusLabel: "待处理",
      body: [
        "缺口与一次短暂停电重合。",
        "建议调取 UPS 日志与硬盘 SMART。",
        "户外作业注意保暖。"
      ]
    }
  ];
})();
