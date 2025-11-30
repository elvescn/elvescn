// 【文件: script.js】
// 功能文件 - 核心修改为异步加载 navigation-data.json 文件，并新增本地化图标功能。

// 使用全局的 navigationData 变量（不再从 navigation-data.js 文件加载）
let currentNavigationData = { categories: [] }; // 初始设为空对象，等待加载

// Toast提示函数
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// DOM元素
const categoriesContainer = document.getElementById('categories');
const managementButtons = document.getElementById('managementButtons');
const addSiteBtn = document.getElementById('addSiteBtn');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const exportBtn = document.getElementById('exportBtn');

// 模态框相关
const addSiteModal = document.getElementById('addSiteModal');
const addCategoryModal = document.getElementById('addCategoryModal');
const editSiteModal = document.getElementById('editSiteModal');
const editCategoryModal = document.getElementById('editCategoryModal');

// Sortable实例
let categorySortable = null;
let siteSortables = [];

// 检查是否是本地环境
let isLocalEnvironment = false;

// 模态框关闭逻辑变量
let mouseDownTarget = null;

// 初始化页面改为异步
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

async function initApp() {
    await loadNavigationData(); 
    
    checkLocalEnvironment();
    renderCategories();
    setupEventListeners();
    setupModalCloseLogic();
    if (isLocalEnvironment) {
        initDragAndDrop();
    }
}


function setupModalCloseLogic() {
    window.addEventListener('mousedown', function(event) {
        mouseDownTarget = event.target;
    });

    window.addEventListener('mouseup', function(event) {
        if (mouseDownTarget && 
            mouseDownTarget.classList.contains('modal') && 
            event.target.classList.contains('modal')) {
            closeAllModals();
        }
        mouseDownTarget = null;
    });
}

function checkLocalEnvironment() {
    if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        managementButtons.style.display = 'flex';
        isLocalEnvironment = true;
    }
}

// 初始化拖动排序
function initDragAndDrop() {
    if (typeof Sortable === 'undefined') {
        setTimeout(initDragAndDrop, 100);
        return;
    }
    
    initCategorySortable();
    initSiteSortables();
}

// 初始化分类拖动
function initCategorySortable() {
    categorySortable = new Sortable(categoriesContainer, {
        handle: '.category-handle',
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        onEnd: function(evt) {
            const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;
            
            if (oldIndex !== newIndex) {
                const [movedCategory] = currentNavigationData.categories.splice(oldIndex, 1);
                currentNavigationData.categories.splice(newIndex, 0, movedCategory);
                
                saveToLocalStorage();
            }
        }
    });
}

// 初始化网址拖动
function initSiteSortables() {
    siteSortables.forEach(sortable => sortable.destroy());
    siteSortables = [];
    
    document.querySelectorAll('.sites-grid').forEach((grid, categoryIndex) => {
        const sortable = new Sortable(grid, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            group: {
                name: 'sites',
                pull: true,
                put: true
            },
            onEnd: function(evt) {
                const fromCategoryIndex = parseInt(evt.from.getAttribute('data-category-index'));
                const toCategoryIndex = parseInt(evt.to.getAttribute('data-category-index'));
                const oldIndex = evt.oldIndex;
                const newIndex = evt.newIndex;
                
                if (fromCategoryIndex === toCategoryIndex) {
                    const category = currentNavigationData.categories[fromCategoryIndex];
                    const [movedSite] = category.sites.splice(oldIndex, 1);
                    category.sites.splice(newIndex, 0, movedSite);
                } 
                else {
                    const fromCategory = currentNavigationData.categories[fromCategoryIndex];
                    const toCategory = currentNavigationData.categories[toCategoryIndex];
                    const [movedSite] = fromCategory.sites.splice(oldIndex, 1);
                    toCategory.sites.splice(newIndex, 0, movedSite);
                }
                
                saveToLocalStorage();
                
                setTimeout(() => {
                    initSiteSortables();
                }, 100);
            }
        });
        
        grid.setAttribute('data-category-index', categoryIndex);
        siteSortables.push(sortable);
    });
}

