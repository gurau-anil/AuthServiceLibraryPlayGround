import { useEffect, useState } from "react";
import AppWrapper from "../components/content-wrapper";
import AppDataGrid from "../components/data-table/data-grid";
import CellRenderTemplate from "../components/data-table/cell-render-template";
import { FiCheck, FiX } from "react-icons/fi";
import { Box, Icon } from "@chakra-ui/react";
import httpClient from "../axios.config";

function AboutPage() {
  const [data] = useState([
    {
      id: "1",
      make: "Tesla",
      model: "Model Y",
      price: 64950,
      electric: true,
    },
    {
      id: "2",
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
    },
    {
      id: "3",
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
    },
    {
      id: "4",
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
    },
    {
      id: "5",
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
    },
    {
      id: "6",
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
    },
  ]);
  function handleRowDoubleClicked(event: any) {
    console.log(event);
  }

  useEffect(()=>{
    httpClient.get("/api/role/all").then(result=>{
      console.log(result)
    });
  },[])

  function handleAction(evt: any) {
    console.log(evt.data);
  }

  return (
    <>
      <AppWrapper title="Users">
        <Box overflowX={"scroll"} w="full" h="50vh">
          <AppDataGrid
            columnDefs={[
              { field: "id", hide: true },
              { field: "make" },
              { field: "model" },
              { field: "price" },
              {
                field: "electric",
                cellRenderer: CellRenderTemplate,
                cellRendererParams: (params: any) => ({
                  children: (
                    <Icon
                      as={params.data.electric ? FiCheck : FiX}
                      color={params.data.electric ? "green.500" : "red.500"}
                      size={"sm"}
                    />
                  ),
                }),
              },
            ]}
            data={data}
            onRowDoubleClicked={handleRowDoubleClicked}
            onActionClicked={handleAction}
            //   showActionsColumn={false}
          />
        </Box>
      </AppWrapper>
    </>
  );
}

export default AboutPage;
