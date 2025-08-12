import { NavLink, Outlet, useNavigate } from "react-router";
import httpClient from "../axios.config";
import "./layout.css";
import { useState } from "react";
import Navbar from "../components/navbar";

function Layout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  async function logout() {
    try {
      setLoading(true);
      let response = await httpClient.get("api/auth/logout");
      localStorage.removeItem("authResult");
      navigate("/auth/login");
    } catch (error: any) {
      setLoading(false);
      alert(error.message);
    }
  }

  return (
    <>
      <div className="header">
        <Navbar></Navbar>
        <button onClick={logout} disabled={loading}>
          {loading ? "Signing out..." : "Sign Out"}
        </button>
      </div>

      <Outlet></Outlet>
    </>
  );
}

export default Layout;
