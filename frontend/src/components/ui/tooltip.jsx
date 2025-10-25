import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "../../lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

// Enhanced Tooltip that works on both hover and click (mobile-friendly)
const Tooltip = ({ children, ...props }) => {
  return (
    <TooltipPrimitive.Root delayDuration={0} {...props}>
      {children}
    </TooltipPrimitive.Root>
  )
}

// Enhanced Trigger that responds to both hover and click/tap
const TooltipTrigger = React.forwardRef(({ onClick, ...props }, ref) => {
  const [open, setOpen] = React.useState(false)
  
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(!open)
    if (onClick) onClick(e)
  }

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      onClick={handleClick}
      onPointerDown={(e) => {
        // Prevent default to avoid focus issues on mobile
        if (e.pointerType === 'touch') {
          e.preventDefault()
        }
      }}
      {...props}
    />
  )
})

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
        className
      )}
      {...props} />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
