// 【文件: script.js】
// 功能文件 - 增加从 URL 获取图标并转 Base64 的功能。

// 使用全局的 navigationData 变量（来自 navigation-data.js）
let currentNavigationData = navigationData;

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

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    checkLocalEnvironment();
    renderCategories();
    setupEventListeners();
    setupModalCloseLogic();
    // SortableJS 已经通过 <script> 标签加载
    if (isLocalEnvironment && typeof Sortable !== 'undefined') {
        initDragAndDrop();
    }
});

function setupModalCloseLogic() {
    window.addEventListener('mousedown', function(event) {
        mouseDownTarget = event.target;
    });

    window.addEventListener('mouseup', function(event) {
        // 只有当鼠标按下和抬起都在模态框背景时才关闭
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
    if (typeof Sortable === 'undefined') return; // 安全检查
    
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
    // 清除旧的实例，避免重复绑定
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

function setupEventListeners() {
    addSiteBtn.addEventListener('click', () => openModal(addSiteModal));
    addCategoryBtn.addEventListener('click', () => openModal(addCategoryModal));
    exportBtn.addEventListener('click', exportNavigationData);

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

    // 新增：从链接获取图标的事件监听
    document.getElementById('fetchIconUrlBtn').addEventListener('click', () => handleIconUrlFetch('add'));
    
    document.getElementById('editFetchInfoBtn').addEventListener('click', () => fetchSiteInfo('edit'));
    document.getElementById('editUploadIconBtn').addEventListener('click', () => document.getElementById('editSiteIcon').click());
    document.getElementById('editSiteIcon').addEventListener('change', (e) => handleIconUpload(e, 'edit'));

    // 新增：从链接获取图标的事件监听（编辑）
    document.getElementById('editFetchIconUrlBtn').addEventListener('click', () => handleIconUrlFetch('edit'));


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
            editCategoryBtn.className = 'btn-secondary edit-category-btn';
            editCategoryBtn.innerHTML = '编辑';
            editCategoryBtn.addEventListener('click', () => openEditCategoryModal(category));
            
            const deleteCategoryBtn = document.createElement('button');
            deleteCategoryBtn.className = 'btn-danger delete-category-btn';
            deleteCategoryBtn.innerHTML = '删除';
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
                // 如果图标加载失败，尝试使用默认图标
                this.src = getDefaultIcon(site.name);
            };
            
            const textContainer = document.createElement('div');
            textContainer.className = 'site-info'; 
            
            const siteName = document.createElement('div');
            siteName.className = 'site-name';
            siteName.textContent = site.name;

            const siteDescription = document.createElement('div');
            siteDescription.className = 'site-description'; 
            siteDescription.textContent = site.description || '';
            
            textContainer.appendChild(siteName);
            // 只有有描述时才显示描述
            if (site.description && site.description.length > 0) {
                 textContainer.appendChild(siteDescription);
            }
            
            siteCard.appendChild(siteIcon);
            siteCard.appendChild(textContainer);
            
            if (isLocalEnvironment) {
                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.innerHTML = '✎';
                editBtn.title = '编辑';
                
                editBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openEditSiteModal(site, category.id);
                });
                
                // 鼠标悬停显示编辑按钮
                siteCard.addEventListener('mouseenter', () => {
                    editBtn.style.display = 'flex';
                });
                siteCard.addEventListener('mouseleave', () => {
                    editBtn.style.display = 'none';
                });
                siteCard.appendChild(editBtn);
            }
            
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
        // 清空描述字段和新增的图标URL字段
        document.getElementById('siteDescription').value = ''; 
        document.getElementById('siteIconUrl').value = ''; 
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
    const siteDescription = document.getElementById('siteDescription').value;
    
    // **修改点:** 只有当预览图标为空（未获取或未上传）时，才使用默认图标
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
            description: siteDescription,
            icon: siteIcon
        };
        
        category.sites.push(newSite);
        renderCategories();
        closeAllModals();
        saveToLocalStorage();
        showToast('网址添加成功', 'success');
    } else {
        showToast('请选择分类', 'error');
    }
}

