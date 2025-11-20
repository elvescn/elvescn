// 全局变量
let particleSystem;
let currentPage = '';

// 元素数据
const elementsData = {
    1: {symbol: 'H', name: '氢', mass: 1.008, type: 'nonmetal', category: 'nonmetals'},
    2: {symbol: 'He', name: '氦', mass: 4.003, type: 'noble-gas', category: 'noble-gases'},
    3: {symbol: 'Li', name: '锂', mass: 6.941, type: 'alkali-metal', category: 'metals'},
    4: {symbol: 'Be', name: '铍', mass: 9.012, type: 'alkaline-earth', category: 'metals'},
    5: {symbol: 'B', name: '硼', mass: 10.811, type: 'metalloid', category: 'metalloids'},
    6: {symbol: 'C', name: '碳', mass: 12.011, type: 'nonmetal', category: 'nonmetals'},
    7: {symbol: 'N', name: '氮', mass: 14.007, type: 'nonmetal', category: 'nonmetals'},
    8: {symbol: 'O', name: '氧', mass: 15.999, type: 'nonmetal', category: 'nonmetals'},
    9: {symbol: 'F', name: '氟', mass: 18.998, type: 'halogen', category: 'nonmetals'},
    10: {symbol: 'Ne', name: '氖', mass: 20.180, type: 'noble-gas', category: 'noble-gases'},
    11: {symbol: 'Na', name: '钠', mass: 22.990, type: 'alkali-metal', category: 'metals'},
    12: {symbol: 'Mg', name: '镁', mass: 24.305, type: 'alkaline-earth', category: 'metals'},
    13: {symbol: 'Al', name: '铝', mass: 26.982, type: 'post-transition', category: 'metals'},
    14: {symbol: 'Si', name: '硅', mass: 28.086, type: 'metalloid', category: 'metalloids'},
    15: {symbol: 'P', name: '磷', mass: 30.974, type: 'nonmetal', category: 'nonmetals'},
    16: {symbol: 'S', name: '硫', mass: 32.065, type: 'nonmetal', category: 'nonmetals'},
    17: {symbol: 'Cl', name: '氯', mass: 35.453, type: 'halogen', category: 'nonmetals'},
    18: {symbol: 'Ar', name: '氩', mass: 39.948, type: 'noble-gas', category: 'noble-gases'},
    36: {symbol: 'Kr', name: '氪', mass: 83.798, type: 'noble-gas', category: 'noble-gases'},
    54: {symbol: 'Xe', name: '氙', mass: 131.293, type: 'noble-gas', category: 'noble-gases'},
    86: {symbol: 'Rn', name: '氡', mass: 222.000, type: 'noble-gas', category: 'noble-gases'},
    118: {symbol: 'Og', name: '鿫', mass: 294.000, type: 'oganesson', category: 'superheavy'}
};

// 周期表布局
const periodicTableLayout = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10],
    [11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 15, 16, 17, 18],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 118]
];

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    currentPage = getCurrentPage();
    initializeCommonFeatures();
    
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'periodic-table':
            initializePeriodicTable();
            break;
        case 'properties':
            initializePropertiesPage();
            break;
    }
});

// 获取当前页面
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('periodic-table')) return 'periodic-table';
    if (path.includes('properties')) return 'properties';
    return 'index';
}

// 初始化通用功能
function initializeCommonFeatures() {
    // 移动端菜单
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // 滚动动画
    initializeScrollAnimations();

    // 粒子背景
    if (currentPage === 'index') {
        initializeParticleBackground();
    }
}

// 初始化首页
function initializeHomePage() {
    // 原子模型动画
    animateAtomModel();
    
    // Hero区域动画
    animateHeroSection();
    
    // 时间线动画
    animateTimeline();
}

// 初始化周期表页面
function initializePeriodicTable() {
    generatePeriodicTable();
    initializeFilters();
    initializeElementDetail();
    initializeComparison();
}

// 初始化性质页面
function initializePropertiesPage() {
    // 原子结构动画
    animateAtomStructure();
    
    // 数据可视化
    initializePropertyCharts();
}

// 粒子背景系统
function initializeParticleBackground() {
    const container = document.getElementById('particle-bg');
    if (!container) return;

    // 使用p5.js创建粒子系统
    new p5((p) => {
        let particles = [];
        
        p.setup = () => {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('particle-bg');
            
            // 创建粒子
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(1, 3)
                });
            }
        };
        
        p.draw = () => {
            p.clear();
            
            // 绘制粒子
            particles.forEach(particle => {
                p.fill(255, 107, 53, 100);
                p.noStroke();
                p.circle(particle.x, particle.y, particle.size);
                
                // 更新位置
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // 边界检查
                if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
            });
            
            // 绘制连接线
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    if (dist < 100) {
                        p.stroke(255, 107, 53, 50);
                        p.strokeWeight(1);
                        p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    }
                }
            }
        };
        
        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    });
}

