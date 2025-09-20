import { HoverCard, Portal } from "@chakra-ui/react";

function HoverBox({trigger, children}:any) {
    return ( <>
    <HoverCard.Root size="sm" positioning={{ placement: "right" }} openDelay={50} closeDelay={50}>
      <HoverCard.Trigger asChild>
        {trigger}
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content p={2} minWidth={"180px"} borderRadius={2} bg={"ghostwhite"}>
            <HoverCard.Arrow />
            {children}
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
    </> );
}

export default HoverBox;