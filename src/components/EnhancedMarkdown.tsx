import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface EnhancedMarkdownProps {
  children: string
  className?: string
  theme?: 'light' | 'dark'
}

interface CodeBlockProps {
  children: string
  className?: string
  theme?: 'light' | 'dark'
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, theme = 'light' }) => {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  
  // Check if this is a tree structure
  const isTreeStructure = /^[\s├└│┌┐┘┴┬┤┼─┌┐└┘│├┤┬┴┼─\|\\\-\+`~]*[├└│\|\\\-\+`~]/.test(children) && 
                         children.includes('├') || children.includes('└') || children.includes('│') ||
                         (children.includes('|') && children.includes('--')) ||
                         (children.includes('├──') || children.includes('└──'))

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Special handling for tree structures
  if (isTreeStructure) {
    return (
      <div className="relative group">
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 bg-base-200 hover:bg-base-300 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="复制树状结构"
        >
          {copied ? '✓' : '📋'}
        </button>
        <div className="tree-structure">
          {children}
        </div>
      </div>
    )
  }

  if (!language) {
    return (
      <code className="bg-base-200 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    )
  }

  return (
    <div className="relative group">
      <div className="flex items-center justify-between bg-base-300 px-4 py-2 rounded-t-lg">
        <span className="text-sm font-medium text-base-content/70">
          {language.toUpperCase()}
        </span>
        <button
          onClick={copyToClipboard}
          className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="复制代码"
          aria-label="复制代码到剪贴板"
        >
          {copied ? (
            <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={theme === 'dark' ? oneDark : oneLight}
        language={language}
        PreTag="div"
        className="!mt-0 !rounded-t-none"
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

const EnhancedMarkdown: React.FC<EnhancedMarkdownProps> = ({ 
  children, 
  className = '', 
  theme = 'light' 
}) => {
  return (
    <div className={`enhanced-markdown ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code: ({ node, className, children, ...props }: any) => {
            const inline = !className
            if (inline) {
              return (
                <code className="bg-base-200 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <CodeBlock className={className} theme={theme}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            )
          },
          pre: ({ children }) => {
            return <div className="my-4">{children}</div>
          },
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-4 text-base-content border-b border-base-300 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-3 text-base-content border-b border-base-300 pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-medium mb-2 text-base-content">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-medium mb-2 text-base-content">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-medium mb-2 text-base-content">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium mb-2 text-base-content">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-base-content">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-base-content/80">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 text-base-content">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-base-content">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-base-content">
              {children}
            </li>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="table table-zebra w-full">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-base-200">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="text-left font-semibold text-base-content">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="text-base-content">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="link link-primary" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img 
              src={src} 
              alt={alt} 
              className="max-w-full h-auto rounded-lg shadow-sm my-4"
              loading="lazy"
            />
          ),
          hr: () => (
            <hr className="border-base-300 my-6" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

export default EnhancedMarkdown