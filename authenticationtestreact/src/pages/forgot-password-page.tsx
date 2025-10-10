import { useState, type FormEvent } from "react";
import httpClient from "../axios.config";
import {Box,Button,Center,Container,Field,Flex,Heading,HStack,Input,Separator,Stack} from "@chakra-ui/react";
import { OpenToast } from "../utilities/toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [emailErr, setEmailErr] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response = await httpClient.post(
        `api/auth/forgot-password?email=${email}`
      );
      setEmail("");
      OpenToast("success", response.data);
    } catch (err: any) {
      OpenToast("error", err.response?.data?.errors[0] || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container paddingTop="50px">
        {/* <small>
          <a
            href="#"
            onClick={(evt: any) => {
              evt.preventDefault();
              window.history.back();
            }}
          >
            Go back
          </a>
        </small> */}
        <Flex justifyContent={"center"}>
          <Box width={{ base: "100%", sm: "50%", lg: "28%" }} p={10} bg="white">
            <Center marginBottom="20px">
              <img src='/logo.svg' style={{ height: "100px" }} alt="logo"/>
            </Center>
          <Center marginBottom="30px"><Heading>Forgot Password?</Heading></Center>
            <form onSubmit={handleSubmit} noValidate>
              <Stack gap={6}>
                {/* Email Field */}
                <Field.Root invalid={emailErr} required>
                  <Field.Label>
                    Email
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmailErr(false);
                      setEmail(e.target.value);
                    }}
                    onBlur={() => setEmailErr(email.length === 0)}
                  />
                  {emailErr && (
                    <Field.ErrorText>Email is required.</Field.ErrorText>
                  )}
                </Field.Root>

                <Button
                  type="submit"
                  bg="green.600"
                  disabled={loading || emailErr}
                  _hover={{ background: "green.500" }}
                >
                  {loading ? "Submitting..." : "Submit Email"}
                </Button>

                <HStack>
                  <Separator flex="1" />
                  <a href="/auth/login">Go to Login</a>
                  <Separator flex="1" />
                </HStack>
              </Stack>
            </form>
          </Box>
        </Flex>
      </Container>
    </>
  );
}

