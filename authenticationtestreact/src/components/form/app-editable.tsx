import {
  Input,
  IconButton,
  Group,
  createListCollection,
  Portal,
  Select,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { LuPencilLine } from "react-icons/lu";

interface AppEditableProps {
  defaultVal?: string;
  placeholder?: string;
  type?: "text" | "password" | "select" | "yesno";
  inputSize?: "xs" | "sm" | "md" | "lg";
  onSubmitted: (data: any) => void;
}

function AppEditable({
  onSubmitted,
  defaultVal = "",
  placeholder = "Enter your value",
  inputSize = "sm",
  type = "text",
}: AppEditableProps) {
  const [onEditMode, setOnEditMode] = useState<boolean>(false);
  const [val, setVal] = useState<string>(defaultVal);
  const [defaultValue, setDefaultValue] = useState<string>(defaultVal);
  const inputRef = useRef<HTMLInputElement>(null);

  const yesNoCollection = createListCollection({
    items: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
  });
  async function handleSubmit(data?: any) {
    onSubmitted(data ?? val);
    setDefaultValue(data ?? val);
  }

  return (
    <>
      <Group attached w="full">
        {type == "yesno" && (
          <Select.Root
            flex="1"
            open={onEditMode}
            collection={yesNoCollection}
            value={[val]}
            onValueChange={(e: any) => {
              setVal(e.value[0]);
              handleSubmit(e.value[0]);
              setOnEditMode(false);
            }}
            size={inputSize}
            disabled={!onEditMode}
            onBlur={() => {
              setOnEditMode(false);
            }}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger bg={"gray.200"}>
                <Select.ValueText placeholder={placeholder} />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {yesNoCollection.items.map(
                    (item: { label: string; value: string }) => (
                      <Select.Item item={item} key={item.value}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    )
                  )}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        )}

        {(type === "text" || type === "password") && (
          <Input
            flex="1"
            bg={"gray.200"}
            cursor={onEditMode ? "text" : "default"}
            type={type}
            ref={inputRef}
            value={val}
            placeholder={placeholder}
            size={inputSize}
            disabled={!onEditMode}
            onChange={(e: any) => {
              setVal(e.target.value);
            }}
            onInput={() => setOnEditMode(true)}
            onBlur={() => {
              setOnEditMode(false);
              if (val !== defaultValue) {
                handleSubmit();
              }
            }}
          />
        )}

        {!onEditMode && (
          <IconButton
            title="edit"
            variant="outline"
            bg={"gray.300"}
            size={inputSize}
            onClick={() => {
              setOnEditMode(true);
              setTimeout(() => {
                inputRef.current?.focus();
              });
            }}
          >
            <LuPencilLine />
          </IconButton>
        )}
      </Group>
    </>
  );
}

export default AppEditable;
