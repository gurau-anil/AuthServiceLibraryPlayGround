import { useState, type FormEvent } from "react";
import httpClient from "../axios.config";
import { useNavigate, useSearchParams } from "react-router";
import {
  Container,
  Flex,
  Box,
  Center,
  Stack,
  Field,
  Button,
  HStack,
  Separator,
  Heading,
} from "@chakra-ui/react";
import { PasswordInput } from "../components/ui/password-input";
import { OpenToast } from "../utilities/toast";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordErr, setPasswordErr] = useState<boolean>(false);
  const [confirmPasswordErr, setConfirmPasswordErr] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      var email = searchParams.get("email") ?? "";
      var token = searchParams.get("token") ?? "";

      await httpClient.post(`api/auth/reset-password`, {
        email: email,
        token: token,
        password: password,
        confirmPassword: confirmPassword,
      });
      ClearForm();
      OpenToast("success", "Password reset successful.");
      navigate("/auth/login");
    } catch (err: any) {
      OpenToast(
        "error",
        err.response?.data?.errors[0] || "something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  function ClearForm() {
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <>
      <Container paddingTop="50px">
        <Flex justifyContent={"center"}>
          <Box width={{ base: "100%", sm: "50%", lg: "28%" }} p={10} bg="white">
            <Center marginBottom="20px">
              <img src='/logo.svg' style={{ height: "100px" }} alt="logo"/>
            </Center>
            <Center marginBottom="30px">
              <Heading>Reset Password</Heading>
            </Center>
            <form onSubmit={handleSubmit} noValidate>
              <Stack gap={6}>
                {/* Password Field */}

                <Field.Root invalid={passwordErr} required>
                  <Field.Label>
                    Password
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <PasswordInput
                    value={password}
                    onChange={(e) => {
                      setPasswordErr(false);
                      setPassword(e.target.value);
                    }}
                    onBlur={() => setPasswordErr(password.length === 0)}
                  />
                  {passwordErr && (
                    <Field.ErrorText>Password is required.</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={confirmPasswordErr} required>
                  <Field.Label>
                    Confirm Password
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPasswordErr(false);
                      setConfirmPassword(e.target.value);
                    }}
                    onBlur={() => setConfirmPasswordErr(password.length === 0)}
                  />
                  {confirmPasswordErr && (
                    <Field.ErrorText>
                      Confirm Password is required.
                    </Field.ErrorText>
                  )}
                </Field.Root>

                <Button
                  type="submit"
                  bg="green.600"
                  disabled={loading || confirmPasswordErr || passwordErr}
                  _hover={{ background: "green.500" }}
                >
                  {loading ? "Loading..." : "Reset Password"}
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

export default ResetPassword;
