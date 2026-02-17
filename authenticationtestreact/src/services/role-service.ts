import httpClient from "../axios.config";

export interface RoleModel {
  id?: string;
  name: string;
}

export async function getRoles(): Promise<RoleModel[]> {
  const result: any = await httpClient.get(`/api/role/all`);
  const data = result.data;
  // Normalize: API may return string[] or RoleModel[]
  if (Array.isArray(data)) {
    return data.map((item: any, index: number) =>
      typeof item === "string"
        ? { id: String(index), name: item }
        : { id: item.id ?? String(index), name: item.name ?? item }
    );
  }
  return [];
}

export async function createRole(name: string): Promise<void> {
  await httpClient.post("/api/role/create", { name });
}
