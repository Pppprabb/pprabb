# contact.html 逐行解释

下面按原文件行序逐行解释 `contact.html` 的所有代码（编号→简短说明）。

1. <!doctype html> — 声明 HTML5 文档类型。
2. <html lang="zh-CN"> — 根元素，语言为简体中文。
3.   <head> — 文档头部开始。
4.     <meta charset="UTF-8" /> — 指定字符编码 UTF-8。
5.     <meta name="viewport" content="width=device-width, initial-scale=1.0" /> — 响应式视口设置。
6.     <title>玩家反馈 - 联系</title> — 浏览器标签标题文本。
7. (空行) — 可读性空行。
8.     <link rel="stylesheet" href="../../../shared/p5ui/css/p5-ui.css" /> — 引入 p5-ui 全局样式库。
9.     <link rel="stylesheet" href="../../shared/site.css" /> — 引入站点共享样式。
10.     <link rel="stylesheet" href="../../player4/characters.css" /> — 引入人物页样式以复用。
11.     <style> — 内联样式开始（页面特有 CSS）。
12.       /* 联系页：整栏主内容跨三列（无左右侧栏） */ — 注释说明。
13.       body.p5r-characters[data-p5r-page="contact"] .p5r-shell > .p5r-contactMain { — 选择器：针对 contact 页面。
14.         grid-column: 1 / -1; — 使主内容跨越网格所有列（无侧栏）。
15.       } — 结束规则。
16.       .p5r-contactMain { — 主内容容器样式开始。
17.         position: relative; — 相对定位（便于内部绝对元素）。
18.         z-index: 2; — 层级设为 2。
19.         margin-top: 0; — 顶部外边距 0。
20.         padding: var(--p5r-blockGap) var(--p5r-edgePad) 48px; — 上/左右/下内边距（使用变量）。
21.         min-height: calc(100vh - var(--p5r-h) - var(--p5r-banner) - 2 * var(--p5r-blockGap)); — 计算最小高度，考虑头部/banner。
22.         background-color: transparent; — 背景透明。
23.         box-sizing: border-box; — 盒模型包含内边距与边框。
24.       } — 结束 `.p5r-contactMain`。
25.       /* 版心宽度；背景红与表单区红分开（见 .p5r-contactHero / .p5r-contactFormSection） */ — 注释。
26.       .p5r-contactInner { — 内层容器样式。
27.         --p5r-contactFormW: 720px; — 本地变量：表单宽度。
28.         --p5r-contactRedW: calc(var(--p5r-contactFormW) * 1.2); — 背景红区宽度稍大。
29.         max-width: var(--p5r-contactRedW); — 最大宽度限制。
30.         margin: 0 auto; — 水平居中。
31.         padding: var(--p5r-blockGap) clamp(14px, 3vw, 22px) 40px; — 响应式左右内边距与底部内边距。
32.         background-color: transparent; — 背景透明。
33.         box-sizing: border-box;
34.       } — 结束 `.p5r-contactInner`。
35.       .p5r-contactInner .p5r-contactHero,
36.       .p5r-contactInner .p5r-contactFormSection {
37.         max-width: var(--p5r-contactFormW); — 限制为表单宽度。
38.         margin-left: auto; — 左右自动外边距以居中。
39.         margin-right: auto;
40.       } — 结束共享规则。
41.       .p5r-contactLead { — 说明文字样式。
42.         margin: 0 0 var(--p5r-blockGap); — 底部外边距使用变量。
43.         color: rgba(255, 255, 255, 0.88); — 文字颜色。
44.         font-size: 15px;
45.         line-height: 1.65;
46.         letter-spacing: 0.06em;
47.       } — 结束 `.p5r-contactLead`。
48.       .p5r-contactLead p { — 段落下边距。
49.         margin: 0 0 0.75em;
50.       }
51.       .p5r-contactLead p:last-child { — 最后一段取消底部外边距。
52.         margin-bottom: 0;
53.       }
54.       .p5r-contactCard { — 卡片通用样式（边框、圆角、背景、阴影、内边距）。
55.         border: 1px solid rgba(255, 255, 255, 0.14);
56.         border-radius: 16px;
57.         background: linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.55));
58.         box-shadow: 0 22px 60px rgba(0, 0, 0, 0.45);
59.         padding: 20px 18px 18px;
60.         box-sizing: border-box;
61.       }
62.       /* 玩家反馈说明区：偏亮酒红底，与下方表单区分离 */ — 注释。
63.       .p5r-contactHero.p5r-contactCard { — 说明区特化样式。
64.         background: linear-gradient(165deg, #4a1522 0%, #321018 48%, #2a0a10 100%); — 红色渐变背景。
65.         border-color: rgba(255, 120, 140, 0.22); — 边框颜色。
66.         box-shadow: 0 18px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06); — 内阴影与外阴影。
67.       }
68.       .p5r-contactHero { — 说明区额外间距。
69.         margin-bottom: var(--p5r-blockGap);
70.       }
71.       .p5r-contactHero .p5r-contactPageTitle { — 标题下边距。
72.         margin-bottom: 0.5em;
73.       }
74.       /* 提交 / 历史：更深沉的红褐底，与上方玩家反馈块视觉分开 */ — 注释。
75.       .p5r-contactFormSection { — 表单/历史容器样式开始。
76.         display: flex;
77.         flex-direction: column;
78.         gap: 12px;
79.         padding: 18px 16px 20px;
80.         border-radius: 16px;
81.         border: 1px solid rgba(255, 0, 34, 0.18);
82.         background: linear-gradient(180deg, #24080d 0%, #160408 55%, #100306 100%); — 深色背景渐变。
83.         box-shadow: 0 20px 56px rgba(0, 0, 0, 0.55);
84.         box-sizing: border-box;
85.       }
86.       .p5r-contactFormSection .p5r-contactCard { — 表单区卡片样式覆盖。
87.         background: linear-gradient(180deg, rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.5));
88.         border-color: rgba(255, 255, 255, 0.1);
89.       }
90.       .p5r-contactFormBar { — 表单顶部控制条布局。
91.         display: flex;
92.         flex-wrap: wrap;
93.         align-items: center;
94.         justify-content: space-between;
95.         gap: 12px;
96.       }
97.       .p5r-contactFormBar .p5r-contactHeading { — 标题在表单条中的行为。
98.         margin: 0;
99.         text-align: left;
100.         flex: 1; — 占据剩余空间。
101.         min-width: 0; — 允许缩小。
102.       }
103.       .p5r-contactFormBar .p5r-contactHeading[hidden] { — 隐藏时强制不显示。
104.         display: none !important;
105.       }
106.       .p5r-contactHistoryTab { — “历史”切换按钮样式。
107.         flex-shrink: 0;
108.         margin: 0;
109.         padding: 8px 16px;
110.         border-radius: 8px;
111.         border: 1px solid rgba(0, 0, 0, 0.18);
112.         background: #fff;
113.         color: #0a0a0a;
114.         font-weight: 800;
115.         font-size: 13px;
116.         letter-spacing: 0.1em;
117.         cursor: pointer;
118.         transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
119.       }
120.       .p5r-contactHistoryTab:hover { — 悬停样式。
121.         border-color: rgba(0, 0, 0, 0.35);
122.         background: #f5f5f5;
123.         color: #000;
124.       }
125.       .p5r-contactHistoryTab.is-active { — 激活态样式。
126.         border-color: #ff0022;
127.         background: #fff;
128.         color: #0a0a0a;
129.         box-shadow: 0 0 0 2px rgba(255, 0, 34, 0.25);
130.       }
131.       .p5r-contactPanel[hidden] { — 隐藏面板强制不显示。
132.         display: none !important;
133.       }
134.       /* 提交表单：至少为 --p5r-contact-panel-h，无内侧滚动，整块随内容增高；历史面板仍用该高度 + 列表内滚动 */ — 注释。
135.       body.p5r-characters[data-p5r-page="contact"] { — 定义局部高度变量。
136.         --p5r-contact-panel-h: clamp(680px, 62vh, 900px); — 响应式高度区间。
137.       }
138.       .p5r-contactPanels { — 面板容器使用 grid 叠加切换视觉。
139.         display: grid;
140.         grid-template-columns: 1fr;
141.         grid-template-rows: auto;
142.         min-height: var(--p5r-contact-panel-h);
143.         height: auto;
144.         box-sizing: border-box;
145.       }
146.       .p5r-contactPanel:not([hidden]) { — 可见面板共用样式：定位为网格第一层并为 flex 列。
147.         grid-column: 1;
148.         grid-row: 1;
149.         min-height: 0;
150.         box-sizing: border-box;
151.         display: flex;
152.         flex-direction: column;
153.       }
154.       /* 提交：不裁切、不在 form 内出现滚动条 */ — 注释。
155.       #contactPanelForm.p5r-contactPanel:not([hidden]) { — 表单面板特化规则。
156.         position: relative;
157.         min-height: var(--p5r-contact-panel-h);
158.         height: auto;
159.         max-height: none;
160.         overflow: visible; — 不在内部出现滚动条。
161.       }
162.       #contactPanelForm .p5r-contactForm { — 表单内容不自动拉伸，避免内部滚动。
163.         flex: 0 0 auto;
164.         min-height: 0;
165.         overflow: visible;
166.       }
167.       /* 历史：外框高度与变量一致，仅列表区域滚动 */ — 注释。
168.       #contactPanelHistory.p5r-contactPanel:not([hidden]) { — 历史面板特化。
169.         height: var(--p5r-contact-panel-h);
170.         min-height: var(--p5r-contact-panel-h);
171.         max-height: var(--p5r-contact-panel-h);
172.         overflow: hidden;
173.       }
174.       .p5r-historyTopRow { — 历史顶部行样式。
175.         flex-shrink: 0;
176.       }
177.       .p5r-historyListWrap { — 历史列表容器允许内部滚动。
178.         flex: 1 1 0;
179.         min-height: 0;
180.         overflow-y: auto;
181.         padding-right: 4px;
182.         display: flex;
183.         flex-direction: column;
184.         gap: 14px;
185.       }
186.       .p5r-contactForm .p5r-field { — 表单字段的布局（grid）。
187.         display: grid;
188.         gap: 6px;
189.         margin-bottom: 14px;
190.       }
191.       /* 错误行固定占位：避免出现错误时表单区突然增高（与有文案时同高） */ — 注释。
192.       #contactPanelForm .p5r-fieldError { — 错误提示占位样式，保证高度稳定。
193.         margin: 0;
194.         min-height: calc(1.45em * 2 + 10px); — 固定至少两行文本高度。
195.         font-size: 12px;
196.         font-weight: 800;
197.         letter-spacing: 0.05em;
198.         line-height: 1.45;
199.         color: #ff8899;
200.         text-shadow: 0 0 14px rgba(255, 0, 34, 0.45);
201.         box-sizing: border-box;
202.         display: block;
203.         overflow-wrap: break-word;
204.         word-break: break-word;
205.       }
206.       #contactPanelForm .p5r-fieldError.p5r-fieldError--empty { — 空错误占位时隐藏但保留高度。
207.         visibility: hidden;
208.         pointer-events: none;
209.       }
210.       #contactPanelForm .p5r-fieldError:not(.p5r-fieldError--empty) { — 非空错误时显现。
211.         visibility: visible;
212.       }
213.       .p5r-contactForm .p5r-input.p5r-input--invalid { — 无效输入的视觉提示（红色）。
214.         border-color: rgba(255, 0, 34, 0.65);
215.         box-shadow: 0 0 0 2px rgba(255, 0, 34, 0.2);
216.       }
217.       .p5r-contactForm .p5r-field__label { — 表单标签样式。
218.         font-size: 14px;
219.         font-weight: 800;
220.         letter-spacing: 0.08em;
221.         color: rgba(255, 255, 255, 0.9);
222.       }
223.       .p5r-contactForm .p5r-input { — 输入控件通用样式。
224.         width: 100%;
225.         box-sizing: border-box;
226.         border-radius: 10px;
227.         border: 1px solid rgba(255, 255, 255, 0.16);
228.         background: rgba(0, 0, 0, 0.55);
229.         color: #fff;
230.         padding: 10px 12px;
231.         outline: none;
232.       }
233.       .p5r-contactForm .p5r-input:focus { — 聚焦态样式。
234.         border-color: rgba(28, 254, 255, 0.65);
235.         box-shadow: 0 0 0 3px rgba(28, 254, 255, 0.2);
236.       }
237.       .p5r-contactForm textarea.p5r-input { — 文本域限定高度与禁止手动调整。
238.         min-height: 120px;
239.         max-height: 200px;
240.         resize: none;
241.       }
242.       .p5r-fileZone { — 拖放/点击上传区域样式（虚线、圆角、内边距）。
243.         border: 2px dashed rgba(255, 255, 255, 0.28);
244.         border-radius: 12px;
245.         padding: 22px 16px;
246.         text-align: center;
247.         background: rgba(0, 0, 0, 0.3);
248.         cursor: pointer;
249.         transition: border-color 0.2s ease, background 0.2s ease;
250.       }
251.       .p5r-fileZone:hover { — 悬停提示。
252.         border-color: rgba(28, 254, 255, 0.55);
253.         background: rgba(28, 254, 255, 0.06);
254.       }
255.       .p5r-fileZone.dragover { — 拖拽到区域时样式（红色提示）。
256.         border-color: rgba(255, 0, 34, 0.75);
257.         background: rgba(255, 0, 34, 0.08);
258.       }
259.       .p5r-fileZoneHint { — 上传提示文本样式。
260.         margin-top: 8px;
261.         font-size: 12px;
262.         color: rgba(255, 255, 255, 0.55);
263.       }
264.       .p5r-fileList { — 已选文件列表容器样式。
265.         margin-top: 10px;
266.         display: grid;
267.         gap: 8px;
268.       }
269.       .p5r-fileItem { — 单个文件项样式（左右布局、边条强调）。
270.         display: flex;
271.         align-items: center;
272.         justify-content: space-between;
273.         padding: 8px 12px;
274.         background: rgba(0, 0, 0, 0.45);
275.         border-radius: 8px;
276.         border-left: 3px solid rgba(28, 254, 255, 0.75);
277.       }
278.       .p5r-fileItem .file-info { — 文件信息文本样式。
279.         font-size: 12px;
280.         margin-top: 2px;
281.         color: rgba(255, 255, 255, 0.65);
282.       }
283.       .p5r-historyItem .muted { — 历史项的次要文字颜色。
284.         color: rgba(255, 255, 255, 0.55);
285.       }
286.       /* 浮在表单卡片右下角，不占文档流高度 */ — 注释。
287.       .p5r-contactSubmitSuccess { — 提交成功提示定位样式（绝对定位右下）。
288.         position: absolute;
289.         right: 16px;
290.         bottom: 16px;
291.         margin: 0;
292.         padding: 0;
293.         font-size: 14px;
294.         font-weight: 800;
295.         letter-spacing: 0.12em;
296.         color: #ffffff;
297.         text-align: right;
298.         line-height: 1.35;
299.         white-space: nowrap;
300.         z-index: 2;
301.         pointer-events: none; — 不接收指针事件（装饰性）。
302.         text-shadow: 0 1px 8px rgba(0, 0, 0, 0.65);
303.       }
304.       .p5r-contactSubmitSuccess[hidden] { — 隐藏属性时不显示。
305.         display: none !important;
306.       }
307.       .p5r-contactActions { — 表单操作按钮容器。
308.         display: flex;
309.         flex-wrap: wrap;
310.         gap: 10px;
311.         margin-top: 18px;
312.       }
313.       .p5r-historyTopRow { — 历史面板顶部行样式（右对齐控件）。
314.         flex-shrink: 0;
315.         display: flex;
316.         justify-content: flex-end;
317.         align-items: center;
318.         margin-bottom: 12px;
319.       }
320.       .p5r-historyTopRow select { — 筛选下拉样式。
321.         padding: 8px 12px;
322.         border-radius: 8px;
323.         border: 1px solid rgba(255, 255, 255, 0.16);
324.         background: rgba(0, 0, 0, 0.55);
325.         color: #fff;
326.         min-width: 120px;
327.       }
328.       .p5r-historyClearRow { — 清除历史行样式。
329.         flex-shrink: 0;
330.         margin-top: auto;
331.         padding-top: 18px;
332.         text-align: center;
333.       }
334.       .p5r-historyItem { — 历史记录条目整体样式。
335.         display: flex;
336.         flex-direction: row;
337.         align-items: stretch;
338.         gap: 12px;
339.         background: rgba(0, 0, 0, 0.35);
340.         border: 1px solid rgba(255, 255, 255, 0.1);
341.         border-radius: 10px;
342.         padding: 12px;
343.         box-sizing: border-box;
344.       }
345.       .p5r-historyItem__del { — 删除按钮（历史项）样式。
346.         flex-shrink: 0;
347.         align-self: stretch;
348.         width: 44px;
349.         min-height: 52px;
350.         margin: 0;
351.         padding: 0;
352.         border-radius: 8px;
353.         border: 1px solid rgba(255, 255, 255, 0.22);
354.         background: rgba(0, 0, 0, 0.55);
355.         color: rgba(255, 255, 255, 0.88);
356.         font-size: 22px;
357.         font-weight: 700;
358.         line-height: 1;
359.         cursor: pointer;
360.         box-sizing: border-box;
361.         display: flex;
362.         align-items: center;
363.         justify-content: center;
364.         transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
365.       }
366.       .p5r-historyItem__del:hover { — 删除按钮悬停样式。
367.         border-color: rgba(255, 0, 34, 0.55);
368.         background: rgba(40, 0, 8, 0.65);
369.         color: #ffb3be;
370.       }
371.       .p5r-historyItem__del:focus-visible { — 键盘可见焦点样式。
372.         outline: none;
373.         box-shadow: 0 0 0 2px rgba(28, 254, 255, 0.45);
374.       }
375.       .p5r-historyItem__del:disabled { — 禁用时样式。
376.         opacity: 0.35;
377.         cursor: not-allowed;
378.         border-color: rgba(255, 255, 255, 0.1);
379.       }
380.       .p5r-historyItem__main { — 历史项主内容区。
381.         flex: 1;
382.         min-width: 0;
383.       }
384.       .p5r-statusBadge { — 状态徽章样式（未处理）。
385.         font-size: 11px;
386.         padding: 2px 8px;
387.         border-radius: 10px;
388.         background: rgba(255, 0, 34, 0.2);
389.         color: #ff8899;
390.       }
391.       .p5r-statusBadge.processed { — 已处理状态的徽章样式。
392.         background: rgba(28, 254, 255, 0.2);
393.         color: #7efcff;
394.       }
395.       /* 页脚样式与人物页一致（characters.css 仅绑定了 characters 页） */ — 注释。
396.       body.p5r-characters[data-p5r-page="contact"] .p5r-pageFooter { — 页脚样式开始。
397.         position: relative;
398.         z-index: 1;
399.         width: 100%;
400.         box-sizing: border-box;
401.         margin-top: 32px;
402.         padding: 18px 20px 22px;
403.         background: #4a0a12;
404.         text-align: center;
405.       }
406.       body.p5r-characters[data-p5r-page="contact"] .p5r-pageFooter__inner { — 页脚内层宽度限制。
407.         margin: 0 auto;
408.         max-width: 640px;
409.       }
410.       body.p5r-characters[data-p5r-page="contact"] .p5r-pageFooter__line { — 页脚文本样式。
411.         margin: 0;
412.         font-size: 13px;
413.         line-height: 1.7;
414.         letter-spacing: 0.05em;
415.         color: rgba(255, 245, 245, 0.9);
416.       }
417.       body.p5r-characters[data-p5r-page="contact"] .p5r-pageFooter a { — 页脚链接样式。
418.         color: #ffc8d0;
419.         text-decoration: underline;
420.         text-underline-offset: 3px;
421.         word-break: break-all;
422.       }
423.       body.p5r-characters[data-p5r-page="contact"] .p5r-pageFooter a:hover { — 页脚链接悬停。
424.         color: #fff;
425.       }
426.       .visually-hidden { — 无障碍隐藏工具类（保留在文档中但对屏幕不可见）。
427.         position: absolute;
428.         width: 1px;
429.         height: 1px;
430.         padding: 0;
431.         margin: -1px;
432.         overflow: hidden;
433.         clip: rect(0, 0, 0, 0);
434.         white-space: nowrap;
435.         border: 0;
436.       }
437.       /* 顶栏：扩展页面下拉（与 p5 顶栏对比度一致） */ — 注释。
438.       /* 联系页主内容：位于「玩家反馈」说明区之下（非顶栏） */ — 注释。
439.     </style> — 内联样式结束。
440.   </head> — 头部结束。
441.
442.   <body class="p5r-characters" data-p5r-page="contact"> — 页面主体开始，类与 data 属性用于样式/脚本识别。
443.     <header class="p5r-header" role="banner"> — 页面头部（导航）开始。
444.       <div class="p5r-header__left"> — 头部左侧容器。
445.         <img — logo 图片开始（分行属性）。
446.           class="p5r-logo" — 图片类。
447.           src="../../../shared/p5ui/assets/src-assets/logo.png" — logo 路径。
448.           alt="logo" — 替代文本。
449.         /> — 图片闭合。
450.       </div> — 头部左侧结束。
451.
452.       <div class="p5r-header__right"> — 头部右侧开始（导航与用户）。
453.         <nav class="p5r-header__nav" aria-label="委托、公告、联系与人物"> — 导航容器并提供无障碍标签。
454.           <details class="p5r-headerNav" id="p5rHeaderRequestsNav"> — 下拉：委托。
455.             <summary class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__summary"> — summary 作为折叠触发按钮。
456.               <span class="p5r-headerNav__summaryText">委托</span> — 文本标签。
457.               <span class="p5r-headerNav__caret" aria-hidden="true"></span> — 装饰性 caret。
458.             </summary>
459.             <div class="p5r-headerNav__panel" role="group" aria-label="委托与我的任务"> — 下拉面板组。
460.               <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="../../player3/pages/requests.html">委托</a> — 链接：委托。
461.               <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="../../player3/pages/my-missions.html">我的任务</a> — 链接：我的任务。
462.             </div>
463.           </details>
464.           <a — 公告链接开始（分行）。
465.             class="p5-btn-ctn p5-hover-animation-gray p5r-bulletinNavSolo"
466.             href="../../player1/pages/bulletins.html"
467.             >公告</a — 链接文本并闭合。
468.           > — 结尾多余换行符处理（保持原文件折行格式）。
469.           <details class="p5r-headerNav" id="p5rHeaderContactNav"> — 下拉：联系（包含本页与小游戏链接）。
470.             <summary class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__summary">
471.               <span class="p5r-headerNav__summaryText">联系</span>
472.               <span class="p5r-headerNav__caret" aria-hidden="true"></span>
473.             </summary>
474.             <div class="p5r-headerNav__panel" role="group" aria-label="联系与小游戏">
475.               <a
476.                 class="p5-btn-ctn p5-hover-animation-mix p5r-headerNav__item is-current"
477.                 href="contact.html"
478.                 aria-current="page"
479.                 >联系</a
480.               > — 当前页的链接，标记为当前页（无障碍）。
481.               <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="takamaki-3d.html">小游戏</a> — 链接到小游戏。
482.             </div>
483.           </details>
484.           <details class="p5r-headerNav" id="p5rHeaderNav"> — 下拉：人物相关页面。
485.             <summary class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__summary">
486.               <span class="p5r-headerNav__summaryText">人物</span>
487.               <span class="p5r-headerNav__caret" aria-hidden="true"></span>
488.             </summary>
489.             <div class="p5r-headerNav__panel" role="group" aria-label="人物子页面">
490.               <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="../../player4/pages/characters.html">人物</a> — 人物页链接。
491.               <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="../../player4/pages/photo-stage.html">照片舞台</a> — 照片舞台链接。
492.               <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="../../player4/pages/book-flip.html">人物画册</a> — 画册链接。
493.               <a class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item" href="../../player4/pages/card-draw.html">卡片抽取</a> — 卡片抽取链接。
494.             </div>
495.           </details>
496.         </nav> — 导航结束。
497.         <div class="p5r-headerUser" data-p5r-header-user> — 头部用户区域（个人中心、退出、用户名）。
498.           <div class="p5r-profileEntryWrap">
499.             <a id="profileEntry" class="p5-btn-ctn p5-hover-animation-gray" href="../../player4/pages/profile.html">个人中心</a> — 个人中心链接。
500.             <div class="p5r-headerUserMenu" role="group" aria-label="账户操作">
501.               <button type="button" class="p5-btn-ctn p5-hover-animation-gray p5r-headerNav__item p5r-headerUserMenu__btn" data-p5r-logout>退出</button> — 退出按钮（脚本可通过 data 属性绑定）。
502.             </div>
503.           </div>
504.           <span class="p5r-headerUserName" id="p5rHeaderUserName">游客</span> — 显示用户名（默认“游客”）。
505.         </div>
506.       </div>
507.     </header> — 头部结束。
508.
509.     <div class="p5r-shell"> — 页面主要 shell 容器开始。
510.       <section class="p5r-banner" aria-label="banner"> — banner 区域（视觉）开始。
511.         <img — banner 背景图开始。
512.           class="p5r-banner__bg"
513.           src="../../../shared/p5ui/assets/doc-build/bg1.b9635d84.png" — 背景图路径。
514.           alt="" — 空 alt（装饰性）。
515.         /> — 图片闭合。
516.         <div class="p5r-banner__veil" aria-hidden="true"></div> — 阴影/遮罩层（装饰）。
517.       </section>
518.
519.       <main class="p5r-main p5r-contactMain" aria-label="玩家反馈"> — 主要内容区开始，带无障碍标签。
520.         <div class="p5r-contactInner"> — 内层容器开始。
521.           <section class="p5r-contactCard p5r-contactHero" aria-label="玩家反馈说明"> — 说明卡片开始。
522.             <h1 class="p5-title-ctn p5r-contactPageTitle"> — 页面主标题容器。
523.               <span class="p5r-staggerTitle__track"> — 字符逐字样式轨道（用于随机倾斜效果）。
524.                 <span class="p5r-staggerTitle__ch">玩</span> — 标题字符节点。
525.                 <span class="p5r-staggerTitle__ch p5r-staggerTitle__ch--invert">家</span> — 可反色或不同样式的字符。
526.                 <span class="p5r-staggerTitle__ch">反</span>
527.                 <span class="p5r-staggerTitle__ch">馈</span>
528.               </span>
529.             </h1>
530.             <div class="p5r-contactLead"> — 说明文本块开始。
531.               <p>请在此提交您的反馈、建议或问题。</p> — 文案段落。
532.               <p>我们会尽快处理您的请求，感谢您对怪盗团的支持！</p> — 文案段落。
533.             </div>
534.           </section> — 说明卡片结束。
535.
536.           <div class="p5r-contactFormSection" aria-label="提交与历史"> — 表单与历史栏容器开始。
537.             <div class="p5r-contactFormBar"> — 表单顶部控制条开始。
538.               <h2 class="p5-title-ctn p5r-contactHeading" id="contactHeadingForm"> — 提交表单标题。
539.                 <span class="p5r-staggerTitle__track">
540.                   <span class="p5r-staggerTitle__ch">提</span>
541.                   <span class="p5r-staggerTitle__ch p5r-staggerTitle__ch--invert">交</span>
542.                   <span class="p5r-staggerTitle__ch">表</span>
543.                   <span class="p5r-staggerTitle__ch">单</span>
544.                 </span>
545.               </h2>
546.               <h2 class="p5-title-ctn p5r-contactHeading" id="contactHeadingHistory" hidden> — 历史标题，初始隐藏。
547.                 <span class="p5r-staggerTitle__track">
548.                   <span class="p5r-staggerTitle__ch">历</span>
549.                   <span class="p5r-staggerTitle__ch p5r-staggerTitle__ch--invert">史</span>
550.                   <span class="p5r-staggerTitle__ch">记</span>
551.                   <span class="p5r-staggerTitle__ch">录</span>
552.                 </span>
553.               </h2>
554.               <button — 历史切换按钮开始。
555.                 type="button"
556.                 class="p5r-contactHistoryTab"
557.                 id="historyToggle"
558.                 aria-pressed="false"
559.                 aria-controls="contactPanelHistory"
560.               >
561.                 历史 — 按钮文本。
562.               </button>
563.             </div> — 表单条结束。
564.
565.             <div class="p5r-contactPanels"> — 面板容器开始（表单 + 历史切换）。
566.             <div id="contactPanelForm" class="p5r-contactCard p5r-contactPanel"> — 表单面板开始。
567.               <form id="contactForm" class="p5r-contactForm" novalidate> — 表单开始，禁用原生验证以便自定义处理。
568.                 <div class="p5r-field"> — 字段容器：昵称。
569.                   <label class="p5r-field__label" for="cNick">昵称</label> — 标签并关联 `cNick`。
570.                   <input id="cNick" class="p5r-input" name="nick" type="text" autocomplete="nickname" placeholder="请输入昵称" required /> — 昵称输入。
571.                   <p id="errNick" class="p5r-fieldError p5r-fieldError--empty" aria-hidden="true"></p> — 错误占位元素（初始为空且隐藏）。
572.                 </div>
573.
574.                 <div class="p5r-field"> — 字段：邮箱。
575.                   <label class="p5r-field__label" for="cMail">邮箱</label>
576.                   <input
577.                     id="cMail"
578.                     class="p5r-input"
579.                     name="email"
580.                     type="email"
581.                     autocomplete="email"
582.                     placeholder="name@example.com"
583.                     required
584.                   /> — 邮箱输入，类型 email。
585.                   <p id="errMail" class="p5r-fieldError p5r-fieldError--empty" aria-hidden="true"></p> — 邮件错误占位。
586.                 </div>
587.
588.                 <div class="p5r-field"> — 字段：反馈内容（文本域）。
589.                   <label class="p5r-field__label" for="cMsg">反馈内容</label>
590.                   <textarea
591.                     id="cMsg"
592.                     class="p5r-input"
593.                     name="message"
594.                     rows="6"
595.                     placeholder="请描述您遇到的问题、建议或想对怪盗团说的话……"
596.                     required
597.                   ></textarea> — 文本域闭合。
598.                   <p id="errMsg" class="p5r-fieldError p5r-fieldError--empty" aria-hidden="true"></p> — 文本错误占位。
599.                 </div>
600.
601.                 <div class="p5r-field"> — 字段：附件上传区。
602.                   <span class="p5r-field__label">附件上传（可选）</span> — 标签（非表单控件）。
603.                   <div class="p5r-fileZone" id="dropZone" role="button" tabindex="0" aria-label="拖放或点击上传附件"> — 拖放区，兼作按钮（可聚焦）。
604.                     <div style="font-size: 40px; line-height: 1; margin-bottom: 8px" aria-hidden="true">📎</div> — 图标装饰。
605.                     <div style="font-weight: 800; margin-bottom: 4px">拖放文件到此处</div> — 操作提示。
606.                     <div style="font-size: 13px; color: rgba(255,255,255,.75)"> — 说明文字容器。
607.                       或 <span id="browseFiles" style="color: #1cfeff; text-decoration: underline; cursor: pointer">点击浏览</span> — “点击浏览”触发文件输入。
608.                     </div>
609.                     <div class="p5r-fileZoneHint">支持图片与视频；单个 ≤ 10MB；最多 5 个文件</div> — 上传限制提示。
610.                     <input type="file" id="fileInput" multiple accept="image/*,video/*" hidden /> — 隐藏的文件输入控件，由 UI 触发。
611.                   </div> — 拖放区结束。
612.                   <div class="p5r-fileList" id="fileList"></div> — 列出已选文件的容器。
613.                   <div class="p5r-fileZoneHint" style="display: flex; justify-content: space-between; margin-top: 6px"> — 文件计数与总大小显示行。
614.                     <span id="fileCount">已选择 0 个文件</span> — 文件数量文本。
615.                     <span id="totalSize">总大小: 0 Bytes</span> — 总大小文本。
616.                   </div>
617.                   <p id="errFiles" class="p5r-fieldError p5r-fieldError--empty" aria-hidden="true"></p> — 文件错误占位。
618.                 </div>
619.
620.                 <div class="p5r-contactActions"> — 表单操作按钮容器开始。
621.                   <button class="p5-btn-ctn p5-hover-animation-mix" type="submit">提交反馈</button> — 提交按钮。
622.                   <button class="p5-btn-ctn p5-hover-animation-gray" type="reset">重置</button> — 重置按钮。
623.                 </div> — 操作按钮容器结束。
624.               </form> — 表单结束。
625.               <p id="contactSubmitSuccess" class="p5r-contactSubmitSuccess" role="status" aria-live="polite" hidden> — 提交成功提示（初始隐藏）。
626.                 提交成功 — 文本。
627.               </p>
628.             </div> — 表单面板结束。
629.
630.             <div id="contactPanelHistory" class="p5r-contactCard p5r-contactPanel" hidden> — 历史面板开始（初始隐藏）。
631.               <div class="p5r-historyTopRow"> — 历史顶部行（包含筛选）。
632.                 <label for="historyFilter" class="visually-hidden">筛选</label> — 无障碍标签（隐藏可见性）。
633.                 <select id="historyFilter" aria-label="筛选历史记录"> — 筛选下拉控件。
634.                   <option value="all">全部记录</option> — 选项：全部。
635.                   <option value="today">今天</option> — 选项：今天。
636.                   <option value="week">本周</option> — 选项：本周。
637.                 </select>
638.               </div>
639.               <div id="historyList" class="p5r-historyListWrap"></div> — 历史项列表容器（动态填充）。
640.               <div class="p5r-historyClearRow"> — 清除历史行。
641.                 <button class="p5-btn-ctn p5-hover-animation-gray" type="button" id="clearHistory">清除历史</button> — 清除历史按钮。
642.               </div>
643.             </div> — 历史面板结束。
644.             </div> — 面板容器结束。
645.           </div> — 表单区结束。
646.         </div> — 内层容器结束。
647.       </main> — 主要内容结束。
648.     </div> — shell 容器结束。
649.
650.     <footer class="p5r-pageFooter" role="contentinfo"> — 页脚开始。
651.       <div class="p5r-pageFooter__inner"> — 页脚内层。
652.         <p class="p5r-pageFooter__line">玩家反馈 · 怪盗团联络通道</p> — 页脚文本。
653.       </div>
654.     </footer> — 页脚结束。
655.
656.     <div id="p5NotiHost" class="site-notiHost" aria-live="polite" aria-relevant="additions removals"></div> — 通知宿主（动态通知插入点）。
657.     <div id="p5NotiTpl" class="p5-noti-ctn" style="display: none"> — 隐藏通知模板（克隆用）。
658.       <div class="p5-noti-sub-ctn"> — 通知子容器。
659.         <img class="p5-portrait-img" src="../../../shared/p5ui/assets/src-assets/images/portraits/mona.png" alt="" /> — 头像装饰。
660.         <div class="p5-dialog-ctn"> — 对话气泡容器。
661.           <img class="p5-dialog-img" src="../../../shared/p5ui/assets/src-assets/images/notification.png" alt="" /> — 气泡背景图。
662.           <div class="p5-noti-title"> — 通知标题容器。
663.             <p class="p5-title-ctn text-size-small"><span>摩尔 加纳</span></p> — 发送者名显示。
664.           </div>
665.           <div class="p5-noti-text">通知示例</div> — 通知正文占位。
666.         </div>
667.       </div>
668.     </div> — 通知模板结束。
669.
670.     <div id="p5MsgHost"></div> — 可能用于全局消息宿主（空）。
671.
672.     <div id="p5BackTop" class="p5-top-ctn" hidden style="right: 28px; bottom: 28px"> — 回到顶部控件，初始隐藏。
673.       <img src="../../../shared/p5ui/assets/src-assets/images/back-top.png" alt="back top" /> — 回到顶部图片。
674.     </div>
675.
676.     <div id="p5Zoom" class="p5-zoom-ctn" style="display: none"> — 图片放大查看容器（隐藏）。
677.       <div class="p5-zoom-sub-ctn">
678.         <img class="p5-zoom-img" src="" alt="zoom" /> — 放大图片占位（src 由脚本设置）。
679.         <img class="p5-zoom-close" src="../../../shared/p5ui/assets/src-assets/images/upload/close.png" alt="close" /> — 关闭按钮图片。
680.       </div>
681.     </div>
682.
683.     <script src="../../shared/site.js"></script> — 引入共享脚本（站点级行为与工具函数、P5Proto 等）。
684.     <script> — 内联脚本开始（页面交互：banner 视差、标题倾斜等）。
685.       (function () { — 自执行函数，创建私有作用域。
686.         "use strict"; — 严格模式。
687.         var banner = document.querySelector(".p5r-banner"); — 获取 banner 元素引用。
688.         var bannerBg = banner && banner.querySelector(".p5r-banner__bg"); — 获取 banner 背景图片元素。
689.         var reduceMotion =
690.           typeof window.matchMedia === "function" &&
691.           window.matchMedia("(prefers-reduced-motion: reduce)").matches; — 检测用户是否偏好减少动画（无障碍）。
692.         if (banner && bannerBg && !reduceMotion) { — 当存在 banner 且用户未设置减少动画时启用视差效果。
693.           var maxTranslate = 14; — 最大平移像素值。
694.           var maxTilt = 5; — 最大倾斜角度（度）。
695.           var parallaxIdle = "translate3d(0,0,0) rotateX(0deg) rotateY(0deg) scale(1)"; — 初始变换字符串。
696.           function applyBannerParallax(e) { — 鼠标移动时计算并应用视差变换。
697.             var rect = banner.getBoundingClientRect(); — 获取 banner 的可视矩形。
698.             var zoneTop = Math.max(0, rect.top); — 计算有效区域上边界（避免负值）。
699.             var zoneBottom = rect.bottom; — 区域下边界。
700.             if (zoneBottom <= 0 || zoneTop >= window.innerHeight) { — 如果 banner 不在可视区则重置变换。
701.               bannerBg.style.transform = parallaxIdle;
702.               return;
703.             }
704.             if (e.clientY < zoneTop - 24 || e.clientY > zoneBottom + 48) { — 当鼠标远离区域时也重置。
705.               bannerBg.style.transform = parallaxIdle;
706.               return;
707.             }
708.             var cx = rect.left + rect.width / 2; — banner 中心 x。
709.             var zoneMidY = (zoneTop + zoneBottom) / 2; — 区域垂直中点。
710.             var halfW = Math.max(1, rect.width / 2); — 半宽以规范化 dx。
711.             var halfH = Math.max(1, (zoneBottom - zoneTop) / 2); — 半高以规范化 dy。
712.             var dx = (e.clientX - cx) / halfW; — 归一化水平偏移（-1..1）。
713.             var dy = (e.clientY - zoneMidY) / halfH; — 归一化垂直偏移（-1..1）。
714.             dx = Math.max(-1, Math.min(1, dx)); — 限制到 [-1,1]。
715.             dy = Math.max(-1, Math.min(1, dy)); — 限制到 [-1,1]。
716.             var tx = -dx * maxTranslate; — 计算平移量 x（反向）。
717.             var ty = -dy * maxTranslate; — 计算平移量 y（反向）。
718.             var rx = dy * maxTilt; — 计算绕 X 轴旋转角。
719.             var ry = -dx * maxTilt; — 计算绕 Y 轴旋转角（反向）。
720.             bannerBg.style.transform =
721.               "translate3d(" +
722.               tx +
723.               "px," +
724.               ty +
725.               "px,0) rotateX(" +
726.               rx +
727.               "deg) rotateY(" +
728.               ry +
729.               "deg) scale(1.05)"; — 应用组合变换并适当放大以产生视差效果。
730.           } — applyBannerParallax 结束。
731.           document.addEventListener("mousemove", applyBannerParallax); — 注册鼠标移动监听。
732.           window.addEventListener("blur", function () { — 当窗口失焦时重置变换。
733.             bannerBg.style.transform = parallaxIdle;
734.           });
735.         } — 视差启用分支结束。
736.
737.         var headerBar = document.querySelector(".p5r-header"); — 获取头部元素引用。
738.         var bannerEl = document.querySelector(".p5r-banner"); — 获取 banner 元素引用（可能为 null）。
739.         function syncHeaderBar() { — 根据滚动位置切换头部实色背景类。
740.           if (!headerBar) return;
741.           if (!bannerEl) { — 若没有 banner，直接添加实色类。
742.             headerBar.classList.add("p5r-header--solid");
743.             return;
744.           }
745.           var pastBanner = bannerEl.getBoundingClientRect().bottom <= 0; — 判断是否已滚过 banner。
746.           headerBar.classList.toggle("p5r-header--solid", pastBanner); — 切换类以改变对比度。
747.         } — syncHeaderBar 结束。
748.         window.addEventListener("scroll", syncHeaderBar, { passive: true }); — 注册滚动事件（被动）。
749.         syncHeaderBar(); — 初始同步一次头部状态。
750.
751.         function tiltStaggerChars() { — 为标题字符施加随机旋转/倾斜，制造手写错位效果。
752.           var nodes = document.querySelectorAll(".p5r-contactMain .p5r-staggerTitle__ch");
753.           for (var i = 0; i < nodes.length; i++) {
754.             var el = nodes[i];
755.             var rot = Math.random() * 14 - 7; — 随机旋转 -7..7 度。
756.             var skew = Math.random() * 8 - 4; — 随机倾斜 -4..4 度。
757.             el.style.transform = "rotate(" + rot.toFixed(1) + "deg) skewX(" + skew.toFixed(1) + "deg)"; — 应用样式。
758.           }
759.         } — tiltStaggerChars 结束。
760.         if (document.readyState === "loading") { — 若文档未就绪，等待 DOMContentLoaded 后运行。
761.           document.addEventListener("DOMContentLoaded", tiltStaggerChars);
762.         } else {
763.           tiltStaggerChars(); — 立即运行效果。
764.         }
765.       })(); — 自执行函数结束。
766.     </script> — 内联脚本结束。
767.     <script src="./player2.js"></script> — 引入页面逻辑脚本（player2.js）。
768.   </body> — body 结束。
769. </html> — 文档结束。

