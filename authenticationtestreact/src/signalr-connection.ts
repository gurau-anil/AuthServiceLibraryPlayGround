import * as signalR from "@microsoft/signalr";
import { BASEURL } from "./config";

class SignalRClient {
  private connection: signalR.HubConnection | null = null;
  private baseURL: string = "";
  constructor(baseUrl: string) {
    this.baseURL = baseUrl;
  }

  // Initialize (or return existing) connection
  public async init(hubName: string): Promise<signalR.HubConnection> {
    // Return if already connected
    if (
      this.connection &&
      this.connection.state === signalR.HubConnectionState.Connected
    ) {
      return this.connection;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseURL}/${hubName}`, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.None)
      .build();

    connection.onclose((error) => {
      console.warn("SignalR connection closed:", error);
      this.connection = null;
    });

    try {
        
        await connection.start()
    } catch (err:any) {
        // throw new Error(err)
        // if (err && err.message && err.message.includes("Status code '401'")) {
        //   alert("You are not authorized. Please log in.");
        // } else {
        //   alert("Connection error. Please try again later.");
        // }
    }

    this.connection = connection;
    return connection;
  }

  public getConnection(): signalR.HubConnection | null {
    return this.connection;
  }

  public async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log("SignalR connection stopped");
    }
  }
}

export const signalRClient = new SignalRClient(BASEURL);
