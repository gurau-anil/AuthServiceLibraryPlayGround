import { Box, Flex, IconButton, Text, Link, Icon } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { GoDot } from "react-icons/go";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "./ui/tooltip";

function DashboardAnalyticsCard({
  title,
  value,
  link,
  tooltipText,
  icon,
  iconBg,
  iconColor = "black",
}: {
  title: string;
  value: string;
  link: {text: string; href: string};
  tooltipText?: string;
  icon?: IconType;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <>
      <Box minWidth={"200px"} w={"full"} bg={"white"} p={6} shadow={"xs"} borderRadius={"sm"}>
        <Flex justifyContent={"space-between"} alignItems={"start"}>
          <Box mb="2" fontSize={"lg"}>
            {title}
          </Box>
          <Tooltip 
          content={tooltipText?? title} positioning={{placement:"top"}}
          contentProps={{ css: { "--tooltip-bg": "#555555" } }}
          >
            <LuInfo />
          </Tooltip>
        </Flex>
        <Box>
          <Text fontWeight={"medium"} fontSize={"4xl"} pt={2}>
            {value}
          </Text>
        </Box>
        <Box>
          <Flex justifyContent={"space-between"} alignItems={"flex-end"}>
            <Link
              variant="underline"
              href={link.href}
              color={"#555555"}
              _hover={{ color: "#333333" }}
              _focus={{ outline: 0 }}
            >
              {link.text}
            </Link>
            <IconButton
              type={undefined}
              as="div"
              aria-label="Call support"
              variant={"subtle"}
              size={{ base: "md", md: "lg", lg: "xl" }}
              bg={iconBg ?? "green.100"}
              _hover={{ cursor: "default" }}
            >
              <Icon as={icon ?? GoDot} color={iconColor} />
            </IconButton>
          </Flex>
        </Box>
      </Box>
    </>
  );
}

export default DashboardAnalyticsCard;
