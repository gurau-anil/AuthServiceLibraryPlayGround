import {
  Box,
  Flex,
  HStack,
  IconButton,
  Center,
  Text,
  Menu,
  Portal,
  Avatar,
} from "@chakra-ui/react";
import { RiMenuFold3Fill, RiMenuFold4Fill } from "react-icons/ri";
import logo from "../../public/logo.svg";
import { FiPower, FiUser } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";
import type { ReactNode } from "react";

function Header({
  sideNavCollapsed,
  hasCollapseIcon = false,
  isSideNavDefault = true,
  onSideNavCollapseTriggered,
  onDrawerTriggered,
  onLogOutAction,
  children,
  extra
}: {
  sideNavCollapsed: boolean;
  hasCollapseIcon?: boolean;
  isSideNavDefault?: boolean;
  onSideNavCollapseTriggered: () => void;
  onDrawerTriggered?: () => void;
  onLogOutAction?: () => void;
  children?: ReactNode,
  extra?: string
}) {
  return (
    <>
      <Box bg={"white"} h="5rem" position={"fixed"} top={0} w={"full"} zIndex={9}>
        <Flex
          alignItems={"center"}
          h={"100%"}
          gap="2xl"
          px={5}
          shadow="inset"
          justifyContent={"space-between"}
        >
          <HStack gap="5">
            {hasCollapseIcon && (
                <>
                    {isSideNavDefault && (
                        <IconButton variant={"ghost"} display={{base: "none", md: "block"}} onClick={onSideNavCollapseTriggered}>
                            <Center>{sideNavCollapsed ? <RiMenuFold4Fill /> : <RiMenuFold3Fill />}</Center>
                        </IconButton>
                    )}

                    <IconButton variant={"ghost"} display={{base: "block", md: isSideNavDefault ? "none" : "block"}} onClick={onDrawerTriggered}>
                        <Center><IoMdMenu /></Center>
                    </IconButton>
                </>
            )}
            <HStack>
              <img src={logo} style={{ height: "50px" }} alt="logo" />
              <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color={"limegreen"}> Shield </Text>
            </HStack>
          </HStack>

            <Flex alignItems={"end"} flexDirection={"column"}>

             {extra && <div style={{marginBottom: "6px"}}>online: {extra}</div>}
          <Menu.Root positioning={{ placement: "bottom" }}>
            <Menu.Trigger rounded="full" focusRing="outside">
              <Avatar.Root size="md">
                <Avatar.Icon as={FiUser}></Avatar.Icon>
              </Avatar.Root>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content w={"200px"}>
                    {children}
                  <Menu.Item
                    value="delete"
                    color="fg.error"
                    _hover={{ bg: "bg.error", color: "fg.error" }}
                    p={3}
                    onClick={onLogOutAction}
                  >
                    <HStack gap={4}>
                      <FiPower />
                      Logout
                    </HStack>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
            </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default Header;
