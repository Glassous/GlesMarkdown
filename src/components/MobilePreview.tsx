import React, { useState, useRef, useEffect } from 'react'
import EnhancedMarkdown from './EnhancedMarkdown'

interface MobilePreviewProps {
  content: string
  isOpen: boolean
  onClose: () => void
}

const MobilePreview: React.FC<MobilePreviewProps> = ({ content, isOpen, onClose }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const previewRef = useRef<HTMLDivElement>(null)

  // 处理拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!previewRef.current) return
    
    const rect = previewRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsDragging(true)
  }

  // 处理拖拽移动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      
      // 限制在窗口范围内
      const maxX = window.innerWidth - 320 // 手机宽度
      const maxY = window.innerHeight - 640 // 手机高度
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // ESC键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      />
      
      {/* 手机预览窗口 */}
      <div
        ref={previewRef}
        className="fixed z-50 select-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div className="mockup-phone bg-black shadow-2xl">
          {/* 手机顶部摄像头 */}
          <div className="mockup-phone-camera"></div>
          
          {/* 手机屏幕内容 */}
          <div className="mockup-phone-display bg-white relative">
            {/* 拖拽区域 */}
            <div
              className="absolute top-0 left-0 right-0 h-8 bg-transparent z-10"
              onMouseDown={handleMouseDown}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            />
            
            {/* 预览内容 */}
            <div className="h-full overflow-auto p-4 pt-12 text-black text-sm">
              <div className="markdown-body prose prose-sm max-w-none">
                <EnhancedMarkdown>{content}</EnhancedMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobilePreview