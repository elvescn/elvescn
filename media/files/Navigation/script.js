// 功能文件 - 这个文件包含所有交互逻辑，不需要修改

// 使用全局的 navigationData 变量（来自 navigation-data.js）
let currentNavigationData = navigationData;

// DOM元素
const categoriesContainer = document.getElementById('categories');
const addSiteBtn = document.getElementById('addSiteBtn');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const resetBtn = document.getElementById('resetBtn');
const managementButtons = document.getElementById('managementButtons');

// 模态框相关
const addSiteModal = document.getElementById('addSiteModal');
const addCategoryModal = document.getElementById('addCategoryModal');
const editSiteModal = document.getElementById('editSiteModal');
const editCategoryModal = document.getElementById('editCategoryModal');

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    renderCategories();
    setupEventListeners();
    checkLocalEnvironment();
});

function setupEventListeners() {
    // 按钮事件
    addSiteBtn.addEventListener('click', () => openModal(addSiteModal));
    addCategoryBtn.addEventListener('click', () => openModal(addCategoryModal));
    exportBtn.addEventListener('click', exportNavigationData);
    importBtn.addEventListener('click', importData);
    resetBtn.addEventListener('click', resetData);

    // 表单事件
    document.getElementById('addSiteForm').addEventListener('submit', handleAddSite);
    document.getElementById('addCategoryForm').addEventListener('submit', handleAddCategory);
    document.getElementById('editSiteForm').addEventListener('submit', handleEditSite);
    document.getElementById('editCategoryForm').addEventListener('submit', handleEditCategory);
    document.getElementById('deleteSiteBtn').addEventListener('click', handleDeleteSite);
    document.getElementById('deleteCategoryBtn').addEventListener('click', handleDeleteCategory);

    // 图标相关事件
    document.getElementById('fetchIconBtn').addEventListener('click', () => fetchSiteIcon('add'));
    document.getElementById('uploadIconBtn').addEventListener('click', () => document.getElementById('siteIcon').click());
    document.getElementById('siteIcon').addEventListener('change', (e) => handleIconUpload(e, 'add'));
    
    document.getElementById('editFetchIconBtn').addEventListener('click', () => fetchSiteIcon('edit'));
    document.getElementById('editUploadIconBtn').addEventListener('click', () => document.getElementById('editSiteIcon').click());
    document.getElementById('editSiteIcon').addEventListener('change', (e) => handleIconUpload(e, 'edit'));

    // 关闭按钮事件
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });
    document.getElementById('cancelBtn').addEventListener('click', closeAllModals);
    document.getElementById('cancelCategoryBtn').addEventListener('click', closeAllModals);
    document.getElementById('cancelEditBtn').addEventListener('click', closeAllModals);
    document.getElementById('cancelEditCategoryBtn').addEventListener('click', closeAllModals);

    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

function checkLocalEnvironment() {
    if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        managementButtons.style.display = 'flex';
    }
}

