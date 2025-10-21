import { useState } from "react";
import httpClient from "../axios.config";
import type RegisterModel from "../interfaces/RegisterModel";
import "./styles/register.css";
import {Container,Flex,Box,Center,Heading,Stack,Field,Button,HStack,Separator,Input} from "@chakra-ui/react";
import { PasswordInput } from "../components/ui/password-input";
import { OpenToast } from "../utilities/toast";

function RegisterPage() {
  const [form, setForm] = useState<RegisterModel>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterModel, string>>>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateField = (name: string, value: string | number | string[]) => {

    if (typeof value === "string") {
    
  } else if (typeof value === "number") {
    
  } else if (Array.isArray(value)) {
    
  }
    switch (name) {
      case "firstName":
        if (typeof value === "string" && !value.trim()) return "First name is required";
        break;
      case "lastName":
        if (typeof value === "string" && !value.trim()) return "Last name is required";
        break;
      case "username":
        if (typeof value === "string" && !value.trim()) return "Username is required";
        break;
      case "email":
        if (typeof value === "string" && !value.trim()) return "Email is required";
        if (typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        break;
      case "password":
        if (!value) return "Password is required";
        break;
      case "confirmPassword":
        if (!value) return "Confirm password is required";
        if (value !== form.password) return "Passwords do not match";
        break;
    }
    return "";
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newErrors: typeof errors = {};
    (Object.keys(form) as (keyof RegisterModel)[]).forEach((field) => {
      const errorMsg = validateField(field, form[field] || "");
      if (errorMsg) newErrors[field] = errorMsg;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await httpClient.post("api/user/register", form);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });

      OpenToast("success", "User registered Successful", res.data, 10000);
    } catch (err: any) {
      OpenToast("error", err.response?.data?.errors[0] || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  return (
    <>
      <Container paddingTop="50px">
      <Flex justifyContent={"center"}>
        <Box width={{ base: "100%", sm: "50%", lg: "34%" }} p={10} bg="white">
          <Center marginBottom="30px">
            <Heading>Register Account</Heading>
          </Center>

          <form onSubmit={handleSubmit} noValidate>
            <Stack gap={6}>
              {/** First Name */}
              <Field.Root invalid={!!errors.firstName} required>
                <Field.Label>First Name<Field.RequiredIndicator /></Field.Label>
                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.firstName && <Field.ErrorText>{errors.firstName}</Field.ErrorText>}
              </Field.Root>

              {/** Last Name */}
              <Field.Root invalid={!!errors.lastName} required>
                <Field.Label>Last Name<Field.RequiredIndicator /></Field.Label>
                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.lastName && <Field.ErrorText>{errors.lastName}</Field.ErrorText>}
              </Field.Root>

              {/** Username */}
              <Field.Root invalid={!!errors.username} required>
                <Field.Label>Username<Field.RequiredIndicator /></Field.Label>
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.username && <Field.ErrorText>{errors.username}</Field.ErrorText>}
              </Field.Root>

              {/** Email */}
              <Field.Root invalid={!!errors.email} required>
                <Field.Label>Email<Field.RequiredIndicator /></Field.Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
              </Field.Root>

              {/** Password */}
              <Field.Root invalid={!!errors.password} required>
                <Field.Label>Password<Field.RequiredIndicator /></Field.Label>
                <PasswordInput
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
              </Field.Root>

              {/** Confirm Password */}
              <Field.Root invalid={!!errors.confirmPassword} required>
                <Field.Label>Confirm Password<Field.RequiredIndicator /></Field.Label>
                <PasswordInput
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.confirmPassword && (
                  <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>
                )}
              </Field.Root>

              <Button
                type="submit"
                bg="green.600"
                disabled={loading}
                _hover={{ background: "green.500" }}
              >
                {loading ? "Registering User..." : "Register Account"}
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

      {/* <div style={{ marginTop: "20px" }}>
        <small>
          <a
            href="#"
            onClick={(evt: any) => {
              evt.preventDefault();
              window.history.back();
            }}
          >
            Go back
          </a>
        </small>
      </div>
      <h2>User Register</h2>
      <strong>
        <small>
          {message && (
            <div style={{ color: "green", marginTop: 10, marginBottom: 10 }}>
              {message}
            </div>
          )}
          {error && (
            <div style={{ color: "red", marginTop: 10, marginBottom: 10 }}>
              {error}
            </div>
          )}
        </small>
      </strong>
      <form onSubmit={handleSubmit}>
        <div className="form-item">
          <div>
            <label htmlFor="firstName">First Name</label>
          </div>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
            placeholder="First Name"
          />
        </div>
        <div className="form-item">
          <div>
            <label htmlFor="lastName">Last Name</label>
          </div>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
            placeholder="Last Name"
          />
        </div>
        <div className="form-item">
          <div>
            <label htmlFor="username">Username</label>
          </div>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="Username"
          />
        </div>
        <div className="form-item">
          <div>
            <label htmlFor="email">Email</label>
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="your@example.com"
          />
        </div>
        <div className="form-item">
          <div>
            <label htmlFor="password">Password</label>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="************"
          />
        </div>
        <div className="form-item">
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            placeholder="************"
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            className="btn"
            type="submit"
            value={loading ? "Registering User..." : "Register"}
            disabled={loading}
          />
          <div style={{ margin: "6px" }}></div>
          <a href="/auth/login">Go to Login</a>
        </div>
      </form> */}
    </>
  );
}

export default RegisterPage;