// 添加分类 (逻辑不变)
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
        showToast('分类添加成功', 'success');
    }
}

// 打开编辑分类模态框 (逻辑不变)
function openEditCategoryModal(category) {
    document.getElementById('editCategoryId').value = category.id;
    document.getElementById('editCategoryName').value = category.name;
    openModal(editCategoryModal);
}

// 编辑分类 (逻辑不变)
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
        showToast('分类编辑成功', 'success');
    }
}

// 删除分类 (逻辑不变)
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
        showToast('分类删除成功', 'success');
    }
}

// 打开编辑网址模态框 
function openEditSiteModal(site, categoryId) {
    document.getElementById('editSiteId').value = site.id;
    document.getElementById('editSiteName').value = site.name;
    document.getElementById('editSiteUrl').value = site.url;
    document.getElementById('editSiteDescription').value = site.description || '';
    document.getElementById('editIconPreview').src = site.icon;
    
    // 清空图标 URL 字段
    document.getElementById('editSiteIconUrl').value = ''; 
    
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
    const siteDescription = document.getElementById('editSiteDescription').value;
    const categoryId = parseInt(document.getElementById('editSiteCategory').value);
    
    // **修改点:** 只有当预览图标为空（未获取或未上传）时，才使用默认图标
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
            description: siteDescription,
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
        showToast('网址编辑成功', 'success');
    }
}

// 删除网址 (逻辑不变)
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
        showToast('网址删除成功', 'success');
    }
}

/**
 * **新增功能**：处理从 URL 获取图标并转换为 Base64 的逻辑
 * @param {string} type - 'add' 或 'edit'
 */
async function handleIconUrlFetch(type) {
    const urlInput = type === 'add' ? document.getElementById('siteIconUrl') : document.getElementById('editSiteIconUrl');
    const preview = type === 'add' ? document.getElementById('iconPreview') : document.getElementById('editIconPreview');
    const fetchBtn = type === 'add' ? document.getElementById('fetchIconUrlBtn') : document.getElementById('editFetchIconUrlBtn');
    
    const iconUrl = urlInput.value.trim();
    if (!iconUrl) {
        showToast('请输入图标链接', 'error');
        return;
    }

    const originalText = fetchBtn.textContent;
    fetchBtn.textContent = '转换中...';
    fetchBtn.disabled = true;

    try {
        const base64Icon = await fetchAndConvertIconToBase64(iconUrl);
        
        if (base64Icon) {
            preview.src = base64Icon;
            showToast('图标链接转换成功', 'success');
        } else {
            showToast('无法获取或转换图标，请检查链接是否正确或更换链接', 'error');
        }

    } catch (error) {
        console.error('从 URL 获取图标失败:', error);
        showToast('获取或转换失败，可能是跨域问题，请手动上传', 'error');
    } finally {
        fetchBtn.textContent = originalText;
        fetchBtn.disabled = false;
    }
}

/**
 * **新增功能**：通过 CORS 代理获取图片并转换为 Base64
 * @param {string} url - 图标的原始 URL
 * @returns {Promise<string|null>} Base64 格式的图片数据或 null
 */
function fetchAndConvertIconToBase64(url) {
    // 尝试使用 CORS 代理解决跨域问题，这里使用 allorigins
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    
    return new Promise((resolve) => {
        // 使用 Fetch API 获取图片
        fetch(proxyUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络请求失败');
                }
                // 确保内容类型是图片
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.startsWith('image/')) {
                    throw new Error('响应内容不是图片');
                }
                return response.blob();
            })
            .then(blob => {
                // 将 Blob 转换为 Base64
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    resolve(null);
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                console.error('获取或转换图片时发生错误:', error);
                resolve(null);
            });
    });
}


