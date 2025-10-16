import {
  Dialog,
  Portal,
  Button,
  CloseButton,
  Show,
  Alert,
  type ConditionalValue,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import AppLoader from "./app-loader";
import "./styles/dialog-box.css";
interface DialogBoxProps {
  isOpen: boolean;
  setOpen: (val: boolean) => void;
  title?: string;
  children: ReactNode;
  onCancel?: () => void;
  onClose?: () => void;
  onFormSubmit?: () => void;
  loading?: boolean;
  isValid?: boolean;
  error?: string;
  size?: ConditionalValue<
    "sm" | "md" | "lg" | "xl" | "full" | "xs" | undefined
  >;
}

export default function FormDialogBox({
  isOpen,
  setOpen,
  title = "Title",
  children,
  onCancel,
  onClose,
  onFormSubmit,
  loading = false,
  size = "sm",
  isValid = false,
  error = "",
}: DialogBoxProps) {

  return (
    <>
      <AppLoader show={loading}></AppLoader>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(e) => setOpen(e.open)}
        trapFocus={false}
        size={size}
        closeOnInteractOutside={false}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <Show when={error && error.length > 0}>
                  <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title>{error}</Alert.Title>
                    </Alert.Content>
                  </Alert.Root>
                </Show>
                <form noValidate>
                  {children}
                </form>
              </Dialog.Body>

              <Dialog.Footer mt={6}>
                <Button
                  // onClick={action}
                  type="submit"
                  bg="green.600"
                  _hover={{ background: "green.500" }}
                  disabled={loading || !isValid}
                  onClick={onFormSubmit}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>

                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>

              <Dialog.CloseTrigger asChild>
                <CloseButton
                  size="sm"
                  onClick={
                    onClose
                      ? onClose
                      : () => {
                          setOpen(false);
                        }
                  }
                />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