// 渲染分类和网站
function renderCategories() {
    categoriesContainer.innerHTML = '';
    
    currentNavigationData.categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        
        // 分类标题和操作按钮
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        
        const categoryTitle = document.createElement('h2');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category.name;
        
        const categoryActions = document.createElement('div');
        categoryActions.className = 'category-actions';
        
        // 编辑分类按钮（只在本地环境显示）
        const editCategoryBtn = document.createElement('button');
        editCategoryBtn.className = 'edit-category-btn';
        editCategoryBtn.innerHTML = '编辑分类';
        editCategoryBtn.addEventListener('click', () => openEditCategoryModal(category));
        
        // 删除分类按钮（只在本地环境显示）
        const deleteCategoryBtn = document.createElement('button');
        deleteCategoryBtn.className = 'delete-category-btn';
        deleteCategoryBtn.innerHTML = '删除分类';
        deleteCategoryBtn.addEventListener('click', () => handleDeleteCategory(category.id));
        
        categoryActions.appendChild(editCategoryBtn);
        categoryActions.appendChild(deleteCategoryBtn);
        
        categoryHeader.appendChild(categoryTitle);
        categoryHeader.appendChild(categoryActions);
        
        const sitesGrid = document.createElement('div');
        sitesGrid.className = 'sites-grid';
        
        category.sites.forEach(site => {
            const siteCard = document.createElement('a');
            siteCard.className = 'site-card';
            siteCard.href = site.url;
            siteCard.target = '_blank';
            
            const siteHeader = document.createElement('div');
            siteHeader.className = 'site-header';
            
            const siteIcon = document.createElement('img');
            siteIcon.className = 'site-icon';
            siteIcon.src = site.icon;
            siteIcon.alt = `${site.name}图标`;
            siteIcon.onerror = function() {
                this.src = getDefaultIcon(site.name);
            };
            
            const siteName = document.createElement('div');
            siteName.className = 'site-name';
            siteName.textContent = site.name;
            
            siteHeader.appendChild(siteIcon);
            siteHeader.appendChild(siteName);
            
            const siteDescription = document.createElement('div');
            siteDescription.className = 'site-description';
            siteDescription.textContent = site.description;
            
            // 编辑按钮（只在本地环境显示）
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '✎';
            editBtn.title = '编辑';
            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openEditSiteModal(site, category.id);
            });
            
            siteCard.appendChild(siteHeader);
            siteCard.appendChild(siteDescription);
            siteCard.appendChild(editBtn);
            
            sitesGrid.appendChild(siteCard);
        });
        
        categoryElement.appendChild(categoryHeader);
        categoryElement.appendChild(sitesGrid);
        
        categoriesContainer.appendChild(categoryElement);
    });
}

// 生成默认图标
function getDefaultIcon(name) {
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];
    const color = colors[name.length % colors.length];
    const letter = name.charAt(0).toUpperCase();
    
    return `data:image/svg+xml;base64,${btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="4" fill="${color}"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">${letter}</text>
        </svg>
    `)}`;
}

// 打开模态框
function openModal(modal) {
    closeAllModals();
    modal.style.display = 'block';
    if (modal === addSiteModal) {
        populateCategorySelect('siteCategory');
    } else if (modal === editSiteModal) {
        populateCategorySelect('editSiteCategory');
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
    const siteDescription = document.getElementById('siteDescription').value;
    const categoryId = parseInt(document.getElementById('siteCategory').value);
    const siteIcon = document.getElementById('iconPreview').src || getDefaultIcon(siteName);
    
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
        
        alert('网址已添加！');
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
        
        alert('分类已添加！');
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
        
        alert('分类名称已更新！');
    }
}

// 删除分类
function handleDeleteCategory(categoryId) {
    if (typeof categoryId === 'number') {
        // 从按钮点击调用
        const category = currentNavigationData.categories.find(cat => cat.id === categoryId);
        if (category && category.sites.length > 0) {
            if (!confirm(`分类 "${category.name}" 中还有 ${category.sites.length} 个网址，确定要删除这个分类吗？所有网址也将被删除！`)) {
                return;
            }
        } else if (category) {
            if (!confirm(`确定要删除分类 "${category.name}" 吗？`)) {
                return;
            }
        }
        
        currentNavigationData.categories = currentNavigationData.categories.filter(cat => cat.id !== categoryId);
        renderCategories();
        saveToLocalStorage();
        alert('分类已删除！');
    } else {
        // 从模态框按钮调用
        const categoryId = parseInt(document.getElementById('editCategoryId').value);
        handleDeleteCategory(categoryId);
        closeAllModals();
    }
}

// 打开编辑网址模态框
function openEditSiteModal(site, categoryId) {
    document.getElementById('editSiteId').value = site.id;
    document.getElementById('editSiteName').value = site.name;
    document.getElementById('editSiteUrl').value = site.url;
    document.getElementById('editSiteDescription').value = site.description;
    document.getElementById('editSiteCategory').value = categoryId;
    document.getElementById('editIconPreview').src = site.icon;
    
    populateCategorySelect('editSiteCategory');
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
    const siteIcon = document.getElementById('editIconPreview').src || getDefaultIcon(siteName);
    
    // 找到原分类和网站
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
        
        // 如果分类改变了，移动到新分类
        if (oldCategory.id !== categoryId) {
            // 从原分类移除
            oldCategory.sites.splice(siteIndex, 1);
            
            // 添加到新分类
            const newCategory = currentNavigationData.categories.find(cat => cat.id === categoryId);
            if (newCategory) {
                newCategory.sites.push(updatedSite);
            }
        } else {
            // 同一分类，直接更新
            oldCategory.sites[siteIndex] = updatedSite;
        }
        
        renderCategories();
        closeAllModals();
        saveToLocalStorage();
        
        alert('网址已更新！');
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
        
        alert('网址已删除！');
    }
}

// 获取网站图标并转换为Base64 - 修复版
function fetchSiteIcon(type) {
    const urlInput = type === 'add' ? document.getElementById('siteUrl') : document.getElementById('editSiteUrl');
    const preview = type === 'add' ? document.getElementById('iconPreview') : document.getElementById('editIconPreview');
    
    const siteUrl = urlInput.value;
    
    if (!siteUrl) {
        alert('请先输入网站地址');
        return;
    }
    
    try {
        const domain = new URL(siteUrl).hostname;
        
        // 使用多个favicon服务作为备选
        const faviconServices = [
            `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
            `https://favicon.yandex.net/favicon/${domain}`,
            `https://icons.duckduckgo.com/ip3/${domain}.ico`
        ];
        
        let currentServiceIndex = 0;
        
        const tryNextService = () => {
            if (currentServiceIndex >= faviconServices.length) {
                // 所有服务都失败了，使用默认图标
                preview.src = getDefaultIcon(urlInput.value.split('.')[1] || 'Web');
                return;
            }
            
            const faviconUrl = faviconServices[currentServiceIndex];
            currentServiceIndex++;
            
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = 32;
                canvas.height = 32;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 32, 32);
                
                try {
                    const base64 = canvas.toDataURL('image/png');
                    preview.src = base64;
                } catch (e) {
                    // 如果转换失败，尝试下一个服务
                    tryNextService();
                }
            };
            img.onerror = function() {
                // 如果加载失败，尝试下一个服务
                tryNextService();
            };
            img.src = faviconUrl;
        };
        
        // 开始尝试第一个服务
        tryNextService();
        
    } catch (error) {
        alert('请输入有效的网址');
    }
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

