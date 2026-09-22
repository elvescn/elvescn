// 【文件: script.js】

// 1. 全局变量初始化 (防止空白页的关键)
// 默认空数据，后续通过 loadNavigationData 填充
let currentNavigationData = { categories: [] };

// DOM 元素
const categoriesContainer = document.getElementById('categories');
const managementButtons = document.getElementById('managementButtons');
const addSiteBtn = document.getElementById('addSiteBtn');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const exportBtn = document.getElementById('exportBtn');

// 模态框
const addSiteModal = document.getElementById('addSiteModal');
const addCategoryModal = document.getElementById('addCategoryModal');
const editSiteModal = document.getElementById('editSiteModal');
const editCategoryModal = document.getElementById('editCategoryModal');

let isLocalEnvironment = false;
let mouseDownTarget = null;

// 2. 初始化
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

async function initApp() {
    await loadNavigationData(); // 加载数据
    checkLocalEnvironment();
    renderCategories(); // 渲染
    setupEventListeners();
    setupModalCloseLogic();
    if (isLocalEnvironment && typeof initDragAndDrop === 'function') {
        initDragAndDrop();
    }
}

// 3. 事件监听
function setupEventListeners() {
    // 顶部按钮
    addSiteBtn?.addEventListener('click', () => openModal(addSiteModal));
    addCategoryBtn?.addEventListener('click', () => openModal(addCategoryModal));
    exportBtn?.addEventListener('click', exportNavigationData);

    // 表单提交
    document.getElementById('addSiteForm')?.addEventListener('submit', handleAddSite);
    document.getElementById('addCategoryForm')?.addEventListener('submit', handleAddCategory);
    document.getElementById('editSiteForm')?.addEventListener('submit', handleEditSite);
    document.getElementById('editCategoryForm')?.addEventListener('submit', handleEditCategory);
    
    // 删除按钮
    document.getElementById('deleteSiteBtn')?.addEventListener('click', handleDeleteSite);
    document.getElementById('deleteCategoryBtn')?.addEventListener('click', handleDeleteCategory);

    // 智能获取
    document.getElementById('fetchInfoBtn')?.addEventListener('click', () => fetchSiteInfo('add'));
    document.getElementById('editFetchInfoBtn')?.addEventListener('click', () => fetchSiteInfo('edit'));

    // 图标上传
    document.getElementById('uploadIconBtn')?.addEventListener('click', () => document.getElementById('siteIcon').click());
    document.getElementById('siteIcon')?.addEventListener('change', (e) => handleIconUpload(e, 'add'));
    document.getElementById('editUploadIconBtn')?.addEventListener('click', () => document.getElementById('editSiteIcon').click());
    document.getElementById('editSiteIcon')?.addEventListener('change', (e) => handleIconUpload(e, 'edit'));

    // 清空按钮绑定
    bindClearButton('clearNameBtn', 'siteName');
    bindClearButton('clearUrlBtn', 'siteUrl');
    bindClearButton('clearDescriptionBtn', 'siteDescription');
    bindClearButton('clearEditNameBtn', 'editSiteName');
    bindClearButton('clearEditUrlBtn', 'editSiteUrl');
    bindClearButton('clearEditDescriptionBtn', 'editSiteDescription');
    
    // 图标清空特殊处理
    document.getElementById('clearIconBtn')?.addEventListener('click', () => clearField('iconPreview', 'icon'));
    document.getElementById('clearEditIconBtn')?.addEventListener('click', () => clearField('editIconPreview', 'icon'));

    // 模态框关闭
    document.querySelectorAll('.close').forEach(btn => btn.addEventListener('click', closeAllModals));
    document.getElementById('cancelBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('cancelCategoryBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('cancelEditBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('cancelEditCategoryBtn')?.addEventListener('click', closeAllModals);
}

function bindClearButton(btnId, inputId) {
    document.getElementById(btnId)?.addEventListener('click', () => clearField(inputId));
}

// 4. 智能获取逻辑
async function fetchSiteInfo(type) {
    if (typeof SiteUtils === 'undefined') return alert("fetch-helpers.js 未加载");

    const isAdd = type === 'add';
    const urlInput = document.getElementById(isAdd ? 'siteUrl' : 'editSiteUrl');
    const nameInput = document.getElementById(isAdd ? 'siteName' : 'editSiteName');
    const descInput = document.getElementById(isAdd ? 'siteDescription' : 'editSiteDescription');
    const preview = document.getElementById(isAdd ? 'iconPreview' : 'editIconPreview');
    const fetchBtn = document.getElementById(isAdd ? 'fetchInfoBtn' : 'editFetchInfoBtn');

    const siteUrl = urlInput.value.trim();
    if (!siteUrl) return showToast('请先输入网站地址', 'error');

    let domain;
    try { domain = new URL(siteUrl).hostname; } catch { return showToast('网址格式不正确', 'error'); }

    // 检查是否需要获取
    const isIconEmpty = !preview.src || preview.src.includes('//:0') || preview.src.includes('data:image/svg+xml');
    const isNameEmpty = !nameInput.value.trim();
    const isDescEmpty = !descInput.value.trim();

    if (!isIconEmpty && !isNameEmpty && !isDescEmpty) {
        return showToast('所有字段均有内容，无需获取', 'info');
    }

    // 设置按钮加载状态 (兼容包含 span 或纯文本的按钮)
    const btnSpan = fetchBtn.querySelector('.btn-main-text');
    const originalText = btnSpan ? btnSpan.textContent : fetchBtn.textContent;
    if (btnSpan) btnSpan.textContent = '获取中...'; else fetchBtn.textContent = '获取中...';
    fetchBtn.disabled = true;

    try {
        const tasks = [];
        if (isIconEmpty) tasks.push(SiteUtils.fetchIcon(domain).then(res => ({ type: 'icon', data: res })));
        if (isNameEmpty || isDescEmpty) tasks.push(SiteUtils.fetchMeta(siteUrl).then(res => ({ type: 'meta', data: res })));

        // 10秒超时
        const timeout = new Promise((_, r) => setTimeout(() => r(new Error('TIMEOUT')), 10000));
        const results = await Promise.race([Promise.all(tasks), timeout]);

        let successCount = 0;
        results.forEach(res => {
            if (res.type === 'icon' && res.data) { preview.src = res.data; successCount++; }
            if (res.type === 'meta') {
                if (isNameEmpty && res.data.title) { nameInput.value = res.data.title; successCount++; }
                if (isDescEmpty && res.data.description) { descInput.value = res.data.description; successCount++; }
            }
        });

        if (successCount > 0) showToast('获取成功', 'success');
        else showToast('未获取到新信息', 'info');

        // 兜底图标
        if (isIconEmpty && (!preview.src || preview.src.includes('//:0'))) {
            preview.src = SiteUtils.getDefaultIcon(domain.split('.')[0]);
        }

    } catch (err) {
        showToast(err.message === 'TIMEOUT' ? '获取超时' : '获取失败', 'error');
    } finally {
        if (btnSpan) btnSpan.textContent = originalText; else fetchBtn.textContent = originalText;
        fetchBtn.disabled = false;
    }
}

// 5. 辅助函数
function clearField(elementId, type = 'text') {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (type === 'icon') {
        el.src = '//:0';
        showToast('图标已清空', 'info');
    } else {
        el.value = '';
        showToast('内容已清空', 'info');
    }
}

function handleIconUpload(e, type) {
    const file = e.target.files[0];
    const preview = document.getElementById(type === 'add' ? 'iconPreview' : 'editIconPreview');
    if (file) {
        const reader = new FileReader();
        reader.onload = evt => preview.src = evt.target.result;
        reader.readAsDataURL(file);
    }
}

function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div'); toast.id = 'toast';
        toast.className = 'toast'; document.body.appendChild(toast);
    }
    toast.textContent = message; toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// 6. 渲染核心
function renderCategories() {
    categoriesContainer.innerHTML = '';
    
    if (!currentNavigationData.categories || currentNavigationData.categories.length === 0) {
        categoriesContainer.innerHTML = '<div style="text-align:center; padding:20px; color:#666;">暂无数据，请点击“添加分类”开始。</div>';
        return;
    }

    currentNavigationData.categories.forEach((category, catIdx) => {
        const catEl = document.createElement('div');
        catEl.className = 'category';
        
        const header = document.createElement('div');
        header.className = 'category-header';
        
        const titleBox = document.createElement('div');
        titleBox.style.display = 'flex'; titleBox.style.alignItems = 'center';
        
        if (isLocalEnvironment) {
            const handle = document.createElement('span');
            handle.className = 'category-handle'; handle.innerHTML = '⠿';
            titleBox.appendChild(handle);
        }
        
        const h2 = document.createElement('h2');
        h2.className = 'category-title'; h2.textContent = category.name;
        titleBox.appendChild(h2);
        
        const actions = document.createElement('div');
        actions.className = 'category-actions';
        if (isLocalEnvironment) {
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-secondary'; editBtn.textContent = '编辑';
            editBtn.onclick = () => openEditCategoryModal(category);
            
            const delBtn = document.createElement('button');
            delBtn.className = 'btn-danger'; delBtn.textContent = '删除';
            delBtn.onclick = () => handleDeleteCategory(category.id);
            
            actions.append(editBtn, delBtn);
            actions.style.display = 'flex';
        }
        header.append(titleBox, actions);
        
        const grid = document.createElement('div');
        grid.className = 'sites-grid';
        grid.setAttribute('data-category-index', catIdx);
        
        category.sites.forEach(site => {
            const card = document.createElement('a');
            card.className = 'site-card';
            card.href = site.url; card.target = '_blank';
            if (site.description) card.title = site.description;

            const icon = document.createElement('img');
            icon.className = 'site-icon';
            icon.src = site.icon;
            icon.onerror = function() { if(typeof SiteUtils !== 'undefined') this.src = SiteUtils.getDefaultIcon(site.name); };

            const info = document.createElement('div');
            info.className = 'site-info';
            
            const name = document.createElement('div');
            name.className = 'site-name'; name.textContent = site.name;
            info.appendChild(name);

            if (site.description) {
                const desc = document.createElement('div');
                desc.className = 'site-description'; desc.textContent = site.description;
                info.appendChild(desc);
            }

            card.append(icon, info);

            if (isLocalEnvironment) {
                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn'; editBtn.innerHTML = '✎';
                editBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); openEditSiteModal(site, category.id); };
                card.appendChild(editBtn);
                card.onmouseenter = () => editBtn.style.display = 'block';
                card.onmouseleave = () => editBtn.style.display = 'none';
            }
            grid.appendChild(card);
        });
        
        catEl.append(header, grid);
        categoriesContainer.appendChild(catEl);
    });
    
    if (isLocalEnvironment) setTimeout(initSiteSortables, 100);
}

