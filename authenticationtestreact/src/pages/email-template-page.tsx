import {Box,Button,ButtonGroup,createListCollection,Field,Input} from "@chakra-ui/react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import httpClient from "../axios.config";
import TinyEditor from "../components/tiny-editor/tiny-editor";
import { EmailType } from "../enums/email-type";
import type { MergeField } from "../interfaces/merge-field.model";
import AppSelect from "../components/form/app-select";
import { OpenToast } from "../utilities/toast";
import AppLoader from "../components/app-loader";
import type { EmailTemplate } from "../interfaces/email-template";

function EmailTemplatePage() {
  const appData: { mergeFields: MergeField[]; emailTemplate: EmailTemplate } =
    useLoaderData();
  const [emailBody, setEmailBody] = useState<string>("");
  const [baseEmailContent, setBaseEmailContent] = useState<string>(
    appData?.emailTemplate.body ?? ""
  );
  const [emailType, setEmailType] = useState<number>(
    EmailType?.EmailConfirmation ?? 0
  );
  const [mergeFields, setMergeFields] = useState<MergeField[]>(
    appData?.mergeFields ?? []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [subject, setEmailSubject] = useState<string>(appData.emailTemplate.subject);
  //   const [refreshToken, setRefreshToken] = useState<string>(generateRandom());

  async function handleSubmit() {
    try {
      setLoading(true);
      setDisabled(true);
      const result = await httpClient.post(
        `/api/email-template?emailType=${emailType}`,
        { id: emailType, subject: subject, body: emailBody }
      );
      setBaseEmailContent(emailBody);
      // setRefreshToken(generateRandom());
      OpenToast("success", result.data);
    } catch (error: any) {
      OpenToast("error", "Failed to save.");
    } finally {
      setLoading(false);
    }
  }

  async function handleChange(e: any) {
    setEmailType(e.value[0]);
    let result = await Promise.all([
      httpClient.get(`/api/merge-field?emailType=${e.value}`),
      httpClient.get(`/api/email-template?emailType=${e.value}`),
    ]);
    const mergeFields: MergeField[] = result[0]?.data ?? [];
    const emailTemplate: EmailTemplate = result[1].data;
    setDisabled(true);
    setMergeFields(mergeFields);
    setEmailSubject(emailTemplate.subject)
    setBaseEmailContent(emailTemplate.body);
  }

  //later data will be fetched from an api
  const emailTemplates = createListCollection({
    items: [
      {
        label: "Confirmation Email",
        value: EmailType.EmailConfirmation.toString(),
      },
      {
        label: "Password Reset Email",
        value: EmailType.PasswordReset.toString(),
      },
      {
        label: "User Register Email Confirmation",
        value: EmailType.UserRegisterEmailConfirm.toString(),
      },
      {
        label: "Two Factor Authentication Email",
        value: EmailType.TwoFactorAuuthentication.toString(),
      },
    ],
  });

  return (
    <>
      <AppLoader show={loading}></AppLoader>
      <Box mb={3} w={{base: "full", md: "320px"}}>
        <AppSelect
          label="Select Email Template"
          collection={emailTemplates}
          value={[emailType.toString()]}
          onValueChange={handleChange}
        ></AppSelect>
      </Box>

      <Field.Root invalid={false} required mb={3}>
        <Field.Label>
          Email Subject
          <Field.RequiredIndicator />
        </Field.Label>
        <Input
          bg={"white"}
          type="text"
          value={subject}
          onChange={(e: any) => {
            setEmailSubject(e.target.value);
            setDisabled(false);
          }}
        //   onBlur={() => setUsernameErr(userName.length === 0)}
        />
        {/* {usernameErr && (
          <Field.ErrorText>Username is required.</Field.ErrorText>
        )} */}
      </Field.Root>

      <TinyEditor
        initialContent={baseEmailContent}
        onChangeContent={setEmailBody}
        onDirty={() => {
          setDisabled(false);
        }}
        // refreshToken={refreshToken}
        mergeFields={mergeFields}
      ></TinyEditor>

      <ButtonGroup size="md" variant="outline" mt={4}>
        <Button
          bg={"green.400"}
          onClick={handleSubmit}
          disabled={disabled || loading}
          w={"120px"}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button w={"120px"}>Preview</Button>
      </ButtonGroup>
    </>
  );
}

export default EmailTemplatePage;
