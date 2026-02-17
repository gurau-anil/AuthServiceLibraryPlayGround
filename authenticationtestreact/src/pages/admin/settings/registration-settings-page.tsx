import { SimpleGrid } from "@chakra-ui/react";
import { useLoaderData } from "react-router";
import { useState } from "react";
import AppWrapper from "../../../components/content-wrapper";
import AppLoader from "../../../components/app-loader";
import { SettingsSection, type AppSetting } from "../../../components/settings-section";

export default function RegistrationSettingsPage() {
  const appSettings: AppSetting[] = useLoaderData() ?? [];
  const [loading, setLoading] = useState(false);

  const accessSettings = appSettings.filter((c) =>
    c.key.startsWith("RegistrationSettings:") &&
    (c.key.includes("AllowRegistration") || c.key.includes("RequireApproval"))
  );
  const defaultSettings = appSettings.filter((c) =>
    c.key.startsWith("RegistrationSettings:") &&
    (c.key.includes("DefaultRole") || c.key.includes("MinAge"))
  );

  return (
    <>
      <AppLoader show={loading} />
      <AppWrapper title="Registration Settings">
        <SimpleGrid
          columns={{ base: 1, md: 1, lg: 4 }}
          gap={4}
          w="full"
          alignItems="start"
        >
          <SettingsSection
            title="Access"
            settings={accessSettings}
            onLoadingChange={setLoading}
          />
          <SettingsSection
            title="Defaults"
            settings={defaultSettings}
            onLoadingChange={setLoading}
          />
        </SimpleGrid>
      </AppWrapper>
    </>
  );
}
