import { redirect } from "react-router";

export default function isUserAuthenticated(request:Request){
    const token = localStorage.getItem('bearer-token'); // Or use a more robust check from AuthContext
    if (!token) {
        const url = new URL(request.url);
        return redirect(`/auth/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
    }
}