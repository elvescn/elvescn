// 【文件: fetch-helpers.js】
const SiteUtils = {
    getDefaultIcon(name) {
        if (!name) name = 'Web';
        const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];
        const color = colors[name.length % colors.length];
        const letter = name.charAt(0).toUpperCase();
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="6" fill="${color}"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">${letter}</text>
            </svg>
        `)}`;
    },

    urlToBase64(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const contentType = response.headers.get('Content-Type');
                    if (!contentType || (!contentType.startsWith('image/') && !contentType.includes('svg'))) {
                        throw new Error(`Invalid content type: ${contentType}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                })
                .catch(reject);
        });
    },

    async fetchIcon(domain) {
        const faviconServices = [
            `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
            `https://api.btstu.cn/favicon.php?url=${domain}`,
            `https://favicon.cccyun.cc/${domain}`,
            `https://icons.duckduckgo.com/ip3/${domain}.ico`
        ];
        
        for (const faviconUrl of faviconServices) {
            try {
                const base64Icon = await this.urlToBase64(faviconUrl);
                if (base64Icon && base64Icon.startsWith('data:')) {
                    return base64Icon;
                }
            } catch (e) { }
        }
        return null;
    },

    cleanTitle(title) {
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
    },

    async fetchMeta(siteUrl) {
        const result = { title: null, description: null };
        try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(siteUrl)}`;
            const response = await fetch(proxyUrl, { timeout: 6000 });
            if (response.ok) {
                const data = await response.json();
                const html = data.contents;
                
                const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                if (titleMatch && titleMatch[1]) {
                    result.title = this.cleanTitle(titleMatch[1]);
                }
                
                const metaMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                                  html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
                if (metaMatch && metaMatch[1]) {
                    result.description = metaMatch[1].trim();
                }
            }
        } catch (error) {
            console.error('FetchUtils: 获取Meta信息失败:', error);
        }
        return result;
    }
};