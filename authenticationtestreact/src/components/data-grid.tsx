import { AgGridReact } from "ag-grid-react";
import { useRef, useState } from "react";
// import type { ColDef } from "ag-grid-community";
import {
  type ICellRendererParams,
  type ColDef,
  type RowDoubleClickedEvent,
} from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

import "./styles/data-grid.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Box, Flex, HStack } from "@chakra-ui/react";
import AppWrapper from "./content-wrapper";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { Tooltip } from "./ui/tooltip";
ModuleRegistry.registerModules([AllCommunityModule]);

interface IRow {
  id: string;
  make: string;
  model: string;
  price: number;
  electric: boolean;
  action?: string;
}

interface ActionCellRendererProps extends ICellRendererParams {
  // Optionally pass down custom functions from the parent grid component
  // onActionClicked: (action: string, data: any) => void;
}

const ActionCellRenderer: React.FC<ActionCellRendererProps> = (props) => {
  const rowData = props.data;

  const handleAction = (action: "view" | "edit" | "delete") => {
    console.log(`Action: ${action}, Row Data:`, rowData);
    alert(`${action.toUpperCase()} action triggered for row ID: ${rowData.id}`);
  };

  const iconStyle = { cursor: "pointer", margin: "0 4px" };

  return (
    <Flex alignItems={"center"} gap={1} h={"full"}>
      <Tooltip
        content={"View Details"}
        contentProps={{ css: { "--tooltip-bg": "#555555" } }}
      >
        <FiEye
          size={16}
          style={{ ...iconStyle, color: "#007bff" }}
          onClick={() => handleAction("view")}
        />
      </Tooltip>

      <Tooltip
        content={"Edit"}
        contentProps={{ css: { "--tooltip-bg": "#555555" } }}
      >
        <FiEdit
          size={16}
          style={{ ...iconStyle, color: "#4bd669" }}
          onClick={() => handleAction("edit")}
        />
      </Tooltip>

      <Tooltip
        content={"Delete"}
        contentProps={{ css: { "--tooltip-bg": "#555555" } }}
      >
        <FiTrash2
          size={16}
          style={{ ...iconStyle, color: "#dc3545" }}
          onClick={() => handleAction("delete")}
        />
      </Tooltip>
    </Flex>
  );
};

function AppDataGrid() {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<IRow[]>([
    { id: "1", make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { id: "2", make: "Ford", model: "F-Series", price: 33850, electric: false },
    {
      id: "3",
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
    },
    { id: "4", make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { id: "5", make: "Fiat", model: "500", price: 15774, electric: false },
    { id: "6", make: "Nissan", model: "Juke", price: 20675, electric: false },
  ]);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
    { field: "id", hide: true },
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
    {
      field: "action",
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      maxWidth: 160,
      filter: false,
      sortable: false,
      lockPosition: "right",
    },
  ]);

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: false,
    filter: true,
    filterParams: {
      //   buttons: ['clear', 'apply', 'reset', 'cancel'],
      buttons: ["apply", "reset"],
      closeOnApply: true,
    },
  };

  function handleRowDoubleClicked(event: RowDoubleClickedEvent) {
    console.log(event);
  }

  return (
    <AppWrapper title="Users">
      <Box width="100%" height="calc(100vh - 10rem)">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 50, 100]}
          // rowSelection={{mode: "singleRow"}}
          onRowDoubleClicked={handleRowDoubleClicked}
        />
      </Box>
    </AppWrapper>
  );
}

export default AppDataGrid;
