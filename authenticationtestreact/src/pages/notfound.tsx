import { Button, Container, HStack, Text, Box } from "@chakra-ui/react";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import { TbError404 } from "react-icons/tb";
import { useNavigate } from "react-router";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <>
    <Container centerContent={true} py={10}>
        <Box my={5}>
            <TbError404 style={{ fontSize: "100px" }}/>
            <Text>Page Not found</Text>
        </Box>
        <HStack gap={2}>
                <Button
                  colorPalette="teal"
                  variant="solid"
                  onClick={() => window.history.back()}
                >
                  <FiArrowLeft /> Back
                </Button>
                <Button
                  colorPalette="blue"
                  variant="surface"
                  onClick={() => navigate("/")}
                >
                  <FiHome /> Home
                </Button>
              </HStack>
    </Container>
    </>
  );
}

export default NotFoundPage;
