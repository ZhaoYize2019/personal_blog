// 工具函数集合

// 移动端菜单切换
function setupMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            // 切换图标
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
}

// 平滑滚动
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const menuBtn = document.getElementById('menu-btn');
                    if (menuBtn) {
                        const icon = menuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            }
        });
    });
}

// 滚动时导航栏效果
function setupScrollEffects() {
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-md');
            } else {
                header.classList.remove('shadow-md');
            }
        });
    }
}

// 初始化导航栏
function initNavbar() {
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-md', 'bg-white/95', 'backdrop-blur-sm');
                header.classList.remove('bg-transparent');
            } else {
                header.classList.remove('shadow-md', 'bg-white/95', 'backdrop-blur-sm');
                header.classList.add('bg-transparent');
            }
        });
    }
}

// 初始化移动端菜单
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // 切换图标
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (!mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
}

// 加载文章列表到页面
function loadArticles() {
    const articlesContainer = document.getElementById('articles-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    if (!articlesContainer) return;
    
    // 清除加载指示器
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
    
    // 获取文章数据并渲染
    getArticles().then(articles => {
        // 渲染文章列表
        if (articles && articles.length > 0) {
            articles.forEach(article => {
                const articleCard = document.createElement('article');
                articleCard.className = 'article-card bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden observe-element';
                articleCard.setAttribute('data-category', article.category);
                
                articleCard.innerHTML = `
                    <div class="relative h-48 overflow-hidden">
                        <img src="${article.featured_image || article.image}" alt="${article.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
                        <div class="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded">
                            ${article.category}
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-2 text-xs text-secondary mb-3">
                            <span class="fa fa-calendar-o"></span>
                            <span>${article.publish_date || article.date}</span>
                            ${article.read_time ? `<span class="mx-2">•</span><span class="fa fa-clock-o mr-1"></span>${article.read_time}` : ''}
                        </div>
                        <h3 class="text-xl font-bold mb-3 hover:text-primary transition-colors">
                            <a href="article.html?id=${article.id}">${article.title}</a>
                        </h3>
                        <p class="text-gray-600 mb-4 line-clamp-2">${article.excerpt}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${article.tags.map(tag => `
                                <a href="categories.html?tag=${tag}" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors">
                                    ${tag}
                                </a>
                            `).join('')}
                        </div>
                        <a href="article.html?id=${article.id}" class="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium">
                            阅读全文
                            <i class="fa fa-arrow-right text-sm transition-transform duration-300 hover:translate-x-1"></i>
                        </a>
                    </div>
                `;
                
                articlesContainer.appendChild(articleCard);
            });
        } else {
            articlesContainer.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500">暂无文章</div>';
        }
    }).catch(error => {
        console.error('加载文章失败:', error);
        articlesContainer.innerHTML = '<div class="col-span-full text-center py-12 text-red-500">加载失败，请刷新页面重试</div>';
    });
}

// 初始化过滤按钮
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.category-filter');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的活跃状态
            filterButtons.forEach(btn => btn.classList.remove('bg-primary', 'text-white'));
            
            // 添加当前按钮的活跃状态
            button.classList.add('bg-primary', 'text-white');
            
            // 获取筛选类别
            const category = button.getAttribute('data-category') || '';
            
            // 筛选文章
            const articlesContainer = document.getElementById('articles-container');
            if (articlesContainer) {
                articlesContainer.innerHTML = '<div id="loading-indicator" class="col-span-full flex justify-center items-center py-12"><div class="animate-pulse"><i class="fa fa-circle-o-notch fa-spin text-3xl text-primary"></i><p class="mt-2 text-gray-500">加载中...</p></div></div>';
                
                if (category) {
                    getArticlesByCategory(category).then(filteredArticles => {
                        renderFilteredArticles(filteredArticles);
                    });
                } else {
                    getArticles().then(articles => {
                        renderFilteredArticles(articles);
                    });
                }
            }
        });
    });
}

