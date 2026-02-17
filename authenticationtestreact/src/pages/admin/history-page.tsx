import { useLoaderData } from "react-router";
import AppWrapper from "../../components/content-wrapper";
import AppDataGrid from "../../components/data-table/data-grid";
import moment from "moment";
import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";
import CellRenderTemplate from "../../components/data-table/cell-render-template";
import { getHistory, type HistoryEventType } from "../../services/history-service";
import { useState } from "react";

const eventTypeColors: Record<HistoryEventType, string> = {
  Login: "blue.500",
  Create: "green.500",
  Update: "orange.500",
  Delete: "red.500",
};

export default function HistoryPage() {
  const data = useLoaderData();
  const [gridData, setGridData] = useState<any>(data);

  async function handleRefresh() {
    setGridData(await getHistory());
  }

  return (
    <AppWrapper title="History">
      <Flex gap={2} wrap="wrap" mb={4}>
        <Button bg="blue.500" size="sm" onClick={handleRefresh}>
          <FiRefreshCw /> Refresh
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
            {
              field: "eventType",
              headerName: "Event Type",
              cellRenderer: CellRenderTemplate,
              cellRendererParams: (params: any) => ({
                children: (
                  <Badge
                    variant="solid"
                    bg={eventTypeColors[params.value] ?? "gray.500"}
                    size="sm"
                  >
                    {params.value ?? "—"}
                  </Badge>
                ),
              }),
            },
            {
              field: "actorUserName",
              headerName: "Actor",
            },
            {
              field: "targetUserName",
              headerName: "Target User",
            },
            {
              field: "timestamp",
              headerName: "Date & Time",
              valueFormatter: (params) =>
                params.value
                  ? moment.utc(params.value).local().format("MM/DD/YYYY hh:mm:ss a")
                  : "",
            },
            {
              field: "details",
              headerName: "Details",
              flex: 2,
            },
          ]}
          data={gridData}
          showActionsColumn={false}
        />
      </Box>
    </AppWrapper>
  );
}