// 7. 数据持久化 (LocalStorage & JSON Fetch)
async function loadNavigationData() {
    const savedData = localStorage.getItem('navigationData');
    if (savedData) {
        try { currentNavigationData = JSON.parse(savedData); return; } catch(e) { console.error(e); }
    }
    // 如果本地没有，尝试读取 json 文件
    try {
        const response = await fetch('navigation-data.json');
        if (response.ok) { currentNavigationData = await response.json(); }
    } catch (e) {
        console.warn("未找到 navigation-data.json 或网络错误，初始化为空数据。", e);
    }
}

function saveToLocalStorage() {
    localStorage.setItem('navigationData', JSON.stringify(currentNavigationData));
}

function exportNavigationData() {
    const dataContent = JSON.stringify(currentNavigationData, null, 2);
    const blob = new Blob([dataContent], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'navigation-data.json';
    link.click();
    showToast('数据导出成功', 'success');
}

// 8. 模态框与数据操作
function handleAddSite(e) {
    e.preventDefault();
    const name = document.getElementById('siteName').value;
    const url = document.getElementById('siteUrl').value;
    const desc = document.getElementById('siteDescription').value.trim();
    const catId = parseInt(document.getElementById('siteCategory').value);
    let icon = document.getElementById('iconPreview').src;
    
    if ((!icon || icon.includes('//:0')) && typeof SiteUtils !== 'undefined') icon = SiteUtils.getDefaultIcon(name);

    const cat = currentNavigationData.categories.find(c => c.id === catId);
    if (cat) {
        cat.sites.push({ id: Date.now(), name, url, description: desc, icon });
        renderCategories(); closeAllModals(); saveToLocalStorage();
    }
}

function handleEditSite(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editSiteId').value);
    const name = document.getElementById('editSiteName').value;
    const url = document.getElementById('editSiteUrl').value;
    const desc = document.getElementById('editSiteDescription').value.trim();
    const catId = parseInt(document.getElementById('editSiteCategory').value);
    let icon = document.getElementById('editIconPreview').src;

    if ((!icon || icon.includes('//:0')) && typeof SiteUtils !== 'undefined') icon = SiteUtils.getDefaultIcon(name);

    let oldCat, idx;
    currentNavigationData.categories.forEach(c => {
        const i = c.sites.findIndex(s => s.id === id);
        if (i !== -1) { oldCat = c; idx = i; }
    });

    if (oldCat) {
        const newSite = { id, name, url, description: desc, icon };
        if (oldCat.id !== catId) {
            oldCat.sites.splice(idx, 1);
            const newCat = currentNavigationData.categories.find(c => c.id === catId);
            if (newCat) newCat.sites.push(newSite);
        } else { oldCat.sites[idx] = newSite; }
        renderCategories(); closeAllModals(); saveToLocalStorage();
    }
}

function handleDeleteSite() {
    const id = parseInt(document.getElementById('editSiteId').value);
    if (confirm('确定删除?')) {
        currentNavigationData.categories.forEach(c => {
            const idx = c.sites.findIndex(s => s.id === id);
            if (idx !== -1) c.sites.splice(idx, 1);
        });
        renderCategories(); closeAllModals(); saveToLocalStorage();
    }
}

function handleAddCategory(e) {
    e.preventDefault();
    const name = document.getElementById('categoryName').value;
    currentNavigationData.categories.push({ id: Date.now(), name, sites: [] });
    renderCategories(); closeAllModals(); saveToLocalStorage();
}

function handleEditCategory(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editCategoryId').value);
    const name = document.getElementById('editCategoryName').value;
    const cat = currentNavigationData.categories.find(c => c.id === id);
    if (cat) { cat.name = name; renderCategories(); closeAllModals(); saveToLocalStorage(); }
}

function handleDeleteCategory(id) {
    const targetId = typeof id === 'number' ? id : parseInt(document.getElementById('editCategoryId').value);
    const catIdx = currentNavigationData.categories.findIndex(c => c.id === targetId);
    if (catIdx !== -1) {
        if (currentNavigationData.categories[catIdx].sites.length > 0 && !confirm('分类不为空，确定删除?')) return;
        currentNavigationData.categories.splice(catIdx, 1);
        renderCategories(); closeAllModals(); saveToLocalStorage();
    }
}

function openModal(modal) {
    closeAllModals(); modal.style.display = 'block';
    if (modal === addSiteModal) {
        populateCategorySelect('siteCategory');
        document.getElementById('addSiteForm').reset();
        document.getElementById('iconPreview').src = '//:0';
    }
}
function openEditSiteModal(site, catId) {
    document.getElementById('editSiteId').value = site.id;
    document.getElementById('editSiteName').value = site.name;
    document.getElementById('editSiteUrl').value = site.url;
    document.getElementById('editSiteDescription').value = site.description || '';
    document.getElementById('editIconPreview').src = site.icon;
    populateCategorySelect('editSiteCategory');
    document.getElementById('editSiteCategory').value = catId;
    closeAllModals(); editSiteModal.style.display = 'block';
}
function openEditCategoryModal(cat) {
    document.getElementById('editCategoryId').value = cat.id;
    document.getElementById('editCategoryName').value = cat.name;
    closeAllModals(); editCategoryModal.style.display = 'block';
}
function closeAllModals() {
    [addSiteModal, addCategoryModal, editSiteModal, editCategoryModal].forEach(m => m.style.display = 'none');
}
function populateCategorySelect(id) {
    const sel = document.getElementById(id); sel.innerHTML = '';
    currentNavigationData.categories.forEach(c => {
        const opt = document.createElement('option'); opt.value = c.id; opt.textContent = c.name; sel.appendChild(opt);
    });
}
function checkLocalEnvironment() {
    if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        managementButtons.style.display = 'flex'; isLocalEnvironment = true;
    }
}
function setupModalCloseLogic() {
    window.addEventListener('mousedown', e => mouseDownTarget = e.target);
    window.addEventListener('mouseup', e => {
        if (mouseDownTarget && mouseDownTarget.classList.contains('modal') && e.target.classList.contains('modal')) closeAllModals();
        mouseDownTarget = null;
    });
}
// SortableJS Wrapper
function initDragAndDrop() { if (typeof Sortable === 'undefined') { setTimeout(initDragAndDrop, 100); return; } initCategorySortable(); initSiteSortables(); }
function initCategorySortable() { new Sortable(categoriesContainer, { handle: '.category-handle', animation: 150, onEnd: function(evt) { if (evt.oldIndex !== evt.newIndex) { const [moved] = currentNavigationData.categories.splice(evt.oldIndex, 1); currentNavigationData.categories.splice(evt.newIndex, 0, moved); saveToLocalStorage(); } } }); }
function initSiteSortables() { document.querySelectorAll('.sites-grid').forEach((grid, catIdx) => { new Sortable(grid, { group: 'sites', animation: 150, onEnd: function(evt) { const fromIdx = parseInt(evt.from.getAttribute('data-category-index')); const toIdx = parseInt(evt.to.getAttribute('data-category-index')); const [moved] = currentNavigationData.categories[fromIdx].sites.splice(evt.oldIndex, 1); currentNavigationData.categories[toIdx].sites.splice(evt.newIndex, 0, moved); saveToLocalStorage(); setTimeout(initSiteSortables, 50); } }); grid.setAttribute('data-category-index', catIdx); }); }