import { Stack, Field, Input } from "@chakra-ui/react";
import FormDialogBox from "../../../components/FormDialogBox";
import { useState } from "react";
import { OpenToast } from "../../../utilities/toast";
import { createRole } from "../../../services/role-service";

export default function RoleCreateForm({
  isOpen,
  setOpen,
  onSubmissionComplete,
}: {
  isOpen: boolean;
  setOpen: (val: boolean) => void;
  onSubmissionComplete?: () => void;
}) {
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const variant = "subtle";

  const validateField = (name: string, value: string) => {
    if (name === "name") {
      if (!value?.trim()) return "Role name is required";
      if (value.trim().length < 2) return "Role name must be at least 2 characters";
    }
    return "";
  };

  const handleChange = (e: any) => {
    const { name, value } = Object.keys(e).includes("target") ? e.target : e;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      setIsValid(!!next.name?.trim() && next.name.trim().length >= 2);
      return next;
    });
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async () => {
    const errorMsg = validateField("name", form.name);
    if (errorMsg) {
      setErrors({ name: errorMsg });
      return;
    }

    setLoading(true);
    try {
      await createRole(form.name.trim());
      setOpen(false);
      onSubmissionComplete?.();
      clearForm();
      OpenToast("success", "Role created successfully");
    } catch (err: any) {
      OpenToast(
        "error",
        err.response?.data?.message || err.response?.data?.errors?.[0] || "Failed to create role"
      );
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setErrors({});
    setForm({ name: "" });
    setIsValid(false);
  };

  return (
    <FormDialogBox
      title="Create New Role"
      isOpen={isOpen}
      setOpen={setOpen}
      isValid={isValid}
      onFormSubmit={handleSubmit}
      loading={loading}
      size="md"
      onClose={clearForm}
      onCancel={clearForm}
    >
      <Stack gap={6}>
        <Field.Root invalid={!!errors.name} required>
          <Field.Label>
            Role Name
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            variant={variant}
            placeholder="e.g. Admin, Editor, Viewer"
          />
          {errors.name && (
            <Field.ErrorText>{errors.name}</Field.ErrorText>
          )}
        </Field.Root>
      </Stack>
    </FormDialogBox>
  );
}