// 原子模型动画
function animateAtomModel() {
    const atomContainer = document.getElementById('atom-container');
    if (!atomContainer) return;

    anime({
        targets: atomContainer.querySelector('img'),
        rotate: '1turn',
        duration: 20000,
        easing: 'linear',
        loop: true
    });
}

// Hero区域动画
function animateHeroSection() {
    // 标题动画
    anime({
        targets: '.hero-title',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 1500,
        easing: 'easeOutElastic(1, .8)',
        delay: 500
    });

    // 副标题动画
    anime({
        targets: '.hero-title + p',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuad',
        delay: 1000
    });

    // 按钮动画
    anime({
        targets: '.hero-title + p + p',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuad',
        delay: 1500
    });
}

// 时间线动画
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        anime({
            targets: item,
            translateX: [-50, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutQuad',
            delay: index * 200
        });
    });
}

// 滚动动画
function initializeScrollAnimations() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

// 生成周期表
function generatePeriodicTable() {
    const tableContainer = document.getElementById('periodic-table');
    if (!tableContainer) return;

    tableContainer.innerHTML = '';

    periodicTableLayout.forEach((row, rowIndex) => {
        row.forEach((atomicNumber, colIndex) => {
            const cell = document.createElement('div');
            cell.className = 'element-cell';
            
            if (atomicNumber === 0) {
                cell.style.visibility = 'hidden';
            } else {
                const element = elementsData[atomicNumber];
                if (element) {
                    cell.innerHTML = `
                        <div class="element-number">${atomicNumber}</div>
                        <div class="element-symbol">${element.symbol}</div>
                        <div class="element-name">${element.name}</div>
                    `;
                    
                    // 添加样式类
                    if (atomicNumber === 118) {
                        cell.classList.add('oganesson-cell');
                    } else if (element.category === 'superheavy') {
                        cell.classList.add('superheavy-cell');
                    } else if (element.category === 'radioactive') {
                        cell.classList.add('radioactive-cell');
                    } else if (element.category === 'stable') {
                        cell.classList.add('stable-cell');
                    } else {
                        cell.classList.add('unknown-cell');
                    }
                    
                    // 添加点击事件
                    cell.addEventListener('click', () => showElementDetail(atomicNumber));
                    cell.dataset.category = element.category;
                    cell.dataset.type = element.type;
                }
            }
            
            tableContainer.appendChild(cell);
        });
    });
}

// 初始化筛选器
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 筛选元素
            const filter = btn.dataset.filter;
            filterElements(filter);
        });
    });
}

// 筛选元素
function filterElements(filter) {
    const elementCells = document.querySelectorAll('.element-cell');
    
    elementCells.forEach(cell => {
        if (filter === 'all') {
            cell.style.display = 'flex';
        } else {
            const category = cell.dataset.category;
            const type = cell.dataset.type;
            
            let shouldShow = false;
            
            switch(filter) {
                case 'metals':
                    shouldShow = category === 'metals';
                    break;
                case 'nonmetals':
                    shouldShow = category === 'nonmetals';
                    break;
                case 'noble-gases':
                    shouldShow = type === 'noble-gas';
                    break;
                case 'radioactive':
                    shouldShow = category === 'radioactive';
                    break;
                case 'superheavy':
                    shouldShow = category === 'superheavy';
                    break;
                case 'synthetic':
                    shouldShow = parseInt(cell.querySelector('.element-number')?.textContent) > 94;
                    break;
            }
            
            cell.style.display = shouldShow ? 'flex' : 'none';
        }
    });
}

