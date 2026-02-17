import { useLoaderData } from "react-router";
import AppWrapper from "../../../components/content-wrapper";
import AppDataGrid from "../../../components/data-table/data-grid";
import { Box, Button, Flex } from "@chakra-ui/react";
import { FiBriefcase } from "react-icons/fi";
import { useState } from "react";
import RoleCreateForm from "./role-create-form";
import { getRoles } from "../../../services/role-service";

export default function RoleManagePage() {
  const data = useLoaderData();
  const [createFormOpen, setCreateFormOpen] = useState<boolean>(false);
  const [gridData, setGridData] = useState<any>(data);

  function handleRowDoubleClicked(event: any) {
    console.log(event);
  }

  function handleAction(evt: any) {
    console.log(evt);
  }

  async function onSubmissionComplete() {
    setGridData(await getRoles());
  }

  return (
    <>
      <AppWrapper title="Roles">
        <Flex gap={2} wrap="wrap">
          <Button
            bg="blue.500"
            size="sm"
            onClick={() => setCreateFormOpen(true)}
          >
            <FiBriefcase /> Create New
          </Button>
        </Flex>
        <Box
          w="full"
          overflowX={{ base: "scroll", md: "unset" }}
          h="calc(75vh)"
        >
          <AppDataGrid
            columnDefs={[
              { field: "id", hide: true },
              { field: "name", headerName: "Role Name" },
            ]}
            data={gridData}
            onRowDoubleClicked={handleRowDoubleClicked}
            onActionClicked={handleAction}
          />
        </Box>
      </AppWrapper>
      <RoleCreateForm
        isOpen={createFormOpen}
        setOpen={setCreateFormOpen}
        onSubmissionComplete={onSubmissionComplete}
      />
    </>
  );
}
