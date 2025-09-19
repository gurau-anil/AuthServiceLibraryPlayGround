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
  Show,
} from "@chakra-ui/react";
import { RiMenuFold3Fill, RiMenuFold4Fill } from "react-icons/ri";
import logo from "../../public/logo.svg";
import { FiBriefcase, FiPower, FiSettings, FiUser } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";

function Header({
  sideNavCollapsed,
  hasCollapseIcon = false,
  isSideNavDefault = true,
  onSideNavCollapseTriggered,
  onDrawerTriggered,
  onLogOutAction,
}: {
  sideNavCollapsed: boolean;
  hasCollapseIcon?: boolean;
  isSideNavDefault?: boolean;
  onSideNavCollapseTriggered: () => void;
  onDrawerTriggered?: () => void;
  onLogOutAction?: () => void;
}) {
  return (
    <>
      <Box bg={"white"} h="5rem">
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
                            <Center>{sideNavCollapsed ? <RiMenuFold3Fill /> : <RiMenuFold4Fill />}</Center>
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

          <Menu.Root positioning={{ placement: "bottom" }}>
            <Menu.Trigger rounded="full" focusRing="outside">
              <Avatar.Root size="md">
                <Avatar.Icon as={FiUser}></Avatar.Icon>
              </Avatar.Root>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content w={"200px"}>
                  <Menu.Item value="account" p={3}>
                    <HStack gap={4}>
                      <FiBriefcase />
                      Account
                    </HStack>
                  </Menu.Item>
                  <Menu.Item value="settings" p={3}>
                    <HStack gap={4}>
                      <FiSettings />
                      Settings
                    </HStack>
                  </Menu.Item>
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
      </Box>
    </>
  );
}

export default Header;
