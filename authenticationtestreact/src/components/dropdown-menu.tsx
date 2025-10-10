import { Menu, Avatar, Portal, HStack } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { FiUser, FiPower } from "react-icons/fi";

export default function DropDownMenu({triggerItem, items}:{triggerItem: ReactNode, items: any[]}) {
    return ( <>
        <Menu.Root positioning={{ placement: "bottom" }}>
            <Menu.Trigger lineHeight={0} outline={0} bg={"unset"}>
                {triggerItem}
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                <Menu.Content color={"red"}>
                    {items.map((item, index)=> (
                            <Menu.Item key={index} value={item.value} color={"gray.600"}>
                    <HStack gap={4}> 
                        {item.title}
                    </HStack>
                    </Menu.Item>
                    ))}
                </Menu.Content>
                </Menu.Positioner>
            </Portal>
            </Menu.Root>
    </> );
}
