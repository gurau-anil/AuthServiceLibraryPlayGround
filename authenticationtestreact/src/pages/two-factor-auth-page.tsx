import {
  Container,
  Flex,
  Box,
  Center,
  HStack,
  Separator,
  Heading,
  Stack,
  PinInput,
  Button,
} from "@chakra-ui/react";
import "./styles/two-fact-auth.css";
import { useNavigate, useSearchParams } from "react-router";
import httpClient from "../axios.config";
import { toaster } from "../components/ui/toaster";
import { OpenToast } from "../utilities/toast";
import { useState } from "react";
import AppLoader from "../components/app-loader";

export default function TwoFactorAuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userName = searchParams.get("userName");
  const [value, setValue] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestCode, setRequestCode] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(30);

  async function handleSubmit(data: {
    valueAsString: string;
    value: string[];
  }) {
    try {
      setLoading(true);
      const response = await httpClient.post("api/auth/two-factor-login", {
        userName: userName,
        token: data.valueAsString,
      });

      const redirectURL = searchParams.get("redirectTo") ?? "/";
      localStorage.setItem("authResult", JSON.stringify(response.data));
      toaster.create({ description: "Login Successful.", type: "success" });
      
      if (response.data.roles.some((c: any) => c.toLowerCase() == "admin")) {
          navigate(redirectURL == "/" ? "/admin" : redirectURL);
        } else {
            navigate(redirectURL ?? "/");
        }
    } catch (error: any) {
        OpenToast("error", error?.response?.data?.errors[0]);
    } finally {
      setValue(["", "", "", "", "", ""]);
      setLoading(false);
      startCounter();
    }
  }

  async function requestNewCode(e: any) {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await httpClient.post(
        `api/auth/get-two-factor-auth-token?username=${userName}`
      );
      OpenToast("success", response.data);
    } catch (error: any) {
      OpenToast("error", error?.response?.data.errors[0]);
    } finally {
      setLoading(false);
      startCounter();
    }
  }

  function startCounter() {
    setRequestCode(true);
    setCounter(30);
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return (
    <>
      <AppLoader show={loading} />
      <Container paddingTop="50px">
        <Flex justifyContent={"center"}>
          <Box
            width={{ base: "100%", sm: "50%", lg: "28%" }}
            p={10}
            bg="white"
            shadow={"xs"}
          >
            <Center marginBottom="20px">
              <img src="/logo.svg" style={{ height: "100px" }} alt="logo" />
            </Center>
            <Center marginBottom="30px">
              <Heading>Verification code</Heading>
            </Center>
            <Stack gap={6}>
              <Flex justifyContent={"center"}>
                <PinInput.Root
                  size={{ base: "sm", md: "md", lg: "lg" }}
                  autoFocus={true}
                  blurOnComplete={true}
                //   onValueComplete={handleSubmit}
                  value={value}
                  onValueChange={(e) => setValue(e.value)}
                  disabled={loading}
                >
                  <PinInput.HiddenInput />
                  <PinInput.Control>
                    <PinInput.Input index={0} />
                    <PinInput.Input index={1} />
                    <PinInput.Input index={2} />
                    <PinInput.Input index={3} />
                    <PinInput.Input index={4} />
                    <PinInput.Input index={5} />
                  </PinInput.Control>
                </PinInput.Root>
              </Flex>
              <Button
                onClick={()=> handleSubmit({
                    valueAsString: value.join(''),
                    value: value
                })}
                bg="green.600"
                disabled={loading || value.some(c=>c.length == 0)}
                _hover={{ background: "green.500" }}
              >
                {loading ? "Verifying code..." : "Verify Code"}
              </Button>
              <Flex justifyContent={"center"}>
                {requestCode && (
                  <a
                    href="#"
                    onClick={requestNewCode}
                    className={counter > 0 ? "disabled-link" : ""}
                  >
                    {counter > 0 ? (
                      <>
                        Request new Code in {counter}{" "}
                        {counter > 1 ? "seconds" : "second"}
                      </>
                    ) : (
                      <>Request new Code</>
                    )}
                  </a>
                )}
              </Flex>
              <HStack>
                <Separator flex="1" />
                <a href="/auth/login">Go to Login</a>
                <Separator flex="1" />
              </HStack>
            </Stack>
          </Box>
        </Flex>
      </Container>
    </>
  );
}
