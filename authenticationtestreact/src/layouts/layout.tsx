import { NavLink, Outlet, useNavigate } from "react-router";
import httpClient from "../axios.config";
import './layout.css';
import { useState } from "react";

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
      alert(error.message);
    }
  }

  return (
    <>
      <div className="header">
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>
        <button onClick={logout} disabled={loading}>{loading ? "Signing out..." : "Sign Out"}</button>
      </div>

      <Outlet></Outlet>
    </>
  );
}

export default Layout;