// 【新增】注册本地化图标按钮事件
function setupEventListeners() {
    addSiteBtn.addEventListener('click', () => openModal(addSiteModal));
    addCategoryBtn.addEventListener('click', () => openModal(addCategoryModal));
    exportBtn.addEventListener('click', exportNavigationData);
    document.getElementById('localizeIconsBtn').addEventListener('click', localizeAllIcons); // 【新增】

    document.getElementById('addSiteForm').addEventListener('submit', handleAddSite);
    document.getElementById('addCategoryForm').addEventListener('submit', handleAddCategory);
    document.getElementById('editSiteForm').addEventListener('submit', handleEditSite);
    document.getElementById('editCategoryForm').addEventListener('submit', handleEditCategory);
    document.getElementById('deleteSiteBtn').addEventListener('click', handleDeleteSite);
    document.getElementById('deleteCategoryBtn').addEventListener('click', handleDeleteCategory);

    // 图标和标题相关事件
    document.getElementById('fetchInfoBtn').addEventListener('click', () => fetchSiteInfo('add'));
    document.getElementById('uploadIconBtn').addEventListener('click', () => document.getElementById('siteIcon').click());
    document.getElementById('siteIcon').addEventListener('change', (e) => handleIconUpload(e, 'add'));
    
    document.getElementById('editFetchInfoBtn').addEventListener('click', () => fetchSiteInfo('edit'));
    document.getElementById('editUploadIconBtn').addEventListener('click', () => document.getElementById('editSiteIcon').click());
    document.getElementById('editSiteIcon').addEventListener('change', (e) => handleIconUpload(e, 'edit'));

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });
    document.getElementById('cancelBtn').addEventListener('click', closeAllModals);
    document.getElementById('cancelCategoryBtn').addEventListener('click', closeAllModals);
    document.getElementById('cancelEditBtn').addEventListener('click', closeAllModals);
    document.getElementById('cancelEditCategoryBtn').addEventListener('click', closeAllModals);
}

// 渲染分类和网站
function renderCategories() {
    categoriesContainer.innerHTML = '';
    
    currentNavigationData.categories.forEach((category, categoryIndex) => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        
        const categoryTitleContainer = document.createElement('div');
        categoryTitleContainer.style.display = 'flex';
        categoryTitleContainer.style.alignItems = 'center';
        
        if (isLocalEnvironment) {
            const categoryHandle = document.createElement('span');
            categoryHandle.className = 'category-handle';
            categoryHandle.innerHTML = '⠿';
            categoryHandle.title = '拖动排序';
            categoryTitleContainer.appendChild(categoryHandle);
        }
        
        const categoryTitle = document.createElement('h2');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category.name;
        categoryTitleContainer.appendChild(categoryTitle);
        
        const categoryActions = document.createElement('div');
        categoryActions.className = 'category-actions';
        
        if (isLocalEnvironment) {
            const editCategoryBtn = document.createElement('button');
            editCategoryBtn.className = 'edit-category-btn';
            editCategoryBtn.innerHTML = '编辑分类';
            editCategoryBtn.addEventListener('click', () => openEditCategoryModal(category));
            
            const deleteCategoryBtn = document.createElement('button');
            deleteCategoryBtn.className = 'delete-category-btn';
            deleteCategoryBtn.innerHTML = '删除分类';
            deleteCategoryBtn.addEventListener('click', () => handleDeleteCategory(category.id));
            
            categoryActions.appendChild(editCategoryBtn);
            categoryActions.appendChild(deleteCategoryBtn);
            categoryActions.style.display = 'flex';
        }
        
        categoryHeader.appendChild(categoryTitleContainer);
        categoryHeader.appendChild(categoryActions);
        
        const sitesGrid = document.createElement('div');
        sitesGrid.className = 'sites-grid';
        sitesGrid.setAttribute('data-category-index', categoryIndex);
        
        category.sites.forEach(site => {
            const siteCard = document.createElement('a');
            siteCard.className = 'site-card';
            siteCard.href = site.url;
            siteCard.target = '_blank';
            
            const siteIcon = document.createElement('img');
            siteIcon.className = 'site-icon';
            siteIcon.src = site.icon;
            siteIcon.alt = `${site.name}图标`;
            siteIcon.onerror = function() {
                // 如果当前图标加载失败，则使用默认图标
                this.src = getDefaultIcon(site.name);
            };
            
            const siteName = document.createElement('div');
            siteName.className = 'site-name';
            siteName.textContent = site.name;
            
            siteCard.appendChild(siteIcon);
            siteCard.appendChild(siteName);
            
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '✎';
            editBtn.title = '编辑';
            
            if (isLocalEnvironment) {
                editBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openEditSiteModal(site, category.id);
                });
                
                siteCard.addEventListener('mouseenter', () => {
                    editBtn.style.display = 'flex';
                });
                siteCard.addEventListener('mouseleave', () => {
                    editBtn.style.display = 'none';
                });
            }
            
            siteCard.appendChild(editBtn);
            sitesGrid.appendChild(siteCard);
        });
        
        categoryElement.appendChild(categoryHeader);
        categoryElement.appendChild(sitesGrid);
        
        categoriesContainer.appendChild(categoryElement);
    });
    
    if (isLocalEnvironment) {
        setTimeout(() => {
            initSiteSortables();
        }, 100);
    }
}

