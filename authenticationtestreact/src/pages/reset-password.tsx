import { useState, type FormEvent } from "react";
import httpClient from "../axios.config";
import { Link, useNavigate, useSearchParams } from "react-router";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      var email = searchParams.get("email") ?? "";
      var token = searchParams.get("token") ?? "";

      let response = await httpClient.post(`api/auth/reset-password`, {
        email: email,
        token: token,
        password: password,
        confirmPassword: confirmPassword,
      });
      ClearForm();
      alert("Password has been reset, go to login.");
    } catch (err: any) {
      setError(err.response?.data || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  function ClearForm() {
    setPassword("");
    setConfirmPassword("");
  }

  function goToLogin(){
    navigate("/auth/login");
  }

  return (
    <>
      <p>
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      </p>
      <form onSubmit={handleSubmit}>
        <p>
          <input
            id="password"
            type="password"
            value={password}
            autoComplete="password"
            placeholder="password"
            title="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </p>

        <p>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            autoComplete="confirmPassword"
            placeholder="confirmPassword"
            title="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </p>

        <p style={{display: "flex"}}>
          <input
            className="btn"
            type="submit"
            value={loading ? "Loading" : "Reset Password"}
            disabled={loading}
          />
        <button style={{marginLeft: "10px"}} onClick={goToLogin}>Go To Login</button>
        </p>
      </form>
      <div>
        {/* <Link to="/auth/login">Go To Login</Link> */}
      </div>
    </>
  );
}

export default ResetPassword;
