import { SimpleGrid } from "@chakra-ui/react";
import { useLoaderData } from "react-router";
import { useState } from "react";
import AppWrapper from "../../../components/content-wrapper";
import AppLoader from "../../../components/app-loader";
import { SettingsSection, type AppSetting } from "../../../components/settings-section";

export default function AccountSettingsPage() {
  const appSettings: AppSetting[] = useLoaderData() ?? [];
  const [loading, setLoading] = useState(false);

  const loginSettings = appSettings.filter((c) =>
    c.key.startsWith("AccountSettings:") &&
    (c.key.includes("MaxLoginAttempts") || c.key.includes("LockoutDuration"))
  );
  const accountOptions = appSettings.filter((c) =>
    c.key.startsWith("AccountSettings:") &&
    (c.key.includes("RequireEmailConfirmation") || c.key.includes("AllowMultipleSessions"))
  );

  return (
    <>
      <AppLoader show={loading} />
      <AppWrapper title="Account Settings">
        <SimpleGrid
          columns={{ base: 1, md: 1, lg: 4 }}
          gap={4}
          w="full"
          alignItems="start"
        >
          <SettingsSection
            title="Login & Lockout"
            settings={loginSettings}
            onLoadingChange={setLoading}
          />
          <SettingsSection
            title="Account Options"
            settings={accountOptions}
            onLoadingChange={setLoading}
          />
        </SimpleGrid>
      </AppWrapper>
    </>
  );
}