// 生成默认图标
function getDefaultIcon(name) {
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];
    const color = colors[name.length % colors.length];
    const letter = name.charAt(0).toUpperCase();
    
    return `data:image/svg+xml;base64,${btoa(`
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="6" fill="${color}"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">${letter}</text>
        </svg>
    `)}`;
}

// 打开模态框
function openModal(modal) {
    closeAllModals();
    modal.style.display = 'block';
    if (modal === addSiteModal) {
        populateCategorySelect('siteCategory');
        const defaultCategory = currentNavigationData.categories.find(cat => cat.name === "常用");
        if (defaultCategory) {
            document.getElementById('siteCategory').value = defaultCategory.id;
        }
    }
}

function closeAllModals() {
    addSiteModal.style.display = 'none';
    addCategoryModal.style.display = 'none';
    editSiteModal.style.display = 'none';
    editCategoryModal.style.display = 'none';
}

// 填充分类选择下拉框
function populateCategorySelect(selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">请选择分类</option>';
    
    currentNavigationData.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

// 添加网址
function handleAddSite(event) {
    event.preventDefault();
    
    const siteName = document.getElementById('siteName').value;
    const siteUrl = document.getElementById('siteUrl').value;
    const categoryId = parseInt(document.getElementById('siteCategory').value);
    let siteIcon = document.getElementById('iconPreview').src;
    if (!siteIcon || siteIcon.includes('//:0')) { 
        siteIcon = getDefaultIcon(siteName);
    }
    
    const category = currentNavigationData.categories.find(cat => cat.id === categoryId);
    
    if (category) {
        const newSite = {
            id: Date.now(),
            name: siteName,
            url: siteUrl,
            icon: siteIcon
        };
        
        category.sites.push(newSite);
        renderCategories();
        closeAllModals();
        saveToLocalStorage();
    }
}

// 添加分类
function handleAddCategory(event) {
    event.preventDefault();
    
    const categoryName = document.getElementById('categoryName').value;
    
    if (categoryName) {
        const newCategory = {
            id: Date.now(),
            name: categoryName,
            sites: []
        };
        
        currentNavigationData.categories.push(newCategory);
        renderCategories();
        closeAllModals();
        saveToLocalStorage();
    }
}

// 打开编辑分类模态框
function openEditCategoryModal(category) {
    document.getElementById('editCategoryId').value = category.id;
    document.getElementById('editCategoryName').value = category.name;
    openModal(editCategoryModal);
}

// 编辑分类
function handleEditCategory(event) {
    event.preventDefault();
    
    const categoryId = parseInt(document.getElementById('editCategoryId').value);
    const categoryName = document.getElementById('editCategoryName').value;
    
    const category = currentNavigationData.categories.find(cat => cat.id === categoryId);
    
    if (category) {
        category.name = categoryName;
        renderCategories();
        closeAllModals();
        saveToLocalStorage();
    }
}

// 删除分类
function handleDeleteCategory(categoryId) {
    const targetId = typeof categoryId === 'number' ? categoryId : parseInt(document.getElementById('editCategoryId').value);
    
    const category = currentNavigationData.categories.find(cat => cat.id === targetId);
    
    if (category) {
        if (category.sites.length > 0) {
            if (!confirm(`分类 "${category.name}" 中还有 ${category.sites.length} 个网址，确定要删除这个分类吗？所有网址也将被删除！`)) {
                return;
            }
        } else {
            if (!confirm(`确定要删除分类 "${category.name}" 吗？`)) {
                return;
            }
        }
        
        currentNavigationData.categories = currentNavigationData.categories.filter(cat => cat.id !== targetId);
        renderCategories();
        saveToLocalStorage();
        closeAllModals();
    }
}

// 打开编辑网址模态框
function openEditSiteModal(site, categoryId) {
    document.getElementById('editSiteId').value = site.id;
    document.getElementById('editSiteName').value = site.name;
    document.getElementById('editSiteUrl').value = site.url;
    document.getElementById('editIconPreview').src = site.icon;
    
    populateCategorySelect('editSiteCategory');
    document.getElementById('editSiteCategory').value = categoryId;
    
    openModal(editSiteModal);
}

// 编辑网址
function handleEditSite(event) {
    event.preventDefault();
    
    const siteId = parseInt(document.getElementById('editSiteId').value);
    const siteName = document.getElementById('editSiteName').value;
    const siteUrl = document.getElementById('editSiteUrl').value;
    const categoryId = parseInt(document.getElementById('editSiteCategory').value);
    let siteIcon = document.getElementById('editIconPreview').src;
    if (!siteIcon || siteIcon.includes('//:0')) { 
        siteIcon = getDefaultIcon(siteName);
    }
    
    let oldCategory, siteIndex;
    currentNavigationData.categories.forEach(category => {
        const index = category.sites.findIndex(site => site.id === siteId);
        if (index !== -1) {
            oldCategory = category;
            siteIndex = index;
        }
    });
    
    if (oldCategory && siteIndex !== undefined) {
        const updatedSite = {
            id: siteId,
            name: siteName,
            url: siteUrl,
            icon: siteIcon
        };
        
        if (oldCategory.id !== categoryId) {
            oldCategory.sites.splice(siteIndex, 1);
            
            const newCategory = currentNavigationData.categories.find(cat => cat.id === categoryId);
            if (newCategory) {
                newCategory.sites.push(updatedSite);
            }
        } else {
            oldCategory.sites[siteIndex] = updatedSite;
        }
        
        renderCategories();
        closeAllModals();
        saveToLocalStorage();
    }
}

// 删除网址
function handleDeleteSite() {
    const siteId = parseInt(document.getElementById('editSiteId').value);
    
    if (confirm('确定要删除这个网址吗？')) {
        currentNavigationData.categories.forEach(category => {
            const index = category.sites.findIndex(site => site.id === siteId);
            if (index !== -1) {
                category.sites.splice(index, 1);
            }
        });
        
        renderCategories();
        closeAllModals();
        saveToLocalStorage();
    }
}

// 获取网站信息（图标和标题）
async function fetchSiteInfo(type) {
    const urlInput = type === 'add' ? document.getElementById('siteUrl') : document.getElementById('editSiteUrl');
    const nameInput = type === 'add' ? document.getElementById('siteName') : document.getElementById('editSiteName');
    const preview = type === 'add' ? document.getElementById('iconPreview') : document.getElementById('editIconPreview');
    
    const siteUrl = urlInput.value;
    
    if (!siteUrl) {
        showToast('请先输入网站地址', 'error');
        return;
    }
    
    const fetchBtn = type === 'add' ? document.getElementById('fetchInfoBtn') : document.getElementById('editFetchInfoBtn');
    const originalText = fetchBtn.textContent; 
    
    try {
        const domain = new URL(siteUrl).hostname;
        
        fetchBtn.textContent = '获取中...'; 
        fetchBtn.disabled = true;

        let successResults = [];
        
        const GLOBAL_TIMEOUT_MS = 10000;
        
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('GLOBAL_TIMEOUT'));
            }, GLOBAL_TIMEOUT_MS);
        });

        const fetchOperation = Promise.all([
            fetchSiteIcon(domain, preview),
            fetchSiteTitle(siteUrl, nameInput)
        ]);

        const [iconSuccess, titleSuccess] = await Promise.race([
            fetchOperation,
            timeoutPromise
        ]);
        
        if (iconSuccess) successResults.push('图标');
        if (titleSuccess) successResults.push('标题');
        
        if (successResults.length > 0) {
            showToast(`成功获取: ${successResults.join('、')}`, 'success');
        } else {
            showToast('获取失败，请手动填写信息', 'error');
        }
        
    } catch (error) {
        console.error('获取网站信息失败:', error);
        
        if (error.message === 'GLOBAL_TIMEOUT') {
             showToast('获取超时 (10秒限制)，显示失败', 'error');
        } else {
            showToast('获取失败，请检查网址和网络', 'error');
        }

    } finally {
        fetchBtn.textContent = originalText;
        fetchBtn.disabled = false;
    }
}

