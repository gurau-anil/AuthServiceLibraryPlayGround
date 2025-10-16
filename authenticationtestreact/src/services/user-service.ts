import httpClient from "../axios.config";

export async function getUsers(){
    let result: any = await httpClient.get(`/api/user/get-all`);
    return result.data;
}