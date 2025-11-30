// 功能文件 - 这个文件包含所有交互逻辑，不需要修改

// 使用全局的 navigationData 变量（来自 navigation-data.js）
let currentNavigationData = navigationData;

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

// 检查是否是本地环境
let isLocalEnvironment = false;

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    checkLocalEnvironment();
    renderCategories();
    setupEventListeners();
});

function checkLocalEnvironment() {
    if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        managementButtons.style.display = 'flex';
        isLocalEnvironment = true;
    }
}

function setupEventListeners() {
    // 按钮事件
    addSiteBtn.addEventListener('click', () => openModal(addSiteModal));
    addCategoryBtn.addEventListener('click', () => openModal(addCategoryModal));
    exportBtn.addEventListener('click', exportNavigationData);

    // 表单事件
    document.getElementById('addSiteForm').addEventListener('submit', handleAddSite);
    document.getElementById('addCategoryForm').addEventListener('submit', handleAddCategory);
    document.getElementById('editSiteForm').addEventListener('submit', handleEditSite);
    document.getElementById('editCategoryForm').addEventListener('submit', handleEditCategory);
    document.getElementById('deleteSiteBtn').addEventListener('click', handleDeleteSite);
    document.getElementById('deleteCategoryBtn').addEventListener('click', handleDeleteCategory);

    // 图标和描述相关事件
    document.getElementById('fetchInfoBtn').addEventListener('click', () => fetchSiteInfo('add'));
    document.getElementById('uploadIconBtn').addEventListener('click', () => document.getElementById('siteIcon').click());
    document.getElementById('siteIcon').addEventListener('change', (e) => handleIconUpload(e, 'add'));
    
    document.getElementById('editFetchInfoBtn').addEventListener('click', () => fetchSiteInfo('edit'));
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
        
        // 只在本地环境显示分类操作按钮
        if (isLocalEnvironment) {
            // 编辑分类按钮
            const editCategoryBtn = document.createElement('button');
            editCategoryBtn.className = 'edit-category-btn';
            editCategoryBtn.innerHTML = '编辑分类';
            editCategoryBtn.addEventListener('click', () => openEditCategoryModal(category));
            
            // 删除分类按钮
            const deleteCategoryBtn = document.createElement('button');
            deleteCategoryBtn.className = 'delete-category-btn';
            deleteCategoryBtn.innerHTML = '删除分类';
            deleteCategoryBtn.addEventListener('click', () => handleDeleteCategory(category.id));
            
            categoryActions.appendChild(editCategoryBtn);
            categoryActions.appendChild(deleteCategoryBtn);
            categoryActions.style.display = 'flex';
        }
        
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
            
            // 只在本地环境显示编辑按钮
            if (isLocalEnvironment) {
                editBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openEditSiteModal(site, category.id);
                });
                
                // 添加鼠标悬停显示编辑按钮
                siteCard.addEventListener('mouseenter', () => {
                    editBtn.style.display = 'flex';
                });
                siteCard.addEventListener('mouseleave', () => {
                    editBtn.style.display = 'none';
                });
            }
            
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

// 获取网站信息（标题、描述、图标）
async function fetchSiteInfo(type) {
    const urlInput = type === 'add' ? document.getElementById('siteUrl') : document.getElementById('editSiteUrl');
    const nameInput = type === 'add' ? document.getElementById('siteName') : document.getElementById('editSiteName');
    const descriptionInput = type === 'add' ? document.getElementById('siteDescription') : document.getElementById('editSiteDescription');
    const preview = type === 'add' ? document.getElementById('iconPreview') : document.getElementById('editIconPreview');
    
    const siteUrl = urlInput.value;
    
    if (!siteUrl) {
        alert('请先输入网站地址');
        return;
    }
    
    try {
        const domain = new URL(siteUrl).hostname;
        
        // 显示加载状态
        const fetchBtn = type === 'add' ? document.getElementById('fetchInfoBtn') : document.getElementById('editFetchInfoBtn');
        const originalMainText = fetchBtn.querySelector('.btn-main-text').textContent;
        fetchBtn.querySelector('.btn-main-text').textContent = '获取中...';
        fetchBtn.disabled = true;
        
        // 并行获取所有信息
        const [iconSuccess, siteInfo] = await Promise.all([
            fetchSiteIcon(domain, preview),
            fetchSiteMetadata(siteUrl)
        ]);
        
        // 恢复按钮状态
        fetchBtn.querySelector('.btn-main-text').textContent = originalMainText;
        fetchBtn.disabled = false;
        
        // 更新表单字段
        if (siteInfo.title) {
            nameInput.value = siteInfo.title;
        }
        
        if (siteInfo.description) {
            descriptionInput.value = siteInfo.description;
        }
        
        if (!iconSuccess) {
            // 如果图标获取失败，使用默认图标
            preview.src = getDefaultIcon(siteInfo.title || domain.split('.')[0] || 'Web');
        }
        
        if (siteInfo.title || siteInfo.description) {
            alert(`成功获取网站信息！\n标题: ${siteInfo.title || '未获取到'}\n描述: ${siteInfo.description || '未获取到'}`);
        } else {
            alert('未能获取到网站信息，请手动填写');
        }
        
    } catch (error) {
        // 恢复按钮状态
        const fetchBtn = type === 'add' ? document.getElementById('fetchInfoBtn') : document.getElementById('editFetchInfoBtn');
        fetchBtn.querySelector('.btn-main-text').textContent = '获取网站信息';
        fetchBtn.disabled = false;
        
        console.error('获取网站信息失败:', error);
        alert('获取网站信息失败，请检查网址是否正确或手动填写信息');
    }
}

