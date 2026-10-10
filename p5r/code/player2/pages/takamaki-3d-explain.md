# `takamaki-3d.html` 逐行解释

下面为 `takamaki-3d.html` 的逐行/逐段解释，便于查阅与维护。

1. <!doctype html> — 声明 HTML5 文档类型。
2. <html lang="zh-CN"> — 根元素，页面语言为简体中文。
3. <head> — 文档头部开始。
4. <meta charset="UTF-8" /> — 指定字符编码为 UTF-8。
5. <meta name="viewport" content="width=device-width, initial-scale=1.0" /> — 响应式视口设置。
6. <title>火箭射击</title> — 浏览器标签标题“火箭射击”。
7. <link rel="stylesheet" href="../../../shared/p5ui/css/p5-ui.css" /> — 引入全局 p5-ui 样式库。
8. <link rel="stylesheet" href="../../shared/site.css" /> — 引入站点共享样式。
9. <link rel="stylesheet" href="../../player4/characters.css" /> — 引入人物页相关样式（复用）。
10. <style> — 内联样式开始（页面特定 CSS）。
11. body.p5r-characters[data-p5r-page="player2-canvas-game"] { — 选择器：当 body 有该类和 data 属性时应用样式（限定到此页面）。
12.   min-height: 100vh; — 最小高度为视口高度（回退）。
13.   min-height: 100dvh; — 使用动态视口高度以适配移动浏览器工具栏。
14.   display: flex; — 使用 Flex 布局使主内容可垂直伸缩。
15.   flex-direction: column; — 列方向排列。
16. }
17. body.p5r-characters[data-p5r-page="player2-canvas-game"] .p5r-photoStageMain.p2-cvg-main { — 对主区域容器的样式（居中、宽度限制等）。
18.   flex: 1 1 auto; — 在列布局中可伸缩，占据剩余空间。
19.   display: flex; — 内部也使用 flex 布局。
20.   flex-direction: column; — 列方向。
21.   justify-content: center; — 垂直居中内容。
22.   align-items: center; — 水平居中内容。
23.   width: 100%; — 宽度 100%。
24.   max-width: 520px; — 最大宽度 520px，控制画布居中显示宽度。
25.   margin: 0 auto; — 左右居中容器。
26.   padding-top: calc(var(--p5r-h) + var(--p5r-blockGap)); — 顶部内边距由全局变量决定（与头部高度/间隔配合）。
27.   padding-left: var(--p5r-edgePad); — 左右边距变量化。
28.   padding-right: var(--p5r-edgePad);
29.   padding-bottom: 32px; — 底部固定内边距。
30.   box-sizing: border-box; — 盒模型包含内边距。
31.   min-height: 0; — 允许在 flex 容器中收缩（避免 overflow）。
32. }
33. .p2-cvg-toolbar { — 工具栏容器样式（开始）。
34.   display: flex; — 水平排列按钮。
35.   flex-wrap: wrap; — 小屏时换行。
36.   align-items: center; — 垂直对齐。
37.   justify-content: center; — 水平居中。
38.   gap: 10px; — 子元素间距。
39.   margin-bottom: 14px; — 下方间距。
40. }
41. .p2-cvg-toolbar .p5-btn-ctn { — 工具栏中按钮最小宽度约束。
42.   min-width: 120px;
43. }
44. .p2-cvg-meta { — 分数显示区域样式。
45.   width: 100%;
46.   text-align: center;
47.   font-size: 13px;
48.   letter-spacing: 0.06em;
49.   color: rgba(255, 255, 255, 0.78);
50.   margin-bottom: 10px;
51. }
52. .p2-cvg-board { — 画板外壳样式（包含 canvas）。
53.   margin: 0 auto;
54.   max-width: 400px;
55.   border-radius: 14px;
56.   border: 2px solid rgba(255, 255, 255, 0.14);
57.   background: rgba(0, 0, 0, 0.5);
58.   box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 0, 34, 0.08);
59.   overflow: hidden; — 隐藏溢出内容，保持圆角效果。
60. }
61. .p2-cvg-canvas { — Canvas 的视觉与交互样式。
62.   display: block;
63.   width: 100%; — 画布宽度撑满容器（物理像素通过脚本调整）。
64.   height: min(52vh, 440px); — 高度为视口 52% 或 440px 取小者。
65.   min-height: 300px; — 最小高度 300px。
66.   touch-action: none; — 禁用手势默认行为，便于捕获 pointer 事件。
67.   cursor: pointer; — 鼠标显示为可点击手势。
68. }
69. @media (prefers-reduced-motion: reduce) { — 如果用户偏好减少动画（无障碍），调整交互样式。
70.   .p2-cvg-canvas {
71.     cursor: default; — 取消指针手型提示。
72.   }
73. }
74. </style> — 内联样式结束。
75. </head> — 头部结束。
76. <body class="p5r-characters" data-p5r-page="player2-canvas-game"> — 页面主体，类与 data 属性用于样式/脚本识别。
77. <header class="p5r-header p5r-header--solid" role="banner"> — 页面头部（导航）开始。
78.   <div class="p5r-header__left"> — 头部左侧容器。
79.     <img class="p5r-logo" src="../../../shared/p5ui/assets/src-assets/logo.png" alt="logo" /> — logo 图片。
80.   </div> — 左侧结束。
81.   <div class="p5r-header__right"> — 头部右侧，导航/用户区域开始。
82.     <nav class="p5r-header__nav" aria-label="委托、公告、联系与人物"> — 主导航，含多组下拉（details）。
83.       <details class="p5r-headerNav" id="p5rHeaderRequestsNav"> — 第一个下拉：委托。
84.         <summary class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__summary"> — summary 作为触发按钮。
85.           <span class="p5r-headerNav__summaryText">委托</span> — 按钮文本。
86.           <span class="p5r-headerNav__caret" aria-hidden="true"></span> — caret 图标（装饰）。
87.         </summary>
88.         <div class="p5r-headerNav__panel" role="group" aria-label="委托与我的任务"> — 下拉面板组。
89.           <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="../../player3/pages/requests.html">委托</a> — 链接到请求页。
90.           <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="../../player3/pages/my-missions.html">我的任务</a> — 我的任务。
91.         </div>
92.       </details>
93.       <a class="p5-btn-ctn p5-hover-animation-gray p5r-bulletinNavSolo" href="../../player1/pages/bulletins.html">公告</a> — 单独的公告链接。
94.       <details class="p5r-headerNav" id="p5rHeaderContactNav"> — 第二个下拉：联系/小游戏。
95.         <summary class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__summary">
96.           <span class="p5r-headerNav__summaryText">联系</span>
97.           <span class="p5r-headerNav__caret" aria-hidden="true"></span>
98.         </summary>
99.         <div class="p5r-headerNav__panel" role="group" aria-label="联系与小游戏">
100.           <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="contact.html">联系</a> — 本地联系页。
101.           <a class="p5-btn-ctn p5-hover-animation-mix p5r-headerNav__item is-current" href="takamaki-3d.html" aria-current="page">小游戏</a> — 当前页面链接，标记为当前页。
102.         </div>
103.       </details>
104.       <details class="p5r-headerNav" id="p5rHeaderNav"> — 第三个下拉：人物相关。
105.         <summary class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__summary">
106.           <span class="p5r-headerNav__summaryText">人物</span>
107.           <span class="p5r-headerNav__caret" aria-hidden="true"></span>
108.         </summary>
109.         <div class="p5r-headerNav__panel" role="group" aria-label="人物子页面">
110.           <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="../../player4/pages/characters.html">人物</a>
111.           <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="../../player4/pages/photo-stage.html">照片舞台</a>
112.           <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="../../player4/pages/book-flip.html">人物画册</a>
113.           <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="../../player4/pages/card-draw.html">卡片抽取</a>
114.         </div>
115.       </details>
116.     </nav> — 主导航结束。
117.     <div class="p5r-headerUser" data-p5r-header-user> — 用户区域开始（个人中心、退出、用户名）。
118.       <div class="p5r-profileEntryWrap">
119.         <a id="profileEntry" class="p5-btn-ctn p5-hover-animation-gray" href="../../player4/pages/profile.html">个人中心</a> — 个人中心链接。
120.         <div class="p5r-headerUserMenu" role="group" aria-label="账户操作">
121.           <button type="button" class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item p5r-headerUserMenu__btn" data-p5r-logout>退出</button> — 退出按钮，带 data 属性供脚本绑定。
122.         </div>
123.       </div>
124.       <span class="p5r-headerUserName" id="p5rHeaderUserName">游客</span> — 显示用户名，默认“游客”。
125.     </div> — 用户区域结束。
126.   </div> — 头部右侧结束。
127. </header> — 头部结束。
128.
129. <main class="p5r-photoStageMain p2-cvg-main" aria-label="火箭射击"> — 主要内容区（游戏舞台），含可访问标签。
130.   <div class="p2-cvg-meta" id="p2CvgMeta" aria-live="polite">得分：0　最高：0</div> — 分数显示，`aria-live` 便于屏幕阅读器读出更新。
131.   <div class="p2-cvg-toolbar"> — 工具栏，包含开始/暂停/重置按钮。
132.     <button type="button" class="p5-btn-ctn p5-hover-animation-mix" id="p2CvgStart">开始 / 继续</button> — 开始或继续按钮。
133.     <button type="button" class="p5-btn-ctn p5-hover-animation-gray" id="p2CvgPause">暂停</button> — 暂停按钮。
134.     <button type="button" class="p5-btn-ctn p5-hover-animation-gray" id="p2CvgReset">重新开始</button> — 重新开始按钮。
135.   </div>
136.   <div class="p2-cvg-board"> — 画布外壳。
137.     <canvas id="p2CvgCanvas" class="p2-cvg-canvas" width="360" height="420" aria-label="火箭射击"></canvas> — Canvas 元素，初始像素尺寸 360x420（脚本会根据 DPR 调整实际分辨率）。
138.   </div>
139. </main> — 主区域结束。
140.
141. <div id="p5NotiHost" class="site-notiHost" aria-live="polite" aria-relevant="additions removals"></div> — 通知宿主（供脚本插入通知）。
142. <div id="p5NotiTpl" class="p5-noti-ctn" style="display: none"> — 隐藏的通知模板（复用）。
143.   <div class="p5-noti-sub-ctn"> — 模板内容开始。
144.     <img class="p5-portrait-img" src="../../../shared/p5ui/assets/src-assets/images/portraits/mona.png" alt="" /> — 模板头像（装饰）。
145.     <div class="p5-dialog-ctn"> — 气泡容器。
146.       <img class="p5-dialog-img" src="../../../shared/p5ui/assets/src-assets/images/notification.png" alt="" /> — 气泡背景图。
147.       <div class="p5-noti-title">
148.         <p class="p5-title-ctn text-size-small"><span>摩尔 加纳</span></p> — 通知标题（发送者名）。
149.       </div>
150.       <div class="p5-noti-text">通知示例</div> — 通知正文占位。
151.     </div>
152.   </div>
153. </div> — 通知模板结束。
154. <div id="p5BackTop" class="p5-top-ctn" hidden style="right: 28px; bottom: 28px"> — 回到顶部控件（初始 hidden）。
155.   <img src="../../../shared/p5ui/assets/src-assets/images/back-top.png" alt="back top" />
156. </div>
157.
158. <script src="../../shared/site.js"></script> — 引入共享脚本，包含页面通用行为与 P5Proto 等（若定义）。
159. <script> — 内联脚本开始：实现火箭射击小游戏逻辑。
160. (function () { — 自执行函数，创建私有作用域避免污染全局。
161.   "use strict"; — 严格模式。
162.
163.   var canvas = document.getElementById("p2CvgCanvas"); — 获取 canvas 元素。
164.   var meta = document.getElementById("p2CvgMeta"); — 获取显示分数的元素。
165.   var btnStart = document.getElementById("p2CvgStart"); — 获取开始按钮。
166.   var btnPause = document.getElementById("p2CvgPause"); — 获取暂停按钮。
167.   var btnReset = document.getElementById("p2CvgReset"); — 获取重置按钮。
168.   if (!canvas || !meta || !btnStart || !btnPause || !btnReset) return; — 如果任一必需元素不存在则退出脚本。
169.   var ctx = canvas.getContext && canvas.getContext("2d"); — 获取 2D 渲染上下文（防御式写法）。
170.   if (!ctx) return; — 若不支持 canvas 则退出。
171.
172.   var storageKey = "p2-canvasRocketGame-hi"; — 本地存储键名，用于保存最高分。
173.   var hi = 0; — 最高分变量初始为 0。
174.   try {
175.     hi = parseInt(localStorage.getItem(storageKey) || "0", 10) || 0; — 尝试从 localStorage 读取最高分，防止异常。
176.   } catch (e) {
177.     hi = 0; — 读取失败时回退为 0。
178.   }
179.
180.   var dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1)); — 设备像素比，向下取整确保整数倍缩放（≥1）。
181.   var w = 360; — 初始逻辑宽度（像素单位，脚本在 resize 时更新）。
182.   var h = 420; — 初始逻辑高度。
183.
184.   function resize() { — 根据元素实际布局尺寸调整 canvas 的物理像素尺寸与 ctx 缩放。
185.     var r = canvas.getBoundingClientRect(); — 获取显示尺寸（CSS 像素）。
186.     w = Math.max(1, Math.floor(r.width)); — 取整并保护最小值。
187.     h = Math.max(1, Math.floor(r.height));
188.     var tw = w * dpr; — 物理像素宽度。
189.     var th = h * dpr; — 物理像素高度。
190.     if (canvas.width !== tw || canvas.height !== th) { — 仅在尺寸变化时重设画布物理尺寸。
191.       canvas.width = tw;
192.       canvas.height = th;
193.       ctx.setTransform(dpr, 0, 0, dpr, 0, 0); — 将绘图坐标系缩放回 CSS 像素坐标系，便于按逻辑像素绘制。
194.     }
195.   }
196.
197.   var running = false; — 游戏是否运行中。
198.   var raf = 0; — requestAnimationFrame 的 id，便于取消。
199.   var lastT = 0; — 上一帧时间戳，用于计算 dt。
200.   var score = 0; — 当前得分。
201.   var over = false; — 游戏是否结束（坠毁）。
202.   var keys = { left: false, right: false }; — 键盘左右按键状态。
203.   var player = { x: 0, y: 0, halfW: 18, nose: 22, tail: 16 }; — 玩家（火箭）属性：位置与尺寸参数。
204.   var bullets = []; — 子弹数组。
205.   var enemies = []; — 敌人数组。
206.   var spawnTimer = 0; — 敌人生成计时器（秒）。
207.   var fireTimer = 0; — 开火计时器（秒）。
208.   var pointerActive = false; — 指针（触控/鼠标）是否处于按下/拖动状态。
209.   var pointerTargetX = 0; — 指针目标 x 坐标（逻辑像素）。
210.
211.   function rnd(a, b) { — 返回 (a,b) 范围内的随机数。
212.     return a + Math.random() * (b - a);
213.   }
214.
215.   function clamp(v, a, b) { — 限制值在 [a,b] 区间。
216.     return Math.max(a, Math.min(b, v));
217.   }
218.
219.   function updateMeta() { — 更新页面上分数文本。
220.     meta.textContent = "得分：" + score + "　最高：" + hi + (over ? "　（坠毁）" : "");
221.   }
222.
223.   function placePlayer() { — 将玩家放置在初始位置（底部中间）。
224.     player.x = w * 0.5;
225.     player.y = h * 0.88;
226.     pointerTargetX = player.x; — 指针目标同步到玩家当前位置。
227.   }
228.
229.   function resetGame() { — 重置游戏状态（重新开始）。
230.     score = 0;
231.     over = false;
232.     bullets = [];
233.     enemies = [];
234.     spawnTimer = 0.55; — 初始生成间隔。
235.     fireTimer = 0;
236.     lastT = 0;
237.     keys.left = false;
238.     keys.right = false;
239.     pointerActive = false;
240.     resize(); — 适配画布尺寸。
241.     placePlayer(); — 放置玩家。
242.     updateMeta(); — 更新分数显示。
243.     draw(0); — 绘制初始帧（传 0 作为时间戳）。
244.   }
245.
246.   function spawnEnemy() { — 生成一个敌人并加入数组。
247.     var r = rnd(14, 22); — 敌人半径随机（14~22）。
248.     var fall = 52 + Math.min(220, score * 3.2 + (score > 25 ? (score - 25) * 1.8 : 0)); — 垂直速度随分数增加（难度曲线）。
249.     enemies.push({ — 敌人对象包含位置、半径、速度与旋转角。
250.       x: rnd(r + 8, w - r - 8), — 横向随机位置，考虑边界。
251.       y: -r - 4, — 从上方外部开始。
252.       r: r,
253.       vy: fall, — 竖直下落速度。
254.       vx: rnd(-28, 28) * (0.35 + Math.min(1, score * 0.02)), — 横向速度随分数略加成并随机方向。
255.       rot: rnd(0, 6.28) — 随机初始旋转角（0~2π）。
256.     });
257.   }
258.
259.   function dist2(ax, ay, bx, by) { — 计算两点的平方距离（避免开根号以节省性能）。
260.     var dx = ax - bx;
261.     var dy = ay - by;
262.     return dx * dx + dy * dy;
263.   }
264.
265.   function enemyHitPlayer(e) { — 判断敌人与玩家是否碰撞（圆圈碰撞近似）。
266.     var cx = player.x;
267.     var cy = player.y - 6; — 玩家碰撞点稍向上偏移（调整命中判定）。
268.     var rr = e.r + 17; — 整体碰撞半径 = 敌人半径 + 玩家半径估算（17）。
269.     return dist2(e.x, e.y, cx, cy) < rr * rr; — 若平方距离小于 rr^2 则命中。
270.   }
271.
272.   function drawRocket(ts) { — 绘制玩家火箭，包含火焰效果（基于时间抖动）。
273.     var px = player.x;
274.     var py = player.y;
275.     var flick = 8 + Math.sin((ts || 0) * 0.018) * 3.5; — 火焰抖动幅度随时间变化。
276.     ctx.save(); — 保存画布状态。
277.     ctx.translate(px, py); — 原点移至玩家位置，便于相对绘制。
278.     ctx.fillStyle = "rgba(28, 254, 255, 0.95)"; — 火箭主体颜色。
279.     ctx.strokeStyle = "rgba(255, 255, 255, 0.35)"; — 描边颜色。
280.     ctx.lineWidth = 1.2;
281.     ctx.beginPath();
282.     ctx.moveTo(0, -player.nose); — 火箭尖端。
283.     ctx.lineTo(-player.halfW, player.tail); — 左下角。
284.     ctx.lineTo(player.halfW, player.tail); — 右下角。
285.     ctx.closePath();
286.     ctx.fill(); — 填充火箭机身。
287.     ctx.stroke(); — 描边。
288.     ctx.fillStyle = "rgba(255, 60, 90, 0.75)"; — 火焰颜色（红色系）。
289.     ctx.beginPath();
290.     ctx.moveTo(-6, player.tail - 2);
291.     ctx.lineTo(0, player.tail + flick); — 火焰尖端随 flick 抖动。
292.     ctx.lineTo(6, player.tail - 2);
293.     ctx.closePath();
294.     ctx.fill(); — 填充火焰三角形。
295.     ctx.restore(); — 恢复画布状态。
296.   }
297.
298.   function draw(ts) { — 整体绘制函数：背景、网格线、子弹、敌人、玩家、提示文字。
299.     resize(); — 确保画布尺寸正确。
300.     if (!player.y) placePlayer(); — 若玩家尚未定位则放置。
301.     ctx.clearRect(0, 0, w, h); — 清空画布。
302.
303.     var g = ctx.createLinearGradient(0, 0, w, h); — 创建背景线性渐变。
304.     g.addColorStop(0, "rgba(12, 8, 32, 0.95)");
305.     g.addColorStop(0.55, "rgba(26, 6, 40, 0.92)");
306.     g.addColorStop(1, "rgba(0, 0, 0, 0.96)");
307.     ctx.fillStyle = g;
308.     ctx.fillRect(0, 0, w, h); — 填充背景。
309.
310.     ctx.strokeStyle = "rgba(255, 0, 68, 0.08)"; — 细竖线网格的描边色。
311.     ctx.lineWidth = 1;
312.     var sx;
313.     for (sx = (ts * 0.02) % 40; sx < w + 40; sx += 40) { — 绘制倾斜网格线，随时间滚动（产生运动感）。
314.       ctx.beginPath();
315.       ctx.moveTo(sx, 0);
316.       ctx.lineTo(sx - 30, h);
317.       ctx.stroke();
318.     }
319.
320.     var i;
321.     var b;
322.     for (i = 0; i < bullets.length; i++) { — 绘制所有子弹。
323.       b = bullets[i];
324.       ctx.fillStyle = "rgba(255, 240, 200, 0.95)";
325.       ctx.shadowColor = "rgba(28, 254, 255, 0.5)";
326.       ctx.shadowBlur = 8; — 子弹发光效果。
327.       ctx.fillRect(b.x - 1.5, b.y - 8, 3, 14); — 用矩形表示子弹。
328.       ctx.shadowBlur = 0; — 清除阴影以免污染后续绘制。
329.     }
330.
331.     var e;
332.     for (i = 0; i < enemies.length; i++) { — 绘制每个敌人（星形/多角形视觉）。
333.       e = enemies[i];
334.       ctx.save();
335.       ctx.translate(e.x, e.y); — 移动到敌人中心。
336.       ctx.rotate(e.rot + (ts || 0) * 0.0012 * (i % 2 ? 1 : -1)); — 根据索引交替旋转方向并随时间缓慢旋转。
337.       var rg = ctx.createRadialGradient(0, 0, 2, 0, 0, e.r); — 放射渐变用于敌人填充。
338.       rg.addColorStop(0, "rgba(255, 120, 140, 0.95)");
339.       rg.addColorStop(0.55, "rgba(180, 20, 60, 0.9)");
340.       rg.addColorStop(1, "rgba(60, 0, 20, 0.85)");
341.       ctx.fillStyle = rg;
342.       ctx.beginPath();
343.       ctx.moveTo(e.r, 0);
344.       for (var k = 1; k < 6; k++) { — 生成一个 5 边形（星形近似）点集。
345.         var ang = (k * Math.PI * 2) / 5 - Math.PI / 2;
346.         ctx.lineTo(Math.cos(ang) * e.r * 0.88, Math.sin(ang) * e.r * 0.88);
347.       }
348.       ctx.closePath();
349.       ctx.fill(); — 填充敌人形状。
350.       ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
351.       ctx.lineWidth = 1;
352.       ctx.stroke(); — 添加浅描边。
353.       ctx.restore();
354.     }
355.
356.     drawRocket(ts); — 绘制玩家火箭（在敌人后或前这是设计选择，这里在敌人之后绘制）。
357.
358.     if (!running && !over) { — 游戏未开始且未结束时绘制提示文字。
359.       ctx.fillStyle = "rgba(255,255,255,0.82)";
360.       ctx.font = "bold 14px system-ui, -apple-system, Segoe UI, sans-serif";
361.       ctx.textAlign = "center";
362.       ctx.fillText("点「开始 / 继续」或按空格", w / 2, h * 0.42);
363.     }
364.     if (over) { — 游戏结束时提示“坠毁”和重试说明。
365.       ctx.fillStyle = "rgba(255,255,255,0.9)";
366.       ctx.font = "900 16px system-ui, -apple-system, Segoe UI, sans-serif";
367.       ctx.textAlign = "center";
368.       ctx.fillText("坠毁", w / 2, h * 0.44);
369.       ctx.font = "13px system-ui, -apple-system, Segoe UI, sans-serif";
370.       ctx.fillText("点「重新开始」", w / 2, h * 0.44 + 22);
371.     }
372.   } — draw 函数结束。
373.
374.   function step(ts) { — 游戏主循环逻辑（由 requestAnimationFrame 调用）。
375.     if (!running || over) return; — 若未运行或已结束则跳出。
376.     if (!lastT) lastT = ts; — 初始化上一帧时间。
377.     var dt = Math.min(0.045, (ts - lastT) / 1000); — 计算帧间隔（限制最大 dt，避免跳帧导致大步进）。
378.     lastT = ts;
379.
380.     var moveSpd = 240 + Math.min(160, score * 2.4); — 玩家移动速度随分数略增，最高加 160。
381.     if (pointerActive) { — 若使用指针控制（触摸/鼠标按下），插值移动到目标 x。
382.       player.x += (pointerTargetX - player.x) * Math.min(1, dt * 10);
383.     } else {
384.       if (keys.left) player.x -= moveSpd * dt; — 键盘左移。
385.       if (keys.right) player.x += moveSpd * dt; — 键盘右移。
386.     }
387.     player.x = clamp(player.x, player.halfW + 6, w - player.halfW - 6); — 限制玩家不出边界。
388.
389.     fireTimer -= dt; — 开火计时器递减。
390.     var fireEvery = Math.max(0.1, 0.22 - Math.min(0.09, score * 0.002)); — 开火间隔随分数变化（更高分率更快）。
391.     if (fireTimer <= 0) { — 若到达开火时间则产生子弹。
392.       fireTimer = fireEvery;
393.       bullets.push({ x: player.x, y: player.y - player.nose - 2, vy: -520 - Math.min(180, score * 2) }); — 子弹初速随分数增加但有上限。
394.     }
395.
396.     spawnTimer -= dt; — 敌人生成计时器递减。
397.     var spawnEvery = Math.max(0.35, 1.05 - score * 0.012); — 生成间隔随分数缩短（最低 0.35s）。
398.     if (spawnTimer <= 0) {
399.       spawnTimer = spawnEvery;
400.       spawnEnemy(); — 触发新敌人生成。
401.     }
402.
403.     var i;
404.     var j;
405.     var b;
406.     var e;
407.     var hit;
408.     for (i = bullets.length - 1; i >= 0; i--) { — 反向遍历子弹数组以便安全删除。
409.       b = bullets[i];
410.       b.y += b.vy * dt; — 子弹移动（y 方向）。
411.       if (b.y < -20) { — 超出上边界则移除。
412.         bullets.splice(i, 1);
413.         continue;
414.       }
415.       hit = false;
416.       for (j = enemies.length - 1; j >= 0; j--) { — 反向遍历敌人检测碰撞。
417.         e = enemies[j];
418.         if (dist2(b.x, b.y, e.x, e.y) < (e.r + 5) * (e.r + 5)) { — 碰撞判定（简单圆形近似）。
419.           enemies.splice(j, 1); — 击中则移除敌人。
420.           hit = true;
421.           score += 1; — 增加分数。
422.           if (score > hi) { — 更新最高分并尝试保存到 localStorage。
423.             hi = score;
424.             try {
425.               localStorage.setItem(storageKey, String(hi));
426.             } catch (e2) {}
427.           }
428.           updateMeta(); — 刷新分数显示。
429.           break; — 子弹只会击中一个敌人（退出内层循环）。
430.         }
431.       }
432.       if (hit) bullets.splice(i, 1); — 若命中则移除该子弹。
433.     }
434.
435.     for (i = enemies.length - 1; i >= 0; i--) { — 更新敌人位置并检测撞击玩家或离场。
436.       e = enemies[i];
437.       e.y += e.vy * dt; — 垂直位移。
438.       e.x += e.vx * dt; — 横向位移。
439.       e.x = clamp(e.x, e.r + 4, w - e.r - 4); — 限制敌人横向不出边界。
440.       if (e.y - e.r > h + 40) { — 超出画布下方则移除。
441.         enemies.splice(i, 1);
442.         continue;
443.       }
444.       if (enemyHitPlayer(e)) { — 检测是否撞上玩家。
445.         over = true; — 标记游戏结束。
446.         running = false; — 停止运行。
447.         updateMeta(); — 更新分数显示（显示坠毁）。
448.         raf = 0; — 清除 raf id。
449.         draw(ts); — 绘制一帧显示坠毁效果。
450.         return; — 退出 step（终止循环）。
451.       }
452.     }
453.
454.     draw(ts); — 绘制当前帧。
455.     if (running && !over) {
456.       raf = requestAnimationFrame(step); — 继续下一帧循环。
457.     } else {
458.       raf = 0;
459.     }
460.   } — step 函数结束。
461.
462.   function startOrResume() { — 启动或恢复游戏。
463.     if (over) return; — 如果已结束不可启动（要求重置）。
464.     if (running && raf) return; — 已在运行则忽略。
465.     running = true;
466.     lastT = 0; — 重置时间基线，避免大 dt 跳帧。
467.     raf = requestAnimationFrame(step); — 启动循环。
468.   }
469.
470.   function pauseGame() { — 暂停游戏并取消动画帧。
471.     running = false;
472.     pointerActive = false; — 取消指针控制状态。
473.     if (raf) {
474.       cancelAnimationFrame(raf);
475.       raf = 0;
476.     }
477.     draw(performance.now()); — 绘制一次静止帧（更新提示文字）。
478.   }
479.
480.   btnStart.addEventListener("click", function () { — 绑定开始按钮事件。
481.     if (over) return; — 若已结束忽略。
482.     startOrResume();
483.   });
484.   btnPause.addEventListener("click", function () { — 暂停按钮绑定。
485.     pauseGame();
486.   });
487.   btnReset.addEventListener("click", function () { — 重置按钮绑定。
488.     pauseGame();
489.     resetGame();
490.   });
491.
492.   canvas.addEventListener( — 指针按下：用于触摸/鼠标控制玩家移动并可能启动游戏。
493.     "pointerdown",
494.     function (e) {
495.       if (over) return;
496.       if (!running) {
497.         startOrResume(); — 若未运行则先启动。
498.       }
499.       pointerActive = true;
500.       var r = canvas.getBoundingClientRect(); — 获取显示矩形用于将 clientX 转为逻辑坐标。
501.       pointerTargetX = clamp(((e.clientX - r.left) / r.width) * w, player.halfW + 6, w - player.halfW - 6); — 计算目标 x 并限制边界。
502.     },
503.     { passive: true } — 声明为被动监听器，表示不调用 preventDefault，提升性能。
504.   );
505.   canvas.addEventListener( — 指针移动：当 pointerActive 且未结束时跟随目标。
506.     "pointermove",
507.     function (e) {
508.       if (!pointerActive || over) return;
509.       var r = canvas.getBoundingClientRect();
510.       pointerTargetX = clamp(((e.clientX - r.left) / r.width) * w, player.halfW + 6, w - player.halfW - 6);
511.     },
512.     { passive: true }
513.   );
514.   function pointerEnd() { — 指针结束（up/cancel/leave）统一处理函数。
515.     pointerActive = false;
516.   }
517.   canvas.addEventListener("pointerup", pointerEnd); — 绑定指针结束事件。
518.   canvas.addEventListener("pointercancel", pointerEnd);
519.   canvas.addEventListener("pointerleave", pointerEnd);
520.
521.   window.addEventListener("keydown", function (e) { — 键盘按下处理：空格用于开/暂停，方向键或 A/D 控制移动。
522.     if (e.code === "Space") {
523.       e.preventDefault(); — 阻止页面滚动等默认行为。
524.       if (!over) {
525.         if (running) pauseGame();
526.         else startOrResume();
527.       }
528.       return;
529.     }
530.     if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true; — 标记左移按下。
531.     if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true; — 标记右移按下。
532.   });
533.   window.addEventListener("keyup", function (e) { — 键盘弹起取消左右标记。
534.     if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
535.     if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
536.   });
537.
538.   window.addEventListener("resize", function () { — 窗口尺寸变化时重置玩家位置并重绘。
539.     placePlayer();
540.     draw(performance.now());
541.   });
542.
543.   resetGame(); — 页面加载完成时初始化游戏状态。
544.   updateMeta(); — 更新分数显示（确保 UI 与状态一致）。
545. })(); — 自执行函数结束并立即执行。
546. </script> — 内联脚本结束。
547. </body> — body 结束。
548. </html> — HTML 文档结束。

---

如果你想，我可以：
- 将此解释拆分为更小节（CSS / HTML / JS）并添加索引；
- 把注释直接写回 `takamaki-3d.html`（嵌入简短注释）；
- 或把部分函数做更深入逐行注释（比如碰撞检测或性能优化）。