// 获取网站图标 (保持不变)
function fetchSiteIcon(domain, preview) {
    return new Promise((resolve) => {
        const faviconServices = [
            `https://api.btstu.cn/favicon.php?url=${domain}`,
            `https://favicon.cccyun.cc/${domain}`,
            `https://icons.duckduckgo.com/ip3/${domain}.ico`,
            `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
        ];
        
        let currentServiceIndex = 0;
        
        const tryNextService = () => {
            if (currentServiceIndex >= faviconServices.length) {
                const currentName = document.getElementById('siteName')?.value || 
                                  document.getElementById('editSiteName')?.value || 
                                  domain.split('.')[0] || 'Web';
                preview.src = getDefaultIcon(currentName);
                resolve(false);
                return;
            }
            
            const faviconUrl = faviconServices[currentServiceIndex];
            currentServiceIndex++;
            
            const img = new Image();
            
            img.onload = function() {
                preview.src = faviconUrl;
                resolve(true);
            };
            
            img.onerror = function() {
                tryNextService();
            };
            
            setTimeout(() => {
                if (!img.complete) {
                    img.onload = null;
                    img.onerror = null;
                    tryNextService();
                }
            }, 3000);
            
            img.src = faviconUrl;
        };
        
        tryNextService();
    });
}

// 获取网站标题
async function fetchSiteTitle(siteUrl, nameInput) {
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(siteUrl)}`;
        
        const response = await fetch(proxyUrl);
        
        if (response.ok) {
            const data = await response.json();
            const html = data.contents;
            
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
                const title = cleanWebsiteTitle(titleMatch[1]);
                if (title && title.length > 0) {
                    nameInput.value = title;
                    return true;
                }
            }
        }
    } catch (error) {
        console.log('标题获取失败:', error);
    }
    
    return false;
}

// 清理网站标题
function cleanWebsiteTitle(title) {
    if (!title) return '';
    
    const suffixes = [
        ' - 官方网站', ' - 官方首页', ' - 首页', ' - 主页',
        ' - Official Website', ' - Official Site', ' - Home Page',
        ' | 官方网站', ' | 官方首页', ' | 首页', ' | 主页',
        ' | Official Website', ' | Official Site', ' | Home Page'
    ];
    
    let cleanTitle = title.trim();
    suffixes.forEach(suffix => {
        if (cleanTitle.endsWith(suffix)) {
            cleanTitle = cleanTitle.slice(0, -suffix.length);
        }
    });
    
    return cleanTitle.trim();
}

// 处理图标上传并转换为Base64
function handleIconUpload(event, type) {
    const file = event.target.files[0];
    const preview = type === 'add' ? document.getElementById('iconPreview') : document.getElementById('editIconPreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// 【新增】将远程URL转换为Base64
function urlToBase64(url) {
    return new Promise((resolve, reject) => {
        if (url.startsWith('data:')) {
            resolve(url); // 已经是Base64数据
            return;
        }

        // 使用 fetch 获取图片数据
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                // 使用 FileReader 将 Blob 转换为 Base64
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            })
            .catch(reject);
    });
}

// 【新增】本地化所有图标的主函数
async function localizeAllIcons() {
    if (!confirm('确定要尝试本地化所有远程网站图标吗？此操作会尝试从互联网获取图标并转换成Base64格式存储。注意：本地文件（file://）运行时可能会因浏览器安全限制而失败，建议在本地服务器（如 localhost）下运行此操作。')) {
        return;
    }

    const localizeBtn = document.getElementById('localizeIconsBtn');
    const originalText = localizeBtn.textContent;
    localizeBtn.textContent = '本地化中...';
    localizeBtn.disabled = true;

    let successfulConversions = 0;
    let failedConversions = 0;

    for (const category of currentNavigationData.categories) {
        for (const site of category.sites) {
            // 仅处理外部URL
            if (!site.icon.startsWith('data:')) {
                let conversionSuccessful = false;
                try {
                    // 使用Google的稳定Favicon服务作为本地化源
                    const domain = new URL(site.url).hostname;
                    const reliableFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
                    
                    const base64Icon = await urlToBase64(reliableFaviconUrl);
                    
                    if (base64Icon.startsWith('data:')) {
                        site.icon = base64Icon;
                        successfulConversions++;
                        conversionSuccessful = true;
                    } else {
                        throw new Error("Conversion failed to produce Base64 data.");
                    }
                } catch (e) {
                    // 失败时，替换为默认生成的 Base64 图标
                    site.icon = getDefaultIcon(site.name);
                    failedConversions++;
                    console.error(`本地化 ${site.name} 失败，使用默认图标:`, e.message);
                }
            }
        }
    }

    // 保存更改并重新渲染页面
    saveToLocalStorage();
    renderCategories();

    localizeBtn.textContent = originalText;
    localizeBtn.disabled = false;

    showToast(`图标本地化完成。成功转换: ${successfulConversions} 个, 失败/使用默认: ${failedConversions} 个。`, 'success');
}


// 从本地存储或JSON文件加载数据
async function loadNavigationData() {
    const savedData = localStorage.getItem('navigationData');
    
    if (savedData) {
        // 1. 优先从本地存储加载
        try {
             currentNavigationData = JSON.parse(savedData);
             return;
        } catch(e) {
            console.error("加载本地存储数据失败", e);
        }
    }
    
    // 2. 如果本地存储没有，则从 navigation-data.json 异步加载
    try {
        const response = await fetch('navigation-data.json');
        if (response.ok) {
            const data = await response.json();
            currentNavigationData = data;
        } else {
            console.warn("未能从 navigation-data.json 加载数据，使用默认空结构。");
            currentNavigationData = { categories: [] };
        }
    } catch (e) {
        console.error("加载 navigation-data.json 文件失败", e);
        currentNavigationData = { categories: [] };
    }
}

// 保存到本地存储
function saveToLocalStorage() {
    localStorage.setItem('navigationData', JSON.stringify(currentNavigationData));
}

// 导出导航数据文件到 navigation-data.json
function exportNavigationData() {
    const dataContent = JSON.stringify(currentNavigationData, null, 2);

    const dataBlob = new Blob([dataContent], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'navigation-data.json';
    link.click();
    
    showToast('数据已导出为 navigation-data.json 文件。', 'success');
}