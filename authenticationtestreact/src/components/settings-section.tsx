import { Flex, GridItem, Heading, IconButton, SimpleGrid } from "@chakra-ui/react";
import AppEditable from "./form/app-editable";
import AppCollapsible from "./app-collapsible";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import httpClient from "../axios.config";
import { OpenToast } from "../utilities/toast";

export interface AppSetting {
  name: string;
  value?: string;
  key: string;
}

interface SettingsSectionProps {
  title: string;
  settings: AppSetting[];
  onLoadingChange?: (loading: boolean) => void;
}

export function SettingsSection({
  title,
  settings,
  onLoadingChange,
}: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  async function handleSubmit(data: AppSetting) {
    try {
      onLoadingChange?.(true);
      const result = await httpClient.put(`/api/settings?key=${data.key}`, data);
      OpenToast("success", result?.data ?? "Setting saved.");
    } catch {
      OpenToast("error", "Failed to save setting.");
    } finally {
      onLoadingChange?.(false);
    }
  }

  function getInputType(setting: AppSetting): "text" | "password" | "yesno" {
    if (setting.key.toLowerCase().endsWith("password")) return "password";
    if (setting.value === "true" || setting.value === "false") return "yesno";
    return "text";
  }

  return (
    <GridItem bg="white" p={4} borderRadius="md" shadow="sm">
      <Flex alignItems="center" justifyContent="space-between">
        <Heading size="md">{title}</Heading>
        <IconButton
          variant="subtle"
          size="xs"
          aria-label="Toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </IconButton>
      </Flex>
      {isOpen && (
        <AppCollapsible isOpen={isOpen} setOpen={setIsOpen}>
          <SimpleGrid columns={1} gap={4} w="full" mt={4}>
            {settings?.length > 0 ? (
              settings.map((setting) => (
                <GridItem key={setting.key}>
                  <Flex direction="column" gap={2}>
                    <span>{setting.name}</span>
                    <AppEditable
                      defaultVal={setting.value}
                      type={getInputType(setting)}
                      onSubmitted={(val: string) =>
                        handleSubmit({
                          key: setting.key,
                          value: val,
                          name: setting.name,
                        })
                      }
                    />
                  </Flex>
                </GridItem>
              ))
            ) : (
              <GridItem color="gray.500" fontSize="sm">
                No settings in this category.
              </GridItem>
            )}
          </SimpleGrid>
        </AppCollapsible>
      )}
    </GridItem>
  );
}
