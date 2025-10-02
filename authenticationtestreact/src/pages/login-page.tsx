import { useState, type FormEvent } from "react";
import httpClient from "../axios.config";
import { useNavigate, useSearchParams } from "react-router";
import "./styles/login.css";
import {Alert, Box,Button,Center,Container,Field,Flex,HStack,Input,Separator,Show,Stack} from "@chakra-ui/react";
import {PasswordInput} from "../components/ui/password-input";
import { toaster } from "../components/ui/toaster";
import { OpenToast } from "../utilities/toast";
import EmailConfirmationDialog from "../components/EmailConfirmationDialog";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [usernameErr, setUsernameErr] = useState<boolean>(false);
  const [passwordErr, setPasswordErr] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if(!validateForm()){
        return;
      }
      let response = await httpClient.post("api/auth/login", {
        userName,
        password,
      });
      localStorage.setItem("authResult", JSON.stringify(response.data));

      toaster.create({ description: "Login Successful.", type: "success"});
      const redirectURL = searchParams.get("redirectTo")?? '/';

      if(response.data.roles.some((c: any)=> c.toLowerCase() == 'admin')){
        navigate(redirectURL== '/' ? '/admin': redirectURL)
      }
      else{
        navigate(redirectURL?? '/')
      }

    } catch (err: any) {
      if(err?.response){
        OpenToast("error", err.response?.data?.errors[0]);
        setError(err.response?.data?.errors[0] || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  function validateForm(){
    if(userName.length == 0 && password.length == 0){
      OpenToast("error", "Invalid Form");
      return false;
    }
    return true;
  }

  async function handleForgotPassword(e: any) {
    e.preventDefault();
    navigate("/auth/forgot-password");
  }

  return (
    <>
      <Container paddingTop="50px">
        <Flex justifyContent={"center"}>
          <Box width={{ base: "100%", sm: "50%", md: "50%", lg: "28%" }} p={10} bg="white">
            
            <Center marginBottom="20px">
              <img src='/logo.svg' style={{ height: "100px" }} alt="logo"/>
            </Center>

            <form onSubmit={handleSubmit} noValidate>
              <Stack gap={6}>
                {/* Username Field */}
                <Field.Root invalid={usernameErr} required>
                  <Field.Label>
                    Username
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      setUsernameErr(false);
                      setError("");
                      setUserName(e.target.value);
                    }}
                    onBlur={() => setUsernameErr(userName.length === 0)}
                  />
                  {usernameErr && (
                    <Field.ErrorText>Username is required.</Field.ErrorText>
                  )}
                </Field.Root>

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
                      setError("");
                      setPassword(e.target.value);
                    }}
                    onBlur={() => setPasswordErr(password.length === 0)}
                  />
                  {passwordErr && (
                    <Field.ErrorText>Password is required.</Field.ErrorText>
                  )}
                </Field.Root>
                <div>
                  <a href="#" onClick={handleForgotPassword}>
                    Forget password?
                  </a>
                </div>
                <Button
                  type="submit"
                  bg="green.600"
                  disabled={loading || usernameErr || passwordErr}
                  _hover={{ background: "green.500" }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                <HStack>
                  <Separator flex="1" />
                  <a href="/auth/register">Create an account</a>
                  <Separator flex="1" />
                </HStack>
              </Stack>
            </form>
            <Show when={error.length > 0}>
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Title>
                  {error}
                  {error.includes("confirmed") && (
                    <div style={{marginTop: "10px"}}>
                    <EmailConfirmationDialog onEmailConfirmationRequested={()=>{
                      setError("");
                    }}></EmailConfirmationDialog>
                  </div>
                  )}
                  
                  </Alert.Title>
                  
              </Alert.Root>
            </Show>
          </Box>
        </Flex>
      </Container>

      {/* <div className="login-wrapper">
        <div className="login-container">
          <div className="col-left">
            <div>
              <img
                src={reactLogo}
                style={{ height: "130px" }}
                alt="React logo"
              />
            </div>
          </div>
          <div className="col-right">
            <div className="login-form">
              <h2>Login</h2>
              <form onSubmit={handleSubmit}>
                <p>
                  <input
                    id="userName"
                    type="text"
                    value={userName}
                    autoComplete="username"
                    placeholder="Username"
                    title="username"
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </p>
                <p>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="Password"
                    autoComplete="current-password"
                    title="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </p>
                <p>
                  <input
                    className="btn"
                    type="submit"
                    value={loading ? "Signing in..." : "Sign In"}
                    disabled={loading}
                  />
                  {error && (<div style={{ color: "red", marginTop: 10 }}>{error}</div>)}
                </p>
                <p></p>
              </form>
              <div>
                <a href="#" onClick={handleForgotPassword}>
                  Forget password?
                </a>
              </div>
              <br />
              <div>
                <a href="/auth/register">Create an account.</a>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