// 获取网站信息（图标、标题和描述）
async function fetchSiteInfo(type) {
    const urlInput = type === 'add' ? document.getElementById('siteUrl') : document.getElementById('editSiteUrl');
    const nameInput = type === 'add' ? document.getElementById('siteName') : document.getElementById('editSiteName');
    const descriptionInput = type === 'add' ? document.getElementById('siteDescription') : document.getElementById('editSiteDescription');
    const preview = type === 'add' ? document.getElementById('iconPreview') : document.getElementById('editIconPreview');
    
    const siteUrl = urlInput.value.trim();
    
    if (!siteUrl) {
        showToast('请先输入网站地址', 'error');
        return;
    }

    let formattedUrl = siteUrl;
    if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'http://' + formattedUrl;
    }
    urlInput.value = formattedUrl; 

    
    const fetchBtn = type === 'add' ? document.getElementById('fetchInfoBtn') : document.getElementById('editFetchInfoBtn');
    const originalText = fetchBtn.textContent; 
    
    try {
        const domain = new URL(formattedUrl).hostname;
        
        fetchBtn.textContent = '获取中...';
        fetchBtn.disabled = true;

        let successResults = [];
        
        // --- 10秒全局超时控制 ---
        const GLOBAL_TIMEOUT_MS = 10000;
        
        // 1. 设置一个 10 秒后拒绝的 Promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('GLOBAL_TIMEOUT'));
            }, GLOBAL_TIMEOUT_MS);
        });

        // 2. 准备图标和标题/描述的并行获取操作
        const fetchOperation = Promise.all([
            // fetchSiteIcon 内部有 3s 限制
            fetchSiteIcon(domain, preview), 
            // fetchSiteTitleAndDescription 内部有 6s 限制
            fetchSiteTitleAndDescription(formattedUrl, nameInput, descriptionInput) 
        ]);

        // 3. 竞赛获取操作和超时 Promise
        const [iconSuccess, titleDescResult] = await Promise.race([
            fetchOperation,
            timeoutPromise
        ]);
        // --- 10秒全局超时控制 END ---

        
        if (iconSuccess) successResults.push('图标');
        if (titleDescResult.title) successResults.push('标题');
        if (titleDescResult.description) successResults.push('描述');
        
        
        if (successResults.length > 0) {
            showToast(`成功获取: ${successResults.join('、')}`, 'success');
        } else {
            showToast('获取失败，请手动填写信息', 'error');
        }
        
    } catch (error) {
        console.error('获取网站信息失败:', error);
        
        if (error.message === 'GLOBAL_TIMEOUT') {
             showToast('获取超时 (10秒限制)，请重试或手动输入', 'error');
        } else {
            showToast('获取失败，请检查网址和网络', 'error');
        }
        
    } finally {
        // 无论成功、失败或超时，都恢复按钮状态
        fetchBtn.textContent = originalText;
        fetchBtn.disabled = false;
    }
}

