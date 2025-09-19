import { Box, Center, Show, Spinner, Text, VStack } from "@chakra-ui/react";

function AppLoader({ show = false, text= "Loading..." }: { show?: boolean, text?:string }) {
  return (
    <>
      <Show when={show}>
        <Box style={{position: "absolute", height:"100%", width: "100%", inset:"0", zIndex: "9999"}} bg="black/25" pointerEvents="all">
          <Center h="full">
            <VStack gap={2}>
              <Spinner color="teal.500" borderWidth="4px" size="lg"/>
              <Text color="whiteAlpha.700">{text}</Text>
            </VStack>
          </Center>
        </Box>
      </Show>
    </>
  );
}

export default AppLoader;
