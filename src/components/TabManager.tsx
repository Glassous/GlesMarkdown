import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

export interface TabFile {
  id: string
  name: string
  content: string
  lastModified: Date
  isActive: boolean
}

interface TabManagerProps {
  currentFile: TabFile
  onFileChange: (file: TabFile) => void
  onContentChange: (content: string) => void
}

export interface TabManagerRef {
  createNewTab: (file: TabFile) => void
}

const TabManager = forwardRef<TabManagerRef, TabManagerProps>(({ currentFile, onFileChange, onContentChange }, ref) => {
  const [tabs, setTabs] = useState<TabFile[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('')

  // 从localStorage加载历史文件
  useEffect(() => {
    const savedTabs = localStorage.getItem('markdown-tabs')
    const lastActiveTab = localStorage.getItem('markdown-last-active-tab')
    
    if (savedTabs) {
      const parsedTabs: TabFile[] = JSON.parse(savedTabs)
      if (parsedTabs.length > 0) {
        setTabs(parsedTabs)
        
        // 恢复上次活动的选项卡
        if (lastActiveTab && parsedTabs.find(tab => tab.id === lastActiveTab)) {
          setActiveTabId(lastActiveTab)
          const activeTab = parsedTabs.find(tab => tab.id === lastActiveTab)
          if (activeTab) {
            onFileChange(activeTab)
          }
        } else {
          setActiveTabId(parsedTabs[0].id)
          onFileChange(parsedTabs[0])
        }
      } else {
        // 如果保存的选项卡为空，显示开始页面
        setTabs([])
        setActiveTabId('')
        onFileChange({
          id: '',
          name: '',
          content: '',
          lastModified: new Date(),
          isActive: false
        })
      }
    } else {
      // 如果没有保存的选项卡，显示开始页面
      setTabs([])
      setActiveTabId('')
      onFileChange({
        id: '',
        name: '',
        content: '',
        lastModified: new Date(),
        isActive: false
      })
    }
  }, [])

  // 保存选项卡到localStorage
  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem('markdown-tabs', JSON.stringify(tabs))
    }
  }, [tabs])

  // 保存当前活动选项卡
  useEffect(() => {
    if (activeTabId) {
      localStorage.setItem('markdown-last-active-tab', activeTabId)
    }
  }, [activeTabId])

  // 创建新选项卡
  const createNewTab = (file?: TabFile) => {
    const newTab: TabFile = file || {
      id: 'tab-' + Date.now(),
      name: `untitled-${tabs.length + 1}.md`,
      content: '# 新文档\n\n开始编写你的内容...',
      lastModified: new Date(),
      isActive: true
    }
    
    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
    onFileChange(newTab)
  }

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    createNewTab
  }))

  // 切换选项卡
  const switchTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab) {
      // 保存当前选项卡内容
      if (activeTabId) {
        updateTabContent(activeTabId, currentFile.content)
      }
      
      setActiveTabId(tabId)
      onFileChange(tab)
    }
  }

  // 关闭选项卡
  const closeTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    
    const tabIndex = tabs.findIndex(t => t.id === tabId)
    const newTabs = tabs.filter(t => t.id !== tabId)
    
    setTabs(newTabs)
    
    if (newTabs.length === 0) {
      // 如果关闭了所有选项卡，清空活动选项卡ID
      setActiveTabId('')
      // 通知父组件显示开始页面
      onFileChange({
        id: '',
        name: '',
        content: '',
        lastModified: new Date(),
        isActive: false
      })
      return
    }
    
    // 如果关闭的是当前活动选项卡，切换到相邻选项卡
    if (tabId === activeTabId) {
      const nextActiveIndex = tabIndex > 0 ? tabIndex - 1 : 0
      const nextActiveTab = newTabs[nextActiveIndex]
      setActiveTabId(nextActiveTab.id)
      onFileChange(nextActiveTab)
    }
  }

  // 更新选项卡内容
  const updateTabContent = (tabId: string, content: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, content, lastModified: new Date() }
        : tab
    ))
  }

  // 重命名选项卡
  const renameTab = (tabId: string, newName: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, name: newName }
        : tab
    ))
  }

  // 监听当前文件内容变化
  useEffect(() => {
    if (activeTabId && currentFile.content !== undefined) {
      updateTabContent(activeTabId, currentFile.content)
    }
  }, [currentFile.content, activeTabId])

  return (
    <div className="w-full">
      {/* 选项卡栏 */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-1 px-3 py-1 rounded-t-lg border-b-2 transition-colors group whitespace-nowrap ${
              tab.id === activeTabId 
                ? 'bg-base-100 border-primary text-primary' 
                : 'bg-base-200 border-transparent hover:bg-base-300'
            }`}
          >
            {/* 可编辑文件名 */}
            {tab.id === activeTabId ? (
              <input
                type="text"
                value={tab.name}
                onChange={(e) => renameTab(tab.id, e.target.value)}
                className="input input-ghost input-xs bg-transparent border-none p-0 w-24 min-w-0"
                onBlur={(e) => {
                  if (!e.target.value.trim()) {
                    renameTab(tab.id, 'untitled.md')
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur()
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span 
                className="truncate cursor-pointer text-sm max-w-24" 
                title={tab.name}
                onClick={() => switchTab(tab.id)}
              >
                {tab.name}
              </span>
            )}
            
            {/* 关闭按钮 */}
            <button
              className="btn btn-ghost btn-xs w-4 h-4 min-h-0 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              onClick={(e) => closeTab(tab.id, e)}
              title="关闭选项卡"
            >
              ✕
            </button>
          </div>
        ))}
        
        {/* 新建选项卡按钮 */}
        <button
          className="btn btn-ghost btn-xs w-6 h-6 min-h-0 p-0 ml-1 flex-shrink-0"
          onClick={() => createNewTab()}
          title="新建选项卡"
        >
          +
        </button>
      </div>
    </div>
  )
})

TabManager.displayName = 'TabManager'

export default TabManager