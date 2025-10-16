import { AgGridReact } from "ag-grid-react";
import { useRef, useState } from "react";
import type { ICellRendererParams, ColDef, GridOptions} from "ag-grid-community";
import "../styles/data-grid.css";
import { Box, Icon } from "@chakra-ui/react";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { Tooltip } from "../ui/tooltip";
import CellRenderTemplate from "./cell-render-template";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

interface AppDataGridProps<TData = any> extends GridOptions<TData> {
  columnDefs: ColDef<TData>[];
  data: TData[];
  showActionsColumn?: boolean;
  onActionClicked?: (evt: {action: "view" | "edit" | "delete", data: TData | any}) => void
}

function AppDataGrid({ columnDefs, data, showActionsColumn = true, rowSelection=undefined, pagination=true, paginationPageSize=20, paginationPageSizeSelector=[10,20,50,100], onActionClicked, ...gridOptions}: AppDataGridProps) {
  const gridRef = useRef<AgGridReact>(null);
  const [colDefs] = useState<ColDef[]>([
    ...columnDefs,
    ...(showActionsColumn
      ? [
          {
            //   field: "action",
            //   headerName: "Actions",
            cellRenderer: CellRenderTemplate,
            cellRendererParams: (params: ICellRendererParams)=>({
              children: (
                <>
                  <Tooltip
                    content={"View"}
                  >
                    <Icon as={FiEye} size={"sm"} color={"blue.500"} className="action-icon" onClick={() => onActionClicked?.({action: "view", data: params.data})}/>
                  </Tooltip>

                  <Tooltip
                    content={"Edit"}
                  >
                    <Icon as={FiEdit} size={"sm"} color={"green.500"} className="action-icon" onClick={() => onActionClicked?.({action: "edit", data: params.data})}/>
                  </Tooltip>

                  <Tooltip
                    content={"Delete"}
                  >
                    <Icon as={FiTrash2} size={"sm"} color="red.500" className="action-icon" onClick={() => onActionClicked?.({action: "delete", data: params.data})}/>
                  </Tooltip>
                </>
              ),
            }),
            maxWidth: 160,
            filter: false,
            sortable: false,
            lockPosition: "right",
          } as ColDef,
        ]
      : []),
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

  return (
    <Box width="100%" h="100%" as="div" minW={"768px"}>
      <AgGridReact
        className="ag-theme-alpine"
        ref={gridRef}
        rowData={data}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        rowSelection={rowSelection}
        {...gridOptions}
      />
    </Box>
  );
}

export default AppDataGrid;