// 显示元素详情
function showElementDetail(atomicNumber) {
    const element = elementsData[atomicNumber];
    if (!element) return;

    const overlay = document.getElementById('overlay');
    const detail = document.getElementById('element-detail');
    const title = document.getElementById('detail-title');
    const content = document.getElementById('detail-content');

    title.textContent = `${element.name} (${element.symbol})`;
    
    content.innerHTML = `
        <div class="space-y-4">
            <div class="flex justify-between">
                <span>原子序数:</span>
                <span class="font-bold">${atomicNumber}</span>
            </div>
            <div class="flex justify-between">
                <span>原子量:</span>
                <span class="font-bold">${element.mass}</span>
            </div>
            <div class="flex justify-between">
                <span>元素类型:</span>
                <span class="font-bold">${getElementTypeName(element.type)}</span>
            </div>
            <div class="mt-4 p-3 bg-gray-700 rounded">
                <p class="text-sm">
                    ${getElementDescription(atomicNumber)}
                </p>
            </div>
        </div>
    `;

    overlay.style.display = 'block';
    detail.style.display = 'block';

    // 动画显示
    anime({
        targets: detail,
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
}

// 初始化元素详情功能
function initializeElementDetail() {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-detail');
    
    if (overlay) {
        overlay.addEventListener('click', hideElementDetail);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideElementDetail);
    }
}

// 隐藏元素详情
function hideElementDetail() {
    const overlay = document.getElementById('overlay');
    const detail = document.getElementById('element-detail');
    
    anime({
        targets: detail,
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInQuad',
        complete: () => {
            overlay.style.display = 'none';
            detail.style.display = 'none';
        }
    });
}

// 初始化对比功能
function initializeComparison() {
    const compareBtn = document.getElementById('compare-btn');
    const comparisonElement = document.getElementById('comparison-element');
    
    if (compareBtn && comparisonElement) {
        compareBtn.addEventListener('click', () => {
            const selectedElement = comparisonElement.value;
            showComparison(selectedElement);
        });
    }
}

// 显示对比图表
function showComparison(elementKey) {
    const chartContainer = document.getElementById('comparison-chart');
    if (!chartContainer) return;

    const chart = echarts.init(chartContainer);
    
    const comparisonData = {
        oganesson: {atomicNumber: 118, mass: 294, radius: 152},
        helium: {atomicNumber: 2, mass: 4.003, radius: 31},
        neon: {atomicNumber: 10, mass: 20.18, radius: 38},
        argon: {atomicNumber: 18, mass: 39.95, radius: 71},
        krypton: {atomicNumber: 36, mass: 83.80, radius: 88},
        xenon: {atomicNumber: 54, mass: 131.29, radius: 108},
        radon: {atomicNumber: 86, mass: 222, radius: 120}
    };
    
    const ogData = comparisonData.oganesson;
    const compareData = comparisonData[elementKey];
    
    const option = {
        backgroundColor: 'transparent',
        title: {
            text: '元素性质对比',
            textStyle: {color: '#ffffff'}
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,0.8)',
            textStyle: {color: '#ffffff'}
        },
        legend: {
            data: ['Oganesson', compareData ? getElementName(elementKey) : ''],
            textStyle: {color: '#ffffff'}
        },
        xAxis: {
            type: 'category',
            data: ['原子序数', '原子量', '原子半径'],
            axisLabel: {color: '#ffffff'},
            axisLine: {lineStyle: {color: '#ffffff'}}
        },
        yAxis: {
            type: 'value',
            axisLabel: {color: '#ffffff'},
            axisLine: {lineStyle: {color: '#ffffff'}}
        },
        series: [
            {
                name: 'Oganesson',
                type: 'bar',
                data: [ogData.atomicNumber, ogData.mass, ogData.radius],
                itemStyle: {color: '#ff6b35'}
            },
            {
                name: compareData ? getElementName(elementKey) : '',
                type: 'bar',
                data: compareData ? [compareData.atomicNumber, compareData.mass, compareData.radius] : [0, 0, 0],
                itemStyle: {color: '#00d2ff'}
            }
        ]
    };
    
    chart.setOption(option);
}

// 原子结构动画
function animateAtomStructure() {
    const atomImage = document.querySelector('.atom-container img');
    if (!atomImage) return;

    // 添加鼠标交互
    atomImage.addEventListener('mouseenter', () => {
        anime({
            targets: atomImage,
            scale: 1.1,
            duration: 300,
            easing: 'easeOutQuad'
        });
    });

    atomImage.addEventListener('mouseleave', () => {
        anime({
            targets: atomImage,
            scale: 1,
            duration: 300,
            easing: 'easeOutQuad'
        });
    });
}

// 初始化性质图表
function initializePropertyCharts() {
    // 这里可以添加更多的数据可视化图表
    // 例如：性质对比图、放射性衰变曲线等
}

// 移动端菜单切换
function toggleMobileMenu() {
    // 移动端菜单逻辑
    console.log('Mobile menu toggled');
}

// 辅助函数
function getElementTypeName(type) {
    const typeNames = {
        'noble-gas': '惰性气体',
        'nonmetal': '非金属',
        'metal': '金属',
        'metalloid': '类金属',
        'oganesson': '超重元素'
    };
    return typeNames[type] || '未知类型';
}

function getElementDescription(atomicNumber) {
    const descriptions = {
        1: '最轻的元素，宇宙中最丰富的元素之一。',
        2: '第一个惰性气体，化学性质极其稳定。',
        2: '惰性气体，常用于气球和飞艇。',
        118: '目前已知最重的元素，具有强放射性，仅制造过5个原子。'
    };
    return descriptions[atomicNumber] || '这是一个重要的化学元素。';
}

function getElementName(key) {
    const names = {
        'helium': '氦',
        'neon': '氖',
        'argon': '氩',
        'krypton': '氪',
        'xenon': '氙',
        'radon': '氡'
    };
    return names[key] || key;
}

// 页面切换动画
function navigateToPage(url) {
    anime({
        targets: 'body',
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInQuad',
        complete: () => {
            window.location.href = url;
        }
    });
}

// 添加页面进入动画
anime({
    targets: 'body',
    opacity: [0, 1],
    duration: 500,
    easing: 'easeOutQuad'
});