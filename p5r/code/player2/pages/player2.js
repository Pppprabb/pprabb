// player2.js - 只修复提示框和历史记录空状态
(function() {
  "use strict";
  
  // 本地存储键名
  const STORAGE_KEY = 'phantom_thieves_feedback_history';
  const MAX_HISTORY = 10;
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  
  // DOM元素
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');
  const fileCount = document.getElementById('fileCount');
  const totalSize = document.getElementById('totalSize');
  const historyList = document.getElementById('historyList');
  const historyFilter = document.getElementById('historyFilter');
  const clearHistoryBtn = document.getElementById('clearHistory');
  const contactForm = document.getElementById('contactForm');
  const submitSuccessEl = document.getElementById('contactSubmitSuccess');
  const historyToggle = document.getElementById('historyToggle');
  const contactPanelForm = document.getElementById('contactPanelForm');
  const contactPanelHistory = document.getElementById('contactPanelHistory');
  const contactHeadingForm = document.getElementById('contactHeadingForm');
  const contactHeadingHistory = document.getElementById('contactHeadingHistory');
  
  // 当前选择的文件
  let selectedFiles = [];
  let historyViewOpen = false;
  
  // 防止重复提交的标志
  let isSubmitting = false;
  
  const ERR_IDS = { nick: 'errNick', mail: 'errMail', msg: 'errMsg', files: 'errFiles' };
  const INPUT_IDS = { nick: 'cNick', mail: 'cMail', msg: 'cMsg' };

  function clearContactFieldErrors() {
    Object.keys(ERR_IDS).forEach(function (key) {
      setContactFieldError(key, '');
    });
  }

  function setContactFieldError(key, message) {
    var id = ERR_IDS[key];
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var text = message ? String(message).trim() : '';
    el.textContent = text;
    if (text) {
      el.classList.remove('p5r-fieldError--empty');
      el.setAttribute('role', 'alert');
      el.removeAttribute('aria-hidden');
    } else {
      el.classList.add('p5r-fieldError--empty');
      el.removeAttribute('role');
      el.setAttribute('aria-hidden', 'true');
    }
    var inputId = INPUT_IDS[key];
    if (inputId) {
      var input = document.getElementById(inputId);
      if (input) input.classList.toggle('p5r-input--invalid', !!text);
    }
  }

  function showFailBannerOnly() {
    if (window.P5Proto && window.P5Proto.showMsg) {
      window.P5Proto.showMsg('fail');
    }
  }

  function hideSubmitSuccess() {
    if (!submitSuccessEl) return;
    submitSuccessEl.setAttribute('hidden', '');
  }

  function showSubmitSuccess() {
    if (!submitSuccessEl) return;
    submitSuccessEl.removeAttribute('hidden');
  }

  function bindContactFieldClearOnInput() {
    if (!contactForm) return;
    ['cNick', 'cMail', 'cMsg'].forEach(function (inputId) {
      var input = document.getElementById(inputId);
      if (!input) return;
      input.addEventListener('input', function () {
        if (inputId === 'cNick') setContactFieldError('nick', '');
        if (inputId === 'cMail') setContactFieldError('mail', '');
        if (inputId === 'cMsg') setContactFieldError('msg', '');
      });
    });
    contactForm.addEventListener('reset', function () {
      clearContactFieldErrors();
      hideSubmitSuccess();
    });
  }

  function migrateHistoryIds() {
    let h;
    try {
      h = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return;
    }
    if (!Array.isArray(h) || !h.length) return;
    let changed = false;
    const base = Date.now();
    h = h.map(function (r, i) {
      if (r && r.id != null) return r;
      changed = true;
      const copy = Object.assign({}, r);
      copy.id = base + i;
      return copy;
    });
    if (changed) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
      } catch (e2) {
        /* ignore */
      }
    }
  }

  // 初始化
  function init() {
    migrateHistoryIds();
    bindFileEvents();
    bindFormEvents();
    bindContactFieldClearOnInput();
    loadHistory();
    bindHistoryEvents();
    bindHistoryToggle();
    // 修复通知框位置
    fixNotificationPosition();
  }

  // 修复通知框位置 - 只修改这一部分
  function fixNotificationPosition() {
    const style = document.createElement('style');
    style.textContent = `
      .site-notiHost {
        left: 50% !important;
        transform: translateX(-50%) !important;
        right: auto !important;
        top: 100px !important; /* 修改这里：从20px改为100px，避免与导航栏重叠 */
        min-width: 300px;
        max-width: 90vw;
        z-index: 1000 !important; /* 确保在最上层 */
      }
    `;
    document.head.appendChild(style);
  }
  
  // 绑定文件相关事件
  function bindFileEvents() {
    if (!dropZone || !fileInput) return;
    
    const browseFilesBtn = document.getElementById('browseFiles');
    if (browseFilesBtn) {
      browseFilesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
      });
    }

    dropZone.addEventListener('click', (e) => {
      if (browseFilesBtn && (e.target === browseFilesBtn || browseFilesBtn.contains(e.target))) return;
      if (e.target.closest('button')) return;
      fileInput.click();
    });

    dropZone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });
    
    // 文件选择
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖放事件
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      
      if (e.dataTransfer.files.length) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    });
  }
  
  // 处理文件选择
  function handleFileSelect(e) {
    if (e.target.files.length) {
      handleFiles(Array.from(e.target.files));
    }
  }
  
  // 处理文件
  function handleFiles(files) {
    let fileErrMsg = '';
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidType = isImage || isVideo;
      
      if (!isValidType) {
        fileErrMsg = '不支持的文件类型：' + file.type;
        return false;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        fileErrMsg = '文件「' + file.name + '」超过 10MB 限制';
        return false;
      }
      
      return true;
    });
    
    if (selectedFiles.length + validFiles.length > MAX_FILES) {
      fileErrMsg = '最多只能选择 ' + MAX_FILES + ' 个文件';
      validFiles.splice(MAX_FILES - selectedFiles.length);
    }
    
    selectedFiles.push(...validFiles);
    updateFileList();
    updateFileSummary();

    if (fileErrMsg) {
      setContactFieldError('files', fileErrMsg);
      showFailBannerOnly();
    } else {
      setContactFieldError('files', '');
    }
  }
  
  // 更新文件列表显示
  function updateFileList() {
    if (!fileList) return;
    
    fileList.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
      const fileItem = document.createElement('div');
      fileItem.className = 'p5r-fileItem';
      
      const fileSize = formatFileSize(file.size);
      const isImage = file.type.startsWith('image/');
      
      fileItem.innerHTML = `
        <div style="display: flex; align-items: center;">
          <div style="font-size: 20px; margin-right: 10px;">
            ${isImage ? '🖼️' : '🎬'}
          </div>
          <div>
            <div style="font-weight: bold; font-size: 14px;">${file.name}</div>
            <div class="file-info">${fileSize} • ${file.type}</div>
          </div>
        </div>
        <div class="file-actions">
          ${isImage ? '<button type="button" class="p5-btn-ctn p5-hover-animation-gray preview-btn" style="font-size: 12px; padding: 4px 8px;">预览</button>' : ''}
          <button type="button" class="p5-btn-ctn p5-hover-animation-gray remove-btn" data-index="${index}" style="font-size: 12px; padding: 4px 8px; background: rgba(255,0,34,0.2);">删除</button>
        </div>
      `;
      
      fileList.appendChild(fileItem);
      
      if (isImage) {
        const previewBtn = fileItem.querySelector('.preview-btn');
        previewBtn.addEventListener('click', () => previewFile(file));
      }
      
      const removeBtn = fileItem.querySelector('.remove-btn');
      removeBtn.addEventListener('click', () => removeFile(index));
    });
  }
  
  // 预览文件
  function previewFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      `;
      
      modal.innerHTML = `
        <div style="position: relative; max-width: 90vw; max-height: 90vh;">
          <img src="${e.target.result}" style="max-width: 100%; max-height: 100%; border-radius: 8px;" />
          <button type="button" style="position: absolute; top: -40px; right: 0; background: rgba(255,0,34,0.8); color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      modal.querySelector('button').addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
    };
    reader.readAsDataURL(file);
  }
  
  // 删除文件
  function removeFile(index) {
    selectedFiles.splice(index, 1);
    setContactFieldError('files', '');
    updateFileList();
    updateFileSummary();
  }
  
  // 更新文件摘要
  function updateFileSummary() {
    if (!fileCount || !totalSize) return;
    
    const total = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    fileCount.textContent = `已选择 ${selectedFiles.length} 个文件`;
    totalSize.textContent = `总大小: ${formatFileSize(total)}`;
  }
  
  // 格式化文件大小
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // 绑定表单事件 - 完全接管提交，防止冲突
  function bindFormEvents() {
    if (!contactForm) return;
    
    // 关键修复：阻止site.js中的表单提交事件
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation(); // 阻止事件冒泡
      e.stopImmediatePropagation(); // 阻止其他事件处理程序

      hideSubmitSuccess();

      // 防止重复提交
      if (isSubmitting) return;
      isSubmitting = true;
      
      // 获取表单数据
      const nick = document.getElementById('cNick').value.trim();
      const mail = document.getElementById('cMail').value.trim();
      const msg = document.getElementById('cMsg').value.trim();
      
      clearContactFieldErrors();
      let hasErr = false;
      if (!nick) {
        setContactFieldError('nick', '请输入昵称');
        hasErr = true;
      }
      if (!mail) {
        setContactFieldError('mail', '请输入邮箱');
        hasErr = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        setContactFieldError('mail', '邮箱格式不正确');
        hasErr = true;
      }
      if (!msg) {
        setContactFieldError('msg', '请填写反馈内容');
        hasErr = true;
      }
      if (hasErr) {
        showFailBannerOnly();
        isSubmitting = false;
        return;
      }
      
      // 关键修复：在重置前保存文件信息
      const fileInfos = selectedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }));
      
      // 保存到历史记录
      const historyItem = {
        id: Date.now(),
        nick,
        mail,
        message: msg,
        files: fileInfos, // 保存完整的文件信息
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      
      saveToHistory(historyItem);
      
      // 成功：与登录页校验同款底部摩尔加纳气泡
      setTimeout(() => {
        if (window.P5Proto && window.P5Proto.toastNoti) {
          window.P5Proto.toastNoti('反馈已提交，感谢你的反馈。', {
            title: '摩尔 加纳',
            portrait: 'mona',
            ttl: 3800,
            bottomQuarter: true
          });
        }
        clearContactFieldErrors();

        // 重置表单
        contactForm.reset();

        // 清空文件列表
        selectedFiles = [];
        updateFileList();
        updateFileSummary();

        // 重新加载历史记录
        loadHistory();

        showSubmitSuccess();

        isSubmitting = false;
      }, 300);
      
      return false; // 阻止默认表单提交
    }, true); // 使用捕获阶段确保先执行
  }
  
  // 保存到历史记录
  function saveToHistory(record) {
    let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    history.unshift(record);
    
    if (history.length > MAX_HISTORY) {
      history = history.slice(0, MAX_HISTORY);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
  
  function deleteHistoryById(id) {
    const key = String(id);
    let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const before = history.length;
    history = history.filter(function (r) {
      return String(r.id) !== key;
    });
    if (history.length === before) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    loadHistory(historyFilter ? historyFilter.value : 'all');
    if (window.P5Proto && window.P5Proto.toastNoti) {
      window.P5Proto.toastNoti('已删除该条记录', { ttl: 2200, portrait: 'mona' });
    }
  }

  // 加载历史记录 - 修改历史记录为空时的显示
  function loadHistory(filter = 'all') {
    if (!historyList) return;
    
    let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    if (filter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const weekAgo = today - 6 * 24 * 60 * 60 * 1000;
      
      history = history.filter(record => {
        const recordTime = new Date(record.timestamp).getTime();
        
        switch(filter) {
          case 'today':
            return recordTime >= today;
          case 'week':
            return recordTime >= weekAgo;
          default:
            return true;
        }
      });
    }
    
    if (history.length === 0) {
      // 修改这里：去掉邮箱图片，使用纯文本提示
      historyList.innerHTML = `
        <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">暂无提交记录</div>
          <div style="font-size: 14px; opacity: 0.7;">
            提交反馈后，记录将显示在这里
          </div>
        </div>
      `;
      return;
    }
    
    historyList.innerHTML = '';
    
    history.forEach(record => {
      const item = document.createElement('div');
      item.className = 'p5r-historyItem';
      
      const date = new Date(record.timestamp);
      const dateStr = date.toLocaleDateString('zh-CN', { 
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // 生成附件详细列表
      let filesHtml = '';
      if (record.files && record.files.length > 0) {
        filesHtml = `
          <div style="margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
            <div style="font-weight: bold; font-size: 12px; margin-bottom: 6px; color: var(--p-cyan);">上传附件：</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${record.files.map(file => {
                const isImage = file.type && file.type.startsWith('image/');
                const icon = isImage ? '🖼️' : '📁';
                return `
                  <div style="
                    font-size: 12px; 
                    padding: 6px 10px; 
                    background: rgba(0,0,0,0.4); 
                    border-radius: 6px; 
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    max-width: 200px;
                  ">
                    <div style="font-size: 16px;">${icon}</div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${file.name}">
                        ${file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}
                      </div>
                      <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">
                        ${formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }
      
      const hid = String(record.id != null ? record.id : '');
      item.innerHTML = `
        <div class="p5r-historyItem__main">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <div style="font-weight: bold; font-size: 16px;">${record.nick}</div>
              <div class="muted" style="font-size: 12px; margin-top: 2px;">${record.mail}</div>
            </div>
            <div style="text-align: right;">
              <span class="p5r-statusBadge ${record.status === 'processed' ? 'processed' : ''}">
                ${record.status === 'processed' ? '已处理' : '待处理'}
              </span>
              <div class="muted" style="font-size: 12px; margin-top: 4px;">${dateStr}</div>
            </div>
          </div>
          <div style="margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-weight: bold;">玩家反馈</span>
              <span class="muted" style="font-size: 12px;">${record.files?.length || 0}个附件</span>
            </div>
            <div style="font-size: 14px; line-height: 1.4; opacity: 0.9; word-break: break-word;">
              ${record.message.length > 150 ? record.message.substring(0, 150) + '...' : record.message}
            </div>
          </div>
          ${filesHtml}
        </div>
        <button type="button" class="p5r-historyItem__del" aria-label="删除此条记录" data-history-id="${hid}">×</button>
      `;
      
      historyList.appendChild(item);
    });
  }
  
  function bindHistoryToggle() {
    if (!historyToggle || !contactPanelForm || !contactPanelHistory) return;
    historyToggle.addEventListener('click', function () {
      historyViewOpen = !historyViewOpen;
      contactPanelForm.hidden = historyViewOpen;
      contactPanelHistory.hidden = !historyViewOpen;
      if (contactHeadingForm) contactHeadingForm.hidden = historyViewOpen;
      if (contactHeadingHistory) contactHeadingHistory.hidden = !historyViewOpen;
      historyToggle.textContent = historyViewOpen ? '填写反馈' : '历史';
      historyToggle.setAttribute('aria-pressed', historyViewOpen ? 'true' : 'false');
      historyToggle.classList.toggle('is-active', historyViewOpen);
      if (historyViewOpen) loadHistory(historyFilter ? historyFilter.value : 'all');
    });
  }

  // 绑定历史记录事件
  function bindHistoryEvents() {
    if (historyList) {
      historyList.addEventListener('click', function (e) {
        const btn = e.target.closest('.p5r-historyItem__del');
        if (!btn || !historyList.contains(btn)) return;
        if (btn.disabled) return;
        const rid = btn.getAttribute('data-history-id');
        if (!rid) return;
        e.preventDefault();
        deleteHistoryById(rid);
      });
    }

    if (historyFilter) {
      historyFilter.addEventListener('change', function() {
        loadHistory(this.value);
      });
    }
    
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', function() {
        if (confirm('确定要清除所有历史记录吗？此操作不可撤销。')) {
          localStorage.removeItem(STORAGE_KEY);
          loadHistory();
          showMessage('历史记录已清除', 'clear');
        }
      });
    }
  }
  
  // 显示消息（fail 类错误由表单项下文案 + 顶部仅 fail 图承担，不由此处传 caption）
  function showMessage(text, type = 'default') {
    if (window.P5Proto && window.P5Proto.showMsg) {
      if (type === 'fail') {
        window.P5Proto.showMsg('fail');
      } else {
        window.P5Proto.showMsg(type);
      }
    }

    if (type !== 'fail' && window.P5Proto && window.P5Proto.toastNoti) {
      window.P5Proto.toastNoti(text, { ttl: 2200 });
    }
  }
  
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 暴露给控制台
  window.Player2 = {
    getSelectedFiles: () => selectedFiles,
    clearFiles: () => {
      selectedFiles = [];
      updateFileList();
      updateFileSummary();
    },
    getHistory: () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
    clearHistory: () => {
      localStorage.removeItem(STORAGE_KEY);
      loadHistory();
    }
  };
  
})();