// 渲染过滤后的文章
function renderFilteredArticles(articles) {
    const articlesContainer = document.getElementById('articles-container');
    if (!articlesContainer) return;
    
    articlesContainer.innerHTML = '';
    
    if (articles && articles.length > 0) {
        articles.forEach(article => {
            const articleCard = document.createElement('article');
            articleCard.className = 'article-card bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden observe-element';
            articleCard.setAttribute('data-category', article.category);
            
            articleCard.innerHTML = `
                <div class="relative h-48 overflow-hidden">
                    <img src="${article.featured_image || article.image}" alt="${article.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
                    <div class="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded">
                        ${article.category}
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex items-center gap-2 text-xs text-secondary mb-3">
                        <span class="fa fa-calendar-o"></span>
                        <span>${article.publish_date || article.date}</span>
                        ${article.read_time ? `<span class="mx-2">•</span><span class="fa fa-clock-o mr-1"></span>${article.read_time}` : ''}
                    </div>
                    <h3 class="text-xl font-bold mb-3 hover:text-primary transition-colors">
                        <a href="article.html?id=${article.id}">${article.title}</a>
                    </h3>
                    <p class="text-gray-600 mb-4 line-clamp-2">${article.excerpt}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${article.tags.map(tag => `
                            <a href="categories.html?tag=${tag}" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors">
                                ${tag}
                            </a>
                        `).join('')}
                    </div>
                    <a href="article.html?id=${article.id}" class="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium">
                        阅读全文
                        <i class="fa fa-arrow-right text-sm transition-transform duration-300 hover:translate-x-1"></i>
                    </a>
                </div>
            `;
            
            articlesContainer.appendChild(articleCard);
        });
    } else {
        articlesContainer.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500">暂无文章</div>';
    }
}

// 初始化订阅表单
function initSubscribeForm() {
    const form = document.getElementById('subscribe-form');
    const statusElement = document.getElementById('subscribe-status');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput || !emailInput.value) return;
        
        // 显示提交成功消息
        if (statusElement) {
            statusElement.textContent = '订阅成功！感谢你的关注。';
            statusElement.classList.remove('hidden', 'text-red-500');
            statusElement.classList.add('text-green-500');
        }
        
        // 重置表单
        form.reset();
        
        // 5秒后隐藏消息
        setTimeout(() => {
            if (statusElement) {
                statusElement.classList.add('hidden');
            }
        }, 5000);
    });
}

// 设置滚动动画效果
function setupScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察所有带有observe-element类的元素
    document.querySelectorAll('.observe-element').forEach(element => {
        observer.observe(element);
    });
}

// 表单提交处理
function setupFormSubmission(formId, successMessage = '提交成功！') {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 模拟表单提交
            // 在实际应用中，这里会发送表单数据到服务器
            alert(successMessage);
            form.reset();
        });
    }
}

// 观察者模式，用于检测元素是否进入视口
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.observe-element').forEach(element => {
        observer.observe(element);
    });
}

// 从JSON文件加载文章数据
let articlesData = null;

// 初始化数据
export async function initData() {
  if (!articlesData) {
    try {
      const response = await fetch('data/articles.json');
      if (!response.ok) {
        throw new Error('Failed to load articles data');
      }
      const data = await response.json();
      articlesData = data.articles;
    } catch (error) {
      console.error('Error loading articles data:', error);
      // 提供模拟数据作为后备
      articlesData = generateMockArticles();
    }
  }
  return articlesData;
}

