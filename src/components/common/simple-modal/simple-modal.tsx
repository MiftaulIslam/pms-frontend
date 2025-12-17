import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import styles from './simple-modal.module.css'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'

type SimpleModalProviderProps = ComponentProps<typeof Dialog> & {
  className?: string
  trigger?: ReactNode
}

type SimpleModalContentProps = {
  className?: string
  children: ReactNode

  headerContent?: ReactNode
  headerClassName?: string

  footerContent?: ReactNode
  footerClassName?: string

  title?: ReactNode
  description?: ReactNode

  footerCancel?: ReactNode | true
  footerSubmit?: ReactNode | true
  footerSubmitLoading?: boolean
  footerSubmitVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  onFooterSubmitClick?: () => void
}

export function SimpleModalProvider({
  className,
  children,
  trigger,
  ...props
}: SimpleModalProviderProps) {
  return (
    <Dialog {...props}>
      {trigger}
      <DialogContent
        showCloseButton={false}
        className={cn(
          'flex h-full max-h-full w-full max-w-full flex-col gap-0 overflow-hidden rounded-none border bg-card p-0 outline-none sm:h-auto sm:max-h-[90vh] sm:max-w-[min(var(--width,45rem),90%)] sm:rounded-2xl sm:border',
          className
        )}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

export function SimpleModalHeader({
  className,
  ...props
}: ComponentProps<typeof DialogHeader>) {
  return (
    <DialogHeader
      className={cn(
        'flex min-h-18 w-full flex-row items-center justify-between border-b border-border px-6',
        className
      )}
      {...props}
    />
  )
}

export function SimpleModalFooter({
  className,
  ...props
}: ComponentProps<typeof DialogFooter>) {
  return (
    <DialogFooter
      className={cn(
        'flex w-full flex-row items-center justify-end gap-3 p-6 pt-3',
        className
      )}
      {...props}
    />
  )
}

export function SimpleModalContent({
  children,
  className,

  headerContent,
  footerContent,

  title,
  description,

  footerCancel,
  footerSubmit,
  footerSubmitLoading,
  footerSubmitVariant = 'default',
  onFooterSubmitClick,
}: SimpleModalContentProps) {
  const renderedHeaderContent =
    headerContent ??
    (title || description ? (
      <SimpleModalHeader>
        <div className="flex flex-col gap-1">
          <DialogTitle className="text-base font-medium">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </div>

        <SimpleModalCloseButton />
      </SimpleModalHeader>
    ) : null)

  const renderedFooterContent =
    footerContent ??
    (footerCancel || footerSubmit ? (
      <SimpleModalFooter>
        {footerCancel && (
          <DialogClose asChild>
            <Button
              variant="outline"
              className="h-11 rounded-[12.85px] border-border px-[12.85px] text-muted-foreground"
            >
              {footerCancel === true ? 'Cancel' : footerCancel}
            </Button>
          </DialogClose>
        )}

        {footerSubmit && (
          <Button
            variant={footerSubmitVariant}
            onClick={onFooterSubmitClick}
            className="h-11 rounded-[12.85px] px-4"
            disabled={footerSubmitLoading}
          >
            {footerSubmitLoading && <Loader2 className="size-4 animate-spin" />}
            {footerSubmit === true ? 'Submit' : footerSubmit}
          </Button>
        )}
      </SimpleModalFooter>
    ) : null)

  return (
    <>
      {renderedHeaderContent}

      <div
        className={cn(
          'w-full flex-1 overflow-auto p-6 pb-3',
          styles.content,
          className
        )}
      >
        {children}
      </div>

      {renderedFooterContent}
    </>
  )
}

export function SimpleModalCloseButton({
  className,
  ...props
}: ComponentProps<'button'>) {
  return (
    <DialogClose asChild {...props}>
      <button
        className={cn(
          'flex size-[1em] cursor-pointer items-center justify-center rounded-[0.3em] bg-card text-sm text-[2.5rem] text-muted-foreground transition-all hover:bg-red-100 hover:text-red-700',
          className
        )}
      >
        <svg
          width="0.4em"
          height="0.4em"
          fill="none"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.7434 1.1709L0.743408 15.1709M0.743408 1.1709L14.7434 15.1709"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="transition-all"
          />
        </svg>
      </button>
    </DialogClose>
  )
}
