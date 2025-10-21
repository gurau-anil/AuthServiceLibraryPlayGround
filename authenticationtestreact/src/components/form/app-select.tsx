import { Select, Portal, type ListCollection, Text, Tag, Flex} from "@chakra-ui/react";
import { useState } from "react";
import _ from "lodash";

interface AppSelectProps {
  label?: string;
  multiple?: boolean;
  variant?: "subtle" | "outline";
  collection: ListCollection<{ label: string; value: string }>;
  value?: string[];
  placeholder?: string;
  onValueChange: (data: any) => void;
}

function AppSelect({
  label = "",
  multiple = false,
  variant = "outline",
  collection,
  value = [],
  placeholder = "",
  onValueChange,
}: AppSelectProps) {
  let [selectedValues, setSelectedValues] = useState<any>([]);
  return (
    <>
      <Select.Root
        collection={collection}
        variant={variant}
        value={value}
        onValueChange={(evt: any) => {
          onValueChange(evt);
          setSelectedValues(evt);
        }}
        multiple={multiple}
      >
        <Select.HiddenSelect />
        <Select.Label>{label}</Select.Label>
        <Select.Control>
          <Select.Trigger pr={8}>
            <Flex w={"full"} h={"full"} wrap={"wrap"}>
            {multiple ? (
              <Flex gap={2} wrap={"wrap"} w={"full"} h={"full"} py={2} pr={4}>
                {selectedValues && selectedValues?.items?.length > 0 ? (
                  selectedValues.items.map((c: any, index: number) => (
                    <Tag.Root maxW="120px" key={index} size={"lg"} as={"span"} colorPalette={"gray"}>
                      <Tag.Label>{c.label}</Tag.Label>
                      <Tag.EndElement>
                        <Tag.CloseTrigger
                          as="a"
                          onClick={(closeEvt: any) => {
                            closeEvt.preventDefault();
                            let tempSelectedValue = selectedValues;
                            _.remove(
                              tempSelectedValue.items,
                              (x) => x.value == c.value
                            );
                            _.remove(
                              tempSelectedValue.value,
                              (x) => x == c.value
                            );
                            onValueChange({
                              items: tempSelectedValue.items,
                              value: tempSelectedValue.value,
                            });
                            setSelectedValues({
                              items: tempSelectedValue.items,
                              value: tempSelectedValue.value,
                            });
                          }}
                        />
                      </Tag.EndElement>
                    </Tag.Root>
                  ))
                ) : (
                  <Text color="gray.400">{placeholder}</Text>
                )}
              </Flex>
            ) : (
              <Select.ValueText placeholder={placeholder} />
            )}
            </Flex>
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {collection.items.map(
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
    </>
  );
}

export default AppSelect;
