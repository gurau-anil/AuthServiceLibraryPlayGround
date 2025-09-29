import { Collapsible } from "@chakra-ui/react";
import type { ReactNode } from "react";

function AppCollapsible({
  isOpen = true,
  setOpen,
  children,
}: {
  isOpen?: boolean;
  setOpen: (val: boolean) => void;
  children: ReactNode;
}) {
  return (
    <>
      <Collapsible.Root open={isOpen} onOpenChange={(e) => setOpen(e.open)}>
        <Collapsible.Trigger></Collapsible.Trigger>
        <Collapsible.Content>{children}</Collapsible.Content>
      </Collapsible.Root>
    </>
  );
}

export default AppCollapsible;
