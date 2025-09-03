import { useState, useRef, useEffect } from 'react'
import EnhancedMarkdown from './components/EnhancedMarkdown'
import TabManager from './components/TabManager'
import MobilePreview from './components/MobilePreview'
import type { TabFile, TabManagerRef } from './components/TabManager'
import './App.css'

type ViewMode = 'edit' | 'preview' | 'split'

function App() {
  const defaultContent = `# 🎉 欢迎使用 Markdown 编辑器

这是一个功能强大的在线 Markdown 编辑器，支持实时预览、语法高亮和多种编辑模式。

## ✨ 主要功能

### 📝 编辑模式
- **编辑模式**：专注于内容创作
- **预览模式**：查看渲染效果
- **分屏模式**：同时编辑和预览

### 🎨 Markdown 语法支持

#### 标题
\`\`\`markdown
# 一级标题
## 二级标题
### 三级标题
\`\`\`

#### 文本样式
**粗体文本** 和 *斜体文本* 以及 ~~删除线~~

#### 列表
- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项

1. 有序列表项 1
2. 有序列表项 2

#### 链接和图片
[链接文本](https://example.com)
![图片描述](https://picsum.photos/150/150)

#### 引用
> 这是一个引用块
> 可以包含多行内容

#### 代码
行内代码：\`console.log('Hello World')

代码块：
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('Markdown');
\`\`\`

#### 表格
| 功能 | 描述 | 状态 |
|------|------|------|
| 语法高亮 | 代码块语法高亮 | ✅ |
| 实时预览 | 即时查看效果 | ✅ |
| 文件管理 | 多文件支持 | ✅ |

#### 项目结构示例
\`\`\`
📁 我的项目/
├── 📄 README.md
├── 📁 docs/
│   ├── 📄 guide.md
│   └── 📄 api.md
├── 📁 src/
│   ├── 📄 index.js
│   └── 📄 utils.js
└── 📄 package.json
\`\`\`

## 🚀 快速开始

1. **选择编辑模式**：点击顶部的模式切换按钮
2. **开始编写**：在左侧编辑区域输入 Markdown 内容
3. **实时预览**：右侧会实时显示渲染效果
4. **保存文件**：使用文件菜单保存你的工作

## 💡 使用技巧

- 使用 \`Ctrl+S\` 快速保存
- 支持拖拽上传文件
- 代码块支持一键复制
- 支持多种主题切换

---

**开始你的 Markdown 创作之旅吧！** 🎯`

  const [currentFile, setCurrentFile] = useState<TabFile>({
    id: 'default',
    name: 'welcome.md',
    content: defaultContent,
    lastModified: new Date(),
    isActive: true
  })
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  // URL state removed as it's not currently used
  const [syncScroll, setSyncScroll] = useState(true)
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const tabManagerRef = useRef<TabManagerRef>(null)

  // 处理文件切换
  const handleFileChange = (file: TabFile) => {
    setCurrentFile(file)
  }

  // 处理内容变化
  const handleContentChange = (content: string) => {
    setCurrentFile(prev => ({
      ...prev,
      content,
      lastModified: new Date()
    }))
  }

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        // 保存当前文件到localStorage（已在TabManager中自动处理）
        console.log('文件已自动保存')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 检查文件扩展名而不是MIME类型，因为.md文件的MIME类型可能不一致
      const fileName = file.name.toLowerCase()
      const isMarkdownFile = fileName.endsWith('.md') || fileName.endsWith('.markdown') || fileName.endsWith('.txt')
      
      if (isMarkdownFile) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          const newFile: TabFile = {
          id: 'uploaded-' + Date.now(),
          name: file.name,
          content: content,
          lastModified: new Date(),
          isActive: true
        }
        // 通过TabManager创建新选项卡
        if (tabManagerRef.current) {
          tabManagerRef.current.createNewTab(newFile)
        } else {
          setCurrentFile(newFile)
        }
        }
        reader.readAsText(file)
      } else {
        alert('请选择 .md、.markdown 或 .txt 文件')
      }
    }
    // 重置input值，允许重复选择同一文件
    event.target.value = ''
  }

  // URL fetch functionality removed for now

  const downloadMarkdown = () => {
    const blob = new Blob([currentFile.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = currentFile.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleEditorScroll = () => {
    if (!syncScroll || !textareaRef.current || !previewRef.current) return
    
    const editor = textareaRef.current
    const preview = previewRef.current
    const scrollPercentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight)
    preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight)
  }

  const handlePreviewScroll = () => {
    if (!syncScroll || !textareaRef.current || !previewRef.current) return
    
    const editor = textareaRef.current
    const preview = previewRef.current
    const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight)
    editor.scrollTop = scrollPercentage * (editor.scrollHeight - editor.clientHeight)
  }

  return (
    <div className="app-container bg-base-100">
      {/* Header with Tabs */}
      <div className="bg-base-200 shadow-lg flex-shrink-0">
        {/* Top navbar with tabs in same line */}
        <div className="navbar px-4">
          <div className="flex-1 flex items-center gap-4">
            <h1 className="text-xl font-bold">GlesMarkdown</h1>
            {/* Tab Manager inline */}
            <div className="flex-1">
              <TabManager
                ref={tabManagerRef}
                currentFile={currentFile}
                onFileChange={handleFileChange}
                onContentChange={handleContentChange}
              />
            </div>
          </div>
          <div className="flex-none gap-2">
            <label className="btn btn-primary btn-sm">
              📁 打开
              <input
                type="file"
                accept=".md,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={downloadMarkdown}
            >
              💾 保存
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Controls */}
      <div className="bg-base-200 px-4 py-2 border-b border-base-300 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="join">
              <button 
                className={`btn join-item btn-sm ${viewMode === 'split' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setViewMode('split')}
              >
                分屏模式
              </button>
              <button 
                className={`btn join-item btn-sm ${viewMode === 'edit' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setViewMode('edit')}
              >
                源码模式
              </button>
              <button 
                className={`btn join-item btn-sm ${viewMode === 'preview' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setViewMode('preview')}
              >
                阅读模式
              </button>
            </div>
            <button 
              className="btn btn-sm btn-outline"
              onClick={() => setIsMobilePreviewOpen(true)}
              title="手机预览模式"
            >
              📱 手机预览
            </button>
          </div>
          {viewMode === 'split' && (
            <button 
              className={`btn btn-sm ${syncScroll ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSyncScroll(!syncScroll)}
              title={syncScroll ? '关闭同步滚动' : '开启同步滚动'}
            >
              {syncScroll ? '🔗' : '🔗💔'} 同步滚动
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* 开始页面 - 当没有选项卡时显示 */}
        {!currentFile.id ? (
          <div className="flex items-center justify-center h-full bg-base-100">
            <div className="text-center max-w-md">
              <h2 className="text-3xl font-bold mb-4">🎉 欢迎使用 GlesMarkdown</h2>
              <p className="text-base-content/70 mb-6">开始你的 Markdown 创作之旅</p>
              <div className="space-y-3">
                <button 
                  className="btn btn-primary btn-wide"
                  onClick={() => tabManagerRef.current?.createNewTab({
                    id: Date.now().toString(),
                    name: 'untitled.md',
                    content: '',
                    lastModified: new Date(),
                    isActive: true
                  })}
                >
                  📝 新建文档
                </button>
                <label className="btn btn-outline btn-wide">
                  📁 打开文件
                  <input
                    type="file"
                    accept=".md,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Editor Panel */}
            {(viewMode === 'edit' || viewMode === 'split') && (
              <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} border-r border-base-300 flex flex-col`}>
                <div className="bg-base-200 px-4 py-2 border-b border-base-300">
                  <span className="text-sm text-base-content/70">{currentFile.name}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <textarea
                    ref={textareaRef}
                    className="w-full h-full p-4 bg-base-100 text-base-content resize-none focus:outline-none font-mono text-sm leading-relaxed editor-textarea"
                    value={currentFile.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    onScroll={handleEditorScroll}
                    placeholder="在这里输入Markdown内容..."
                  />
                </div>
              </div>
            )}
            
            {/* Preview Panel */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col`}>
                <div className="bg-base-200 px-4 py-2 border-b border-base-300">
                  <span className="text-sm text-base-content/70">预览</span>
                </div>
                <div 
                  ref={previewRef}
                  className="flex-1 p-6 bg-base-100 overflow-auto"
                  onScroll={handlePreviewScroll}
                >
                  <div className="markdown-body">
                    <EnhancedMarkdown>{currentFile.content}</EnhancedMarkdown>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Mobile Preview Modal */}
      <MobilePreview
        content={currentFile.content}
        isOpen={isMobilePreviewOpen}
        onClose={() => setIsMobilePreviewOpen(false)}
      />
    </div>
  )
}

export default App