// 获取网站图标 
function fetchSiteIcon(domain, preview) {
    return new Promise((resolve) => {
        // 如果获取失败，不替换已有的图标。
        // 只有获取成功时才设置 preview.src。
        
        const faviconServices = [
            `https://favicon.cccyun.cc/${domain}`, 
            `https://icon.horse/icon/${domain}`, 
            `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
        ];
        
        let currentServiceIndex = 0;
        
        const tryNextService = () => {
            if (currentServiceIndex >= faviconServices.length) {
                // 所有服务都失败了，不更新 preview.src，直接返回失败
                resolve(false); 
                return;
            }
            
            const faviconUrl = faviconServices[currentServiceIndex];
            currentServiceIndex++;
            
            let timer;
            const img = new Image();
            
            img.onload = function() {
                clearTimeout(timer);
                preview.src = faviconUrl; // 成功获取，更新图标
                resolve(true);
            };
            
            img.onerror = function() {
                clearTimeout(timer);
                tryNextService(); // 失败，尝试下一个服务
            };
            
            // 设置超时：3秒内未加载成功则尝试下一个
            timer = setTimeout(() => {
                img.onload = null;
                img.onerror = null;
                tryNextService();
            }, 3000);
            
            img.src = faviconUrl;
        };
        
        tryNextService();
    });
}

// 整合获取网站标题和描述的函数 
async function fetchSiteTitleAndDescription(siteUrl, nameInput, descriptionInput) {
    const results = { title: false, description: false };
    
    // 仅尝试一个国内常用的 CORS 代理，并缩短超时时间
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(siteUrl)}`;

    let html = '';
    
    try {
        const controller = new AbortController();
        // 内部超时设置为 6 秒，以确保在全局 10 秒内留出时间给图标获取
        const timeoutId = setTimeout(() => controller.abort(), 6000); 
        
        const response = await fetch(proxyUrl, { signal: controller.signal }); 
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            html = data.contents || ''; 
        }
    } catch (error) {
        // 忽略错误，返回空结果
        return results;
    }
    
    if (html) {
        // 1. 解析标题
        const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
            const title = cleanWebsiteTitle(titleMatch[1].trim());
            if (title && title.length > 0) {
                nameInput.value = title;
                results.title = true;
            }
        }

        // 2. 解析描述 (从 meta description 标签)
        const metaDescriptionRegex = /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>|<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i;
        const metaDescriptionMatch = html.match(metaDescriptionRegex);
        
        if (metaDescriptionMatch) {
            const rawDescription = metaDescriptionMatch[1] || metaDescriptionMatch[2];
            const description = rawDescription ? rawDescription.trim() : '';
            
            if (description && description.length > 0) {
                descriptionInput.value = description.substring(0, 100); 
                results.description = true;
            }
        }
    }
    
    return results;
}


// 清理网站标题 (逻辑不变)
function cleanWebsiteTitle(title) {
    if (!title) return '';
    
    const suffixes = [
        ' - 官方网站', ' - 官方首页', ' - 首页', ' - 主页',
        ' - Official Website', ' - Official Site', ' - Home Page',
        ' | 官方网站', ' | 官方首页', ' | 首页', ' | 主页',
        ' | Official Website', ' | Official Site', ' | Home Page',
        ' - Powered by Discuz!',
        ' - 专业的软件技术交流社区'
    ];
    
    let cleanTitle = title.trim();
    
    suffixes.forEach(suffix => {
        const regex = new RegExp(`\\s*([\\s\\-—_\\|])*\\s*${suffix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*$`, 'i');
        cleanTitle = cleanTitle.replace(cleanTitle.trim().endsWith(suffix) ? suffix : ''); // 兼容旧版，但使用 endsWith 判断
    });
    
    return cleanTitle.trim();
}

// 处理图标上传并转换为Base64 (逻辑不变)
function handleIconUpload(event, type) {
    const file = event.target.files[0];
    const preview = type === 'add' ? document.getElementById('iconPreview') : document.getElementById('editIconPreview');
    
    if (file) {
        if (!file.type.startsWith('image/')) {
            showToast('请选择一个图片文件', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// 保存到本地存储 (逻辑不变)
function saveToLocalStorage() {
    localStorage.setItem('navigationData', JSON.stringify(currentNavigationData));
}

// 从本地存储加载 (逻辑不变)
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('navigationData');
    if (savedData) {
        try {
             currentNavigationData = JSON.parse(savedData);
        } catch(e) {
            console.error("加载本地存储数据失败", e);
            // 如果解析失败，使用初始数据
            currentNavigationData = navigationData;
        }
    }
}

// 导出导航数据文件 (逻辑不变)
function exportNavigationData() {
    const dataContent = `// 导航数据 - 这个文件只包含数据，可以安全导出和替换\nconst navigationData = ${JSON.stringify(currentNavigationData, null, 2)};`;

    const dataBlob = new Blob([dataContent], {type: 'application/javascript'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'navigation-data.js';
    link.click();
}