// 获取网站图标
function fetchSiteIcon(domain, preview) {
    return new Promise((resolve) => {
        // 使用多个favicon服务作为备选
        const faviconServices = [
            `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
            `https://favicon.yandex.net/favicon/${domain}`,
            `https://icons.duckduckgo.com/ip3/${domain}.ico`,
            `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=64`
        ];
        
        let currentServiceIndex = 0;
        
        const tryNextService = () => {
            if (currentServiceIndex >= faviconServices.length) {
                // 所有服务都失败了
                resolve(false);
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
                    resolve(true);
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
    });
}

// 获取网站元数据（标题和描述）
async function fetchSiteMetadata(siteUrl) {
    try {
        // 方法1: 使用 AllOrigins 代理（更可靠的CORS代理）
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        
        const response = await fetch(proxyUrl + encodeURIComponent(siteUrl), {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`网络请求失败: ${response.status}`);
        }
        
        const html = await response.text();
        
        // 解析HTML获取元数据
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 获取标题
        const title = doc.querySelector('title')?.textContent?.trim() || '';
        
        // 获取描述 - 尝试多种meta标签
        let description = '';
        const descriptionSelectors = [
            'meta[name="description"]',
            'meta[property="og:description"]',
            'meta[name="twitter:description"]',
            'meta[name="sailthru.description"]',
            'meta[itemprop="description"]'
        ];
        
        for (const selector of descriptionSelectors) {
            const meta = doc.querySelector(selector);
            if (meta && meta.getAttribute('content')) {
                description = meta.getAttribute('content').trim();
                break;
            }
        }
        
        // 如果还没有描述，尝试从页面内容中提取
        if (!description) {
            // 尝试获取第一个段落
            const firstParagraph = doc.querySelector('p');
            if (firstParagraph) {
                description = firstParagraph.textContent.trim().substring(0, 150);
            }
        }
        
        // 清理文本
        const cleanText = (text) => {
            return text
                .replace(/\s+/g, ' ')
                .replace(/[\n\r\t]/g, ' ')
                .trim();
        };
        
        return {
            title: cleanText(title).substring(0, 50),
            description: cleanText(description).substring(0, 100)
        };
        
    } catch (error) {
        console.log('获取网站元数据失败:', error);
        
        // 方法2: 备用方案 - 使用 iframe（仅适用于同源或CORS允许的网站）
        try {
            return await fetchWithIframe(siteUrl);
        } catch (iframeError) {
            console.log('iframe方法也失败:', iframeError);
            return { title: '', description: '' };
        }
    }
}

// 备用方法：使用iframe获取网站信息
function fetchWithIframe(siteUrl) {
    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = siteUrl;
        
        iframe.onload = function() {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                const title = doc.title || '';
                
                let description = '';
                const metaDescription = doc.querySelector('meta[name="description"]');
                if (metaDescription) {
                    description = metaDescription.getAttribute('content') || '';
                }
                
                document.body.removeChild(iframe);
                resolve({ title, description });
            } catch (error) {
                document.body.removeChild(iframe);
                resolve({ title: '', description: '' });
            }
        };
        
        iframe.onerror = function() {
            document.body.removeChild(iframe);
            resolve({ title: '', description: '' });
        };
        
        document.body.appendChild(iframe);
        
        // 超时处理
        setTimeout(() => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
                resolve({ title: '', description: '' });
            }
        }, 5000);
    });
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