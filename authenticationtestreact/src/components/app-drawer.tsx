"use client"

import { CloseButton, Drawer, Portal, type ConditionalValue } from "@chakra-ui/react"
import { type ReactNode } from "react"

export default function AppDrawer({title, show = false, children, onOpenChanged, placement="start", size}: 
  {title: string, 
    show: boolean, 
    children?: ReactNode, 
    onOpenChanged: (data: boolean)=> void,
    placement?: 'start' | 'end',
    size?: ConditionalValue<"sm" | "md" | "lg" | "xl" | "full" | "xs" | undefined>
  }
  ) {

  return (
    <Drawer.Root open={show} onOpenChange={(e)=> onOpenChanged(e.open)} placement={placement} size={size}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body p={0}>
              {children}
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
