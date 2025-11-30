// 静态数据 - 初始数据（每个分类填充20个示例网址）
let navigationData = {
    categories: [
        {
            id: 1,
            name: "常用",
            sites: [
                { id: 1, name: "Google", url: "https://www.google.com", description: "全球最大的搜索引擎", icon: "https://www.google.com/favicon.ico" },
                { id: 2, name: "GitHub", url: "https://github.com", description: "代码托管平台", icon: "https://github.com/favicon.ico" },
                { id: 3, name: "Gmail", url: "https://mail.google.com", description: "Google邮箱服务", icon: "https://mail.google.com/favicon.ico" },
                { id: 4, name: "百度", url: "https://www.baidu.com", description: "中文搜索引擎", icon: "https://www.baidu.com/favicon.ico" },
                { id: 5, name: "知乎", url: "https://www.zhihu.com", description: "中文问答社区", icon: "https://www.zhihu.com/favicon.ico" },
                { id: 6, name: "Bilibili", url: "https://www.bilibili.com", description: "视频弹幕网站", icon: "https://www.bilibili.com/favicon.ico" },
                { id: 7, name: "淘宝", url: "https://www.taobao.com", description: "在线购物平台", icon: "https://www.taobao.com/favicon.ico" },
                { id: 8, name: "京东", url: "https://www.jd.com", description: "综合电商平台", icon: "https://www.jd.com/favicon.ico" },
                { id: 9, name: "微信", url: "https://wx.qq.com", description: "即时通讯工具", icon: "https://wx.qq.com/favicon.ico" },
                { id: 10, name: "微博", url: "https://weibo.com", description: "社交媒体平台", icon: "https://weibo.com/favicon.ico" },
                { id: 11, name: "豆瓣", url: "https://www.douban.com", description: "书影音分享社区", icon: "https://www.douban.com/favicon.ico" },
                { id: 12, name: "网易云音乐", url: "https://music.163.com", description: "音乐流媒体平台", icon: "https://music.163.com/favicon.ico" },
                { id: 13, name: "腾讯视频", url: "https://v.qq.com", description: "在线视频平台", icon: "https://v.qq.com/favicon.ico" },
                { id: 14, name: "爱奇艺", url: "https://www.iqiyi.com", description: "视频娱乐平台", icon: "https://www.iqiyi.com/favicon.ico" },
                { id: 15, name: "优酷", url: "https://www.youku.com", description: "视频分享网站", icon: "https://www.youku.com/favicon.ico" },
                { id: 16, name: "斗鱼", url: "https://www.douyu.com", description: "游戏直播平台", icon: "https://www.douyu.com/favicon.ico" },
                { id: 17, name: "虎牙", url: "https://www.huya.com", description: "游戏直播平台", icon: "https://www.huya.com/favicon.ico" },
                { id: 18, name: "起点中文网", url: "https://www.qidian.com", description: "原创文学网站", icon: "https://www.qidian.com/favicon.ico" },
                { id: 19, name: "晋江文学城", url: "https://www.jjwxc.net", description: "女性文学网站", icon: "https://www.jjwxc.net/favicon.ico" },
                { id: 20, name: "CSDN", url: "https://www.csdn.net", description: "IT技术社区", icon: "https://www.csdn.net/favicon.ico" }
            ]
        },
        {
            id: 2,
            name: "AI类",
            sites: [
                { id: 21, name: "ChatGPT", url: "https://chat.openai.com", description: "OpenAI的对话AI", icon: "https://chat.openai.com/favicon.ico" },
                { id: 22, name: "Claude", url: "https://claude.ai", description: "Anthropic的AI助手", icon: "https://claude.ai/favicon.ico" },
                { id: 23, name: "DeepSeek", url: "https://www.deepseek.com", description: "深度求索AI助手", icon: "https://www.deepseek.com/favicon.ico" },
                { id: 24, name: "文心一言", url: "https://yiyan.baidu.com", description: "百度AI对话助手", icon: "https://yiyan.baidu.com/favicon.ico" },
                { id: 25, name: "通义千问", url: "https://tongyi.aliyun.com", description: "阿里云AI助手", icon: "https://tongyi.aliyun.com/favicon.ico" },
                { id: 26, name: "讯飞星火", url: "https://xinghuo.xfyun.cn", description: "科大讯飞AI助手", icon: "https://xinghuo.xfyun.cn/favicon.ico" },
                { id: 27, name: "智谱清言", url: "https://chatglm.cn", description: "智谱AI对话助手", icon: "https://chatglm.cn/favicon.ico" },
                { id: 28, name: "Midjourney", url: "https://www.midjourney.com", description: "AI图像生成工具", icon: "https://www.midjourney.com/favicon.ico" },
                { id: 29, name: "Stable Diffusion", url: "https://stability.ai", description: "开源AI绘画模型", icon: "https://stability.ai/favicon.ico" },
                { id: 30, name: "DALL-E", url: "https://labs.openai.com", description: "OpenAI图像生成", icon: "https://labs.openai.com/favicon.ico" },
                { id: 31, name: "Runway", url: "https://runwayml.com", description: "AI视频创作工具", icon: "https://runwayml.com/favicon.ico" },
                { id: 32, name: "Hugging Face", url: "https://huggingface.co", description: "AI模型社区", icon: "https://huggingface.co/favicon.ico" },
                { id: 33, name: "Kaggle", url: "https://www.kaggle.com", description: "数据科学竞赛平台", icon: "https://www.kaggle.com/favicon.ico" },
                { id: 34, name: "Papers with Code", url: "https://paperswithcode.com", description: "论文与代码资源", icon: "https://paperswithcode.com/favicon.ico" },
                { id: 35, name: "TensorFlow", url: "https://www.tensorflow.org", description: "机器学习框架", icon: "https://www.tensorflow.org/favicon.ico" },
                { id: 36, name: "PyTorch", url: "https://pytorch.org", description: "深度学习框架", icon: "https://pytorch.org/favicon.ico" },
                { id: 37, name: "Keras", url: "https://keras.io", description: "神经网络API", icon: "https://keras.io/favicon.ico" },
                { id: 38, name: "Scikit-learn", url: "https://scikit-learn.org", description: "机器学习库", icon: "https://scikit-learn.org/favicon.ico" },
                { id: 39, name: "OpenCV", url: "https://opencv.org", description: "计算机视觉库", icon: "https://opencv.org/favicon.ico" },
                { id: 40, name: "Jupyter", url: "https://jupyter.org", description: "交互式编程环境", icon: "https://jupyter.org/favicon.ico" }
            ]
        },
        {
            id: 3,
            name: "环评相关",
            sites: [
                { id: 41, name: "生态环境部", url: "https://www.mee.gov.cn", description: "中国生态环境部官网", icon: "https://www.mee.gov.cn/favicon.ico" },
                { id: 42, name: "环评互联网", url: "https://www.eiacn.com", description: "环评行业资讯平台", icon: "https://www.eiacn.com/favicon.ico" },
                { id: 43, name: "中国环境影响评价网", url: "https://www.china-eia.com", description: "环评信息服务平台", icon: "https://www.china-eia.com/favicon.ico" },
                { id: 44, name: "环保技术论坛", url: "https://bbs.eptech.cn", description: "环保技术交流社区", icon: "https://bbs.eptech.cn/favicon.ico" },
                { id: 45, name: "环境标准网", url: "https://www.es.org.cn", description: "环境标准查询平台", icon: "https://www.es.org.cn/favicon.ico" },
                { id: 46, name: "环境监测网", url: "https://www.cnemc.cn", description: "环境监测信息平台", icon: "https://www.cnemc.cn/favicon.ico" },
                { id: 47, name: "环保在线", url: "https://www.hbzhan.com", description: "环保行业门户网站", icon: "https://www.hbzhan.com/favicon.ico" },
                { id: 48, name: "北极星环保网", url: "https://huanbao.bjx.com.cn", description: "环保行业资讯网站", icon: "https://huanbao.bjx.com.cn/favicon.ico" },
                { id: 49, name: "中国环保产业协会", url: "https://www.caepi.org.cn", description: "环保产业协会官网", icon: "https://www.caepi.org.cn/favicon.ico" },
                { id: 50, name: "环境工程网", url: "https://www.eeweb.com", description: "环境工程技术资源", icon: "https://www.eeweb.com/favicon.ico" },
                { id: 51, name: "环保资料库", url: "https://www.epdoc.cn", description: "环保文档资料分享", icon: "https://www.epdoc.cn/favicon.ico" },
                { id: 52, name: "环境科学网", url: "https://www.hjkx.org", description: "环境科学研究平台", icon: "https://www.hjkx.org/favicon.ico" },
                { id: 53, name: "环保技术网", url: "https://www.ep65.com", description: "环保技术交流平台", icon: "https://www.ep65.com/favicon.ico" },
                { id: 54, name: "环境评估网", url: "https://www.eia8.com", description: "环境影响评估资源", icon: "https://www.eia8.com/favicon.ico" },
                { id: 55, name: "环保政策网", url: "https://www.epolicy.cn", description: "环保政策法规查询", icon: "https://www.epolicy.cn/favicon.ico" },
                { id: 56, name: "环境数据平台", url: "https://www.envdata.org", description: "环境数据统计分析", icon: "https://www.envdata.org/favicon.ico" },
                { id: 57, name: "环评报告库", url: "https://www.eiareport.com", description: "环评报告案例参考", icon: "https://www.eiareport.com/favicon.ico" },
                { id: 58, name: "环保验收网", url: "https://www.epacceptance.com", description: "环保验收指导平台", icon: "https://www.epacceptance.com/favicon.ico" },
                { id: 59, name: "环境治理网", url: "https://www.envtreatment.com", description: "环境治理技术交流", icon: "https://www.envtreatment.com/favicon.ico" },
                { id: 60, name: "环保设备网", url: "https://www.ep-equipment.com", description: "环保设备信息平台", icon: "https://www.ep-equipment.com/favicon.ico" }
            ]
        },
        {
            id: 4,
            name: "工作资料类",
            sites: [
                { id: 61, name: "百度文库", url: "https://wenku.baidu.com", description: "文档资料分享平台", icon: "https://wenku.baidu.com/favicon.ico" },
                { id: 62, name: "道客巴巴", url: "https://www.doc88.com", description: "文档分享社区", icon: "https://www.doc88.com/favicon.ico" },
                { id: 63, name: "豆丁网", url: "https://www.docin.com", description: "文档分享平台", icon: "https://www.docin.com/favicon.ico" },
                { id: 64, name: "维普网", url: "https://www.cqvip.com", description: "学术期刊数据库", icon: "https://www.cqvip.com/favicon.ico" },
                { id: 65, name: "万方数据", url: "https://www.wanfangdata.com.cn", description: "学术资源平台", icon: "https://www.wanfangdata.com.cn/favicon.ico" },
                { id: 66, name: "中国知网", url: "https://www.cnki.net", description: "学术文献数据库", icon: "https://www.cnki.net/favicon.ico" },
                { id: 67, name: "超星读书", url: "https://book.chaoxing.com", description: "数字图书馆", icon: "https://book.chaoxing.com/favicon.ico" },
                { id: 68, name: "国家图书馆", url: "https://www.nlc.cn", description: "国家数字图书馆", icon: "https://www.nlc.cn/favicon.ico" },
                { id: 69, name: "谷歌学术", url: "https://scholar.google.com", description: "学术文献搜索", icon: "https://scholar.google.com/favicon.ico" },
                { id: 70, name: "微软学术", url: "https://academic.microsoft.com", description: "学术研究平台", icon: "https://academic.microsoft.com/favicon.ico" },
                { id: 71, name: "ResearchGate", url: "https://www.researchgate.net", description: "科研社交网络", icon: "https://www.researchgate.net/favicon.ico" },
                { id: 72, name: "Academia.edu", url: "https://www.academia.edu", description: "学术论文分享", icon: "https://www.academia.edu/favicon.ico" },
                { id: 73, name: "arXiv", url: "https://arxiv.org", description: "预印本论文库", icon: "https://arxiv.org/favicon.ico" },
                { id: 74, name: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov", description: "生物医学文献", icon: "https://pubmed.ncbi.nlm.nih.gov/favicon.ico" },
                { id: 75, name: "IEEE Xplore", url: "https://ieeexplore.ieee.org", description: "工程技术文献", icon: "https://ieeexplore.ieee.org/favicon.ico" },
                { id: 76, name: "ScienceDirect", url: "https://www.sciencedirect.com", description: "科学文献数据库", icon: "https://www.sciencedirect.com/favicon.ico" },
                { id: 77, name: "SpringerLink", url: "https://link.springer.com", description: "学术出版物平台", icon: "https://link.springer.com/favicon.ico" },
                { id: 78, name: "Wiley Online", url: "https://onlinelibrary.wiley.com", description: "学术期刊库", icon: "https://onlinelibrary.wiley.com/favicon.ico" },
                { id: 79, name: "Nature", url: "https://www.nature.com", description: "自然期刊官网", icon: "https://www.nature.com/favicon.ico" },
                { id: 80, name: "Science", url: "https://www.science.org", description: "科学期刊官网", icon: "https://www.science.org/favicon.ico" }
            ]
        }
    ]
};

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
    exportBtn.addEventListener('click', exportData);
    importBtn.addEventListener('click', importData);
    resetBtn.addEventListener('click', resetData);

    // 表单事件
    document.getElementById('addSiteForm').addEventListener('submit', handleAddSite);
    document.getElementById('addCategoryForm').addEventListener('submit', handleAddCategory);
    document.getElementById('editSiteForm').addEventListener('submit', handleEditSite);
    document.getElementById('deleteSiteBtn').addEventListener('click', handleDeleteSite);

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
    
    navigationData.categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category.name;
        
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
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzM0OThkYiIvPgo8dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2IDE4KSI+V0VCPC90ZXh0Pgo8L3N2Zz4K';
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
        
        categoryElement.appendChild(categoryTitle);
        categoryElement.appendChild(sitesGrid);
        
        categoriesContainer.appendChild(categoryElement);
    });
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
}

