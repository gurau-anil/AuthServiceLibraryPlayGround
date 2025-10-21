import { Stack, Field, Input, Flex, createListCollection, type ListCollection} from "@chakra-ui/react";
import FormDialogBox from "../../../components/FormDialogBox";
import { useEffect, useState } from "react";
import type RegisterModel from "../../../interfaces/RegisterModel";
import httpClient from "../../../axios.config";
import { OpenToast } from "../../../utilities/toast";
import AppSelect from "../../../components/form/app-select";

export default function RegisterFormModel({
  isOpen,
  setOpen,
  onSubmissionComplete,
}: {
  isOpen: boolean;
  setOpen: (val: boolean) => void;
  onSubmissionComplete?: () => void;
}) {
  const [form, setForm] = useState<RegisterModel>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    roles:[]
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterModel, string>>
  >({});
  const [roles, setRoles] = useState<ListCollection<{
    label: string;
    value: string;
}>>(createListCollection({
      items: [] as { label: string; value: string }[]
    }))

  useEffect(()=>{
    async function getRoles() {
        const response = await httpClient.get("/api/role/all");
        setRoles(createListCollection({
            items: response.data.map((c: any)=>{
            return {label: c, value: c }
        }),
      }));
    }

    getRoles();
  },[])

    
  const variant = "subtle"

  const handleChange = (e: any) => {
      let { name, value } = Object.keys(e).includes("target")? e.target : e;
    setForm((prev) => {
      const retVal = { ...prev, [name]: value };
      validateForm(retVal);
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));

      return retVal;
    });
  };

  function validateField(name: string, value: string | number | string[]){
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
        if (typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        break;
    }
    return "";
  };

  function validateForm(formData: RegisterModel) {
    let formEntries = Object.entries(formData);
    for (let index = 0; index < formEntries.length; index++) {
      if (
        validateField(formEntries[index][0], formEntries[index][1]).length > 0
      ) {
        setIsValid(false);
        return;
      }
    }
    setIsValid(true);
  }

  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async () => {
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
        console.log(res)

      setOpen(false);
      onSubmissionComplete?.();
      clearForm();
      OpenToast("success", "User registered Successful", "res.data", 10000);
    } catch (err: any) {
      OpenToast(
        "error",
        err.response?.data?.errors[0] || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  function clearForm() {
    setErrors({})
    setForm({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        roles:[]
      });
  }

  return (
    <>
      <FormDialogBox
        title="User Register Form"
        isOpen={isOpen}
        setOpen={setOpen}
        isValid={isValid}
        onFormSubmit={handleSubmit}
        loading={loading}
        size={"lg"}
        onClose={clearForm}
        onCancel={clearForm}
      >
        <Stack gap={6}>
          <Flex gap={6} direction={{base:"column", md:"row"}}>
            {/** First Name */}
            <Field.Root invalid={!!errors.firstName} required>
              <Field.Label>
                First Name
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                variant={variant}
              />
              {errors.firstName && (
                <Field.ErrorText>{errors.firstName}</Field.ErrorText>
              )}
            </Field.Root>

            {/** Last Name */}
            <Field.Root invalid={!!errors.lastName} required>
              <Field.Label>
                Last Name
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                variant={variant}
              />
              {errors.lastName && (
                <Field.ErrorText>{errors.lastName}</Field.ErrorText>
              )}
            </Field.Root>
          </Flex>

          <Flex gap={6} direction={{base:"column", md:"row"}}>
            {/** Username */}
            <Field.Root invalid={!!errors.username} required>
              <Field.Label>
                Username
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                name="username"
                value={form.username}
                onChange={handleChange}
                onBlur={handleBlur}
                variant={variant}
              />
              {errors.username && (
                <Field.ErrorText>{errors.username}</Field.ErrorText>
              )}
            </Field.Root>

            {/** Email */}
            <Field.Root invalid={!!errors.email} required>
              <Field.Label>
                Email
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                variant={variant}
              />
              {errors.email && (
                <Field.ErrorText>{errors.email}</Field.ErrorText>
              )}
            </Field.Root>
          </Flex>

          <AppSelect 
          label={"Roles"}
          multiple = {true}
          value={form.roles}
          collection={roles} 
          variant={variant}
          onValueChange={(e: any)=>{
            handleChange({name: "roles", value: e.value})
            // setSelectedRoles(e.value)
          }}/>
          
        </Stack>
      </FormDialogBox>
    </>
  );
}
