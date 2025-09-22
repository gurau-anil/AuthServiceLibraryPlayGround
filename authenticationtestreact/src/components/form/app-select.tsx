import { Select, Portal, type ListCollection } from "@chakra-ui/react";

interface AppSelectProps{
    collection: ListCollection<{label: string, value: string}>;
    value?: string[];
    placeholder?: string, onValueChange:(data: any)=> void;
}
function AppSelect({collection, value=[], placeholder="", onValueChange}:AppSelectProps) {
  return (
    <>
      <Select.Root
        collection={collection}
        value={value}
        onValueChange={onValueChange}
      >
        <Select.HiddenSelect />
        <Select.Label>Select Email Template</Select.Label>
        <Select.Control>
          <Select.Trigger bg={"white"}>
            <Select.ValueText placeholder={placeholder} />
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
