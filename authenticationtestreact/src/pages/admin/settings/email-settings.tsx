import {Box,Flex,GridItem,Heading,IconButton,SimpleGrid,VStack} from "@chakra-ui/react";
import AppEditable from "../../../components/form/app-editable";
import { useLoaderData } from "react-router";
import AppCollapsible from "../../../components/app-collapsible";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import AppWrapper from "../../../components/content-wrapper";

interface AppSetting {
  name: string;
  value?: string;
  key: string;
}
function EmailSettingsPage() {
  const appSettings: AppSetting[] = useLoaderData();
  const [emailSettingsOpen, setEmailSettingsOpen] = useState<boolean>(true);

  const emailSettings: AppSetting[] = appSettings.filter((c) =>
    c.key.startsWith("EmailSettings:")
  );

  const half = Math.ceil(appSettings.length / 2);
  const leftEmailSettings: AppSetting[] = emailSettings.slice(0, half);
  const rightEmailSettings: AppSetting[] = emailSettings.slice(half);


  function handleSubmit(data: AppSetting){
    console.log(data);
  }

  return (
    <>
      <AppWrapper>

        <SimpleGrid
        columns={{ base: 1, sm: 2, md: 2, lg: 3 }} // breakpoint columns
        gap={4} // gap between blocks
        w="full" // take full width
      >
        
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Box pt={6} px={6} bg={"white"}>
            <Flex justifyContent={"space-between"}>
              <Heading display={"inline-block"}>Email Settings</Heading>

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
            <AppCollapsible
              isOpen={emailSettingsOpen}
              setOpen={setEmailSettingsOpen}
            >
              <Flex
                gap={4}
                mb={10}
                direction={{ base: "column", sm: "column", md: "row" }}
                justifyContent={"space-between"}
              >
                <Flex direction={"column"} gap={4} flex={1}>
                  {leftEmailSettings?.map(
                    (setting: {
                      name: string;
                      value?: string;
                      key: string;
                    }) => (
                        <VStack gap={1} align={"start"} key={setting.key}>
                          {setting.name}
                          <AppEditable
                            defaultVal={setting.value}
                            type={
                              setting.key.toLowerCase().includes("password")
                                ? "password"
                                : "text"
                            }
                            onSubmitted={(val: any)=>{
                                handleSubmit({key: setting.key, value: val, name: setting.name})
                            }}
                          ></AppEditable>
                        </VStack>
                    )
                  )}
                </Flex>

                <Flex direction={"column"} gap={4} flex={1}>
                  {rightEmailSettings?.map(
                    (setting: {
                      name: string;
                      value?: string;
                      key: string;
                    }) => (
                        <VStack gap={1} align={"start"} key={setting.key}>
                          {setting.name}
                          <AppEditable
                            defaultVal={setting.value}
                            type={
                              setting.key.toLowerCase().includes("password")
                                ? "password"
                                : "text"
                            }
                          ></AppEditable>
                        </VStack>
                    )
                  )}
                </Flex>
              </Flex>
            </AppCollapsible>
          </Box>
        </GridItem>
      </SimpleGrid>
        
      </AppWrapper>
    </>
  );
}

export default EmailSettingsPage;
