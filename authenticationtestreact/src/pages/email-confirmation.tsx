import { useLoaderData } from "react-router";
import type LoaderDataModel from "../interfaces/LoaderDataModel";
import { Container, Flex, Box, Center, HStack, Separator, Alert, Show } from "@chakra-ui/react";

function EmailConfirmationPage() {
  const loaderData: LoaderDataModel = useLoaderData();
  console.log(loaderData)
  return (
    <>
    <Container paddingTop="50px">
            <Flex justifyContent={"center"}>
              <Box width={{ base: "100%", sm: "50%", lg: "28%" }} p={10} bg="white">
              <Center marginBottom="30px">
                <Show when={loaderData?.data}>
                  <Alert.Root status="success">
                    <Alert.Indicator />
                    <Alert.Title>{loaderData?.data}</Alert.Title>
                  </Alert.Root>
                </Show>
                
                <Show when={loaderData?.error?.message}>
                  <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title>{loaderData?.error?.message}</Alert.Title>
                  </Alert.Root>
                </Show>
              </Center>

              <HStack>
                <Separator flex="1" />
                <a href="/auth/login">Go to Login</a>
                <Separator flex="1" />
              </HStack>
              </Box>
            </Flex>
          </Container>
    </>
    
  );
}

export default EmailConfirmationPage;
