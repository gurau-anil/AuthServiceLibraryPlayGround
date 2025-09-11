import { useState, type FormEvent } from "react";
import httpClient from "../axios.config";

function ForgotPassword() {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response = await httpClient.post(`api/auth/forgot-password?email=${email}`);
      window.location = response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  
    return ( <>
        <form onSubmit={handleSubmit}>
                <p>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    placeholder="Email"
                    title="Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </p>
                <p>
                  <input className="btn" type="submit" value={loading ? "Loading" : "Reset Password"} disabled={loading}/>
                  {error && (
                    <div style={{ color: "red", marginTop: 10 }}>{error}</div>
                  )}
                </p>
                <p>
              </p>
              </form>
    </> );
}

export default ForgotPassword;