// 生成模拟文章数据作为后备
function generateMockArticles() {
  return [
    {
      id: 1,
      title: "2023年前端技术发展趋势与展望",
      slug: "frontend-trends-2023",
      category: "技术趋势",
      tags: ["前端", "React", "Vue", "JavaScript"],
      featured_image: "https://picsum.photos/1200/600?random=1",
      excerpt: "本文分析了2023年前端技术的发展趋势，包括框架更新、工具链优化、性能提升等方面的变化和创新。",
      content: "# 2023年前端技术发展趋势与展望\n\n2023年，前端技术领域继续保持快速发展的势头。随着Web应用的复杂度不断提升，前端开发也在向着更高效、更智能、更用户友好的方向演进。本文将从多个维度分析2023年前端技术的发展趋势，帮助开发者把握技术脉搏。\n\n## 一、框架与库的演进\n\n### React生态系统的完善\n\nReact在2023年继续保持其领先地位，但生态系统更加完善。React 18引入的并发特性（Concurrent Features）逐渐被开发者广泛采用，提高了应用的响应速度和用户体验。\n\n```javascript\n// 使用React 18的并发特性\nimport { useState, startTransition } from 'react';\n\nfunction Search() {\n  const [query, setQuery] = useState('');\n  const [results, setResults] = useState([]);\n\n  function handleSearch(e) {\n    const value = e.target.value;\n    setQuery(value);\n    \n    // 在后台执行耗时操作\n    startTransition(() => {\n      fetchResults(value).then(setResults);\n    });\n  }\n  \n  return (\n    <div>\n      <input value={query} onChange={handleSearch} />\n      <ResultsList results={results} />\n    </div>\n  );
}\n```\n\n### Vue 3的广泛应用\n\nVue 3及其组合式API（Composition API）在2023年获得了更广泛的应用。其优雅的响应式系统和TypeScript支持，使得大型应用的开发更加高效和可维护。\n\n### 新兴框架的崛起\n\n除了传统的三大框架（React、Vue、Angular），一些新兴框架如Svelte、Solid.js等也在2023年获得了更多关注。这些框架通过编译时优化，提供了更好的性能和更小的打包体积。",
      author: "作者名称",
      publish_date: "2023-01-15",
      read_time: "8分钟",
      views: 1243,
      comments: 32
    },
    {
      id: 2,
      title: "如何高效学习新技术：我的个人经验分享",
      slug: "how-to-learn-tech-efficiently",
      category: "学习方法",
      tags: ["学习方法", "效率", "个人成长"],
      featured_image: "https://picsum.photos/1200/600?random=2",
      excerpt: "在技术快速迭代的时代，掌握高效的学习方法至关重要。本文分享了我在学习新技术过程中的经验和技巧。",
      content: "# 如何高效学习新技术：我的个人经验分享\n\n在当今技术快速发展的时代，前端开发者面临着前所未有的挑战和机遇。新技术、新框架、新工具不断涌现，如何高效地学习和掌握这些新技术，成为每个开发者必须面对的问题。作为一名有多年经验的前端开发者，我想分享一些我在学习新技术过程中的经验和技巧。\n\n## 一、明确学习目标\n\n在开始学习任何新技术之前，首先要明确自己的学习目标。是为了解决特定的问题？还是为了提升自己的技术栈？或者是为了跟上行业发展的趋势？不同的学习目标会导致不同的学习方法和学习路径。\n\n### 设定SMART目标\n\n一个好的学习目标应该符合SMART原则：\n- Specific（具体的）：明确你要学习什么，达到什么程度\n- Measurable（可衡量的）：有明确的衡量标准\n- Achievable（可实现的）：通过努力可以实现\n- Relevant（相关的）：与你的职业发展或项目需求相关\n- Time-bound（有时限的）：设定明确的时间限制\n\n例如，一个SMART目标可以是："在接下来的4周内，学习React Hooks的核心概念和使用方法，能够独立开发一个简单的待办事项应用"。",
      author: "作者名称",
      publish_date: "2023-02-20",
      read_time: "6分钟",
      views: 986,
      comments: 24
    },
    {
      id: 3,
      title: "深入理解JavaScript异步编程",
      slug: "javascript-async-programming",
      category: "前端开发",
      tags: ["JavaScript", "异步编程", "Promise", "async/await"],
      featured_image: "https://picsum.photos/1200/600?random=3",
      excerpt: "本文深入探讨JavaScript异步编程的各种模式和技术，包括回调函数、Promise、async/await等，帮助开发者更好地理解和应用异步编程。",
      content: "# 深入理解JavaScript异步编程\n\nJavaScript作为一门单线程语言，异步编程是其核心特性之一。在Web开发中，我们经常需要处理各种异步操作，如网络请求、文件读写、定时器等。本文将深入探讨JavaScript异步编程的各种模式和技术，帮助你更好地理解和应用异步编程。\n\n## 一、异步编程的基础\n\n### 什么是异步编程？\n\n在传统的同步编程中，代码是按照顺序执行的，每一行代码都必须等待前一行代码执行完成后才能执行。而异步编程则允许代码在等待某个操作完成的同时，继续执行其他代码，从而提高程序的执行效率。\n\n在JavaScript中，异步编程主要是通过事件循环（Event Loop）机制实现的。事件循环负责处理异步操作的回调函数，确保它们在适当的时机被执行。\n\n## 二、异步编程的发展历程\n\nJavaScript异步编程经历了从回调函数到Promise，再到async/await的发展过程。每一次的演进，都使得异步代码更加易读、易写、易维护。",
      author: "作者名称",
      publish_date: "2023-03-10",
      read_time: "10分钟",
      views: 1567,
      comments: 45
    }
  ];
}

// 获取所有文章
export async function getArticles() {
  await initData();
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  return articlesData;
}

// 根据ID获取文章
export async function getArticleById(id) {
  await initData();
  await new Promise(resolve => setTimeout(resolve, 200));
  return articlesData.find(article => article.id === parseInt(id));
}

// 根据slug获取文章
export async function getArticleBySlug(slug) {
  await initData();
  await new Promise(resolve => setTimeout(resolve, 200));
  return articlesData.find(article => article.slug === slug);
}

// 根据分类获取文章
export async function getArticlesByCategory(category) {
  await initData();
  await new Promise(resolve => setTimeout(resolve, 200));
  return articlesData.filter(article => article.category === category);
}

// 根据标签获取文章
export async function getArticlesByTag(tag) {
  await initData();
  await new Promise(resolve => setTimeout(resolve, 200));
  return articlesData.filter(article => article.tags.includes(tag));
}

// 获取所有分类
export async function getCategories() {
  await initData();
  await new Promise(resolve => setTimeout(resolve, 100));
  const categories = [...new Set(articlesData.map(article => article.category))];
  return categories.map(category => ({
    name: category,
    count: articlesData.filter(article => article.category === category).length
  }));
}

// 获取所有标签
export async function getTags() {
  await initData();
  await new Promise(resolve => setTimeout(resolve, 100));
  const allTags = articlesData.flatMap(article => article.tags);
  const tagCounts = {};
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  return Object.entries(tagCounts).map(([name, count]) => ({ name, count }));
}

// 保存文章（模拟）
export async function saveArticle(article) {
  await initData();
  
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (article.id) {
    // 更新现有文章
    const index = articlesData.findIndex(a => a.id === article.id);
    if (index !== -1) {
      articlesData[index] = { ...article, updated_at: new Date().toISOString() };
    }
  } else {
    // 创建新文章
    const newId = Math.max(...articlesData.map(a => a.id), 0) + 1;
    const newArticle = {
      ...article,
      id: newId,
      publish_date: new Date().toISOString().split('T')[0],
      views: 0,
      comments: 0,
      slug: generateSlug(article.title)
    };
    articlesData.unshift(newArticle); // 添加到数组开头
    article.id = newId;
    article.slug = newArticle.slug;
  }
  
  // 在实际应用中，这里应该发送API请求保存到服务器
  console.log('Article saved:', article);
  
  return article;
}

// 生成文章slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// 初始化页面公共功能
function initCommon() {
    setupMobileMenu();
    setupSmoothScroll();
    setupScrollEffects();
}

// 导出所有函数
export {
  // 初始化和UI函数
  initCommon, 
  setupFormSubmission, 
  setupIntersectionObserver,
  initNavbar, 
  initMobileMenu, 
  loadArticles, 
  initFilterButtons, 
  initSubscribeForm, 
  setupScrollAnimation,
  setupScrollEffects,
  
  // 数据获取函数
  initData,
  getArticles,
  getArticleById,
  getArticleBySlug,
  getArticlesByCategory,
  getArticlesByTag,
  getCategories,
  getTags,
  saveArticle,
  generateSlug
};