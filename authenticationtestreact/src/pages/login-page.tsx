import { useState, type FormEvent } from "react";
import httpClient from "../axios.config";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import "./styles/login.css";
import reactLogo from '../assets/react.svg';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userName, setUserName] = useState<string>("admin");
  const [password, setPassword] = useState<string>("Dev@1234");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response = await httpClient.post("api/auth/login", {
        userName,
        password,
      });

      //   localStorage.setItem("bearer-token", response.data.token)
      localStorage.setItem("authResult", JSON.stringify(response.data));
      navigate(searchParams.get("redirectTo") ?? "/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-container">
          <div className="col-left">
            <div>
              {/* <h2>Logo</h2> */}
              <img src={reactLogo} style={{height: "130px"}} alt="React logo" />
            </div>
          </div>
          <div className="col-right">
            <div className="login-form">
              <h2>Login</h2>
              <form onSubmit={handleSubmit}>
                <p>
                  <input
                    id="userName"
                    type="text"
                    value={userName}
                    autoComplete="username"
                    placeholder="Username"
                    title="username"
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </p>
                <p>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="Password"
                    autoComplete="current-password"
                    title="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </p>
                <p>
                  <input className="btn" type="submit" value={loading ? "Signing in..." : "Sign In"} disabled={loading}/>
                  {error && (
                    <div style={{ color: "red", marginTop: 10 }}>{error}</div>
                  )}
                </p>
                {/* <p>
                <a href="">Forget password?</a>
                <a href="">Create an account.</a>
              </p> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
