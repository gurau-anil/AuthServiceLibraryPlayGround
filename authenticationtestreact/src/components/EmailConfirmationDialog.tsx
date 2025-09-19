import { useState } from "react";
import {Field,Input,Stack} from "@chakra-ui/react";
import DialogBox from "./DialogBox";
import httpClient from "../axios.config";
import { OpenToast } from "../utilities/toast";

function EmailConfirmationDialog({onEmailConfirmationRequested}: {onEmailConfirmationRequested?: ()=> void}) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [emailErr, setEmailErr] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [isValid, setIsValid] = useState<boolean>(false);

  const closeAndclear = () => {
      clearForm();
  };

  const clearForm = () => {
      setLoading(false);
      setEmail('');
      setError('');
      setIsValid(false);
      setEmailErr('');
      setIsOpen(false);
  };

  async function handleSubmit() {
    try {
      setLoading(true);
      const response = await httpClient.post(`api/auth/send-email-confirmation?email=${email}`);
      setTimeout(() => {
        setIsOpen(false);
        clearForm();
        onEmailConfirmationRequested?.();
      OpenToast("success", response.data)
      }, 1000);
    } catch (error: any) {
      setTimeout(() => {
        setError(error?.response?.data?.errors[0]);
        setLoading(false);
        
      }, 1000);
    }
    
  }



  return (
    <>
      <a href="#" onClick={(e) => {
        e.preventDefault();
        setIsOpen(true);
      }}>Request confirmation email.</a>
      <DialogBox
        isOpen={isOpen}
        setOpen={setIsOpen}
        title="Request Confirmation Email"
        onCancel={clearForm}
        onClose={closeAndclear}
        action={handleSubmit}
        loading= {loading}
        isValid={isValid}
        error={error}
      >
        <form onSubmit={handleSubmit} noValidate>
            <Stack gap={6}>
              {/* Email Field */}
              <Field.Root invalid={emailErr.length > 0} required>
                <Field.Label>
                  Email
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e: any)=>{
                    let value = e.target.value;
                    setEmail(value);
                    setError("");
                    if(value.trim().length === 0){
                      setEmailErr("Email is Required.");
                      setIsValid(false);
                    }
                    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
                      setEmailErr("Invalid Email Address.");
                      setIsValid(false);
                    }
                    else{
                      setEmailErr("");
                      setIsValid(true);
                    }

                  }}
                  autoFocus={false}
                />
                {emailErr && (
                  <Field.ErrorText>{emailErr}</Field.ErrorText>
                )}
              </Field.Root>
            </Stack>
        </form>
      </DialogBox>
    </>
  );
}

export default EmailConfirmationDialog;
