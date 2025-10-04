import {
  Flex,
  GridItem,
  Heading,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react";
import AppEditable from "../../../components/form/app-editable";
import { useLoaderData } from "react-router";
import AppCollapsible from "../../../components/app-collapsible";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import AppWrapper from "../../../components/content-wrapper";
import httpClient from "../../../axios.config";
import { OpenToast } from "../../../utilities/toast";
import AppLoader from "../../../components/app-loader";

interface AppSetting {
  name: string;
  value?: string;
  key: string;
}
function EmailSettingsPage() {
  const appSettings: AppSetting[] = useLoaderData();
  const [emailSettingsOpen, setEmailSettingsOpen] = useState<boolean>(true);
  const [passwordSettingsOpen, setPasswordSettingsOpen] =
    useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const emailSettings: AppSetting[] = appSettings.filter((c) =>
    c.key.startsWith("EmailSettings:")
  );

  const passwordSettings: AppSetting[] = appSettings.filter((c) =>
    c.key.startsWith("PasswordSettings:")
  );

  async function handleSubmit(data: AppSetting) {
    try {
      setLoading(true);
      const result = await httpClient.put(
        `/api/settings?key=${data.key}`,
        data
      );
      OpenToast("success", result.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <AppLoader show={loading}/>
      <AppWrapper>
        <SimpleGrid
          columns={{ base: 1, md: 1, lg: 4 }}
          gap={4}
          w={{ base: "full" }}
          alignItems={"start"}
        >
          <GridItem bg={"white"} p={4}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Heading>Email Settings</Heading>

              <IconButton
                variant="subtle"
                size={"xs"}
                onClick={() => {
                  setEmailSettingsOpen(!emailSettingsOpen);
                }}
              >
                {emailSettingsOpen ? <FiChevronUp /> : <FiChevronDown />}
              </IconButton>
            </Flex>
            {emailSettingsOpen && (
              <AppCollapsible
                isOpen={emailSettingsOpen}
                setOpen={setEmailSettingsOpen}
              >
                <SimpleGrid
                  columns={1}
                  gap={4}
                  w={{ base: "full" }}
                >
                  {emailSettings?.map(
                    (setting: {
                      name: string;
                      value?: string;
                      key: string;
                    }) => (
                      <GridItem>
                          {setting.name}
                          <AppEditable
                            defaultVal={setting.value}
                            type={
                              setting.key.toLowerCase().endsWith("password")
                                ? "password"
                                : setting.value == "true" ||
                                  setting.value == "false"
                                ? "yesno"
                                : "text"
                            }
                            onSubmitted={async (val: any) => {
                              handleSubmit({
                                key: setting.key,
                                value: val,
                                name: setting.name,
                              });
                            }}
                          />
                      </GridItem>
                    )
                  )}
                </SimpleGrid>
              </AppCollapsible>
            )}
          </GridItem>

          <GridItem bg={"white"} p={4}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Heading display={"inline-block"}>Password Settings</Heading>

              <IconButton
                variant="subtle"
                size={"xs"}
                onClick={() => {
                  setPasswordSettingsOpen(!passwordSettingsOpen);
                }}
              >
                {passwordSettingsOpen ? <FiChevronUp /> : <FiChevronDown />}
              </IconButton>
            </Flex>
            {passwordSettingsOpen && (
              <AppCollapsible
                isOpen={passwordSettingsOpen}
                setOpen={setPasswordSettingsOpen}
              >
                <SimpleGrid columns={1} gap={4} w={{ base: "full" }}>
                  {passwordSettings?.map(
                    (setting: {
                      name: string;
                      value?: string;
                      key: string;
                    }) => (
                      <GridItem>
                          {setting.name}
                          <AppEditable
                            defaultVal={setting.value}
                            type={
                              setting.key.toLowerCase().endsWith("password")
                                ? "password"
                                : setting.value == "true" ||
                                  setting.value == "false"
                                ? "yesno"
                                : "text"
                            }
                            onSubmitted={async (val: any) => {
                              handleSubmit({
                                key: setting.key,
                                value: val,
                                name: setting.name,
                              });
                            }}
                          />
                      </GridItem>
                    )
                  )}
                </SimpleGrid>
              </AppCollapsible>
            )}
          </GridItem>
        </SimpleGrid>
      </AppWrapper>
    </>
  );
}

export default EmailSettingsPage;