// 填充分类选择下拉框
function populateCategorySelect(selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">请选择分类</option>';
    
    navigationData.categories.forEach(category => {
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
    const siteIcon = document.getElementById('iconPreview').src || '';
    
    const category = navigationData.categories.find(cat => cat.id === categoryId);
    
    if (category) {
        const newSite = {
            id: Date.now(),
            name: siteName,
            url: siteUrl,
            description: siteDescription,
            icon: siteIcon || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzM0OThkYiIvPgo8dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2IDE4KSI+V0VCPC90ZXh0Pgo8L3N2Zz4K'
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
        
        navigationData.categories.push(newCategory);
        renderCategories();
        closeAllModals();
        saveToLocalStorage();
        
        alert('分类已添加！');
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
    const siteIcon = document.getElementById('editIconPreview').src || '';
    
    // 找到原分类和网站
    let oldCategory, siteIndex;
    navigationData.categories.forEach(category => {
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
            const newCategory = navigationData.categories.find(cat => cat.id === categoryId);
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
        navigationData.categories.forEach(category => {
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

// 获取网站图标
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
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        preview.src = faviconUrl;
    } catch (error) {
        alert('请输入有效的网址');
    }
}

// 处理图标上传
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
    localStorage.setItem('navigationData', JSON.stringify(navigationData));
}

// 从本地存储加载
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('navigationData');
    if (savedData) {
        navigationData = JSON.parse(savedData);
    }
}

// 导出数据
function exportData() {
    const dataStr = JSON.stringify(navigationData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'navigation_data.json';
    link.click();
}

// 导入数据
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    navigationData = importedData;
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

// 重置数据
function resetData() {
    if (confirm('确定要重置所有数据吗？这将清除所有本地添加的网址，恢复为初始数据。')) {
        localStorage.removeItem('navigationData');
        location.reload();
    }
}