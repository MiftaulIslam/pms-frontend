import React, { useEffect, useRef, useState } from 'react'

interface CustomizePanelProps {
  open: boolean
  onClose: () => void
  width?: number
  title?: string
  children: React.ReactNode
}

const CustomizePanel: React.FC<CustomizePanelProps> = ({ open, onClose, width = 360, title = 'Customize Board', children }) => {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!open) return
      const panel = panelRef.current
      if (panel && !panel.contains(e.target as Node)) {
        onClose()
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  // Keep wrapper width during slide-out, then collapse to 0
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const closeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    // Clear any pending timers
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    if (open) {
      // Expand immediately when opening
      setContainerWidth(width)
    } else {
      // Defer collapse to allow translateX animation to play
      closeTimerRef.current = window.setTimeout(() => {
        setContainerWidth(0)
        closeTimerRef.current = null
      }, 300) // must match CSS duration
    }
  }, [open, width])

  return (
    <div
      aria-hidden={!open}
      className={`absolute inset-y-0 right-0 pointer-events-none overflow-hidden`}
      style={{ width: containerWidth }}
    >
      <div
        ref={panelRef}
        className={`h-full w-full border-l bg-background shadow-lg pointer-events-auto transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
        </div>
        <div className="p-3 h-[calc(100%-48px)] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default CustomizePanel
