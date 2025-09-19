import {
  Dialog,
  Portal,
  Button,
  CloseButton,
  Show,
  Alert,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import AppLoader from "./app-loader";

interface DialogBoxProps {
  isOpen: boolean;
  setOpen: (val: boolean) => void;
  title?: string;
  children: ReactNode;
  onCancel?: () => void;
  onClose?: () => void;
  action?: () => void;
  loading?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "full" | "cover";
  isValid?: boolean;
  error?: string;
}

export default function DialogBox({
  isOpen,
  setOpen,
  title = "Title",
  children,
  onCancel,
  onClose,
  action,
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

              {children}
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>

              {action && (
                <Button
                  onClick={action}
                  bg="green.600"
                  _hover={{ background: "green.500" }}
                  disabled={loading || !isValid}
                >
                  {loading ? "Submitting..." : "Summit"}
                </Button>
              )}
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