// 保存到本地存储
function saveToLocalStorage() {
    localStorage.setItem('navigationData', JSON.stringify(currentNavigationData));
}

// 从本地存储加载
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('navigationData');
    if (savedData) {
        currentNavigationData = JSON.parse(savedData);
    }
}

// 导出导航数据文件
function exportNavigationData() {
    const dataContent = `// 导航数据 - 这个文件只包含数据，可以安全导出和替换
const navigationData = ${JSON.stringify(currentNavigationData, null, 2)};`;

    const dataBlob = new Blob([dataContent], {type: 'application/javascript'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'navigation-data.js';
    link.click();
}

// 导入数据
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    // 尝试解析为JavaScript文件
                    const importedData = extractDataFromJS(e.target.result);
                    if (importedData) {
                        currentNavigationData = importedData;
                        saveToLocalStorage();
                        renderCategories();
                        alert('数据导入成功！');
                        return;
                    }
                    
                    // 如果不是JS文件，尝试解析为JSON
                    const jsonData = JSON.parse(e.target.result);
                    currentNavigationData = jsonData;
                    saveToLocalStorage();
                    renderCategories();
                    alert('数据导入成功！');
                } catch (error) {
                    alert('导入失败：文件格式不正确');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// 从JS文件中提取数据
function extractDataFromJS(jsContent) {
    try {
        // 简单的正则匹配来提取 navigationData
        const match = jsContent.match(/const navigationData = (\{[\s\S]*?\});/);
        if (match && match[1]) {
            return JSON.parse(match[1]);
        }
        return null;
    } catch (e) {
        return null;
    }
}

// 重置数据
function resetData() {
    if (confirm('确定要重置所有数据吗？这将清除所有本地添加的网址，恢复为初始数据。')) {
        localStorage.removeItem('navigationData');
        currentNavigationData = JSON.parse(JSON.stringify(navigationData)); // 深拷贝初始数据
        renderCategories();
        alert('数据已重置！');
    }
}