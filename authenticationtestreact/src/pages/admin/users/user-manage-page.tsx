import { useLoaderData } from "react-router";
import AppWrapper from "../../../components/content-wrapper";
import AppDataGrid from "../../../components/data-table/data-grid";
import moment from "moment";
import { Badge, Box, Button, Flex} from "@chakra-ui/react";
import { FiUserCheck, FiUserPlus, FiUserX} from "react-icons/fi";
import { useState } from "react";
import CellRenderTemplate from "../../../components/data-table/cell-render-template";
import { LuMailCheck, LuMailX } from "react-icons/lu";
import { Tooltip } from "../../../components/ui/tooltip";
import RegisterFormModel from "./user-register";
import { getUsers } from "../../../services/user-service";

export default function UserManagePage() {
  const data = useLoaderData();
  const [enableActivate, setEnableActivate] = useState<boolean>(false);
  const [enableDeactivate, setEnableDeactivate] = useState<boolean>(false);
  const [registerFormOpen, setRegisterFormOpen] = useState<boolean>(false);
  const [gridData, setGridData] = useState<any>(data);

  function handleRowDoubleClicked(event: any) {
    console.log(event);
  }

  function handleAction(evt: any) {
    console.log(evt.data);
  }

  function handleRowSelection(evt: any) {
    var rowsSelected: any[] = evt.api.getSelectedRows();
    if (rowsSelected.length > 0) {
      console.log(rowsSelected.every((c) => c.isActive === true))
      setEnableActivate(rowsSelected.every((c) => c.isActive === false));
      setEnableDeactivate(rowsSelected.every((c) => c.isActive === true));
    } else {
      setEnableActivate(false);
      setEnableDeactivate(false);
    }
  }

  async function onSubmissionComplete() {
    setGridData(await getUsers());
  }

  return (
    <>
      <AppWrapper title="Users">
        <Flex gap={2} wrap={"wrap"}>
          <Button bg={"blue.500"} size={"sm"} onClick={()=>{
            setRegisterFormOpen(true);
          }}>
            <FiUserPlus /> Register New
          </Button>
          <Button bg={"green.500"} size={"sm"} disabled={!enableActivate}>
            <FiUserCheck /> Activate
          </Button>
          <Button bg={"red.500"} size={"sm"} disabled={!enableDeactivate}>
            <FiUserX /> Deactivate
          </Button>
          {/* <Group attached>
            <Button variant="solid" bg={"teal.500"} disabled={selectedRows.length <= 0} size={"sm"}>
              <FiSend /> Send Email
            </Button>
            <DropDownMenu
              triggerItem={
                <IconButton variant="solid" bg={"teal.400"} borderLeftRadius={0} size={"sm"}>
                  <LuChevronDown />
                </IconButton>
              }
              items={[
                { title: "Confirmation Email", value: "1" },
                { title: "Confirmation Remainder", value: "2" },
                { title: "Two Factor Auth Remainder", value: "3" },
              ]}
            />
          </Group> */}
          
        </Flex>
        <Box
          w={"full"}
          overflowX={{ base: "scroll", md: "unset" }}
          h={"calc(75vh)"}
        >
          <AppDataGrid
            columnDefs={[
              { field: "id", hide: true },
              {
                headerName: "Name",
                valueGetter: (params) => {
                  return `${params.data.firstName} ${params.data.lastName}`;
                },
              },
              { field: "userName" },
              {
                field: "email",
                cellRenderer: CellRenderTemplate,
                cellRendererParams: (params: any) => ({
                  children: (
                    <>
                      <Flex alignItems={"center"} gap={3}>
                        <Tooltip
                          content={
                            params.data.emailConfirmed
                              ? "Verified"
                              : "Unverified"
                          }
                        >
                          <Badge
                            variant="solid"
                            bg={
                              params.data.emailConfirmed
                                ? "green.400"
                                : "red.400"
                            }
                            size={"sm"}
                          >
                            {params.data.emailConfirmed ? (
                              <LuMailCheck />
                            ) : (
                              <LuMailX />
                            )}
                          </Badge>
                        </Tooltip>
                        {params.data.email}
                      </Flex>
                    </>
                  ),
                }),
              },
              {
                field: "lastLogin",
                valueFormatter: (params) =>
                  params.value
                    ? moment
                        .utc(params.value)
                        .local()
                        .format("MM/DD/YYYY hh:mm:ss a")
                    : "",
              },
            ]}
            data={gridData}
            getRowStyle={(params: any) => {
              return params.data?.isActive === false
                ? { backgroundColor: "#FFB8B8" }
                : undefined;
            }}
            onRowDoubleClicked={handleRowDoubleClicked}
            onActionClicked={handleAction}
            rowSelection={{ mode: "multiRow" }}
            onRowSelected={handleRowSelection}
          />
        </Box>
      </AppWrapper>
      <RegisterFormModel isOpen={registerFormOpen} setOpen={setRegisterFormOpen} onSubmissionComplete={onSubmissionComplete}/>
    </>
  );
}
