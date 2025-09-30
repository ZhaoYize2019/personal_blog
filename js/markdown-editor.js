// Markdown编辑器功能实现

// 简单的Markdown解析器
export function parseMarkdown(markdown) {
    if (!markdown) return '';
    
    // 替换标题
    markdown = markdown.replace(/^#{1} (.*$)/gm, '<h1>$1</h1>');
    markdown = markdown.replace(/^#{2} (.*$)/gm, '<h2>$1</h2>');
    markdown = markdown.replace(/^#{3} (.*$)/gm, '<h3>$1</h3>');
    markdown = markdown.replace(/^#{4} (.*$)/gm, '<h4>$1</h4>');
    markdown = markdown.replace(/^#{5} (.*$)/gm, '<h5>$1</h5>');
    markdown = markdown.replace(/^#{6} (.*$)/gm, '<h6>$1</h6>');
    
    // 替换粗体和斜体
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
    markdown = markdown.replace(/\_\_(.*?)\_\_/g, '<strong>$1</strong>');
    markdown = markdown.replace(/\_(.*?)\_/g, '<em>$1</em>');
    
    // 替换链接
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // 替换图片
    markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="markdown-image">');
    
    // 替换代码块
    markdown = markdown.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // 替换行内代码
    markdown = markdown.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // 替换引用
    markdown = markdown.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // 处理列表（需要先处理嵌套情况）
    // 无序列表
    let ulRegex = /^(\s*)- (.*$)/gm;
    let listItems = [];
    let match;
    let tempMarkdown = markdown;
    while ((match = ulRegex.exec(tempMarkdown)) !== null) {
        listItems.push(match[2]);
    }
    if (listItems.length > 0) {
        markdown = markdown.replace(/^(\s*)- (.*$)/gm, '$2');
        let ulStartPos = markdown.indexOf(listItems[0]) - (listItems[0].length + 4);
        if (ulStartPos >= 0) {
            markdown = markdown.substring(0, ulStartPos) + 
                      '<ul><li>' + listItems.join('</li><li>') + '</li></ul>' + 
                      markdown.substring(ulStartPos + listItems.join('\n- ').length + 4);
        }
    }
    
    // 有序列表
    let olRegex = /^(\s*)\d+\. (.*$)/gm;
    listItems = [];
    tempMarkdown = markdown;
    while ((match = olRegex.exec(tempMarkdown)) !== null) {
        listItems.push(match[2]);
    }
    if (listItems.length > 0) {
        markdown = markdown.replace(/^(\s*)\d+\. (.*$)/gm, '$2');
        let olStartPos = markdown.indexOf(listItems[0]) - (listItems[0].length + 6);
        if (olStartPos >= 0) {
            markdown = markdown.substring(0, olStartPos) + 
                      '<ol><li>' + listItems.join('</li><li>') + '</li></ol>' + 
                      markdown.substring(olStartPos + listItems.join('\n1. ').length + 6);
        }
    }
    
    // 替换水平线
    markdown = markdown.replace(/^---$/gm, '<hr>');
    
    // 替换段落（排除已经被处理的元素）
    markdown = markdown.replace(/^(?!<h[1-6]>|<ul>|<ol>|<blockquote>|<pre>|<img>|<hr>)(.*$)/gm, function(match) {
        // 只处理非空行
        if (match.trim() !== '') {
            return '<p>' + match + '</p>';
        }
        return match;
    });
    
    return markdown;
}

// 生成阅读时间
export function calculateReadTime(content) {
    if (!content) return '1分钟';
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes + '分钟';
}

// 编辑器工具栏功能
export function setupEditorToolbar(editorId) {
    const editor = document.getElementById(editorId);
    if (!editor) return;
    
    const toolbar = document.getElementById('editor-toolbar');
    if (!toolbar) return;
    
    // 添加工具栏按钮点击事件
    toolbar.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const selectedText = editor.value.substring(start, end);
            
            let newText = '';
            let newCursorPos = 0;
            
            switch (action) {
                case 'h1':
                    newText = '# ' + selectedText;
                    newCursorPos = newText.length;
                    break;
                case 'h2':
                    newText = '## ' + selectedText;
                    newCursorPos = newText.length;
                    break;
                case 'h3':
                    newText = '### ' + selectedText;
                    newCursorPos = newText.length;
                    break;
                case 'bold':
                    newText = '**' + selectedText + '**';
                    newCursorPos = newText.length;
                    break;
                case 'italic':
                    newText = '*' + selectedText + '*';
                    newCursorPos = newText.length;
                    break;
                case 'link':
                    if (selectedText) {
                        newText = '[' + selectedText + '](https://)';
                        newCursorPos = newText.indexOf('(https://)') + 8;
                    } else {
                        newText = '[链接文本](https://)';
                        newCursorPos = 5;
                    }
                    break;
                case 'image':
                    if (selectedText) {
                        newText = '![' + selectedText + '](https://)';
                        newCursorPos = newText.indexOf('(https://)') + 8;
                    } else {
                        newText = '![图片描述](https://)';
                        newCursorPos = 6;
                    }
                    break;
                case 'code':
                    newText = '`' + selectedText + '`';
                    newCursorPos = newText.length;
                    break;
                case 'codeblock':
                    newText = '```\n' + selectedText + '\n```';
                    newCursorPos = newText.indexOf('\n') + 1;
                    break;
                case 'blockquote':
                    newText = '> ' + selectedText;
                    newCursorPos = newText.length;
                    break;
                case 'ul':
                    newText = '- ' + selectedText;
                    newCursorPos = newText.length;
                    break;
                case 'ol':
                    newText = '1. ' + selectedText;
                    newCursorPos = newText.length;
                    break;
                case 'hr':
                    newText = '---\n' + selectedText;
                    newCursorPos = 4;
                    break;
            }
            
            // 插入新文本并设置光标位置
            editor.value = editor.value.substring(0, start) + newText + editor.value.substring(end);
            editor.focus();
            editor.setSelectionRange(newCursorPos, newCursorPos);
            
            // 触发input事件以更新预览
            const event = new Event('input', { bubbles: true });
            editor.dispatchEvent(event);
        });
    });
}

// 初始化编辑器
export function initEditor() {
    const editor = document.getElementById('markdown-editor');
    const preview = document.getElementById('markdown-preview');
    const titleInput = document.getElementById('article-title');
    const excerptInput = document.getElementById('article-excerpt');
    const categoryInput = document.getElementById('article-category');
    const tagsInput = document.getElementById('article-tags');
    const imageInput = document.getElementById('article-image');
    const submitBtn = document.getElementById('submit-article');
    const saveDraftBtn = document.getElementById('save-draft');
    const previewBtn = document.getElementById('toggle-preview');
    const editorContainer = document.getElementById('editor-container');
    const previewContainer = document.getElementById('preview-container');
    
    // 设置编辑器工具栏
    setupEditorToolbar('markdown-editor');
    
    // 实时预览
    if (editor && preview) {
        editor.addEventListener('input', function() {
            const markdown = editor.value;
            const html = parseMarkdown(markdown);
            preview.innerHTML = html;
        });
        
        // 初始渲染
        if (editor.value) {
            const html = parseMarkdown(editor.value);
            preview.innerHTML = html;
        }
    }
    
    // 自动生成摘要
    if (editor && excerptInput) {
        editor.addEventListener('input', function() {
            // 只有在摘要为空时自动生成
            if (!excerptInput.value.trim()) {
                const plainText = editor.value.replace(/[#*`\[\]()><]/g, '').replace(/\n/g, ' ').trim();
                if (plainText.length > 150) {
                    excerptInput.value = plainText.substring(0, 150) + '...';
                }
            }
        });
    }
    
    // 切换预览模式
    if (previewBtn && editorContainer && previewContainer) {
        previewBtn.addEventListener('click', function() {
            editorContainer.classList.toggle('hidden');
            previewContainer.classList.toggle('hidden');
            
            if (previewBtn.textContent === '预览') {
                previewBtn.textContent = '编辑';
            } else {
                previewBtn.textContent = '预览';
            }
        });
    }
    
    // 提交文章
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            const title = titleInput.value.trim();
            const excerpt = excerptInput.value.trim();
            const category = categoryInput.value.trim();
            const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
            const content = editor.value.trim();
            const featuredImage = imageInput.value.trim() || 'https://picsum.photos/1200/600?random=' + Math.floor(Math.random() * 100);
            
            if (!title || !content) {
                alert('请填写标题和内容');
                return;
            }
            
            // 创建文章对象
            const article = {
                title,
                excerpt: excerpt || content.replace(/[#*`\[\]()><]/g, '').replace(/\n/g, ' ').trim().substring(0, 150) + '...',
                content,
                category: category || '未分类',
                tags,
                featured_image: featuredImage,
                author: '作者名称',
                read_time: calculateReadTime(content)
            };
            
            // 显示加载状态
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发布中...';
            
            try {
                // 模拟提交到服务器
                // 在实际应用中，这里应该调用API保存文章
                // 导入saveArticle函数（如果可用）
                let savedArticle;
                if (window.saveArticle) {
                    savedArticle = await window.saveArticle(article);
                } else {
                    // 模拟保存
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    savedArticle = { ...article, id: Math.floor(Math.random() * 1000) };
                    console.log('提交的文章:', savedArticle);
                }
                
                // 清除草稿
                localStorage.removeItem('articleDraft');
                
                // 显示成功消息
                alert('文章发布成功！');
                
                // 重定向到文章详情页
                setTimeout(() => {
                    window.location.href = savedArticle.slug ? 
                        `article.html?slug=${savedArticle.slug}` : 
                        `article.html?id=${savedArticle.id}`;
                }, 1000);
            } catch (error) {
                console.error('发布文章失败:', error);
                alert('发布文章失败，请重试');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '发布文章';
            }
        });
    }
    
    // 保存草稿
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            const title = titleInput.value.trim();
            const excerpt = excerptInput.value.trim();
            const category = categoryInput.value.trim();
            const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
            const content = editor.value.trim();
            const image = imageInput.value.trim();
            
            const draft = {
                title,
                excerpt,
                content,
                category,
                tags,
                image,
                lastModified: new Date().toISOString()
            };
            
            // 保存到本地存储
            localStorage.setItem('articleDraft', JSON.stringify(draft));
            
            // 显示保存成功提示
            const saveStatus = document.getElementById('save-status');
            if (saveStatus) {
                saveStatus.textContent = '草稿已保存';
                saveStatus.classList.add('show');
                setTimeout(() => {
                    saveStatus.classList.remove('show');
                }, 2000);
            } else {
                alert('草稿保存成功！');
            }
        });
    }
    
    // 加载草稿
    function loadDraft() {
        const draft = localStorage.getItem('articleDraft');
        if (draft) {
            try {
                const parsedDraft = JSON.parse(draft);
                if (titleInput) titleInput.value = parsedDraft.title || '';
                if (excerptInput) excerptInput.value = parsedDraft.excerpt || '';
                if (categoryInput) categoryInput.value = parsedDraft.category || '';
                if (tagsInput) tagsInput.value = parsedDraft.tags ? parsedDraft.tags.join(', ') : '';
                if (editor) editor.value = parsedDraft.content || '';
                if (imageInput) imageInput.value = parsedDraft.image || '';
                
                // 触发预览更新
                if (editor && preview) {
                    const html = parseMarkdown(editor.value);
                    preview.innerHTML = html;
                }
            } catch (e) {
                console.error('加载草稿失败:', e);
            }
        }
    }
    
    // 初始化时加载草稿
    loadDraft();
    
    // 自动保存功能
    let autoSaveTimer;
    if (editor || titleInput || excerptInput || categoryInput || tagsInput) {
        const triggerAutoSave = () => {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                // 调用保存草稿功能
                if (saveDraftBtn && typeof saveDraftBtn.click === 'function') {
                    // 模拟点击保存草稿按钮，但不显示提示
                    const originalAlert = window.alert;
                    window.alert = () => {};
                    saveDraftBtn.click();
                    window.alert = originalAlert;
                }
            }, 30000); // 30秒自动保存一次
        };
        
        // 为输入框添加事件监听
        [editor, titleInput, excerptInput, categoryInput, tagsInput, imageInput].forEach(element => {
            if (element) {
                element.addEventListener('input', triggerAutoSave);
                element.addEventListener('change', triggerAutoSave);
            }
        });
    }
}

// 当页面加载完成时初始化编辑器
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditor);
} else {
    initEditor();
}