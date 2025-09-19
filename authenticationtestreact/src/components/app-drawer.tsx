"use client"

import { CloseButton, Drawer, Portal } from "@chakra-ui/react"
import { type ReactNode } from "react"

export default function AppDrawer({title, show = false, children, onOpenChanged}: {title: string, show: boolean, children: ReactNode, onOpenChanged: (data: boolean)=> void}) {

  return (
    <Drawer.Root open={show} onOpenChange={(e)=> onOpenChanged(e.open)} placement="start">
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
