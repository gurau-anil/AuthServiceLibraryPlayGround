import { redirect } from "react-router";

export default function isUserAuthenticated(request:Request){
    
    const authResult = localStorage.getItem('authResult');
    const url = new URL(request.url);
    if(authResult){
        let result:{expiresAt: Date, isAuthenticated: boolean, roles: string[]} = JSON.parse(authResult);
        if(new Date(result.expiresAt).getTime() <= new Date().getTime()){
            localStorage.removeItem('authResult');
            throw redirect(`/auth/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
        }
    }
    else{
        throw redirect(`/auth/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
    }
    return null;
}

export function isAdminAuthenticated(request:Request){

    const authResult = localStorage.getItem('authResult');
    const url = new URL(request.url);
    if(authResult){
        let result:{expiresAt: Date, isAuthenticated: boolean, roles: string[]} = JSON.parse(authResult);
        if(new Date(result.expiresAt).getTime() <= new Date().getTime() || !result.roles.some(c=>c.toLowerCase() === 'admin')){
            localStorage.removeItem('authResult');
            throw redirect(`/auth/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
        }
    }
    else{
        throw redirect(`/auth/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
    }
    return null;
}