import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { signalRClient } from "../signalr-connection";

export function useSignalR(hubName: string) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;

    signalRClient
      .init(hubName)
      .then((conn) => {
        if (isMounted) setConnection(conn);
      })
      .catch(console.error);

    return () => {
      isMounted = false;
      signalRClient.stopConnection();
    };
  }, [hubName]);

  return connection;
}
