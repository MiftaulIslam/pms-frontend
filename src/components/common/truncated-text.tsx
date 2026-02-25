import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TruncatedTextProps {
    text: string
    maxWidth: string
    onTruncated?: () => void
    className?: string
}

export function TruncatedText({ text, maxWidth, onTruncated, className }: TruncatedTextProps) {
    const textRef = useRef<HTMLSpanElement>(null)
    const [hasShownToast, setHasShownToast] = useState(false)

    useEffect(() => {
        if (!textRef.current || hasShownToast) return

        const element = textRef.current
        // Check if text is truncated by comparing scrollWidth to clientWidth
        const isTruncated = element.scrollWidth > element.clientWidth

        if (isTruncated && onTruncated) {
            onTruncated()
            setHasShownToast(true)
        }
    }, [text, onTruncated, hasShownToast])

    return (
        <span
            ref={textRef}
            className={cn("min-w-0 truncate block", className)}
            style={{ maxWidth }}
            title={text}
        >
            {text}
        </span>
    )
}

