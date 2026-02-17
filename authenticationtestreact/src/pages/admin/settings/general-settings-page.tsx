import { SimpleGrid } from "@chakra-ui/react";
import { useLoaderData } from "react-router";
import { useState } from "react";
import AppWrapper from "../../../components/content-wrapper";
import AppLoader from "../../../components/app-loader";
import { SettingsSection, type AppSetting } from "../../../components/settings-section";

export default function GeneralSettingsPage() {
  const appSettings: AppSetting[] = useLoaderData() ?? [];
  const [loading, setLoading] = useState(false);

  const applicationSettings = appSettings.filter((c) =>
    c.key.startsWith("GeneralSettings:") &&
    (c.key.includes("ApplicationName") || c.key.includes("DefaultLanguage"))
  );
  const sessionSettings = appSettings.filter((c) =>
    c.key.startsWith("GeneralSettings:") &&
    (c.key.includes("MaintenanceMode") || c.key.includes("SessionTimeout"))
  );

  return (
    <>
      <AppLoader show={loading} />
      <AppWrapper title="General Settings">
        <SimpleGrid
          columns={{ base: 1, md: 1, lg: 4 }}
          gap={4}
          w="full"
          alignItems="start"
        >
          <SettingsSection
            title="Application"
            settings={applicationSettings}
            onLoadingChange={setLoading}
          />
          <SettingsSection
            title="Session"
            settings={sessionSettings}
            onLoadingChange={setLoading}
          />
        </SimpleGrid>
      </AppWrapper>
    </>
  );
}
