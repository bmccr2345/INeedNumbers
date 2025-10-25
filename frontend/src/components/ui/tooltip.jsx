import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "../../lib/utils"

// Mobile-friendly TooltipProvider - instant display, no delay
const TooltipProvider = ({ children, ...props }) => (
  <TooltipPrimitive.Provider 
    delayDuration={0} 
    skipDelayDuration={0} 
    disableHoverableContent={false}
    {...props}
  >
    {children}
  </TooltipPrimitive.Provider>
)

// Mobile-friendly Tooltip Root - controlled state for tap functionality
const Tooltip = ({ children, ...props }) => {
  const [open, setOpen] = React.useState(false)
  const timeoutRef = React.useRef(null)

  // Auto-close tooltip after 3 seconds on mobile tap
  React.useEffect(() => {
    if (open) {
      timeoutRef.current = setTimeout(() => {
        setOpen(false)
      }, 3000)
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [open])
  
  return (
    <TooltipPrimitive.Root 
      open={open} 
      onOpenChange={setOpen}
      delayDuration={0}
      {...props}
    >
      {children}
    </TooltipPrimitive.Root>
  )
}

// Enhanced Trigger - tap to open on mobile, hover on desktop
const TooltipTrigger = React.forwardRef(({ asChild, ...props }, ref) => {
  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      asChild={asChild}
      onClick={(e) => {
        // On touch devices, toggle tooltip on tap
        if (window.matchMedia('(hover: none)').matches) {
          e.preventDefault()
          e.stopPropagation()
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
