import { type ConditionalValue, Flex } from "@chakra-ui/react";
import { type ReactNode } from "react";

function CellRenderTemplate({
  children,
  justifyContent="start",
}: {
  children: ReactNode;
  justifyContent?: ConditionalValue<
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "start"
    | "end"
    | "left"
    | "right"
  >;
}) {
  return (
    <>
      <Flex h="full" alignItems={"center"} justifyContent={justifyContent} gap={4}>
        {children}
      </Flex>
    </>
  );
}

export default CellRenderTemplate;